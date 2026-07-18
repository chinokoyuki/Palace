---
title: GPIO 方法详解
description: STM32 HAL 库中 GPIO 常用函数的详细说明、参数解析与使用示例
order: 1
---

# GPIO 方法详解

GPIO（General Purpose Input/Output）是 STM32 最基础的外设，用于控制引脚输出高低电平或读取外部信号。HAL 库把 GPIO 操作封装为几个简单直观的函数。

## HAL_GPIO_Init

```c
void HAL_GPIO_Init(GPIO_TypeDef *GPIOx, GPIO_InitTypeDef *GPIO_Init);
```

### 参数拆解

```c
HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);
//              │         │
//              │         └── GPIO 初始化参数结构体指针
//              └────────────────── GPIO 端口
```

### 功能

根据 `GPIO_InitTypeDef` 结构体中的参数，初始化指定 GPIO 端口的引脚。

### GPIO_InitTypeDef 结构体

```c
typedef struct {
    uint32_t Pin;        // 引脚编号，如 GPIO_PIN_13
    uint32_t Mode;       // 模式：输入/输出/复用/模拟/中断
    uint32_t Pull;       // 上下拉：NOPULL/PULLUP/PULLDOWN
    uint32_t Speed;      // 输出速度
    uint32_t Alternate;  // 复用功能（复用模式下使用）
} GPIO_InitTypeDef;
```

常用取值：

| 字段 | 常见取值 |
| --- | --- |
| `Mode` | `GPIO_MODE_INPUT`、`GPIO_MODE_OUTPUT_PP`、`GPIO_MODE_OUTPUT_OD`、`GPIO_MODE_AF_PP`、`GPIO_MODE_ANALOG`、`GPIO_MODE_IT_RISING`、`GPIO_MODE_IT_FALLING`、`GPIO_MODE_IT_RISING_FALLING` |
| `Pull` | `GPIO_NOPULL`、`GPIO_PULLUP`、`GPIO_PULLDOWN` |
| `Speed` | `GPIO_SPEED_FREQ_LOW`、`GPIO_SPEED_FREQ_MEDIUM`、`GPIO_SPEED_FREQ_HIGH` |

### 示例

```c
GPIO_InitTypeDef GPIO_InitStruct = {0};

__HAL_RCC_GPIOC_CLK_ENABLE();

GPIO_InitStruct.Pin = GPIO_PIN_13;
GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_OD;  // 开漏输出
GPIO_InitStruct.Pull = GPIO_NOPULL;
GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);
```

:::warning
使用任何 GPIO 前，必须先通过 `__HAL_RCC_GPIOx_CLK_ENABLE()` 开启对应端口的时钟，否则引脚不会响应。
:::

## HAL_GPIO_DeInit

```c
void HAL_GPIO_DeInit(GPIO_TypeDef *GPIOx, uint32_t GPIO_Pin);
```

### 参数拆解

```c
HAL_GPIO_DeInit(GPIOC, GPIO_PIN_13);
//                │           │
//                │           └── 引脚编号
//                └──────────────── GPIO 端口
```

### 功能

将指定引脚恢复到复位后的默认状态（通常为浮空输入）。

### 示例

```c
HAL_GPIO_DeInit(GPIOC, GPIO_PIN_13);
```

## HAL_GPIO_WritePin

```c
void HAL_GPIO_WritePin(GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin, GPIO_PinState PinState);
```

### 参数拆解

```c
HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);
//                  │           │              │
//                  │           │              └── 输出状态：SET / RESET
//                  │           └───────────────── 引脚编号
//                  └───────────────────────────── GPIO 端口
```

### 功能

设置指定 GPIO 引脚的输出电平。

### 示例

```c
HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);  // PC13 输出低电平
HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);    // PC13 输出高电平
```

:::tip
很多开发板上的 LED 是低电平点亮（一端接 VCC，另一端接引脚）。此时 `GPIO_PIN_RESET` 点亮 LED，`GPIO_PIN_SET` 熄灭 LED。
:::

## HAL_GPIO_ReadPin

```c
GPIO_PinState HAL_GPIO_ReadPin(GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin);
```

### 参数拆解

```c
GPIO_PinState state = HAL_GPIO_ReadPin(GPIOA, GPIO_PIN_0);
//                                       │           │
//                                       │           └── 引脚编号
//                                       └─────────────── GPIO 端口
```

### 功能

读取指定 GPIO 引脚的当前电平状态。

### 返回值

| 返回值 | 说明 |
| --- | --- |
| `GPIO_PIN_RESET` | 低电平 |
| `GPIO_PIN_SET` | 高电平 |

### 示例

```c
if (HAL_GPIO_ReadPin(GPIOA, GPIO_PIN_0) == GPIO_PIN_SET) {
    // PA0 为高电平
}
```

:::tip
读取按键时，通常需要配合软件消抖，避免机械触点的抖动导致误判。
:::

## HAL_GPIO_TogglePin

```c
void HAL_GPIO_TogglePin(GPIO_TypeDef *GPIOx, uint16_t GPIO_Pin);
```

### 参数拆解

```c
HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);
//                 │           │
//                 │           └── 引脚编号
//                 └─────────────── GPIO 端口
```

### 功能

翻转指定 GPIO 引脚的输出状态。如果当前是高电平，则变为低电平；反之亦然。

### 示例

```c
while (1) {
    HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);  // LED 翻转
    HAL_Delay(500);
}
```

## 外部中断相关函数

### HAL_GPIO_EXTI_IRQHandler

```c
void HAL_GPIO_EXTI_IRQHandler(uint16_t GPIO_Pin);
```

### 参数拆解

```c
HAL_GPIO_EXTI_IRQHandler(GPIO_PIN_0);
//                       │
//                       └── 触发中断的引脚编号
```

### 功能

GPIO 外部中断的统一入口处理函数，通常放在 `EXTIx_IRQHandler` 中调用。它会清除中断标志并调用 `HAL_GPIO_EXTI_Callback`。

### 示例

```c
void EXTI0_IRQHandler(void)
{
    HAL_GPIO_EXTI_IRQHandler(GPIO_PIN_0);
}
```

### HAL_GPIO_EXTI_Callback

```c
void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin);
```

### 参数拆解

```c
void HAL_GPIO_EXTI_Callback(GPIO_PIN_0)
//                          │
//                          └── 触发中断的引脚编号
```

### 功能

GPIO 外部中断回调函数，用户在该函数中编写中断处理逻辑。

### 示例

```c
void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)
{
    if (GPIO_Pin == GPIO_PIN_0) {
        HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);
    }
}
```

## 完整示例：按键控制 LED

```c
// PC13 配置为开漏输出，驱动 LED
GPIO_InitTypeDef GPIO_InitStruct = {0};
__HAL_RCC_GPIOC_CLK_ENABLE();
GPIO_InitStruct.Pin = GPIO_PIN_13;
GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_OD;
GPIO_InitStruct.Pull = GPIO_NOPULL;
GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);

// PA0 配置为输入，读取按键（假设按键另一端接地，使用内部上拉）
__HAL_RCC_GPIOA_CLK_ENABLE();
GPIO_InitStruct.Pin = GPIO_PIN_0;
GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
GPIO_InitStruct.Pull = GPIO_PULLUP;
HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

while (1) {
    if (HAL_GPIO_ReadPin(GPIOA, GPIO_PIN_0) == GPIO_PIN_RESET) {
        HAL_Delay(20);  // 简单消抖
        if (HAL_GPIO_ReadPin(GPIOA, GPIO_PIN_0) == GPIO_PIN_RESET) {
            HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);
            while (HAL_GPIO_ReadPin(GPIOA, GPIO_PIN_0) == GPIO_PIN_RESET);  // 等待释放
        }
    }
}
```
