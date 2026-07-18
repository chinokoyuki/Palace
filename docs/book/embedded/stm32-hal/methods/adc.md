---
title: ADC 方法详解
description: STM32 HAL 库中 ADC 启动、轮询、中断、DMA 采集及校准的详细说明
order: 6
---

# ADC 方法详解

ADC（Analog-to-Digital Converter）用于把模拟电压转换为数字量。STM32F103 的 ADC 支持 12 位分辨率，最高采样率 1 MSPS。

## 基本转换流程

无论是轮询、中断还是 DMA 方式，ADC 转换的核心步骤都是：

1. 启动转换：`HAL_ADC_Start`
2. 等待转换完成（轮询）或进入回调（中断/DMA）
3. 读取结果：`HAL_ADC_GetValue`

## HAL_ADC_Init

```c
HAL_StatusTypeDef HAL_ADC_Init(ADC_HandleTypeDef *hadc);
```

### 参数拆解

```c
HAL_ADC_Init(&hadc1);
//           │
//           └── ADC 句柄指针
```

### 功能

初始化 ADC 外设。

### 示例

```c
ADC_HandleTypeDef hadc1;

hadc1.Instance = ADC1;
hadc1.Init.ScanConvMode = ADC_SCAN_DISABLE;
hadc1.Init.ContinuousConvMode = ADC_DISABLE;
hadc1.Init.DiscontinuousConvMode = ADC_DISABLE;
hadc1.Init.ExternalTrigConv = ADC_SOFTWARE_START;
hadc1.Init.DataAlign = ADC_DATAALIGN_RIGHT;
hadc1.Init.NbrOfConversion = 1;
HAL_ADC_Init(&hadc1);
```

## HAL_ADC_ConfigChannel

```c
HAL_StatusTypeDef HAL_ADC_ConfigChannel(ADC_HandleTypeDef *hadc,
                                        ADC_ChannelConfTypeDef *sConfig);
```

### 参数拆解

```c
HAL_ADC_ConfigChannel(&hadc1, &sConfig);
//                    │       │
//                    │       └── 通道配置结构体指针
//                    └─────────── ADC 句柄
```

### 功能

配置 ADC 的规则通道。

### 示例

```c
ADC_ChannelConfTypeDef sConfig = {0};
sConfig.Channel = ADC_CHANNEL_0;
sConfig.Rank = ADC_REGULAR_RANK_1;
sConfig.SamplingTime = ADC_SAMPLETIME_239CYCLES_5;
HAL_ADC_ConfigChannel(&hadc1, &sConfig);
```

## 轮询方式

### HAL_ADC_Start

```c
HAL_StatusTypeDef HAL_ADC_Start(ADC_HandleTypeDef *hadc);
```

#### 参数拆解

```c
HAL_ADC_Start(&hadc1);
//            │
//            └── ADC 句柄
```

#### 功能

启动 ADC 软件触发转换。

### HAL_ADC_Stop

```c
HAL_StatusTypeDef HAL_ADC_Stop(ADC_HandleTypeDef *hadc);
```

#### 参数拆解

```c
HAL_ADC_Stop(&hadc1);
//           │
//           └── ADC 句柄
```

#### 功能

停止 ADC 转换。

### HAL_ADC_PollForConversion

```c
HAL_StatusTypeDef HAL_ADC_PollForConversion(ADC_HandleTypeDef *hadc,
                                            uint32_t Timeout);
```

#### 参数拆解

```c
HAL_ADC_PollForConversion(&hadc1, HAL_MAX_DELAY);
//                        │       │
//                        │       └── 超时时间
//                        └─────────── ADC 句柄
```

#### 功能

等待 ADC 转换完成。适合单通道轮询采集。

### HAL_ADC_GetValue

```c
uint32_t HAL_ADC_GetValue(ADC_HandleTypeDef *hadc);
```

#### 参数拆解

```c
uint32_t value = HAL_ADC_GetValue(&hadc1);
//                                │
//                                └── ADC 句柄
```

#### 功能

读取最近一次 ADC 转换结果，返回 12 位数字量（0 ~ 4095）。

#### 完整轮询示例

```c
HAL_ADC_Start(&hadc1);
HAL_ADC_PollForConversion(&hadc1, HAL_MAX_DELAY);
uint32_t adcValue = HAL_ADC_GetValue(&hadc1);
float voltage = (adcValue / 4095.0f) * 3.3f;
```

## 中断方式

### HAL_ADC_Start_IT

```c
HAL_StatusTypeDef HAL_ADC_Start_IT(ADC_HandleTypeDef *hadc);
```

#### 参数拆解

```c
HAL_ADC_Start_IT(&hadc1);
//               │
//               └── ADC 句柄
```

#### 功能

以中断方式启动 ADC 转换。转换完成后进入 `HAL_ADC_ConvCpltCallback`。

#### 示例

```c
HAL_ADC_Start_IT(&hadc1);

void HAL_ADC_ConvCpltCallback(ADC_HandleTypeDef *hadc)
{
    if (hadc == &hadc1) {
        uint32_t value = HAL_ADC_GetValue(&hadc1);
    }
}
```

### HAL_ADC_Stop_IT

```c
HAL_StatusTypeDef HAL_ADC_Stop_IT(ADC_HandleTypeDef *hadc);
```

#### 参数拆解

```c
HAL_ADC_Stop_IT(&hadc1);
//              │
//              └── ADC 句柄
```

#### 功能

停止 ADC 中断转换。

## DMA 方式

### HAL_ADC_Start_DMA

```c
HAL_StatusTypeDef HAL_ADC_Start_DMA(ADC_HandleTypeDef *hadc,
                                    uint32_t *pData,
                                    uint32_t Length);
```

#### 参数拆解

```c
HAL_ADC_Start_DMA(&hadc1, (uint32_t *)adcBuffer, 2);
//                │       │                      │
//                │       │                      └── 采样点数
//                │       └───────────────────────── DMA 缓冲区
//                └───────────────────────────────── ADC 句柄
```

#### 功能

以 DMA 方式启动 ADC 转换，适合多通道连续采集。

#### 示例

```c
uint16_t adcBuffer[2];
HAL_ADC_Start_DMA(&hadc1, (uint32_t *)adcBuffer, 2);
```

:::warning
DMA 缓冲区地址建议按 32 位对齐。`Length` 是采样点数，不是字节数。
:::

### HAL_ADC_Stop_DMA

```c
HAL_StatusTypeDef HAL_ADC_Stop_DMA(ADC_HandleTypeDef *hadc);
```

#### 参数拆解

```c
HAL_ADC_Stop_DMA(&hadc1);
//               │
//               └── ADC 句柄
```

#### 功能

停止 ADC DMA 转换。

## HAL_ADCEx_Calibration_Start

```c
HAL_StatusTypeDef HAL_ADCEx_Calibration_Start(ADC_HandleTypeDef *hadc);
```

#### 参数拆解

```c
HAL_ADCEx_Calibration_Start(&hadc1);
//                          │
//                          └── ADC 句柄
```

#### 功能

启动 ADC 校准，减小转换误差。建议在 ADC 初始化后、正式采集前调用一次。

#### 示例

```c
HAL_ADCEx_Calibration_Start(&hadc1);
```

## 多通道 DMA 配置示例

```c
hadc1.Init.ScanConvMode = ADC_SCAN_ENABLE;
hadc1.Init.ContinuousConvMode = ADC_ENABLE;
hadc1.Init.NbrOfConversion = 2;
HAL_ADC_Init(&hadc1);

ADC_ChannelConfTypeDef sConfig = {0};
sConfig.Channel = ADC_CHANNEL_0;
sConfig.Rank = ADC_REGULAR_RANK_1;
sConfig.SamplingTime = ADC_SAMPLETIME_239CYCLES_5;
HAL_ADC_ConfigChannel(&hadc1, &sConfig);

sConfig.Channel = ADC_CHANNEL_1;
sConfig.Rank = ADC_REGULAR_RANK_2;
HAL_ADC_ConfigChannel(&hadc1, &sConfig);

uint16_t adcBuffer[2];
HAL_ADC_Start_DMA(&hadc1, (uint32_t *)adcBuffer, 2);
```

## 温度传感器读取

```c
sConfig.Channel = ADC_CHANNEL_TEMPSENSOR;
sConfig.Rank = ADC_REGULAR_RANK_1;
sConfig.SamplingTime = ADC_SAMPLETIME_239CYCLES_5;
HAL_ADC_ConfigChannel(&hadc1, &sConfig);

HAL_ADC_Start(&hadc1);
HAL_ADC_PollForConversion(&hadc1, HAL_MAX_DELAY);
uint32_t value = HAL_ADC_GetValue(&hadc1);

float vsense = (value / 4095.0f) * 3.3f;
float temp = ((1.43f - vsense) / 0.0043f) + 25.0f;
```
