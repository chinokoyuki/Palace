---
title: NVIC 方法详解
description: STM32 HAL 库中 NVIC 中断优先级设置、使能禁用及常用中断管理函数
order: 7
---

# NVIC 方法详解

NVIC（Nested Vectored Interrupt Controller）是 Cortex-M 内核的中断控制器，负责管理中断的优先级、使能和挂起。HAL 库提供了一组简洁的 NVIC 操作函数。

## 中断优先级基础

STM32F103 使用 4 位优先级分组，支持 16 级抢占优先级和 16 级子优先级（具体取决于分组设置）。

| 分组方式 | 抢占优先级位数 | 子优先级位数 |
| --- | --- | --- |
| `NVIC_PRIORITYGROUP_0` | 0 | 4 |
| `NVIC_PRIORITYGROUP_1` | 1 | 3 |
| `NVIC_PRIORITYGROUP_2` | 2 | 2 |
| `NVIC_PRIORITYGROUP_3` | 3 | 1 |
| `NVIC_PRIORITYGROUP_4` | 4 | 0 |

:::tip
`NVIC_PRIORITYGROUP_4` 最常用，只有抢占优先级，没有子优先级，响应速度最快。
:::

## HAL_NVIC_SetPriorityGrouping

```c
void HAL_NVIC_SetPriorityGrouping(uint32_t PriorityGroup);
```

### 参数拆解

```c
HAL_NVIC_SetPriorityGrouping(NVIC_PRIORITYGROUP_4);
//                           │
//                           └── 优先级分组方式
```

### 功能

设置中断优先级分组。

## HAL_NVIC_SetPriority

```c
void HAL_NVIC_SetPriority(IRQn_Type IRQn,
                          uint32_t PreemptPriority,
                          uint32_t SubPriority);
```

### 参数拆解

```c
HAL_NVIC_SetPriority(TIM2_IRQn, 2, 0);
//                   │             │  │
//                   │             │  └── 子优先级
//                   │             └───── 抢占优先级
//                   └─────────────────── 中断号
```

### 功能

设置指定中断的抢占优先级和子优先级。

### 参数

| 参数 | 说明 |
| --- | --- |
| `IRQn` | 中断号，如 `TIM2_IRQn`、`USART1_IRQn` |
| `PreemptPriority` | 抢占优先级，数值越小优先级越高 |
| `SubPriority` | 子优先级 |

## HAL_NVIC_EnableIRQ

```c
void HAL_NVIC_EnableIRQ(IRQn_Type IRQn);
```

### 参数拆解

```c
HAL_NVIC_EnableIRQ(TIM2_IRQn);
//                 │
//                 └── 中断号
```

### 功能

使能指定中断。

## HAL_NVIC_DisableIRQ

```c
void HAL_NVIC_DisableIRQ(IRQn_Type IRQn);
```

### 参数拆解

```c
HAL_NVIC_DisableIRQ(TIM2_IRQn);
//                  │
//                  └── 中断号
```

### 功能

禁用指定中断。

## HAL_NVIC_SetPendingIRQ

```c
void HAL_NVIC_SetPendingIRQ(IRQn_Type IRQn);
```

### 参数拆解

```c
HAL_NVIC_SetPendingIRQ(TIM2_IRQn);
//                     │
//                     └── 中断号
```

### 功能

软件设置指定中断为挂起状态，触发一次中断。

## HAL_NVIC_ClearPendingIRQ

```c
void HAL_NVIC_ClearPendingIRQ(IRQn_Type IRQn);
```

### 参数拆解

```c
HAL_NVIC_ClearPendingIRQ(TIM2_IRQn);
//                       │
//                       └── 中断号
```

### 功能

清除指定中断的挂起状态。

## HAL_NVIC_SystemReset

```c
void HAL_NVIC_SystemReset(void);
```

### 功能

执行系统软件复位，相当于按复位键。

## 完整示例：定时器中断配置

```c
// 1. 配置中断优先级分组
HAL_NVIC_SetPriorityGrouping(NVIC_PRIORITYGROUP_4);

// 2. 设置定时器中断优先级并使能
HAL_NVIC_SetPriority(TIM2_IRQn, 2, 0);
HAL_NVIC_EnableIRQ(TIM2_IRQn);

// 3. 启动定时器中断
HAL_TIM_Base_Start_IT(&htim2);

// 4. 中断服务函数
void TIM2_IRQHandler(void)
{
    HAL_TIM_IRQHandler(&htim2);
}

// 5. 回调函数
void HAL_TIM_PeriodElapsedCallback(TIM_HandleTypeDef *htim)
{
    if (htim == &htim2) {
        HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);
    }
}
```

:::warning
如果在中断服务函数中调用 `HAL_Delay`，必须保证 SysTick 的抢占优先级高于该中断，否则会出现死循环。
:::
