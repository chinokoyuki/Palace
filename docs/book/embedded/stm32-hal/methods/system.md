---
title: 系统方法详解
description: STM32 HAL 库中系统初始化、延时、滴答定时器及错误处理等常用函数
order: 8
---

# 系统方法详解

HAL 库提供了一组系统级函数，用于初始化、延时、获取系统时间以及错误处理。这些函数虽然简单，但在几乎每个项目中都会用到。

## HAL_Init

```c
HAL_StatusTypeDef HAL_Init(void);
```

### 功能

初始化 HAL 库，包括：

- 配置 Flash 预取取指和等待周期。
- 配置 NVIC 优先级分组为 `NVIC_PRIORITYGROUP_4`。
- 配置 SysTick 为 1 ms 中断，用于 `HAL_Delay` 和 `HAL_GetTick`。

### 示例

```c
int main(void)
{
    HAL_Init();
    SystemClock_Config();
    // ...
}
```

:::warning
`HAL_Init()` 必须在所有 HAL 外设初始化之前调用，通常放在 `main()` 函数的最开始。
:::

## HAL_DeInit

```c
HAL_StatusTypeDef HAL_DeInit(void);
```

### 功能

反初始化 HAL 库，把所有外设恢复到复位状态。在需要软件复位或低功耗场景中使用。

## HAL_Delay

```c
void HAL_Delay(uint32_t Delay);
```

### 参数拆解

```c
HAL_Delay(500);
//        │
//        └── 延时毫秒数
```

### 功能

阻塞延时指定的毫秒数。

### 示例

```c
HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);
HAL_Delay(500);
HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);
HAL_Delay(500);
```

:::warning
`HAL_Delay` 依赖 SysTick 中断。不能在中断服务函数中调用，除非 SysTick 优先级更高。否则会导致死循环。
:::

## HAL_GetTick

```c
uint32_t HAL_GetTick(void);
```

### 功能

获取系统启动以来经过的毫秒数。该值在 SysTick 中断中递增。

### 示例

```c
uint32_t start = HAL_GetTick();
while (HAL_GetTick() - start < 1000) {
    // 非阻塞等待 1 秒
}
```

:::tip
由于 `HAL_GetTick` 返回 `uint32_t`，在计算时间差时不需要担心溢出，因为无符号整数的减法会自动处理回绕。
:::

## HAL_GetTickPrio

```c
uint32_t HAL_GetTickPrio(void);
```

### 功能

获取 SysTick 中断的优先级。

## HAL_SetTickFreq

```c
HAL_StatusTypeDef HAL_SetTickFreq(uint32_t Freq);
```

### 参数拆解

```c
HAL_SetTickFreq(HAL_TICK_FREQ_1KHZ);
//              │
//              └── 滴答频率
```

### 功能

设置 SysTick 中断频率，默认是 1 kHz（1 ms）。

## HAL_IncTick

```c
void HAL_IncTick(void);
```

### 功能

递增系统滴答计数器。该函数在 SysTick 中断中被调用，一般不需要手动调用。

## HAL_SuspendTick / HAL_ResumeTick

```c
void HAL_SuspendTick(void);
void HAL_ResumeTick(void);
```

### 功能

- `HAL_SuspendTick`：暂停 SysTick 中断，常用于进入低功耗模式前。
- `HAL_ResumeTick`：恢复 SysTick 中断。

## Error_Handler

```c
void Error_Handler(void);
```

### 功能

HAL 库在发生严重错误时调用的默认错误处理函数。通常由 STM32CubeMX 生成，实现为无限循环，并关闭中断。

### 默认实现

```c
void Error_Handler(void)
{
    __disable_irq();
    while (1) {
        // 可以在这里闪烁 LED 或输出调试信息
    }
}
```

### 自定义建议

可以在 `Error_Handler` 中加入 LED 闪烁或串口输出，方便定位初始化失败的位置：

```c
void Error_Handler(void)
{
    __disable_irq();
    while (1) {
        HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);
        for (volatile int i = 0; i < 500000; i++);
    }
}
```

## HAL_DBGMCU_EnableDBGSleepMode

```c
void HAL_DBGMCU_EnableDBGSleepMode(void);
```

### 功能

使能调试器在 CPU 进入 Sleep 模式时保持连接。调试低功耗程序时常用。

## 完整示例：系统函数使用

```c
int main(void)
{
    HAL_Init();
    SystemClock_Config();
    MX_GPIO_Init();

    while (1) {
        HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);
        HAL_Delay(1000);

        uint32_t now = HAL_GetTick();
        printf("System run time: %lu ms\r\n", now);
    }
}
```
