---
title: UART 方法详解
description: STM32 HAL 库中 UART 轮询、中断、DMA 收发函数的详细说明与使用示例
order: 2
---

# UART 方法详解

UART（Universal Asynchronous Receiver/Transmitter）是一种异步串行通信协议，广泛用于调试打印、模块通信（如蓝牙、GPS）等场景。HAL 库提供了轮询、中断和 DMA 三种收发方式。

## 公共参数说明

以下参数在多个 UART 函数中都会出现：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `huart` | `UART_HandleTypeDef*` | UART 句柄指针，如 `&huart1` |
| `pData` | `uint8_t*` | 数据缓冲区指针 |
| `Size` | `uint16_t` | 要发送或接收的字节数 |
| `Timeout` | `uint32_t` | 超时时间，单位毫秒；`HAL_MAX_DELAY` 表示一直等待 |

## 轮询方式

### HAL_UART_Transmit

```c
HAL_StatusTypeDef HAL_UART_Transmit(UART_HandleTypeDef *huart,
                                    const uint8_t *pData,
                                    uint16_t Size,
                                    uint32_t Timeout);
```

#### 参数拆解

```c
HAL_UART_Transmit(&huart1, (uint8_t *)msg, strlen(msg), HAL_MAX_DELAY);
//                │         │                 │          │
//                │         │                 │          └── 超时时间（ms）
//                │         │                 └───────────── 发送字节数
//                │         └─────────────────────────────── 发送数据缓冲区
//                └───────────────────────────────────────── UART 句柄
```

#### 功能

以轮询方式发送指定长度的数据。函数会一直阻塞，直到发送完成或超时。

#### 返回值

| 返回值 | 说明 |
| --- | --- |
| `HAL_OK` | 成功 |
| `HAL_ERROR` | 参数错误 |
| `HAL_BUSY` | UART 正在处理其他传输 |
| `HAL_TIMEOUT` | 超时 |

#### 示例

```c
char *msg = "Hello World\r\n";
HAL_UART_Transmit(&huart1, (uint8_t *)msg, strlen(msg), HAL_MAX_DELAY);
```

:::tip
发送字符串时需要把 `char*` 强制转换为 `uint8_t*`，并通过 `strlen()` 计算长度。
:::

### HAL_UART_Receive

```c
HAL_StatusTypeDef HAL_UART_Receive(UART_HandleTypeDef *huart,
                                   uint8_t *pData,
                                   uint16_t Size,
                                   uint32_t Timeout);
```

#### 参数拆解

```c
HAL_UART_Receive(&huart1, rxBuf, 1, HAL_MAX_DELAY);
//               │         │      │  │
//               │         │      │  └── 超时时间
//               │         │      └───── 接收字节数
//               │         └──────────── 接收缓冲区
//               └────────────────────── UART 句柄
```

#### 功能

以轮询方式接收指定长度的数据。如果接收到的字节数不足 `Size`，函数会阻塞到超时。

#### 示例

```c
uint8_t rxBuf[1];
HAL_UART_Receive(&huart1, rxBuf, 1, HAL_MAX_DELAY);

if (rxBuf[0] == '1') {
    HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);
}
```

:::warning
`HAL_UART_Receive` 在收到足够数据前会一直阻塞，适合简单场景。如果需要处理不定长数据，建议使用中断或 DMA + 空闲中断。
:::

## 中断方式

### HAL_UART_Transmit_IT

```c
HAL_StatusTypeDef HAL_UART_Transmit_IT(UART_HandleTypeDef *huart,
                                       const uint8_t *pData,
                                       uint16_t Size);
```

#### 参数拆解

```c
HAL_UART_Transmit_IT(&huart1, txBuf, len);
//                   │         │       │
//                   │         │       └── 发送字节数
//                   │         └────────── 发送缓冲区
//                   └──────────────────── UART 句柄
```

#### 功能

以中断方式发送数据。函数立即返回，数据在后台通过中断逐字节发送。发送完成后触发 `HAL_UART_TxCpltCallback`。

#### 示例

```c
uint8_t txBuf[] = "Hello\r\n";
HAL_UART_Transmit_IT(&huart1, txBuf, sizeof(txBuf) - 1);

void HAL_UART_TxCpltCallback(UART_HandleTypeDef *huart)
{
    if (huart == &huart1) {
        // 发送完成
    }
}
```

:::warning
中断发送期间，`pData` 指向的缓冲区不能被释放或修改，否则可能发送错误数据。
:::

### HAL_UART_Receive_IT

```c
HAL_StatusTypeDef HAL_UART_Receive_IT(UART_HandleTypeDef *huart,
                                      uint8_t *pData,
                                      uint16_t Size);
```

#### 参数拆解

```c
HAL_UART_Receive_IT(&huart1, &dataRcvd, 1);
//                  │         │          │
//                  │         │          └── 接收字节数
//                  │         └──────────── 接收缓冲区
//                  └────────────────────── UART 句柄
```

#### 功能

以中断方式接收数据。收到 `Size` 个字节后触发 `HAL_UART_RxCpltCallback`。

#### 示例

```c
uint8_t dataRcvd;

int main(void)
{
    // ... 初始化
    HAL_UART_Receive_IT(&huart1, &dataRcvd, 1);

    while (1) {
        // 主循环执行其他任务
    }
}

void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
    if (huart == &huart1) {
        if (dataRcvd == '1') {
            blinkInterval = 1000;
        } else if (dataRcvd == '2') {
            blinkInterval = 300;
        }
        // 重新启动接收，否则只接收一次
        HAL_UART_Receive_IT(&huart1, &dataRcvd, 1);
    }
}
```

## DMA 方式

### HAL_UART_Transmit_DMA

```c
HAL_StatusTypeDef HAL_UART_Transmit_DMA(UART_HandleTypeDef *huart,
                                        const uint8_t *pData,
                                        uint16_t Size);
```

#### 参数拆解

```c
HAL_UART_Transmit_DMA(&huart1, txBuf, 256);
//                    │         │      │
//                    │         │      └── 发送字节数
//                    │         └───────── 发送缓冲区
//                    └─────────────────── UART 句柄
```

#### 功能

以 DMA 方式发送数据。CPU 只需配置一次，后续数据搬运由 DMA 完成，适合大数据量传输。发送完成后触发 `HAL_UART_TxCpltCallback`。

#### 示例

```c
uint8_t txBuf[256];
HAL_UART_Transmit_DMA(&huart1, txBuf, 256);
```

### HAL_UART_Receive_DMA

```c
HAL_StatusTypeDef HAL_UART_Receive_DMA(UART_HandleTypeDef *huart,
                                       uint8_t *pData,
                                       uint16_t Size);
```

#### 参数拆解

```c
HAL_UART_Receive_DMA(&huart1, rxBuf, 256);
//                   │         │      │
//                   │         │      └── 接收字节数
//                   │         └───────── 接收缓冲区
//                   └─────────────────── UART 句柄
```

#### 功能

以 DMA 方式接收数据。常用于配合 UART 空闲中断实现不定长数据接收。接收完成后触发 `HAL_UART_RxCpltCallback`。

## 中止传输

### HAL_UART_AbortTransmit / HAL_UART_AbortReceive / HAL_UART_Abort

```c
HAL_StatusTypeDef HAL_UART_AbortTransmit(UART_HandleTypeDef *huart);
HAL_StatusTypeDef HAL_UART_AbortReceive(UART_HandleTypeDef *huart);
HAL_StatusTypeDef HAL_UART_Abort(UART_HandleTypeDef *huart);
```

#### 参数拆解

```c
HAL_UART_AbortReceive(&huart1);
//                    │
//                    └── UART 句柄
```

#### 功能

- `HAL_UART_AbortTransmit`：中止正在进行的轮询/中断/DMA 发送。
- `HAL_UART_AbortReceive`：中止正在进行的轮询/中断/DMA 接收。
- `HAL_UART_Abort`：同时中止发送和接收。

#### 示例

```c
HAL_UART_AbortReceive(&huart1);
HAL_UART_Receive_DMA(&huart1, rxBuf, 256);  // 重新配置 DMA 接收
```

## 常用回调函数

| 回调函数 | 触发时机 |
| --- | --- |
| `HAL_UART_TxCpltCallback` | 发送完成 |
| `HAL_UART_RxCpltCallback` | 接收完成 |
| `HAL_UART_TxHalfCpltCallback` | DMA 发送完成一半 |
| `HAL_UART_RxHalfCpltCallback` | DMA 接收完成一半 |
| `HAL_UART_ErrorCallback` | 发生错误 |

## 使用 printf 输出到串口

重定向 `_write` 函数后，可以直接使用 `printf` 输出到串口。

```c
#include <stdio.h>

int _write(int file, char *ptr, int len)
{
    HAL_UART_Transmit(&huart1, (uint8_t *)ptr, len, HAL_MAX_DELAY);
    return len;
}

int main(void)
{
    printf("Hello STM32\r\n");
}
```

## 配置示例

```c
huart1.Instance = USART1;
huart1.Init.BaudRate = 115200;
huart1.Init.WordLength = UART_WORDLENGTH_8B;
huart1.Init.StopBits = UART_STOPBITS_1;
huart1.Init.Parity = UART_PARITY_NONE;
huart1.Init.Mode = UART_MODE_TX_RX;
huart1.Init.HwFlowCtl = UART_HWCONTROL_NONE;
huart1.Init.OverSampling = UART_OVERSAMPLING_16;
HAL_UART_Init(&huart1);
```
