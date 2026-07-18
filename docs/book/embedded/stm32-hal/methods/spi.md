---
title: SPI 方法详解
description: STM32 HAL 库中 SPI 主机收发、全双工收发及中断 DMA 方式的详细说明
order: 4
---

# SPI 方法详解

SPI（Serial Peripheral Interface）是一种高速全双工同步串行总线，常用于 Flash、显示屏、传感器等外设。SPI 需要至少四根线：SCK（时钟）、MOSI（主机输出从机输入）、MISO（主机输入从机输出）和 NSS/CS（片选）。

## SPI 基本特点

- **全双工**：发送和接收可以同时进行。
- **主机模式**：STM32 通常作为主机，产生 SCK 时钟。
- **片选控制**：多数外设需要软件控制片选引脚。

## 片选控制

HAL 库的 SPI 函数**不自动管理片选引脚**，需要用户在代码中手动拉低和拉高 GPIO。

```c
HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_RESET);  // 选中从机
HAL_SPI_Transmit(&hspi1, cmd, len, HAL_MAX_DELAY);
HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_SET);    // 释放从机
```

## 轮询方式

### HAL_SPI_Transmit

```c
HAL_StatusTypeDef HAL_SPI_Transmit(SPI_HandleTypeDef *hspi,
                                   const uint8_t *pData,
                                   uint16_t Size,
                                   uint32_t Timeout);
```

#### 参数拆解

```c
HAL_SPI_Transmit(&hspi1, writeEnableCmd, 1, HAL_MAX_DELAY);
//               │       │                │  │
//               │       │                │  └── 超时时间
//               │       │                └───── 发送字节数
//               │       └────────────────────── 发送缓冲区
//               └────────────────────────────── SPI 句柄
```

#### 功能

向从机发送数据。在发送过程中，MISO 线上的数据会被忽略。

#### 示例

```c
uint8_t writeEnableCmd[] = {0x06};
HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_RESET);
HAL_SPI_Transmit(&hspi1, writeEnableCmd, 1, HAL_MAX_DELAY);
HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_SET);
```

### HAL_SPI_Receive

```c
HAL_StatusTypeDef HAL_SPI_Receive(SPI_HandleTypeDef *hspi,
                                  uint8_t *pData,
                                  uint16_t Size,
                                  uint32_t Timeout);
```

#### 参数拆解

```c
HAL_SPI_Receive(&hspi1, &ledState, 1, HAL_MAX_DELAY);
//              │       │          │  │
//              │       │          │  └── 超时时间
//              │       │          └───── 接收字节数
//              │       └──────────────── 接收缓冲区
//              └──────────────────────── SPI 句柄
```

#### 功能

从从机接收数据。在接收过程中，MOSI 线上会发送无效数据（通常是 0xFF）。

#### 示例

```c
uint8_t ledState;
HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_RESET);
HAL_SPI_Receive(&hspi1, &ledState, 1, HAL_MAX_DELAY);
HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_SET);
```

### HAL_SPI_TransmitReceive

```c
HAL_StatusTypeDef HAL_SPI_TransmitReceive(SPI_HandleTypeDef *hspi,
                                          const uint8_t *pTxData,
                                          uint8_t *pRxData,
                                          uint16_t Size,
                                          uint32_t Timeout);
```

#### 参数拆解

```c
HAL_SPI_TransmitReceive(&hspi1, txBuf, rxBuf, 4, HAL_MAX_DELAY);
//                      │       │       │      │  │
//                      │       │       │      │  └── 超时时间
//                      │       │       │      └───── 收发字节数
//                      │       │       └──────────── 接收缓冲区
//                      │       └──────────────────── 发送缓冲区
//                      └──────────────────────────── SPI 句柄
```

#### 功能

同时发送和接收数据，是 SPI 全双工特性的典型用法。发送 `pTxData` 的同时，把 MISO 线上收到的数据存入 `pRxData`。

#### 示例

读取 Flash 的 JEDEC ID：

```c
uint8_t txBuf[4] = {0x9f, 0xff, 0xff, 0xff};  // 0x9f 是读 ID 命令
uint8_t rxBuf[4];

HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_RESET);
HAL_SPI_TransmitReceive(&hspi1, txBuf, rxBuf, 4, HAL_MAX_DELAY);
HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_SET);

// rxBuf[1] ~ rxBuf[3] 为厂商 ID 和设备 ID
```

## 中断方式

### HAL_SPI_Transmit_IT

```c
HAL_StatusTypeDef HAL_SPI_Transmit_IT(SPI_HandleTypeDef *hspi,
                                      const uint8_t *pData,
                                      uint16_t Size);
```

#### 参数拆解

```c
HAL_SPI_Transmit_IT(&hspi1, txBuf, len);
//                  │       │      │
//                  │       │      └── 发送字节数
//                  │       └───────── 发送缓冲区
//                  └───────────────── SPI 句柄
```

#### 功能

以中断方式发送数据。函数立即返回，发送完成后触发 `HAL_SPI_TxCpltCallback`。

### HAL_SPI_Receive_IT

```c
HAL_StatusTypeDef HAL_SPI_Receive_IT(SPI_HandleTypeDef *hspi,
                                     uint8_t *pData,
                                     uint16_t Size);
```

#### 参数拆解

```c
HAL_SPI_Receive_IT(&hspi1, rxBuf, len);
//                 │       │      │
//                 │       │      └── 接收字节数
//                 │       └───────── 接收缓冲区
//                 └───────────────── SPI 句柄
```

#### 功能

以中断方式接收数据。接收完成后触发 `HAL_SPI_RxCpltCallback`。

### HAL_SPI_TransmitReceive_IT

```c
HAL_StatusTypeDef HAL_SPI_TransmitReceive_IT(SPI_HandleTypeDef *hspi,
                                             const uint8_t *pTxData,
                                             uint8_t *pRxData,
                                             uint16_t Size);
```

#### 功能

以中断方式同时发送和接收数据。收发完成后触发 `HAL_SPI_TxRxCpltCallback`。

### 回调函数

```c
void HAL_SPI_TxCpltCallback(SPI_HandleTypeDef *hspi);
void HAL_SPI_RxCpltCallback(SPI_HandleTypeDef *hspi);
void HAL_SPI_TxRxCpltCallback(SPI_HandleTypeDef *hspi);
```

## DMA 方式

### HAL_SPI_Transmit_DMA / HAL_SPI_Receive_DMA / HAL_SPI_TransmitReceive_DMA

```c
HAL_StatusTypeDef HAL_SPI_Transmit_DMA(SPI_HandleTypeDef *hspi,
                                       const uint8_t *pData,
                                       uint16_t Size);

HAL_StatusTypeDef HAL_SPI_Receive_DMA(SPI_HandleTypeDef *hspi,
                                      uint8_t *pData,
                                      uint16_t Size);

HAL_StatusTypeDef HAL_SPI_TransmitReceive_DMA(SPI_HandleTypeDef *hspi,
                                              const uint8_t *pTxData,
                                              uint8_t *pRxData,
                                              uint16_t Size);
```

#### 功能

以 DMA 方式进行 SPI 收发。CPU 只需启动一次，数据搬运由 DMA 完成，适合大数据量连续传输。收发完成后触发对应的回调函数。

## HAL_SPI_Abort

```c
HAL_StatusTypeDef HAL_SPI_Abort(SPI_HandleTypeDef *hspi);
```

#### 参数拆解

```c
HAL_SPI_Abort(&hspi1);
//            │
//            └── SPI 句柄
```

#### 功能

中止正在进行的 SPI 传输。

## 配置示例

```c
hspi1.Instance = SPI1;
hspi1.Init.Mode = SPI_MODE_MASTER;
hspi1.Init.Direction = SPI_DIRECTION_2LINES;
hspi1.Init.DataSize = SPI_DATASIZE_8BIT;
hspi1.Init.CLKPolarity = SPI_POLARITY_HIGH;  // CPOL = 1
hspi1.Init.CLKPhase = SPI_PHASE_2EDGE;       // CPHA = 1
hspi1.Init.NSS = SPI_NSS_SOFT;
hspi1.Init.BaudRatePrescaler = SPI_BAUDRATEPRESCALER_8;
hspi1.Init.FirstBit = SPI_FIRSTBIT_MSB;
hspi1.Init.TIMode = SPI_TIMODE_DISABLE;
hspi1.Init.CRCCalculation = SPI_CRCCALCULATION_DISABLE;
HAL_SPI_Init(&hspi1);
```

## 时序模式

SPI 有四种时序模式，由 CPOL（时钟极性）和 CPHA（时钟相位）组合决定：

| 模式 | CPOL | CPHA | 说明 |
| --- | --- | --- | --- |
| 模式 0 | 0 | 0 | 空闲低电平，第一个边沿采样 |
| 模式 1 | 0 | 1 | 空闲低电平，第二个边沿采样 |
| 模式 2 | 1 | 0 | 空闲高电平，第一个边沿采样 |
| 模式 3 | 1 | 1 | 空闲高电平，第二个边沿采样 |

选择哪种模式取决于从机数据手册的要求。
