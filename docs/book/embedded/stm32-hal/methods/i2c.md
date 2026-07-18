---
title: I2C 方法详解
description: STM32 HAL 库中 I2C 主机收发、寄存器读写及中断和 DMA 方式的详细说明
order: 3
---

# I2C 方法详解

I2C（Inter-Integrated Circuit）是一种半双工同步串行总线，使用两根线：SDA（数据线）和 SCL（时钟线）。HAL 库提供了主机收发、寄存器读写等多种 API。

## 地址说明

I2C 从机地址有 7 位和 10 位两种。HAL 库的 `DevAddress` 参数需要传入**写地址**，即 7 位地址左移 1 位后的值。

例如 SSD1306 OLED 的 7 位地址为 `0x3C`，则 `DevAddress` 应传入 `0x78`。

```text
7 位地址：0x3C  = 0b0111100
写地址： 0x78  = 0b01111000
读地址： 0x79  = 0b01111001
```

HAL 库会根据收发函数自动设置最低位的读写标志。

## 轮询方式

### HAL_I2C_Master_Transmit

```c
HAL_StatusTypeDef HAL_I2C_Master_Transmit(I2C_HandleTypeDef *hi2c,
                                          uint16_t DevAddress,
                                          const uint8_t *pData,
                                          uint16_t Size,
                                          uint32_t Timeout);
```

#### 参数拆解

```c
HAL_I2C_Master_Transmit(&hi2c1, 0x78, cmd, sizeof(cmd), HAL_MAX_DELAY);
//                      │       │    │    │             │
//                      │       │    │    │             └── 超时时间
//                      │       │    │    └──────────────── 发送字节数
//                      │       │    └───────────────────── 发送缓冲区
//                      │       └────────────────────────── 从机写地址
//                      └────────────────────────────────── I2C 句柄
```

#### 功能

主机向指定从机发送数据。函数以轮询方式执行，发送完成后返回。

#### 示例

```c
uint8_t cmd[] = {0x00, 0x8d, 0x14, 0xaf};
HAL_I2C_Master_Transmit(&hi2c1, 0x78, cmd, sizeof(cmd), HAL_MAX_DELAY);
```

### HAL_I2C_Master_Receive

```c
HAL_StatusTypeDef HAL_I2C_Master_Receive(I2C_HandleTypeDef *hi2c,
                                         uint16_t DevAddress,
                                         uint8_t *pData,
                                         uint16_t Size,
                                         uint32_t Timeout);
```

#### 参数拆解

```c
HAL_I2C_Master_Receive(&hi2c1, 0x78, rxBuf, 1, HAL_MAX_DELAY);
//                     │       │    │       │  │
//                     │       │    │       │  └── 超时时间
//                     │       │    │       └───── 接收字节数
//                     │       │    └───────────── 接收缓冲区
//                     │       └────────────────── 从机写地址
//                     └────────────────────────── I2C 句柄
```

#### 功能

主机从指定从机读取数据。

#### 示例

```c
uint8_t rxBuf[1];
HAL_I2C_Master_Receive(&hi2c1, 0x78, rxBuf, 1, HAL_MAX_DELAY);
```

### HAL_I2C_Mem_Write

```c
HAL_StatusTypeDef HAL_I2C_Mem_Write(I2C_HandleTypeDef *hi2c,
                                    uint16_t DevAddress,
                                    uint16_t MemAddress,
                                    uint16_t MemAddSize,
                                    const uint8_t *pData,
                                    uint16_t Size,
                                    uint32_t Timeout);
```

#### 参数拆解

```c
HAL_I2C_Mem_Write(&hi2c1, 0xA0, 0x10, I2C_MEMADD_SIZE_8BIT, &data, 1, HAL_MAX_DELAY);
//                │       │     │    │                    │      │  │
//                │       │     │    │                    │      │  └── 超时时间
//                │       │     │    │                    │      └───── 写入字节数
//                │       │     │    │                    └──────────── 写入缓冲区
//                │       │     │    └───────────────────────────────── 地址长度
//                │       │     └────────────────────────────────────── 从机内部地址
//                │       └──────────────────────────────────────────── 从机写地址
//                └──────────────────────────────────────────────────── I2C 句柄
```

#### 功能

向从机的指定内部地址写入数据。常用于 EEPROM、OLED、传感器等带有寄存器地址的设备。

#### 参数

| 参数 | 说明 |
| --- | --- |
| `MemAddress` | 从机内部寄存器/内存地址 |
| `MemAddSize` | 地址长度，`I2C_MEMADD_SIZE_8BIT` 或 `I2C_MEMADD_SIZE_16BIT` |

#### 示例

向 AT24C02 EEPROM 的地址 0x10 写入一个字节：

```c
uint8_t data = 0x55;
HAL_I2C_Mem_Write(&hi2c1, 0xA0, 0x10, I2C_MEMADD_SIZE_8BIT, &data, 1, HAL_MAX_DELAY);
```

### HAL_I2C_Mem_Read

```c
HAL_StatusTypeDef HAL_I2C_Mem_Read(I2C_HandleTypeDef *hi2c,
                                   uint16_t DevAddress,
                                   uint16_t MemAddress,
                                   uint16_t MemAddSize,
                                   uint8_t *pData,
                                   uint16_t Size,
                                   uint32_t Timeout);
```

#### 功能

从从机的指定内部地址读取数据。

#### 示例

```c
uint8_t data;
HAL_I2C_Mem_Read(&hi2c1, 0xA0, 0x10, I2C_MEMADD_SIZE_8BIT, &data, 1, HAL_MAX_DELAY);
```

:::tip
`HAL_I2C_Mem_Read` 会先发送寄存器地址，然后重新启动总线读取数据，即内部实现了写地址 + 读数据的组合时序。
:::

### HAL_I2C_IsDeviceReady

```c
HAL_StatusTypeDef HAL_I2C_IsDeviceReady(I2C_HandleTypeDef *hi2c,
                                        uint16_t DevAddress,
                                        uint32_t Trials,
                                        uint32_t Timeout);
```

#### 参数拆解

```c
HAL_I2C_IsDeviceReady(&hi2c1, 0x78, 3, 100);
//                    │       │    │   │
//                    │       │    │   └── 单次超时时间
//                    │       │    └────── 尝试次数
//                    │       └─────────── 从机写地址
//                    └─────────────────── I2C 句柄
```

#### 功能

检测指定地址的从机是否在线。常用于设备扫描或初始化前检测外设是否存在。

#### 示例

```c
if (HAL_I2C_IsDeviceReady(&hi2c1, 0x78, 3, 100) == HAL_OK) {
    // 设备在线
}
```

## 中断方式

### HAL_I2C_Master_Transmit_IT

```c
HAL_StatusTypeDef HAL_I2C_Master_Transmit_IT(I2C_HandleTypeDef *hi2c,
                                             uint16_t DevAddress,
                                             uint8_t *pData,
                                             uint16_t Size);
```

#### 参数拆解

```c
HAL_I2C_Master_Transmit_IT(&hi2c1, 0x78, txBuf, sizeof(txBuf));
//                         │       │    │      │
//                         │       │    │      └── 发送字节数
//                         │       │    └───────── 发送缓冲区
//                         │       └────────────── 从机写地址
//                         └────────────────────── I2C 句柄
```

#### 功能

以中断方式向从机发送数据。函数立即返回，发送完成后触发 `HAL_I2C_MasterTxCpltCallback`。

### HAL_I2C_Master_Receive_IT

```c
HAL_StatusTypeDef HAL_I2C_Master_Receive_IT(I2C_HandleTypeDef *hi2c,
                                            uint16_t DevAddress,
                                            uint8_t *pData,
                                            uint16_t Size);
```

#### 参数拆解

```c
HAL_I2C_Master_Receive_IT(&hi2c1, 0x78, rxBuf, len);
//                        │       │    │      │
//                        │       │    │      └── 接收字节数
//                        │       │    └───────── 接收缓冲区
//                        │       └────────────── 从机写地址
//                        └────────────────────── I2C 句柄
```

#### 功能

以中断方式从从机接收数据。接收完成后触发 `HAL_I2C_MasterRxCpltCallback`。

### 回调函数

```c
void HAL_I2C_MasterTxCpltCallback(I2C_HandleTypeDef *hi2c);
void HAL_I2C_MasterRxCpltCallback(I2C_HandleTypeDef *hi2c);
```

#### 示例

```c
uint8_t txBuf[] = {0x00, 0xaf};
HAL_I2C_Master_Transmit_IT(&hi2c1, 0x78, txBuf, sizeof(txBuf));

void HAL_I2C_MasterTxCpltCallback(I2C_HandleTypeDef *hi2c)
{
    if (hi2c == &hi2c1) {
        // 发送完成
    }
}
```

## DMA 方式

### HAL_I2C_Master_Transmit_DMA

```c
HAL_StatusTypeDef HAL_I2C_Master_Transmit_DMA(I2C_HandleTypeDef *hi2c,
                                              uint16_t DevAddress,
                                              uint8_t *pData,
                                              uint16_t Size);
```

#### 功能

以 DMA 方式向从机发送数据，适合大数据量传输。发送完成后触发 `HAL_I2C_MasterTxCpltCallback`。

### HAL_I2C_Master_Receive_DMA

```c
HAL_StatusTypeDef HAL_I2C_Master_Receive_DMA(I2C_HandleTypeDef *hi2c,
                                             uint16_t DevAddress,
                                             uint8_t *pData,
                                             uint16_t Size);
```

#### 功能

以 DMA 方式从从机接收数据。接收完成后触发 `HAL_I2C_MasterRxCpltCallback`。

## 配置示例

```c
hi2c1.Instance = I2C1;
hi2c1.Init.ClockSpeed = 100000;  // 100 kHz 标准模式
hi2c1.Init.DutyCycle = I2C_DUTYCYCLE_2;
hi2c1.Init.OwnAddress1 = 0;
hi2c1.Init.AddressingMode = I2C_ADDRESSINGMODE_7BIT;
hi2c1.Init.DualAddressMode = I2C_DUALADDRESS_DISABLE;
hi2c1.Init.OwnAddress2 = 0;
hi2c1.Init.GeneralCallMode = I2C_GENERALCALL_DISABLE;
hi2c1.Init.NoStretchMode = I2C_NOSTRETCH_DISABLE;
HAL_I2C_Init(&hi2c1);
```

## 常见问题

### 通信失败，从机无应答

- 检查 SDA/SCL 是否接了上拉电阻。
- 确认 `DevAddress` 是写地址（7 位地址左移 1 位）。
- 检查从机是否已正确供电并初始化。

### 数据错位或丢失

- I2C 是半双工总线，主从不能同时发送。
- 确保总线速率不超过从机支持的最大值。
