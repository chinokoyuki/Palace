---
title: 定时器与 PWM
description: STM32 HAL 库中定时器的时基单元、PWM 输出、输入捕获及中断应用
order: 8
---

# 定时器与 PWM

定时器是 STM32 中功能最丰富的外设之一，既可以产生精确的延时，也可以输出 PWM 波形、捕获外部信号、编码器测速等。掌握定时器是进行电机控制、信号测量和实时任务调度的基础。

## 定时器分类

STM32 的定时器按功能分为三类：

| 类型 | 代表 | 特点 |
| --- | --- | --- |
| 基本定时器 | TIM6、TIM7 | 只能产生定时中断 |
| 通用定时器 | TIM2 ~ TIM5 | 支持定时中断、PWM、输入捕获、编码器接口 |
| 高级定时器 | TIM1、TIM8 | 在通用定时器基础上增加互补输出、刹车输入等电机控制功能 |

## 时基单元

定时器的核心是由三个寄存器组成的时基单元：

### 时钟来源

定时器的时钟来源主要有三种：

- **RCC**：来自内部总线时钟，最常见。
- **TRIG**：来自其他定时器的触发输出，用于级联。
- **ETRF**：来自外部时钟引脚。

### PSC 预分频器

预分频器对定时器时钟进行分频，降低计数频率：

```text
计数器时钟 = 定时器时钟 / (PSC + 1)
```

PSC 是 16 位寄存器，最大值为 65535。

例如定时器时钟为 72 MHz，PSC = 7199，则计数器时钟为：

```text
72 MHz / (7199 + 1) = 10 kHz
```

### CNT 计数器

计数器对分频后的脉冲进行计数。计数模式有：

- **向上计数**：从 0 计数到 ARR，然后溢出产生更新事件。
- **向下计数**：从 ARR 计数到 0，然后溢出。
- **中心对齐**：先从 0 计数到 ARR，再向下计数到 0，循环往复。

### ARR 自动重装载寄存器

ARR 决定定时器的计数周期：

```text
定时周期 = (ARR + 1) / 计数器时钟
```

接上例，计数器时钟为 10 kHz，ARR = 9999，则定时周期为：

```text
(9999 + 1) / 10 kHz = 1 秒
```

### RCR 重复计数器

RCR 只存在于高级定时器。当 RCR = N 时，CNT 每发生 N + 1 次溢出，才产生一次更新事件。这可以用于产生更低频率的更新中断。

### 预加载

ARR 和 PSC 寄存器有预加载功能。修改这两个寄存器时，新值不会立即生效，而是在下一次更新事件时生效。这样可以避免计数器在运行过程中出现不连续的跳变。

## 计数器模式控制

计数器模式决定了 CNT 寄存器如何计数，以及在什么条件下产生更新事件。STM32 的通用定时器和高级定时器支持三种计数方向：向上计数、向下计数和中心对齐计数。

### 向上计数模式

计数器从 0 开始递增，当 CNT 达到 ARR 时，产生一个更新事件（Update Event），然后 CNT 清零并重新计数。

```c
htim2.Init.CounterMode = TIM_COUNTERMODE_UP;
htim2.Init.Period = 9999;  // CNT 从 0 计到 9999 后溢出
```

更新事件的产生时机：

```text
CNT = 0, 1, 2, ..., 9998, 9999, 0, 1, 2, ...
                         ↑
                      更新事件
```

这是定时器最常用的模式，适合产生固定周期的定时中断和 PWM。

### 向下计数模式

计数器从 ARR 开始递减，当 CNT 达到 0 时，产生更新事件，然后 CNT 重新装载为 ARR 并继续递减。

```c
htim2.Init.CounterMode = TIM_COUNTERMODE_DOWN;
htim2.Init.Period = 9999;  // CNT 从 9999 计到 0 后溢出
```

```text
CNT = 9999, 9998, ..., 1, 0, 9999, 9998, ...
                         ↑
                      更新事件
```

向下计数模式常用于需要知道距离溢出还有多久的场景，例如某些电机控制算法。

### 中心对齐模式

计数器先从 0 计数到 ARR - 1，产生一个更新事件；然后再从 ARR 递减到 1，再次产生更新事件，循环往复。

STM32 支持三种中心对齐模式：

| 模式 | 宏定义 | 比较标志置位时机 |
| --- | --- | --- |
| 中心对齐模式 1 | `TIM_COUNTERMODE_CENTERALIGNED1` | 向下计数时 CNT = CCR |
| 中心对齐模式 2 | `TIM_COUNTERMODE_CENTERALIGNED2` | 向上计数时 CNT = CCR |
| 中心对齐模式 3 | `TIM_COUNTERMODE_CENTERALIGNED3` | 向上和向下计数时 CNT = CCR 都置位 |

```c
htim2.Init.CounterMode = TIM_COUNTERMODE_CENTERALIGNED1;
htim2.Init.Period = 999;  // CNT: 0 -> 998 -> 999 -> 998 -> ... -> 1 -> 0
```

```text
CNT: 0, 1, ..., 998, 999, 998, ..., 1, 0, 1, ...
                  ↑           ↑
               更新事件     更新事件
```

中心对齐模式常用于电机控制中的 SVPWM（空间矢量脉宽调制），可以减小电流谐波。

### 计数器使能与复位

配置完成后，通过以下函数启动计数器：

```c
HAL_TIM_Base_Start(&htim2);     // 普通定时
HAL_TIM_Base_Start_IT(&htim2);  // 定时中断模式
```

如果需要手动复位计数器，可以写入 CNT 寄存器：

```c
__HAL_TIM_SET_COUNTER(&htim2, 0);
```

### 更新事件与中断

计数器溢出、UG 位软件置位、从模式触发都会产生更新事件。更新事件会触发：

- CNT 重新装载初始值。
- 预加载寄存器的值传送到实际寄存器。
- 如果使能了中断，则进入 `TIMx_UP_TIMx_TRG_COM_IRQn` 中断。

```c
__HAL_TIM_ENABLE_IT(&htim2, TIM_IT_UPDATE);  // 使能更新中断
```

:::tip
在 PWM 模式下修改 ARR 或 CCR 时，建议开启预加载，确保新值在更新事件时统一生效，避免输出波形出现毛刺。
:::

## 定时中断示例

配置 TIM2 每 1 秒产生一次中断：

```c
void MX_TIM2_Init(void)
{
    TIM_ClockConfigTypeDef sClockSourceConfig = {0};
    TIM_MasterConfigTypeDef sMasterConfig = {0};

    htim2.Instance = TIM2;
    htim2.Init.Prescaler = 7199;        // 72 MHz / 7200 = 10 kHz
    htim2.Init.CounterMode = TIM_COUNTERMODE_UP;
    htim2.Init.Period = 9999;           // 10 kHz / 10000 = 1 Hz
    htim2.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
    htim2.Init.AutoReloadPreload = TIM_AUTORELOAD_PRELOAD_ENABLE;

    if (HAL_TIM_Base_Init(&htim2) != HAL_OK)
    {
        Error_Handler();
    }

    sClockSourceConfig.ClockSource = TIM_CLOCKSOURCE_INTERNAL;
    HAL_TIM_ConfigClockSource(&htim2, &sClockSourceConfig);

    sMasterConfig.MasterOutputTrigger = TIM_TRGO_RESET;
    sMasterConfig.MasterSlaveMode = TIM_MASTERSLAVEMODE_DISABLE;
    HAL_TIMEx_MasterConfigSynchronization(&htim2, &sMasterConfig);
}
```

启动定时中断：

```c
HAL_TIM_Base_Start_IT(&htim2);
```

中断回调：

```c
void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
{
    if (htim->Instance == TIM2)
    {
        HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);  // 每秒翻转一次 LED
    }
}
```

## PWM 输出

PWM（Pulse Width Modulation）即脉冲宽度调制，通过改变高电平占空比来控制平均电压，常用于 LED 亮度调节、电机调速、舵机控制等。

### PWM 原理

定时器 CNT 不断计数，与 CCR（捕获比较寄存器）比较：

- **PWM 模式 1**：
  - CNT < CCR 时输出高电平。
  - CNT >= CCR 时输出低电平。

- **PWM 模式 2**：与模式 1 相反。

### PWM 频率和占空比

```text
PWM 频率 = 计数器时钟 / (ARR + 1)
占空比 = CCR / (ARR + 1)
```

例如计数器时钟 1 MHz，ARR = 999，则 PWM 频率为 1 kHz。CCR = 500 时，占空比为 50%。

### PWM 输出示例

配置 TIM2 通道 1 输出 1 kHz、占空比 50% 的 PWM：

```c
void MX_TIM2_Init(void)
{
    TIM_ClockConfigTypeDef sClockSourceConfig = {0};
    TIM_MasterConfigTypeDef sMasterConfig = {0};
    TIM_OC_InitTypeDef sConfigOC = {0};

    htim2.Instance = TIM2;
    htim2.Init.Prescaler = 71;          // 72 MHz / 72 = 1 MHz
    htim2.Init.CounterMode = TIM_COUNTERMODE_UP;
    htim2.Init.Period = 999;            // 1 MHz / 1000 = 1 kHz
    htim2.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;

    HAL_TIM_Base_Init(&htim2);
    HAL_TIM_PWM_Init(&htim2);

    sConfigOC.OCMode = TIM_OCMODE_PWM1;
    sConfigOC.Pulse = 500;              // 占空比 50%
    sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;
    sConfigOC.OCFastMode = TIM_OCFAST_DISABLE;
    HAL_TIM_PWM_ConfigChannel(&htim2, &sConfigOC, TIM_CHANNEL_1);
}
```

启动 PWM：

```c
HAL_TIM_PWM_Start(&htim2, TIM_CHANNEL_1);
```

修改占空比：

```c
__HAL_TIM_SET_COMPARE(&htim2, TIM_CHANNEL_1, 300);  // 30% 占空比
```

## 输入捕获

输入捕获用于测量外部信号的脉宽、频率和占空比。

### 测量脉宽

使用两个捕获通道，分别捕获上升沿和下降沿：

```text
脉宽 = (CCR2 - CCR1) × 计数器分辨率
```

### 输入捕获处理流程

1. **输入滤波**：滤除信号毛刺。
2. **边沿检测**：检测上升沿或下降沿。
3. **信号选择**：选择直接输入、间接输入或 TRC。
4. **分频**：降低捕获频率，适合高频信号。

## 编码器接口

STM32 的通用定时器支持编码器接口模式（Encoder Interface Mode），可以直接连接增量式正交编码器，自动对 A、B 两相脉冲进行计数和方向判断，常用于电机测速、位置检测等场景。

### 正交编码器信号

增量式编码器输出两路正交脉冲信号 A 和 B：

- **A 相**：主计数脉冲。
- **B 相**：与 A 相相差 90° 的脉冲，用于判断旋转方向。

根据 A 相超前还是滞后 B 相，可以判断编码器正转或反转：

- A 相上升沿时 B 相为低电平：正转。
- A 相上升沿时 B 相为高电平：反转。

### 编码器模式

STM32 的编码器接口模式有三种：

| 模式 | 宏定义 | 说明 |
| --- | --- | --- |
| 仅 TI1 计数 | `TIM_ENCODERMODE_TI1` | 只在 A 相边沿计数 |
| 仅 TI2 计数 | `TIM_ENCODERMODE_TI2` | 只在 B 相边沿计数 |
| TI1 和 TI2 同时计数 | `TIM_ENCODERMODE_TI12` | 在 A、B 两相边沿都计数，分辨率提高一倍 |

通常使用 `TIM_ENCODERMODE_TI12` 以获得更高的分辨率。

### HAL 库配置示例

配置 TIM2 为编码器接口模式，连接编码器 A 相到 PA0（CH1），B 相到 PA1（CH2）：

```c
TIM_Encoder_InitTypeDef sConfig = {0};
TIM_MasterConfigTypeDef sMasterConfig = {0};

htim2.Instance = TIM2;
htim2.Init.Prescaler = 0;              // 编码器模式一般不需要预分频
htim2.Init.CounterMode = TIM_COUNTERMODE_UP;
htim2.Init.Period = 65535;             // 最大计数值
htim2.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
htim2.Init.AutoReloadPreload = TIM_AUTORELOAD_PRELOAD_ENABLE;

sConfig.EncoderMode = TIM_ENCODERMODE_TI12;
sConfig.IC1Polarity = TIM_ICPOLARITY_RISING;
sConfig.IC1Selection = TIM_ICSELECTION_DIRECTTI;
sConfig.IC1Prescaler = TIM_ICPSC_DIV1;
sConfig.IC1Filter = 0;
sConfig.IC2Polarity = TIM_ICPOLARITY_RISING;
sConfig.IC2Selection = TIM_ICSELECTION_DIRECTTI;
sConfig.IC2Prescaler = TIM_ICPSC_DIV1;
sConfig.IC2Filter = 0;

HAL_TIM_Encoder_Init(&htim2, &sConfig);

sMasterConfig.MasterOutputTrigger = TIM_TRGO_RESET;
sMasterConfig.MasterSlaveMode = TIM_MASTERSLAVEMODE_DISABLE;
HAL_TIMEx_MasterConfigSynchronization(&htim2, &sMasterConfig);
```

启动编码器模式：

```c
HAL_TIM_Encoder_Start(&htim2, TIM_CHANNEL_ALL);
```

### 读取编码器数值

```c
int16_t encoderCount = (int16_t)__HAL_TIM_GET_COUNTER(&htim2);
```

由于计数器是 16 位无符号数，正转时递增，反转时递减。将其强转为 `int16_t` 后，可以直观地表示正负方向。

### 测速计算

常用的测速方法有两种：

#### M 法测速

在固定时间间隔 $T$ 内读取编码器脉冲数 $M$，计算转速：

```text
转速(rpm) = (M / 编码器线数) / T × 60
```

适合中高速场景。

#### T 法测速

测量两个脉冲之间的时间 $T$，计算转速：

```text
转速(rpm) = 1 / (编码器线数 × T) × 60
```

适合低速场景。

### 示例：定时读取编码器并计算转速

```c
#define ENCODER_PPR 1000  // 编码器每转脉冲数

void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
{
    if (htim->Instance == TIM3)  // 假设 TIM3 每 100 ms 产生一次中断
    {
        int16_t count = (int16_t)__HAL_TIM_GET_COUNTER(&htim2);
        __HAL_TIM_SET_COUNTER(&htim2, 0);  // 清零计数器

        float rotations = (float)count / ENCODER_PPR;
        float rpm = rotations * 10 * 60;  // 100 ms 采样一次，1 秒 10 次

        // 根据 rpm 正负判断方向
    }
}
```

:::tip
编码器模式只负责计数，测速和方向判断由软件完成。如果需要更高精度，可以选择 32 位定时器（如 TIM2、TIM5）或使用定时器级联扩展计数范围。
:::

## 定时器与 PWM 应用实例

### 呼吸灯

通过不断改变 PWM 占空比，实现 LED 亮度渐变：

```c
void breathing_led(void)
{
    static int16_t duty = 0;
    static int16_t step = 1;

    duty += step;
    if (duty >= 1000) step = -1;
    if (duty <= 0) step = 1;

    __HAL_TIM_SET_COMPARE(&htim2, TIM_CHANNEL_1, duty);
    HAL_Delay(2);
}
```

### 舵机控制

舵机通常使用 50 Hz PWM，高电平宽度 0.5ms ~ 2.5ms 对应 0° ~ 180°。

配置 50 Hz，ARR = 19999，则计数器时钟为 1 MHz：

```text
0.5 ms -> CCR = 500
1.5 ms -> CCR = 1500
2.5 ms -> CCR = 2500
```

## 实战案例

### 呼吸灯

`BreathingLight` 项目使用 TIM1 的 PWM 功能实现 LED 亮度由暗到亮、再由亮到暗的平滑变化。

#### TIM1 配置

```c
htim1.Instance = TIM1;
htim1.Init.Prescaler = 7;              // 8 MHz / 8 = 1 MHz
htim1.Init.CounterMode = TIM_COUNTERMODE_UP;
htim1.Init.Period = 999;               // 1 MHz / 1000 = 1 kHz
htim1.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
htim1.Init.RepetitionCounter = 0;
htim1.Init.AutoReloadPreload = TIM_AUTORELOAD_PRELOAD_ENABLE;
HAL_TIM_Base_Init(&htim1);
HAL_TIM_PWM_Init(&htim1);

sConfigOC.OCMode = TIM_OCMODE_PWM1;
sConfigOC.Pulse = 0;
sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;
sConfigOC.OCFastMode = TIM_OCFAST_DISABLE;
HAL_TIM_PWM_ConfigChannel(&htim1, &sConfigOC, TIM_CHANNEL_1);
```

TIM1 通道 1 输出 1 kHz 的 PWM，ARR = 999，因此 CCR 取值范围为 0 ~ 1000，对应占空比 0% ~ 100%。

#### 主循环代码

```c
HAL_TIM_PWM_Start(&htim1, TIM_CHANNEL_1);
HAL_TIMEx_PWMN_Start(&htim1, TIM_CHANNEL_1);

while (1)
{
    float t = HAL_GetTick();
    float duty = 0.5 * sin(2 * 3.14 * t) + 0.5;

    uint16_t arr = __HAL_TIM_GET_AUTORELOAD(&htim1);
    uint16_t ccr = (arr + 1) * duty;

    __HAL_TIM_SET_COMPARE(&htim1, TIM_CHANNEL_1, ccr);
}
```

这里使用正弦函数计算占空比，`duty` 在 0 ~ 1 之间周期性变化，再通过 `__HAL_TIM_SET_COMPARE` 实时修改 CCR，LED 亮度就会呈现呼吸效果。注意 `HAL_GetTick()` 返回的是毫秒数，乘以 `2 * 3.14` 后周期约为 1 秒。

### PWM 驱动小车电机

`Car` 项目使用 TIM3 的两路 PWM 控制小车两个电机的转速和方向。电机驱动板通常需要 PWM 调速信号和方向控制信号，本例中 PWM 负责调速，GPIO 负责方向。

#### TIM3 配置

```c
htim3.Instance = TIM3;
htim3.Init.Prescaler = 71;             // 72 MHz / 72 = 1 MHz
htim3.Init.CounterMode = TIM_COUNTERMODE_UP;
htim3.Init.Period = 99;                // 1 MHz / 100 = 10 kHz
htim3.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
htim3.Init.AutoReloadPreload = TIM_AUTORELOAD_PRELOAD_ENABLE;
HAL_TIM_PWM_Init(&htim3);

sConfigOC.OCMode = TIM_OCMODE_PWM1;
sConfigOC.Pulse = 0;
sConfigOC.OCPolarity = TIM_OCPOLARITY_HIGH;
sConfigOC.OCFastMode = TIM_OCFAST_DISABLE;
HAL_TIM_PWM_ConfigChannel(&htim3, &sConfigOC, TIM_CHANNEL_1);
HAL_TIM_PWM_ConfigChannel(&htim3, &sConfigOC, TIM_CHANNEL_2);
```

PWM 频率为 10 kHz，ARR = 99，CCR 取值 0 ~ 99 对应占空比 0% ~ 100%。

#### 电机控制函数

```c
void goAhead(void)
{
    __HAL_TIM_SET_COMPARE(&htim3, TIM_CHANNEL_1, 58);  // 约 58% 占空比
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_12, GPIO_PIN_SET);  // 电机 1 方向

    __HAL_TIM_SET_COMPARE(&htim3, TIM_CHANNEL_2, 58);
    HAL_GPIO_WritePin(GPIOB, GPIO_PIN_13, GPIO_PIN_SET);  // 电机 2 方向
}
```

#### 主循环

```c
HAL_TIM_PWM_Start(&htim3, TIM_CHANNEL_1);
HAL_TIM_PWM_Start(&htim3, TIM_CHANNEL_2);

while (1)
{
    goAhead();
}
```

通过修改 CCR 可以调节电机转速，通过修改 GPIO 电平可以切换电机方向。实际小车通常还会封装 `goBack`、`turnLeft`、`turnRight`、`stop` 等函数。

### 超声波测距 HCSR04

`HCSR04Test` 项目使用 TIM1 的输入捕获功能测量超声波模块返回的回波脉宽，从而计算距离。

#### HCSR04 工作原理

HCSR04 超声波测距模块有两个控制引脚：

- **Trig**：触发引脚，发送至少 10 μs 的高电平脉冲启动一次测距。
- **Echo**：回响引脚，模块根据距离返回一段高电平脉冲，脉宽与距离成正比。

距离计算公式：

```text
距离 = 脉宽 × 声速 / 2
```

常温下声速约为 340 m/s，若定时器计数时钟为 1 MHz（1 μs / 格），则：

```text
距离(cm) = 脉宽(μs) × 0.034 / 2
```

#### TIM1 输入捕获配置

```c
htim1.Instance = TIM1;
htim1.Init.Prescaler = 7;              // 8 MHz / 8 = 1 MHz
htim1.Init.CounterMode = TIM_COUNTERMODE_UP;
htim1.Init.Period = 65535;             // 最大计数，避免溢出
htim1.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
htim1.Init.RepetitionCounter = 0;
htim1.Init.AutoReloadPreload = TIM_AUTORELOAD_PRELOAD_ENABLE;
HAL_TIM_Base_Init(&htim1);
HAL_TIM_IC_Init(&htim1);

sConfigIC.ICPolarity = TIM_INPUTCHANNELPOLARITY_RISING;
sConfigIC.ICSelection = TIM_ICSELECTION_DIRECTTI;
sConfigIC.ICPrescaler = TIM_ICPSC_DIV1;
sConfigIC.ICFilter = 0;
HAL_TIM_IC_ConfigChannel(&htim1, &sConfigIC, TIM_CHANNEL_1);
```

计数器时钟为 1 MHz，每个计数对应 1 μs，最大可测量约 65 ms 的脉宽，对应距离约 11 米。

#### 测距核心代码

```c
// 触发超声波测距
HAL_GPIO_WritePin(GPIOA, GPIO_PIN_0, GPIO_PIN_SET);
HAL_Delay(10);  // 触发脉宽至少 10 μs，这里用 10 ms 演示
HAL_GPIO_WritePin(GPIOA, GPIO_PIN_0, GPIO_PIN_RESET);

// 清除计数器，准备捕获 Echo 高电平宽度
__HAL_TIM_SET_COUNTER(&htim1, 0);

// 实际项目中应在输入捕获中断中分别记录上升沿和下降沿的 CCR 值
// 脉宽 = 下降沿 CCR - 上升沿 CCR
uint32_t pulseWidth = HAL_TIM_ReadCapturedValue(&htim1, TIM_CHANNEL_1);
float distance = pulseWidth * 0.034 / 2;
```

:::tip
完整实现通常需要配合输入捕获中断：在上升沿中断中清零计数器并切换为下降沿捕获，在下降沿中断中读取 CCR 并计算距离。主循环只负责触发和读取结果。
:::

## 本章小结

定时器是 STM32 最核心的外设之一。理解 PSC、CNT、ARR、CCR 等寄存器的作用，掌握定时中断和 PWM 输出，是进行嵌入式控制的基础。高级定时器还具备互补输出、死区插入等功能，适合无刷电机、逆变器等复杂应用场景。
