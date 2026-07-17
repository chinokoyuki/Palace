---
title: ADC 模数转换
description: STM32 HAL 库中 ADC 的分辨率、采样时间、通道选择、轮询/DMA/中断转换及电压计算
order: 9
---

# ADC 模数转换

ADC（Analog-to-Digital Converter，模数转换器）负责把模拟电压信号转换为数字量，是 STM32 采集传感器、电池电压、温度等模拟信号的主要手段。

## ADC 基本原理

ADC 把输入的连续模拟电压量化为离散的数字值。转换结果由以下公式决定：

```text
数字量 = (输入电压 / 参考电压) × (2^分辨率 - 1)
```

例如 12 位分辨率、参考电压 3.3 V 时：

```text
数字量 = (VIN / 3.3) × 4095
```

反过来，已知数字量也可以计算输入电压：

```text
VIN = (数字量 / 4095) × 3.3
```

## 分辨率

STM32F103 的 ADC 支持 12 位分辨率，最大采样率为 1 MSPS（每秒 100 万次采样）。部分新型号支持 16 位 ADC。

| 分辨率 | 最大数字量 | 最小电压步进（3.3 V 参考） |
| --- | --- | --- |
| 12 位 | 4095 | 0.805 mV |
| 10 位 | 1023 | 3.22 mV |
| 8 位 | 255 | 12.94 mV |
| 6 位 | 63 | 52.38 mV |

分辨率越高，量化误差越小，但转换时间也会相应增加。

## 采样时间与转换时间

ADC 的转换过程分为采样和量化两个阶段：

```text
总转换时间 = 采样时间 + 量化时间
```

### 采样时间

采样时间由 ADC 时钟和采样周期数决定。STM32F103 的 ADC 时钟最高为 14 MHz，采样周期可选：

```text
1.5, 7.5, 13.5, 28.5, 41.5, 55.5, 71.5, 239.5
```

采样时间越长，输入信号越稳定，适合驱动能力弱或阻抗高的信号源；采样时间越短，转换速度越快。

### 量化时间

12 位分辨率下，量化固定需要 12.5 个 ADC 时钟周期。因此：

```text
总转换时间 = (采样周期 + 12.5) / ADC 时钟频率
```

例如 ADC 时钟为 12 MHz，采样周期为 239.5：

```text
总转换时间 = (239.5 + 12.5) / 12 MHz = 21 μs
```

## 参考电压

STM32 的 ADC 参考电压通常连接到 VDDA，也就是模拟电源。常见开发板中 VDDA 与 VDD 相连，为 3.3 V。

如果需要更精确的参考电压，可以外接专用的基准源芯片，如 REF3333（3.3 V）或 REF3133（3.3 V）。

## 通道选择

STM32F103C8T6 的 ADC1 有 16 个外部通道（ADC_IN0 ~ ADC_IN15）和 2 个内部通道：

- **温度传感器通道**：ADC_CHANNEL_TEMPSENSOR
- **内部参考电压通道**：ADC_CHANNEL_VREFINT

外部通道对应引脚：

| 通道 | 引脚 | 通道 | 引脚 |
| --- | --- | --- | --- |
| ADC_IN0 | PA0 | ADC_IN8 | PB0 |
| ADC_IN1 | PA1 | ADC_IN9 | PB1 |
| ADC_IN2 | PA2 | ADC_IN10 | PC0 |
| ADC_IN3 | PA3 | ADC_IN11 | PC1 |
| ADC_IN4 | PA4 | ADC_IN12 | PC2 |
| ADC_IN5 | PA5 | ADC_IN13 | PC3 |
| ADC_IN6 | PA6 | ADC_IN14 | PC4 |
| ADC_IN7 | PA7 | ADC_IN15 | PC5 |

## 转换模式

### 单次转换与连续转换

- **单次转换（Single Conversion）**：启动一次转换，转换完成后停止，需要再次启动才能进行下一次转换。
- **连续转换（Continuous Conversion）**：启动一次后，ADC 自动循环进行转换，适合需要持续采样的场景。

```c
hadc1.Init.ContinuousConvMode = ENABLE;   // 连续转换
hadc1.Init.ContinuousConvMode = DISABLE;  // 单次转换
```

### 扫描模式

扫描模式用于多通道采集。使能扫描模式后，ADC 会按照配置的规则通道序列依次转换每个通道。

```c
hadc1.Init.ScanConvMode = ENABLE;   // 使能扫描模式
```

:::tip
多通道采集时，如果不开 DMA，每次只能读取最后一个通道的结果。因此多通道通常配合 DMA 使用。
:::

### 数据对齐

ADC 转换结果是 12 位，但数据寄存器是 16 位，因此有右对齐和左对齐两种存储方式：

- **右对齐**：高位补 0，结果直接就是 0 ~ 4095。
- **左对齐**：低位补 0，常用于需要快速缩放结果的场景。

```c
hadc1.Init.DataAlign = ADC_DATAALIGN_RIGHT;  // 右对齐，最常用
```

## HAL 库 ADC 常用函数

### 轮询方式单通道采集

```c
HAL_ADC_Start(&hadc1);
HAL_ADC_PollForConversion(&hadc1, HAL_MAX_DELAY);
uint32_t adcValue = HAL_ADC_GetValue(&hadc1);
HAL_ADC_Stop(&hadc1);
```

### 中断方式采集

```c
HAL_ADC_Start_IT(&hadc1);

void HAL_ADC_ConvCpltCallback(ADC_HandleTypeDef *hadc)
{
    if (hadc->Instance == ADC1)
    {
        uint32_t adcValue = HAL_ADC_GetValue(&hadc1);
        // 处理转换结果
    }
}
```

### DMA 方式多通道采集

```c
#define ADC_CHANNEL_NUM 2
uint16_t adcBuffer[ADC_CHANNEL_NUM];

HAL_ADC_Start_DMA(&hadc1, (uint32_t *)adcBuffer, ADC_CHANNEL_NUM);

// 在 DMA 完成中断中读取 adcBuffer
void HAL_ADC_ConvCpltCallback(ADC_HandleTypeDef *hadc)
{
    if (hadc->Instance == ADC1)
    {
        uint16_t ch1Value = adcBuffer[0];
        uint16_t ch2Value = adcBuffer[1];
    }
}
```

:::warning
使用 DMA 时，数据缓冲区的地址需要按字对齐，且长度参数以采样点为单位。
:::

## 多通道采集配置

以 ADC1 的 IN0 和 IN1 两通道为例，使用 DMA 循环模式连续采集：

```c
ADC_ChannelConfTypeDef sConfig = {0};

hadc1.Instance = ADC1;
hadc1.Init.ScanConvMode = ADC_SCAN_ENABLE;
hadc1.Init.ContinuousConvMode = ADC_CONTINUOUS;
hadc1.Init.DiscontinuousConvMode = DISABLE;
hadc1.Init.ExternalTrigConv = ADC_SOFTWARE_START;
hadc1.Init.DataAlign = ADC_DATAALIGN_RIGHT;
hadc1.Init.NbrOfConversion = 2;
HAL_ADC_Init(&hadc1);

sConfig.Channel = ADC_CHANNEL_0;
sConfig.Rank = ADC_REGULAR_RANK_1;
sConfig.SamplingTime = ADC_SAMPLETIME_239CYCLES_5;
HAL_ADC_ConfigChannel(&hadc1, &sConfig);

sConfig.Channel = ADC_CHANNEL_1;
sConfig.Rank = ADC_REGULAR_RANK_2;
HAL_ADC_ConfigChannel(&hadc1, &sConfig);
HAL_ADC_ConfigChannel(&hadc1, &sConfig);
```

## 温度传感器

STM32 内部集成了一个温度传感器，连接到 ADC1 的通道 16。温度计算公式：

```text
温度(°C) = ((V25 - VSENSE) / Avg_Slope) + 25
```

- V25：25°C 时的传感器输出电压，典型值 1.43 V。
- Avg_Slope：温度系数，典型值 4.3 mV/°C。
- VSENSE：当前 ADC 测得的传感器电压。

```c
float getChipTemperature(uint16_t adcValue)
{
    float vsense = (3.3 / 4095) * adcValue;
    float temp = ((1.43 - vsense) / 0.0043) + 25;
    return temp;
}
```

:::tip
读取温度传感器前需要使能温度传感器和内部参考电压通道：

```c
HAL_ADCEx_Calibration_Start(&hadc1);
```
:::

## 校准

STM32F1 的 ADC 在上电后建议进行一次校准，以减小转换误差：

```c
HAL_ADCEx_Calibration_Start(&hadc1);
```

## 实战案例

### 电位器电压采集

开发板上常见的电位器连接到 PA0（ADC1_IN0），通过 ADC 读取其分压值并转换为电压。

#### 配置

```c
ADC_HandleTypeDef hadc1;

void MX_ADC1_Init(void)
{
    ADC_ChannelConfTypeDef sConfig = {0};

    hadc1.Instance = ADC1;
    hadc1.Init.ScanConvMode = ADC_SCAN_DISABLE;
    hadc1.Init.ContinuousConvMode = DISABLE;
    hadc1.Init.DiscontinuousConvMode = DISABLE;
    hadc1.Init.ExternalTrigConv = ADC_SOFTWARE_START;
    hadc1.Init.DataAlign = ADC_DATAALIGN_RIGHT;
    hadc1.Init.NbrOfConversion = 1;
    HAL_ADC_Init(&hadc1);

    sConfig.Channel = ADC_CHANNEL_0;
    sConfig.Rank = ADC_REGULAR_RANK_1;
    sConfig.SamplingTime = ADC_SAMPLETIME_239CYCLES_5;
    HAL_ADC_ConfigChannel(&hadc1, &sConfig);
}
```

#### 读取与转换

```c
float readPotentiometerVoltage(void)
{
    HAL_ADC_Start(&hadc1);
    HAL_ADC_PollForConversion(&hadc1, HAL_MAX_DELAY);
    uint32_t adcValue = HAL_ADC_GetValue(&hadc1);
    HAL_ADC_Stop(&hadc1);

    float voltage = (adcValue / 4095.0) * 3.3;
    return voltage;
}
```

在主循环中定时读取并输出：

```c
while (1)
{
    float voltage = readPotentiometerVoltage();
    printf("Potentiometer voltage: %.2f V\r\n", voltage);
    HAL_Delay(500);
}
```

### 光敏电阻采集

光敏电阻通常与固定电阻组成分压电路，光线越强，光敏电阻阻值越小，ADC 采样值越低。采集方法与电位器相同，只是根据实际电路把数字量映射为光照强度或亮度等级。

## 常见问题

### 采样值不稳定

- 采样时间太短，信号未稳定。适当增加采样周期。
- 模拟输入引脚没有配置为模拟模式。
- 电源噪声大，VDDA 未充分滤波。
- 参考电压不精确。

### 多通道采集数据错乱

- 未使能扫描模式。
- 未使用 DMA，导致只能读取最后一个通道。
- 通道 Rank 配置错误。

### 温度传感器读数偏差大

- 未进行 ADC 校准。
- 使用了错误的 V25 和 Avg_Slope 参数。
- 芯片自身发热导致温度高于环境温度。

## 本章小结

ADC 是 STM32 采集模拟世界的窗口。理解分辨率、采样时间、参考电压、数据对齐、扫描和连续转换等概念，掌握轮询、中断、DMA 三种采集方式，就能驱动绝大多数模拟传感器。实际项目中，多通道采集推荐配合 DMA 使用，以提高效率并避免数据丢失。
