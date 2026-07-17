---
title: 串口通信 UART/USART
description: STM32 HAL 库中串口的数据帧、波特率、校验位、UART 与 USART 区别及收发编程
order: 3
---

# 串口通信 UART/USART

串口通信是嵌入式开发中最常用的调试和通信方式之一。STM32 的串口外设支持异步和同步两种工作方式，分别对应 UART 和 USART。

## 串口引脚

串口通信至少需要两条数据线：

- **TX**：发送引脚（Transmit）
- **RX**：接收引脚（Receive）

在连接两个设备时，TX 接对方的 RX，RX 接对方的 TX，GND 互相连接。

## 串口数据帧

串口传输的基本单位是**数据帧**，一帧数据通常由以下几部分组成：

```text
起始位 + 数据位 + 校验位 + 停止位
```

| 部分 | 位数 | 说明 |
| --- | --- | --- |
| 起始位 | 1 位 | 低电平，标志一帧数据的开始 |
| 数据位 | 8 位或 9 位 | 实际传输的数据 |
| 校验位 | 0 位或 1 位 | 用于简单的错误检测，可选 |
| 停止位 | 0.5、1、1.5 或 2 位 | 高电平，标志一帧数据的结束 |

最常用的配置是 **8 位数据位、无校验位、1 位停止位**，简称 **8N1**。

## 校验位

校验位用于检测数据传输过程中是否发生位翻转。

### 奇校验

数据位中 1 的个数加上校验位后，总 1 的个数应为奇数。

例如数据 `0b10110010` 中有 4 个 1，是偶数，所以校验位填 1，使总数为 5（奇数）。

### 偶校验

数据位中 1 的个数加上校验位后，总 1 的个数应为偶数。

例如数据 `0b10110010` 中有 4 个 1，是偶数，所以校验位填 0，使总数仍为 4（偶数）。

:::tip
校验位只能检测奇数个位错误，无法纠正错误，也不能检测偶数个位同时翻转的情况。
:::

## 波特率

波特率（Baud Rate）表示每秒传输的码元个数，单位是 bps（bits per second）。对于二进制串口，波特率等于每秒传输的比特数。

发送方和接收方的波特率必须一致，否则数据会乱码。常见波特率有 9600、115200、921600 等。

### 波特率与时钟的关系

STM32 的串口波特率由外设时钟和分频系数决定：

```text
BaudRate = USART_CK / (16 * USARTDIV)
```

其中 `USART_CK` 是串口外设时钟，`USARTDIV` 是一个 16 位的分频值。HAL 库和 STM32CubeMX 会自动计算这个值。

## UART 与 USART

| 类型 | 全称 | 特点 |
| --- | --- | --- |
| UART | Universal Asynchronous Receiver/Transmitter | 通用异步收发器，只支持异步传输 |
| USART | Universal Synchronous/Asynchronous Receiver/Transmitter | 通用同步/异步收发器，支持异步和同步传输 |

USART 相比 UART 增加了 **CK 时钟引脚**，用于同步模式下的时钟输出。在大多数应用场景中，使用异步模式即可，因此 UART 和 USART 的编程方式基本相同。

## HAL 库串口常用函数

### 阻塞方式发送

```c
HAL_UART_Transmit(UART_HandleTypeDef *huart, uint8_t *pData, uint16_t Size, uint32_t Timeout);
```

示例：

```c
uint8_t msg[] = "Hello Koyuki\r\n";
HAL_UART_Transmit(&huart1, msg, sizeof(msg) - 1, 1000);
```

### 阻塞方式接收

```c
HAL_UART_Receive(UART_HandleTypeDef *huart, uint8_t *pData, uint16_t Size, uint32_t Timeout);
```

示例：

```c
uint8_t rxBuf[10];
HAL_UART_Receive(&huart1, rxBuf, 10, HAL_MAX_DELAY);
```

### 中断方式发送

```c
HAL_UART_Transmit_IT(&huart1, msg, len);
```

### 中断方式接收

```c
HAL_UART_Receive_IT(&huart1, rxBuf, len);
```

### DMA 方式发送

```c
HAL_UART_Transmit_DMA(&huart1, msg, len);
```

## 串口中断回调

开启中断接收后，当收到指定长度数据时会触发回调函数：

```c
void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
    if (huart->Instance == USART1)
    {
        // 处理接收到的数据
        HAL_UART_Receive_IT(&huart1, rxBuf, 1);  // 重新开启接收
    }
}
```

## 使用 `printf` 输出到串口

可以重定向 `printf` 到串口，方便调试：

```c
#include <stdio.h>

int _write(int file, char *ptr, int len)
{
    HAL_UART_Transmit(&huart1, (uint8_t *)ptr, len, HAL_MAX_DELAY);
    return len;
}
```

在 Keil 中可能需要勾选 **Use MicroLIB**。在 STM32CubeIDE 中通常可以直接使用。

## 不定长数据接收

实际应用中，接收数据的长度往往不固定。可以使用空闲中断（IDLE）配合 DMA 实现高效的不定长接收。

### 配置步骤

1. 在 STM32CubeMX 中开启 USART1 的 DMA 接收。
2. 开启 USART1 全局中断和 DMA 中断。
3. 启动 DMA 循环接收。
4. 在 USART 中断中检测 IDLE 标志。

### 示例代码

```c
uint8_t rxBuf[64];
uint8_t rxLen = 0;

void MX_USART1_UART_Init(void)
{
    // ... 由 STM32CubeMX 自动生成

    __HAL_UART_ENABLE_IT(&huart1, UART_IT_IDLE);  // 使能空闲中断
    HAL_UART_Receive_DMA(&huart1, rxBuf, 64);     // 启动 DMA 接收
}

void USART1_IRQHandler(void)
{
    if (__HAL_UART_GET_FLAG(&huart1, UART_FLAG_IDLE) != RESET)
    {
        __HAL_UART_CLEAR_IDLEFLAG(&huart1);

        HAL_UART_DMAStop(&huart1);
        rxLen = 64 - __HAL_DMA_GET_COUNTER(huart1.hdmarx);

        // 处理 rxBuf 中长度为 rxLen 的数据

        HAL_UART_Receive_DMA(&huart1, rxBuf, 64);  // 重新启动 DMA 接收
    }

    HAL_UART_IRQHandler(&huart1);
}
```

## 实战案例

### 串口阻塞发送不同数据

`SimpleURATTx` 项目演示了如何使用 `HAL_UART_Transmit` 发送单字节、数组、字符和字符串。

```c
uint8_t byteNumber = 0x5a;
uint8_t byteArray[] = {1, 2, 3, 4, 5};
char ch = 'a';
char *str = "Hello World";

HAL_UART_Transmit(&huart1, &byteNumber, 1, HAL_MAX_DELAY);
HAL_UART_Transmit(&huart1, byteArray, 5, HAL_MAX_DELAY);
HAL_UART_Transmit(&huart1, (uint8_t *)&ch, 1, HAL_MAX_DELAY);
HAL_UART_Transmit(&huart1, (uint8_t *)str, strlen(str), HAL_MAX_DELAY);
```

注意：发送字符串时需要把 `char *` 强转为 `uint8_t *`，并通过 `strlen` 计算长度。

### 串口阻塞接收控制 LED

`SimpleUARTRx` 项目通过轮询方式接收一个字符，根据接收到的内容控制 LED 亮灭。

```c
uint8_t dataRcvd;

while (1)
{
    HAL_UART_Receive(&huart1, &dataRcvd, 1, HAL_MAX_DELAY);

    if (dataRcvd == '0') {
        HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);    // 熄灭 LED
    }
    else if (dataRcvd == '1') {
        HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);  // 点亮 LED
    }
}
```

`HAL_UART_Receive` 的最后一个参数使用 `HAL_MAX_DELAY` 表示一直阻塞直到收到数据。这种方式适合简单的人机交互，但会占用 CPU。

### 串口中断控制 LED 闪烁频率

`UARTRxInterrupt` 项目使用中断方式接收串口数据，根据收到的字符改变 LED 闪烁间隔。

```c
static uint32_t blinkInterval = 1000;
static uint8_t dataRcvd;

void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
    if (huart == &huart1) {
        if (dataRcvd == '1') {
            blinkInterval = 1000;
        }
        else if (dataRcvd == '2') {
            blinkInterval = 300;
        }
        else if (dataRcvd == '3') {
            blinkInterval = 100;
        }

        HAL_UART_Receive_IT(&huart1, &dataRcvd, 1);  // 重新启动中断接收
    }
}
```

在 `main` 中启动第一次中断接收，然后在主循环中按照 `blinkInterval` 翻转 LED：

```c
HAL_UART_Receive_IT(&huart1, &dataRcvd, 1);

while (1)
{
    HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);
    HAL_Delay(blinkInterval);
    HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);
    HAL_Delay(blinkInterval);
}
```

中断接收的优势在于 CPU 不需要一直等待数据，可以在主循环中执行其他任务，收到数据后再通过回调处理。

## 常见问题

### 数据乱码

- 波特率不匹配。
- 时钟配置不正确，导致实际波特率偏离设定值。
- 未共地（GND 未连接）。

### 只能发送不能接收

- 未开启串口中断。
- 接收缓冲区长度设置错误。
- 中断优先级配置错误。

## 本章小结

串口是嵌入式调试和数据交换的基础。掌握数据帧结构、波特率、校验位、阻塞/中断/DMA 收发方式，是进行 STM32 开发的必备技能。推荐使用 DMA + 空闲中断的方式处理不定长数据，效率和稳定性都更好。
