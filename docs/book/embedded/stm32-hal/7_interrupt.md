---
title: 中断与 NVIC
description: STM32 HAL 库中外部中断、串口中断、中断优先级、抢占优先级与子优先级
order: 7
---

# 中断与 NVIC

中断是单片机响应外部事件或内部条件的重要机制。当中断发生时，CPU 暂停当前任务，转去执行中断服务函数，处理完后再返回原任务。合理使用中断可以让程序更高效、响应更及时。

## 为什么使用中断

以串口接收为例，如果不使用中断，程序需要不断查询接收标志位，浪费 CPU 时间：

```c
while (1)
{
    if (__HAL_UART_GET_FLAG(&huart1, UART_FLAG_RXNE))
    {
        data = huart1.Instance->DR;
        // 处理数据
    }
}
```

使用中断后，CPU 可以执行其他任务，只有在收到数据时才进入中断处理：

```c
void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
    // 收到数据后自动进入这里
}
```

## 中断缓冲机制

以串口接收为例，数据通常经过两级缓冲：

```text
RX 引脚 → 一级缓冲（移位寄存器）→ 二级缓冲（数据寄存器 DR）
```

当数据完整接收并移入数据寄存器后，会触发 RXNE 中断，通知 CPU 读取数据。

## NVIC 中断控制器

NVIC（Nested Vectored Interrupt Controller）是 ARM Cortex-M 内核内置的中断控制器，负责管理所有中断的使能、优先级和响应。

STM32 中，NVIC 的主要功能包括：

- 使能或禁止某个中断。
- 设置中断的抢占优先级和子优先级。
- 管理中断排队和嵌套。

## 中断优先级

STM32F103 使用 4 位优先级寄存器，可以配置为 `0b0000` 到 `0b1111`，数值越小优先级越高。

优先级分为两部分：

- **抢占优先级**：决定中断是否可以嵌套。高抢占优先级的中断可以打断低抢占优先级的中断。
- **子优先级**：当多个中断同时等待处理且抢占优先级相同时，子优先级高的先执行。子优先级不参与中断嵌套。

### 优先级分组

NVIC 提供 5 种优先级分组方式：

| 分组 | 抢占优先级位数 | 子优先级位数 | 抢占优先级范围 | 子优先级范围 |
| --- | --- | --- | --- | --- |
| 0 | 0 | 4 | 0 | 0 ~ 15 |
| 1 | 1 | 3 | 0 ~ 1 | 0 ~ 7 |
| 2 | 2 | 2 | 0 ~ 3 | 0 ~ 3 |
| 3 | 3 | 1 | 0 ~ 7 | 0 ~ 1 |
| 4 | 4 | 0 | 0 ~ 15 | 0 |

默认分组为 2，即 2 位抢占优先级、2 位子优先级。

## 中断排队

当多个中断同时发生时，NVIC 根据优先级决定执行顺序：

1. 抢占优先级高的先执行。
2. 抢占优先级相同时，子优先级高的先执行。
3. 都相同时，遵循先来后到原则。

## 中断嵌套

中断嵌套是指一个中断正在执行时，另一个更高抢占优先级的中断打断了它。嵌套只与抢占优先级有关，与子优先级无关。

例如：

- 定时器中断优先级为（抢占=1，子=0）。
- 串口中断优先级为（抢占=0，子=0）。

当定时器中断正在执行时，串口中断可以立即打断它。

## HAL 库中配置中断优先级

在 `HAL_NVIC_SetPriority` 函数中设置：

```c
HAL_NVIC_SetPriority(USART1_IRQn, 1, 0);  // 抢占优先级 1，子优先级 0
HAL_NVIC_EnableIRQ(USART1_IRQn);          // 使能 USART1 中断
```

## 外部中断 EXTI

STM32 的每个 GPIO 引脚都可以配置为外部中断源。例如配置 PA0 为上升沿触发的外部中断：

### STM32CubeMX 配置

1. 选择 PA0，设置为 `GPIO_EXTI0`。
2. 在 GPIO 设置中，选择上升沿触发。
3. 使能 EXTI0 中断。

### 代码示例

```c
void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)
{
    if (GPIO_Pin == GPIO_PIN_0)
    {
        // 按键按下处理
    }
}
```

:::tip
HAL 库中的中断回调函数以 `Callback` 结尾，用户在其中编写业务逻辑，不需要手动清除中断标志。
:::

## 中断使用注意事项

### 中断服务函数要简短

中断服务函数执行时间过长会影响系统实时性。复杂处理应放到主循环中，中断里只设置标志或读取数据。

### 避免在中断中使用阻塞函数

例如 `HAL_Delay()` 依赖 SysTick 中断，如果在中断中调用且 SysTick 优先级较低，会导致死锁。

### 注意共享变量

中断和主循环可能同时访问同一个变量。应使用 `volatile` 修饰，并在必要时关闭中断进行保护。

```c
volatile uint8_t flag = 0;

void EXTI0_IRQHandler(void)
{
    flag = 1;
}

int main(void)
{
    while (1)
    {
        if (flag)
        {
            __disable_irq();
            flag = 0;
            __enable_irq();
            // 处理事件
        }
    }
}
```

## 实战案例

### 定时器中断实现自定义毫秒延时

`MyDelay` 项目使用 TIM1 的定时中断来实现一个不依赖 SysTick 的毫秒级延时函数。这个技巧在需要关闭 SysTick 或需要更高精度延时的场景中很有用。

#### TIM1 配置

系统时钟使用默认的 HSI（8 MHz），TIM1 预分频设为 7，自动重装载值设为 999：

```c
htim1.Instance = TIM1;
htim1.Init.Prescaler = 7;              // 8 MHz / 8 = 1 MHz
htim1.Init.CounterMode = TIM_COUNTERMODE_UP;
htim1.Init.Period = 999;               // 1 MHz / 1000 = 1 kHz，即 1 ms
htim1.Init.ClockDivision = TIM_CLOCKDIVISION_DIV1;
htim1.Init.RepetitionCounter = 0;
htim1.Init.AutoReloadPreload = TIM_AUTORELOAD_PRELOAD_ENABLE;
HAL_TIM_Base_Init(&htim1);
```

计数器时钟为 1 MHz，每计数 1000 次产生一次更新中断，因此中断周期为 1 ms。

#### 中断回调与延时函数

```c
static volatile uint32_t currentMiliSeconds = 0;

static uint32_t MyGetTick(void)
{
    return currentMiliSeconds;
}

static void MyDelay(uint8_t Delay)
{
    uint32_t expireTime = MyGetTick() + Delay;
    while (expireTime > MyGetTick());
}

void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
{
    if (htim == &htim1) {
        currentMiliSeconds++;
    }
}
```

注意 `currentMiliSeconds` 用 `volatile` 修饰，因为该变量会在中断中修改、在主循环中读取，防止编译器优化导致读取到旧值。

#### 主循环使用

```c
HAL_TIM_Base_Start_IT(&htim1);

while (1)
{
    HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);
    MyDelay(100);
    HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);
    MyDelay(100);
}
```

这样 LED 会以 100 ms 为周期闪烁，延时精度由 TIM1 中断保证，不再依赖 SysTick。

:::warning
`MyDelay` 函数内部是空转等待，会占用 CPU。如果不需要阻塞 CPU，可以使用类似 `if (MyGetTick() - lastTick >= interval)` 的非阻塞写法。
:::

## 本章小结

中断让 STM32 能够及时响应外部事件，NVIC 负责管理中断优先级和嵌套。理解抢占优先级和子优先级的区别，合理设置中断优先级分组，避免在中断中执行耗时操作，是编写稳定中断程序的关键。
