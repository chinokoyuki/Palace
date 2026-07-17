---
title: STM32-HAL 入门
description: STM32 HAL 库开发环境、工程结构与第一个点灯程序
order: 1
---

# STM32-HAL 入门

## 什么是 STM32

STM32 是意法半导体（STMicroelectronics）推出的一系列基于 ARM Cortex-M 内核的 32 位微控制器。凭借丰富的外设、完善的生态和亲民的价格，STM32 广泛应用于工业控制、消费电子、物联网、汽车电子等领域。

## 什么是 HAL 库

HAL 是 Hardware Abstraction Layer（硬件抽象层）的缩写。HAL 库是 ST 官方提供的一套高层 API，它把底层寄存器操作封装成易于理解的函数调用。使用 HAL 库开发 STM32 的优点包括：

- **可移植性强**：同一套 API 可以在不同型号的 STM32 之间迁移。
- **开发效率高**：不需要记忆大量寄存器地址，函数名直观。
- **配套工具完善**：STM32CubeMX 可以图形化配置外设并自动生成初始化代码。

## 开发环境搭建

### 所需工具

- **STM32CubeMX**：用于芯片选型、引脚配置、时钟配置和工程生成。
- **STM32CubeIDE / Keil / VS Code + PlatformIO**：用于编写、编译和调试代码。
- **ST-Link / DAP-Link / J-Link**：用于把程序下载到单片机。

### 使用 STM32CubeMX 创建工程

1. 打开 STM32CubeMX，点击 **File > New Project**。
2. 在芯片选择界面输入目标芯片型号，例如 `STM32F103C8T6`。
3. 配置时钟树、GPIO、串口等外设。
4. 点击 **Project > Generate Code**，选择 IDE 类型，生成工程文件。

## 工程结构简介

一个典型的 HAL 库工程包含以下目录：

```text
Project/
├── Core/
│   ├── Inc/           # 头文件
│   │   └── main.h
│   └── Src/           # 源文件
│       └── main.c
├── Drivers/
│   ├── STM32F1xx_HAL_Driver/  # HAL 库驱动
│   └── CMSIS/                 # CMSIS 核心文件
├── .ioc                 # STM32CubeMX 配置文件
└── Makefile / .uvprojx  # 工程文件
```

## 第一个程序：点亮 LED

### 硬件连接

假设开发板上有一个 LED 连接到 `PA5` 引脚，且低电平点亮。

### STM32CubeMX 配置

1. 选择 `PA5`，设置为 `GPIO_Output`。
2. 在 GPIO 设置中，将初始电平设为高电平，这样上电时 LED 不会亮。
3. 生成代码。

### 主循环代码

```c
#include "main.h"

int main(void)
{
    HAL_Init();
    SystemClock_Config();
    MX_GPIO_Init();

    while (1)
    {
        HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_RESET);  // 点亮 LED
        HAL_Delay(500);                                         // 延时 500ms
        HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET);    // 熄灭 LED
        HAL_Delay(500);                                         // 延时 500ms
    }
}
```

### 代码解释

- `HAL_Init()`：初始化 HAL 库。
- `SystemClock_Config()`：配置系统时钟，由 STM32CubeMX 自动生成。
- `MX_GPIO_Init()`：初始化 GPIO，由 STM32CubeMX 自动生成。
- `HAL_GPIO_WritePin()`：设置指定引脚的电平。
- `HAL_Delay()`：毫秒级延时函数。

### 下载与验证

编译工程，通过 ST-Link 把程序下载到单片机。如果一切正常，LED 会以 1Hz 的频率闪烁。

## 本章小结

本章介绍了 STM32 和 HAL 库的基本概念，演示了如何使用 STM32CubeMX 创建工程并点亮 LED。后续章节将深入讲解 GPIO、串口、I2C、SPI、时钟、中断和定时器等核心外设。
