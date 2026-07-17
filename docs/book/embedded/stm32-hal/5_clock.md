---
title: 时钟系统
description: STM32 HAL 库中 HSI、HSE、LSI、LSE、PLL、System Clock 的配置与选择
order: 5
---

# 时钟系统

时钟是单片机的“心跳”，决定了 CPU 和外设的运行速度。STM32 拥有多套时钟源和灵活的时钟树，理解时钟系统是正确配置串口波特率、定时器频率、ADC 采样率等外设参数的前提。

## 时钟源分类

STM32 的时钟源按速度和来源分为两类：

### 高速时钟

用于驱动 CPU 和大部分外设。

- **HSI**：High Speed Internal，高速内部时钟。由芯片内部 RC 振荡器产生，典型频率为 8 MHz。优点是无需外部元件，缺点是精度较低，受温度影响较大。
- **HSE**：High Speed External，高速外部时钟。由外部晶振或时钟源提供，典型频率为 8 MHz、12 MHz、25 MHz 等。精度高，稳定性好。

### 低速时钟

用于 RTC、看门狗等低功耗外设。

- **LSI**：Low Speed Internal，低速内部时钟。由内部 RC 振荡器产生，典型频率为 40 kHz。
- **LSE**：Low Speed External，低速外部时钟。由外部 32.768 kHz 晶振提供，用于 RTC 走时，精度高。

## 系统时钟 System Clock

系统时钟（SYSCLK）是 CPU 和 AHB 总线的主时钟来源。它可以从以下三个来源中选择：

- **HSI**：直接作为系统时钟，启动快但精度一般。
- **HSE**：直接作为系统时钟，精度高。
- **PLL**：锁相环倍频输出。通常以 HSE 或 HSI 为输入，倍频后得到更高的系统时钟频率。

对于 STM32F103C8T6，最高系统时钟为 72 MHz。常见的配置是使用外部 8 MHz 晶振，经过 PLL 9 倍频得到 72 MHz。

## PLL 锁相环

PLL（Phase-Locked Loop）可以把较低的输入时钟倍频到较高的频率。以 STM32F103 为例：

```text
SYSCLK = HSE / PLLMUL_PREDIV * PLLMul
```

- 当使用 8 MHz HSE 时，通常配置 `PLLMul = 9`，得到 `8 * 9 = 72 MHz`。
- 总线时钟 AHB、APB1、APB2 由 SYSCLK 分频得到。

## 时钟树中的总线

系统时钟经过分频后分配到不同总线：

| 总线 | 最高频率 | 挂载外设 |
| --- | --- | --- |
| AHB | 72 MHz | GPIO、DMA、CRC |
| APB1 | 36 MHz | USART2/3、I2C1/2、SPI2、TIM2~7 |
| APB2 | 72 MHz | USART1、SPI1、TIM1、ADC、GPIO |

:::warning
APB1 总线最高只能到 36 MHz。如果系统时钟是 72 MHz，APB1 预分频器至少要设为 2。
:::

## 外部时钟源模式

### Crystal/Ceramic Resonator

晶体/陶瓷谐振器模式，最常见。需要把外部晶振接到 OSC_IN 和 OSC_OUT 引脚，并配两个起振电容。

### BYPASS Clock Source

旁路时钟源模式。外部已经有稳定的时钟信号，直接输入到 OSC_IN 引脚，不需要晶振和起振电路。

## 使用 STM32CubeMX 配置时钟

1. 在 **Pinout & Configuration** 中，选择 RCC 外设，设置高速外部时钟为 **Crystal/Ceramic Resonator**。
2. 切换到 **Clock Configuration** 页面。
3. 设置输入频率、PLL 倍频系数、AHB/APB1/APB2 分频系数。
4. 按回车，工具会自动检查时钟是否超限。

## HAL 库时钟相关代码

由 STM32CubeMX 生成的 `SystemClock_Config()` 函数负责时钟配置：

```c
void SystemClock_Config(void)
{
    RCC_OscInitTypeDef RCC_OscInitStruct = {0};
    RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};

    // 配置振荡器
    RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSE;
    RCC_OscInitStruct.HSEState = RCC_HSE_ON;
    RCC_OscInitStruct.PLL.PLLState = RCC_PLL_ON;
    RCC_OscInitStruct.PLL.PLLSource = RCC_PLLSOURCE_HSE;
    RCC_OscInitStruct.PLL.PLLMUL = RCC_PLL_MUL9;

    if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK)
    {
        Error_Handler();
    }

    // 配置总线时钟
    RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK | RCC_CLOCKTYPE_SYSCLK
                                | RCC_CLOCKTYPE_PCLK1 | RCC_CLOCKTYPE_PCLK2;
    RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_PLLCLK;
    RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
    RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV2;
    RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV1;

    if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_2) != HAL_OK)
    {
        Error_Handler();
    }
}
```

## 获取当前时钟频率

HAL 库提供了宏来获取各个总线的频率：

```c
uint32_t sysFreq = HAL_RCC_GetSysClockFreq();   // 系统时钟频率
uint32_t hclkFreq = HAL_RCC_GetHCLKFreq();      // AHB 总线频率
uint32_t pclk1Freq = HAL_RCC_GetPCLK1Freq();    // APB1 总线频率
uint32_t pclk2Freq = HAL_RCC_GetPCLK2Freq();    // APB2 总线频率
```

这些函数在配置串口波特率、定时器分频时会经常用到。

## 实战案例

### 使用 HSE + PLL 将系统时钟提升到 72 MHz

`ClockConfig` 项目演示了如何从默认的 HSI 时钟切换到 HSE + PLL，把 STM32F103 的系统时钟提升到最高的 72 MHz，并通过 LED 闪烁观察运行效果。

系统时钟配置代码：

```c
void SystemClock_Config(void)
{
    RCC_OscInitTypeDef RCC_OscInitStruct = {0};
    RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};

    // 开启 HSE，并使用 PLL 9 倍频
    RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSE;
    RCC_OscInitStruct.HSEState = RCC_HSE_ON;
    RCC_OscInitStruct.HSEPredivValue = RCC_HSE_PREDIV_DIV1;
    RCC_OscInitStruct.HSIState = RCC_HSI_ON;
    RCC_OscInitStruct.PLL.PLLState = RCC_PLL_ON;
    RCC_OscInitStruct.PLL.PLLSource = RCC_PLLSOURCE_HSE;
    RCC_OscInitStruct.PLL.PLLMUL = RCC_PLL_MUL9;

    if (HAL_RCC_OscConfig(&RCC_OscInitStruct) != HAL_OK)
    {
        Error_Handler();
    }

    // 配置总线分频
    RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK | RCC_CLOCKTYPE_SYSCLK
                                | RCC_CLOCKTYPE_PCLK1 | RCC_CLOCKTYPE_PCLK2;
    RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_PLLCLK;
    RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
    RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV2;
    RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV1;

    if (HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_2) != HAL_OK)
    {
        Error_Handler();
    }
}
```

配置要点：

- HSE 典型频率为 8 MHz，经过 9 倍频后得到 `8 MHz × 9 = 72 MHz`。
- APB1 总线最高只能到 36 MHz，因此必须 2 分频。
- APB2 总线最高可到 72 MHz，因此 1 分频即可。
- 频率超过 24 MHz 时，Flash 等待周期需要设为 2（`FLASH_LATENCY_2`）。

在主循环中使用空循环延时翻转 LED：

```c
while (1)
{
    HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);

    for (uint32_t i = 0; i < 1000000; i++) {}

    HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);

    for (uint32_t i = 0; i < 1000000; i++) {}
}
```

:::warning
使用 HSE 时，必须保证开发板已焊接外部晶振，并且起振电容匹配，否则程序可能卡死在时钟初始化中。
:::

## 时钟配置常见问题

### 程序下载后无反应

- 外部晶振未焊接或起振电容不匹配。
- 时钟树配置错误，导致 CPU 没有时钟。
- Flash 等待周期设置不当，频率越高需要越多等待周期。

### 串口波特率不对

- 外设时钟频率与配置值不一致。
- APB1/APB2 分频系数设置错误。

### RTC 走时不准

- 没有使用 LSE 而是使用了精度较低的 LSI。
- 外部 32.768 kHz 晶振负载电容不匹配。

## 本章小结

时钟系统是 STM32 的根基。理解 HSI、HSE、LSI、LSE、PLL、System Clock 的关系，掌握 AHB、APB1、APB2 总线的分频规则，才能正确配置串口波特率、定时器、ADC 等外设。建议通过 STM32CubeMX 的时钟树图形界面来辅助理解和验证配置。
