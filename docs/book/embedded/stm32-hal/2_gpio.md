---
title: GPIO 通用输入输出
description: STM32 HAL 库中 GPIO 的引脚命名、复用、工作模式、速度和编程方法
order: 2
---

# GPIO 通用输入输出

GPIO（General Purpose Input/Output）是单片机最基本、最常用的外设。通过 GPIO，STM32 可以读取按键、驱动 LED、控制继电器、与其他芯片通信等。

## GPIO 引脚命名

STM32 的 GPIO 引脚按端口分组，每个端口最多有 16 个引脚：

- **GPIOA**：PA0 ~ PA15
- **GPIOB**：PB0 ~ PB15
- **GPIOC**：PC13 ~ PC15（在 STM32F103C8T6 上可用引脚较少）
- **GPIOD**：PD0、PD1（通常为外部晶振引脚）

:::tip
实际可用引脚取决于芯片型号和封装。例如 STM32F103C8T6 只有 PA、PB、PC 的部分引脚可用。
:::

## IO 复用

IO 复用是指同一个物理引脚可以作为不同的功能使用。例如 PA9 既可以用作普通 GPIO，也可以复用为 USART1_TX。

STM32 的每个引脚都有多个复用功能，通过 GPIO 模式配置选择：

- **通用模式**：直接由 CPU 控制输入或输出。
- **复用模式**：由片上外设（如 USART、I2C、SPI、TIM）接管引脚。

## 复用功能重映射

部分外设的功能可以通过 AFIO（Alternate Function I/O）重映射到其他备用引脚。例如 USART1 的默认 TX/RX 是 PA9/PA10，但可以重映射到 PB6/PB7。

在 HAL 库中，重映射通常通过 `__HAL_AFIO_REMAP_USART1_ENABLE()` 等宏实现。使用 STM32CubeMX 配置时，只需在引脚图上选择对应的复用功能，工具会自动处理重映射。

## 工作模式

GPIO 的工作模式分为输出模式和输入模式两大类。

### 输出模式

| 模式 | 推挽 | 开漏 |
|:---:|:---:|:---:|
| 通用 | 通用输出推挽 | 通用输出开漏 |
| 复用 | 复用输出推挽 | 复用输出开漏 |

#### 推挽输出

推挽输出由两个 MOS 管交替导通：

- 当输出高电平时，上管导通，下管截止，引脚被拉到 VCC。
- 当输出低电平时，下管导通，上管截止，引脚被拉到 GND。

推挽输出具有较强的驱动能力，适合直接驱动 LED、继电器等负载。

#### 开漏输出

开漏输出只有下管，没有上管：

- 当输出低电平时，下管导通，引脚被拉到 GND。
- 当输出高电平时，下管截止，引脚处于浮空状态，必须外接上拉电阻才能输出高电平。

开漏输出的特点是多个开漏输出可以连接在一起实现“线与”逻辑，因此 I2C 总线使用开漏输出。

#### 通用输出与复用输出

- **通用输出**：由程序直接控制引脚电平。
- **复用输出**：由外设模块自动控制引脚电平，例如 PWM 输出、串口发送等。

### 输入模式

| 模式 | 说明 |
| --- | --- |
| 输入上拉 | 使能内部上拉电阻，无外部信号时默认读取到高电平 |
| 输入下拉 | 使能内部下拉电阻，无外部信号时默认读取到低电平 |
| 输入浮空 | 上拉和下拉电阻均不使能，引脚状态由外部电路决定 |
| 模拟模式 | 引脚连接到片上 ADC/DAC，用于模拟信号采集或输出 |

#### 上拉输入

适合连接按键到 GND 的场景。按键未按下时，内部上拉电阻把引脚拉到高电平；按键按下时，引脚被拉到低电平。

#### 下拉输入

适合连接按键到 VCC 的场景。按键未按下时，内部下拉电阻把引脚拉到低电平；按键按下时，引脚被拉到高电平。

#### 浮空输入

功耗最低，但抗干扰能力差。一般只在引脚已有外部明确上下拉电路时使用。

## IO 速度

GPIO 输出速度决定了引脚电平切换的快慢：

| 速度等级 | 上升/下降时间 | 保持时间 | 最高频率 |
| --- | --- | --- | --- |
| 低速 | 125 ns | 250 ns | 2 MHz |
| 中速 | 25 ns | 50 ns | 10 MHz |
| 高速 | 5 ns | 10 ns | 50 MHz |

:::warning
速度越快，功耗和电磁干扰（EMI）越大，还可能导致信号振铃。因此应根据实际需求选择最低够用的速度，而不是一味选高速。
:::

## HAL 库 GPIO 常用函数

### 写入引脚电平

```c
HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_SET);    // 输出高电平
HAL_GPIO_WritePin(GPIOA, GPIO_PIN_5, GPIO_PIN_RESET);  // 输出低电平
```

### 翻转引脚电平

```c
HAL_GPIO_TogglePin(GPIOA, GPIO_PIN_5);
```

### 读取引脚电平

```c
GPIO_PinState state = HAL_GPIO_ReadPin(GPIOA, GPIO_PIN_0);
```

返回值是 `GPIO_PIN_SET` 或 `GPIO_PIN_RESET`。

### 锁定引脚配置

```c
HAL_GPIO_LockPin(GPIOA, GPIO_PIN_5);
```

锁定后，直到下一次复位前，该引脚的配置不能被修改。

## GPIO 初始化示例

假设需要配置 PA5 为推挽输出、高速，初始高电平；PA0 为上拉输入：

```c
void MX_GPIO_Init(void)
{
    GPIO_InitTypeDef GPIO_InitStruct = {0};

    __HAL_RCC_GPIOA_CLK_ENABLE();  // 使能 GPIOA 时钟

    // PA5 推挽输出
    GPIO_InitStruct.Pin = GPIO_PIN_5;
    GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;  // 推挽输出
    GPIO_InitStruct.Pull = GPIO_NOPULL;
    GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_HIGH;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);

    // PA0 上拉输入
    GPIO_InitStruct.Pin = GPIO_PIN_0;
    GPIO_InitStruct.Mode = GPIO_MODE_INPUT;
    GPIO_InitStruct.Pull = GPIO_PULLUP;
    HAL_GPIO_Init(GPIOA, &GPIO_InitStruct);
}
```

## 按键消抖

机械按键在按下和松开时会产生抖动，导致单片机读取到多次跳变。常用的软件消抖方法是检测到按键状态变化后延时 10~20ms，再次确认状态。

```c
#define KEY_PIN GPIO_PIN_0
#define KEY_GPIO_PORT GPIOA

uint8_t key_scan(void)
{
    if (HAL_GPIO_ReadPin(KEY_GPIO_PORT, KEY_PIN) == GPIO_PIN_RESET)
    {
        HAL_Delay(20);  // 延时消抖
        if (HAL_GPIO_ReadPin(KEY_GPIO_PORT, KEY_PIN) == GPIO_PIN_RESET)
        {
            while (HAL_GPIO_ReadPin(KEY_GPIO_PORT, KEY_PIN) == GPIO_PIN_RESET);  // 等待释放
            return 1;
        }
    }
    return 0;
}
```

## 本章小结

GPIO 是 STM32 最基础的外设。理解推挽/开漏、上拉/下拉/浮空、通用/复用等概念，是后续学习串口、I2C、SPI 等通信外设的前提。合理选择 IO 速度可以在性能和电磁兼容性之间取得平衡。
