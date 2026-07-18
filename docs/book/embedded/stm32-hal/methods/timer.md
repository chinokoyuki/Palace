---
title: 定时器方法详解
description: STM32 HAL 库中定时器基本计数、PWM、输入捕获、编码器接口及常用宏的详细说明
order: 5
---

# 定时器方法详解

STM32 的定时器外设非常丰富，包括基本定时器、通用定时器和高级定时器。HAL 库对定时器的操作进行了统一封装。本文按功能分类，介绍每个函数的原型、参数含义和使用方法。

## 基本时基配置

定时器的时基由三个核心参数决定：

```text
计数器时钟 = 定时器输入时钟 / (Prescaler + 1)
更新频率 = 计数器时钟 / (Period + 1)
```

| 参数 | 寄存器 | 说明 |
| --- | --- | --- |
| `Prescaler` | PSC | 预分频器，对输入时钟分频 |
| `Period` | ARR | 自动重装载值，决定计数周期 |
| `CounterMode` | CR1 | 计数方向 |

## HAL_TIM_Base_Init

```c
HAL_StatusTypeDef HAL_TIM_Base_Init(TIM_HandleTypeDef *htim);
```

### 参数拆解

```c
HAL_TIM_Base_Init(&htim2);
//                │
//                └── 定时器句柄指针，包含 Instance 和 Init 配置
```

### 功能

根据 `htim->Init` 中的参数初始化定时器时基单元。

### 示例

```c
TIM_HandleTypeDef htim2;

htim2.Instance = TIM2;
htim2.Init.Prescaler = 7199;      // 72 MHz / 7200 = 10 kHz
htim2.Init.CounterMode = TIM_COUNTERMODE_UP;
htim2.Init.Period = 9999;         // 10 kHz / 10000 = 1 Hz
htim2.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
htim2.Init.AutoReloadPreload = TIM_AUTORELOAD_PRELOAD_ENABLE;
HAL_TIM_Base_Init(&htim2);
```

## 基本计数方式

### HAL_TIM_Base_Start

```c
HAL_StatusTypeDef HAL_TIM_Base_Start(TIM_HandleTypeDef *htim);
```

#### 参数拆解

```c
HAL_TIM_Base_Start(&htim2);
//                 │
//                 └── 要启动的定时器句柄
```

#### 功能

启动定时器基本计数，不使能中断。

### HAL_TIM_Base_Stop

```c
HAL_StatusTypeDef HAL_TIM_Base_Stop(TIM_HandleTypeDef *htim);
```

#### 参数拆解

```c
HAL_TIM_Base_Stop(&htim2);
//                │
//                └── 要停止的定时器句柄
```

#### 功能

停止定时器基本计数。

### HAL_TIM_Base_Start_IT

```c
HAL_StatusTypeDef HAL_TIM_Base_Start_IT(TIM_HandleTypeDef *htim);
```

#### 参数拆解

```c
HAL_TIM_Base_Start_IT(&htim2);
//                    │
//                    └── 要启动中断的定时器句柄
```

#### 功能

启动定时器基本计数，并使能更新中断。计数器溢出时进入 `HAL_TIM_PeriodElapsedCallback`。

#### 示例

```c
HAL_TIM_Base_Start_IT(&htim2);

void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
{
    if (htim == &htim2) {
        HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);
    }
}
```

### HAL_TIM_Base_Stop_IT

```c
HAL_StatusTypeDef HAL_TIM_Base_Stop_IT(TIM_HandleTypeDef *htim);
```

#### 参数拆解

```c
HAL_TIM_Base_Stop_IT(&htim2);
//                   │
//                   └── 要停止中断的定时器句柄
```

#### 功能

停止定时器基本计数，并禁用更新中断。

## PWM 输出方式

### HAL_TIM_PWM_Start

```c
HAL_StatusTypeDef HAL_TIM_PWM_Start(TIM_HandleTypeDef *htim, uint32_t Channel);
```

#### 参数拆解

```c
HAL_TIM_PWM_Start(&htim1, TIM_CHANNEL_1);
//                │        │
//                │        └── PWM 输出通道
//                └─────────── 定时器句柄
```

#### 功能

启动指定通道的 PWM 输出。

#### 通道取值

| 通道 | 说明 |
| --- | --- |
| `TIM_CHANNEL_1` | 通道 1 |
| `TIM_CHANNEL_2` | 通道 2 |
| `TIM_CHANNEL_3` | 通道 3 |
| `TIM_CHANNEL_4` | 通道 4 |
| `TIM_CHANNEL_ALL` | 所有通道 |

#### 示例

```c
HAL_TIM_PWM_Start(&htim1, TIM_CHANNEL_1);
__HAL_TIM_SET_COMPARE(&htim1, TIM_CHANNEL_1, 500);
```

### HAL_TIM_PWM_Stop

```c
HAL_StatusTypeDef HAL_TIM_PWM_Stop(TIM_HandleTypeDef *htim, uint32_t Channel);
```

#### 参数拆解

```c
HAL_TIM_PWM_Stop(&htim1, TIM_CHANNEL_1);
//               │        │
//               │        └── PWM 输出通道
//               └─────────── 定时器句柄
```

#### 功能

停止指定通道的 PWM 输出。

### HAL_TIMEx_PWMN_Start

```c
HAL_StatusTypeDef HAL_TIMEx_PWMN_Start(TIM_HandleTypeDef *htim, uint32_t Channel);
```

#### 参数拆解

```c
HAL_TIMEx_PWMN_Start(&htim1, TIM_CHANNEL_1);
//                   │        │
//                   │        └── 互补 PWM 通道
//                   └─────────── 高级定时器句柄
```

#### 功能

启动高级定时器指定通道的互补 PWM 输出，常用于电机驱动。

### HAL_TIMEx_PWMN_Stop

```c
HAL_StatusTypeDef HAL_TIMEx_PWMN_Stop(TIM_HandleTypeDef *htim, uint32_t Channel);
```

#### 参数拆解

```c
HAL_TIMEx_PWMN_Stop(&htim1, TIM_CHANNEL_1);
//                  │        │
//                  │        └── 互补 PWM 通道
//                  └─────────── 高级定时器句柄
```

#### 功能

停止高级定时器指定通道的互补 PWM 输出。

### HAL_TIM_PWM_Start_DMA

```c
HAL_StatusTypeDef HAL_TIM_PWM_Start_DMA(TIM_HandleTypeDef *htim,
                                        uint32_t Channel,
                                        const uint32_t *pData,
                                        uint16_t Length);
```

#### 参数拆解

```c
HAL_TIM_PWM_Start_DMA(&htim1, TIM_CHANNEL_1, dutyBuffer, 100);
//                    │        │             │          │
//                    │        │             │          └── 数据长度
//                    │        │             └───────────── CCR 值缓冲区
//                    │        └─────────────────────────── 通道
//                    └──────────────────────────────────── 定时器句柄
```

#### 功能

以 DMA 方式更新 PWM 占空比，适合需要快速变化占空比的场景。DMA 传输完成后触发 `HAL_PWM_PulseFinishedCallback`。

## 输入捕获方式

### HAL_TIM_IC_Start

```c
HAL_StatusTypeDef HAL_TIM_IC_Start(TIM_HandleTypeDef *htim, uint32_t Channel);
```

#### 参数拆解

```c
HAL_TIM_IC_Start(&htim1, TIM_CHANNEL_1);
//               │        │
//               │        └── 输入捕获通道
//               └─────────── 定时器句柄
```

#### 功能

启动指定通道的输入捕获，用于测量外部信号脉冲宽度或频率。

### HAL_TIM_IC_Stop

```c
HAL_StatusTypeDef HAL_TIM_IC_Stop(TIM_HandleTypeDef *htim, uint32_t Channel);
```

#### 参数拆解

```c
HAL_TIM_IC_Stop(&htim1, TIM_CHANNEL_1);
//              │        │
//              │        └── 输入捕获通道
//              └─────────── 定时器句柄
```

#### 功能

停止指定通道的输入捕获。

### HAL_TIM_IC_Start_IT

```c
HAL_StatusTypeDef HAL_TIM_IC_Start_IT(TIM_HandleTypeDef *htim, uint32_t Channel);
```

#### 参数拆解

```c
HAL_TIM_IC_Start_IT(&htim1, TIM_CHANNEL_1);
//                  │        │
//                  │        └── 输入捕获通道
//                  └─────────── 定时器句柄
```

#### 功能

启动输入捕获，并使能捕获中断。每次捕获事件发生都会进入 `HAL_TIM_IC_CaptureCallback`。

#### 示例

```c
HAL_TIM_IC_Start_IT(&htim1, TIM_CHANNEL_1);

void HAL_TIM_IC_CaptureCallback(TIM_HandleTypeDef *htim)
{
    if (htim == &htim1) {
        uint32_t value = HAL_TIM_ReadCapturedValue(htim, TIM_CHANNEL_1);
    }
}
```

### HAL_TIM_IC_Stop_IT

```c
HAL_StatusTypeDef HAL_TIM_IC_Stop_IT(TIM_HandleTypeDef *htim, uint32_t Channel);
```

#### 参数拆解

```c
HAL_TIM_IC_Stop_IT(&htim1, TIM_CHANNEL_1);
//                 │        │
//                 │        └── 输入捕获通道
//                 └─────────── 定时器句柄
```

#### 功能

停止输入捕获，并禁用捕获中断。

## 编码器接口方式

### HAL_TIM_Encoder_Start

```c
HAL_StatusTypeDef HAL_TIM_Encoder_Start(TIM_HandleTypeDef *htim, uint32_t Channel);
```

#### 参数拆解

```c
HAL_TIM_Encoder_Start(&htim2, TIM_CHANNEL_ALL);
//                    │        │
//                    │        └── 通道，通常使用 TIM_CHANNEL_ALL
//                    └─────────── 定时器句柄
```

#### 功能

启动定时器的编码器接口模式，用于连接正交编码器。

#### 示例

```c
HAL_TIM_Encoder_Start(&htim2, TIM_CHANNEL_ALL);
int16_t count = (int16_t)__HAL_TIM_GET_COUNTER(&htim2);
```

### HAL_TIM_Encoder_Stop

```c
HAL_StatusTypeDef HAL_TIM_Encoder_Stop(TIM_HandleTypeDef *htim, uint32_t Channel);
```

#### 参数拆解

```c
HAL_TIM_Encoder_Stop(&htim2, TIM_CHANNEL_ALL);
//                   │        │
//                   │        └── 通道
//                   └─────────── 定时器句柄
```

#### 功能

停止定时器的编码器接口模式。

## 单脉冲模式

### HAL_TIM_OnePulse_Start

```c
HAL_StatusTypeDef HAL_TIM_OnePulse_Start(TIM_HandleTypeDef *htim, uint32_t OutputChannel);
```

#### 参数拆解

```c
HAL_TIM_OnePulse_Start(&htim1, TIM_CHANNEL_1);
//                     │        │
//                     │        └── 输出通道
//                     └─────────── 定时器句柄
```

#### 功能

启动单脉冲模式。在该模式下，定时器只产生一个脉冲后自动停止。

### HAL_TIM_OnePulse_Stop

```c
HAL_StatusTypeDef HAL_TIM_OnePulse_Stop(TIM_HandleTypeDef *htim, uint32_t OutputChannel);
```

#### 参数拆解

```c
HAL_TIM_OnePulse_Stop(&htim1, TIM_CHANNEL_1);
//                    │        │
//                    │        └── 输出通道
//                    └─────────── 定时器句柄
```

#### 功能

停止单脉冲模式。

## 定时器常用宏

### PSC / CNT / ARR / CCR

```c
__HAL_TIM_SET_PRESCALER(__HANDLE__, __PRESC__)
__HAL_TIM_GET_PRESCALER(__HANDLE__)

__HAL_TIM_SET_COUNTER(__HANDLE__, __CNT__)
__HAL_TIM_GET_COUNTER(__HANDLE__)

__HAL_TIM_SET_AUTORELOAD(__HANDLE__, __ARR__)
__HAL_TIM_GET_AUTORELOAD(__HANDLE__)

__HAL_TIM_SET_COMPARE(__HANDLE__, __CHANNEL__, __COMPARE__)
__HAL_TIM_GET_COMPARE(__HANDLE__, __CHANNEL__)
```

### 参数拆解

```c
__HAL_TIM_SET_COMPARE(&htim1, TIM_CHANNEL_1, 500);
//                    │        │             │
//                    │        │             └── 新的 CCR 值
//                    │        └──────────────── 通道
//                    └───────────────────────── 定时器句柄
```

### 使用示例

```c
uint32_t arr = __HAL_TIM_GET_AUTORELOAD(&htim1);
float duty = 0.5;
uint32_t ccr = (arr + 1) * duty;
__HAL_TIM_SET_COMPARE(&htim1, TIM_CHANNEL_1, ccr);
```

## 配置示例：PWM 输出

```c
htim1.Instance = TIM1;
htim1.Init.Prescaler = 71;       // 72 MHz / 72 = 1 MHz
htim1.Init.CounterMode = TIM_COUNTERMODE_UP;
htim1.Init.Period = 999;         // 1 MHz / 1000 = 1 kHz
htim1.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
htim1.Init.RepetitionCounter = 0;
HAL_TIM_PWM_Init(&htim1);

TIM_OC_InitTypeDef sConfigOC = {0};
sConfigOC.OCMode = TIM_OCMODE_PWM1;
sConfigOC.Pulse = 0;
sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;
sConfigOC.OCFastMode = TIM_OCFAST_DISABLE;
HAL_TIM_PWM_ConfigChannel(&htim1, &sConfigOC, TIM_CHANNEL_1);
```
