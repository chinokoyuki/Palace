---
title: SPI 总线通信
description: STM32 HAL 库中 SPI 的引脚、波特率、时钟极性/相位、数据位顺序、Flash 读写流程
order: 6
---

# SPI 总线通信

SPI（Serial Peripheral Interface）是一种高速、全双工、同步的串行通信总线。与 I2C 相比，SPI 通信速率更高，但需要更多的数据线，且没有从机地址机制，通过独立的片选线选择从机。

## SPI 引脚

SPI 总线通常由 4 根线组成：

| 引脚 | 全称 | 方向（主机视角） | 说明 |
| --- | --- | --- | --- |
| MOSI | Master Output Slave Input | 输出 | 主机发送数据，从机接收数据 |
| MISO | Master Input Slave Output | 输入 | 主机接收数据，从机发送数据 |
| SCK | Serial Clock | 输出 | 主机产生的时钟信号 |
| NSS | Negative Slave Select | 输出 | 从机片选，低电平有效 |

一主多从时，每个从机都需要独立的 NSS 线，MOSI、MISO、SCK 可以共享。

## SPI 通信特点

- **全双工**：MOSI 和 MISO 可以同时传输数据。
- **同步**：数据传输由 SCK 时钟同步。
- **无应答**：SPI 没有 I2C 那样的 ACK/NAK 机制，通信效率更高，但缺少错误检测。
- **速度快**：SPI 通常可以达到几十 MHz，远高于 I2C。

## 波特率

SPI 波特率即每秒钟传输的位数。主机通过分频器从外设时钟得到 SCK 频率：

```text
SCK = PCLK / 分频系数
```

分频系数通常为 2、4、8、16、32、64、128、256。例如 APB2 时钟为 72 MHz，分频系数为 4，则 SCK 为 18 MHz。

### 波特率选取原则

- 不超过从机设备支持的最高 SCK 频率。
- 考虑 PCB 走线长度和信号完整性。
- 在满足性能要求的前提下，选择较低的频率以提高稳定性。

## 数据位传输顺序

SPI 可以选择先传最高位（MSB）或最低位（LSB）。

- **MSB 优先**：bit7 先传，bit0 后传。大多数设备使用这种模式。
- **LSB 优先**：bit0 先传，bit7 后传。

## 数据位长度

SPI 可以配置为每次传输 8 位或 16 位：

- **8-bit**：最常用，每次传输 1 字节。
- **16-bit**：某些设备或高速场景使用。

## 时钟极性 CPOL

时钟极性（Clock Polarity）决定 SCK 空闲时的电平：

- **CPOL = 0**：空闲时 SCK 为低电平，第一个边沿是上升沿。
- **CPOL = 1**：空闲时 SCK 为高电平，第一个边沿是下降沿。

## 时钟相位 CPHA

时钟相位（Clock Phase）决定数据在哪个边沿被采样：

- **CPHA = 0**：第一个边沿采样，第二个边沿输出。
- **CPHA = 1**：第一个边沿输出，第二个边沿采样。

### 四种模式组合

| 模式 | CPOL | CPHA | 空闲电平 | 采样边沿 |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 低 | 上升沿 |
| 1 | 0 | 1 | 低 | 下降沿 |
| 2 | 1 | 0 | 高 | 下降沿 |
| 3 | 1 | 1 | 高 | 上升沿 |

使用 SPI 设备前，必须确认它支持哪种模式。常见 Flash 芯片 W25Q 系列通常使用 Mode 0 或 Mode 3。

## HAL 库 SPI 常用函数

### 发送数据

```c
HAL_SPI_Transmit(SPI_HandleTypeDef *hspi, uint8_t *pData, uint16_t Size, uint32_t Timeout);
```

### 接收数据

```c
HAL_SPI_Receive(SPI_HandleTypeDef *hspi, uint8_t *pData, uint16_t Size, uint32_t Timeout);
```

### 同时收发

```c
HAL_SPI_TransmitReceive(SPI_HandleTypeDef *hspi, uint8_t *pTxData, uint8_t *pRxData, uint16_t Size, uint32_t Timeout);
```

:::tip
SPI 是移位寄存器，主机发送数据的同时必然接收数据。即使只关心发送，也要调用 `HAL_SPI_TransmitReceive` 或忽略接收到的数据。
:::

## SPI Flash 写入流程

W25Q 系列 SPI Flash 是常用的外部存储芯片。写入数据前，必须按以下步骤操作：

### Flash 存储结构

```text
容量：8 Mbit = 1 MByte
├── 块 Block：64 KB
├── 扇区 Sector：4 KB
└── 页 Page：256 Byte
```

写入的最小单位是页，擦除的最小单位是扇区。

### 写入步骤

1. **写使能**：发送 `0x06`，允许后续写入/擦除操作。
2. **扇区擦除**：发送 `0x20` 和 24 位地址，擦除目标扇区。
3. **等待擦除完成**：查询状态寄存器，等待 BUSY 位清零。
4. **写使能**：再次发送 `0x06`。
5. **页编程**：发送 `0x02`、24 位地址和最多 256 字节数据。
6. **等待写入完成**：查询状态寄存器，等待 BUSY 位清零。

```c
void W25Q_WritePage(uint32_t addr, uint8_t *data, uint16_t len)
{
    uint8_t cmd[4];

    W25Q_WriteEnable();
    W25Q_SectorErase(addr);
    W25Q_WaitBusy();

    W25Q_WriteEnable();

    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_RESET);  // 拉低片选

    cmd[0] = 0x02;  // 页编程指令
    cmd[1] = (addr >> 16) & 0xFF;
    cmd[2] = (addr >> 8) & 0xFF;
    cmd[3] = addr & 0xFF;

    HAL_SPI_Transmit(&hspi1, cmd, 4, 1000);
    HAL_SPI_Transmit(&hspi1, data, len, 1000);

    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_SET);    // 拉高片选

    W25Q_WaitBusy();
}
```

## 实战案例

### SPI Flash 存储 LED 状态

`SPITest` 项目使用 SPI 与外部 Flash 通信，实现 LED 状态的掉电保存：上电时从 Flash 读取之前的 LED 状态，按键切换后再把新状态写回 Flash。

#### SPI1 配置

```c
hspi1.Instance = SPI1;
hspi1.Init.Mode = SPI_MODE_MASTER;
hspi1.Init.Direction = SPI_DIRECTION_2LINES;
hspi1.Init.DataSize = SPI_DATASIZE_8BIT;
hspi1.Init.CLKPolarity = SPI_POLARITY_HIGH;     // CPOL = 1
hspi1.Init.CLKPhase = SPI_PHASE_2EDGE;          // CPHA = 1
hspi1.Init.NSS = SPI_NSS_SOFT;
hspi1.Init.BaudRatePrescaler = SPI_BAUDRATEPRESCALER_8;
hspi1.Init.FirstBit = SPI_FIRSTBIT_MSB;
hspi1.Init.TIMode = SPI_TIMODE_DISABLE;
hspi1.Init.CRCCalculation = SPI_CRCCALCULATION_DISABLE;
HAL_SPI_Init(&hspi1);
```

本例使用的 Flash 支持 SPI Mode 3（CPOL=1，CPHA=1），片选由软件控制，对应引脚为 `PA4`。

#### 写入 LED 状态

写入 Flash 前必须先**写使能**，再**擦除扇区**，然后再次写使能并执行**页编程**：

```c
static void SaveLEDState(uint8_t ledState)
{
    uint8_t writeEnableCmd[] = {0x06};
    uint8_t sectorEraseCmd[] = {0x20, 0x00, 0x00, 0x00};
    uint8_t pageProgCmd[5] = {0x02, 0x00, 0x00, 0x00, ledState};

    // 写使能
    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_RESET);
    HAL_SPI_Transmit(&hspi1, writeEnableCmd, 1, HAL_MAX_DELAY);
    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_SET);

    // 扇区擦除
    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_RESET);
    HAL_SPI_Transmit(&hspi1, sectorEraseCmd, 4, HAL_MAX_DELAY);
    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_SET);

    HAL_Delay(100);  // 等待擦除完成

    // 再次写使能
    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_RESET);
    HAL_SPI_Transmit(&hspi1, writeEnableCmd, 1, HAL_MAX_DELAY);
    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_SET);

    // 页编程
    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_RESET);
    HAL_SPI_Transmit(&hspi1, pageProgCmd, 5, HAL_MAX_DELAY);
    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_SET);

    HAL_Delay(10);  // 等待写入完成
}
```

#### 读取 LED 状态

```c
static uint8_t LoadLEDState(void)
{
    uint8_t readDataCmd[] = {0x03, 0x00, 0x00, 0x00};
    uint8_t ledState = 0xff;

    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_RESET);
    HAL_SPI_Transmit(&hspi1, readDataCmd, 4, HAL_MAX_DELAY);
    HAL_SPI_Receive(&hspi1, &ledState, 1, HAL_MAX_DELAY);
    HAL_GPIO_WritePin(GPIOA, GPIO_PIN_4, GPIO_PIN_SET);

    return ledState;
}
```

#### 主流程

```c
uint8_t ledState = 0;

HAL_Delay(50);
ledState = LoadLEDState();
if (ledState != 0 && ledState != 1) {
    ledState = 0;  // 初次上电或数据无效时默认熄灭
}

if (ledState == 1) {
    HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);  // 点亮
}
else {
    HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);    // 熄灭
}

while (1)
{
    // 检测 PA0 按键下降沿（本例中按键另一端接 GND，配置为上拉输入）
    if (/* 按键按下 */) {
        ledState = !ledState;

        if (ledState == 1) {
            HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);
        }
        else {
            HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);
        }

        SaveLEDState(ledState);
    }
}
```

:::tip
实际项目中，擦除和写入完成后应该读取状态寄存器确认 BUSY 位清零，而不是简单地固定延时。本例为了简化使用了 `HAL_Delay`。
:::

## 常见问题

### 数据全为 0xFF 或 0x00

- 片选线未正确控制。
- SPI 模式不匹配。
- 从机未上电。

### 通信速率上不去

- 分频系数设置过大。
- 走线过长或信号质量差。
- 从机设备本身不支持更高速度。

## 本章小结

SPI 以更高的引脚代价换取更高的通信速度，适合存储芯片、显示屏、传感器等对速率要求较高的设备。理解 MOSI、MISO、SCK、NSS 的功能，正确配置 CPOL、CPHA、波特率和数据位长度，是使用 SPI 的关键。对于 Flash 等存储设备，还要注意先擦除后写入的规则。
