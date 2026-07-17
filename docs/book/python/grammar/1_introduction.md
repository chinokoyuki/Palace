---
title: 介绍
description: Python 是什么、语言特点、环境搭建与第一个程序
order: 1
---

# Python 介绍

Python 是一种高级、解释型、通用的编程语言，由 Guido van Rossum 于 1989 年圣诞节期间开始设计，1991 年正式发布。它的设计哲学强调代码的可读性，允许开发者用更少的代码表达想法。Python 这个名字来源于英国喜剧团体 Monty Python，而不是蛇。

## 为什么选择 Python

Python 之所以成为当今最流行的语言之一，得益于它的一系列特点：

- **语法简洁、可读性强**：Python 使用缩进来划分代码块，强制写出整齐的代码。同样的功能，Python 通常比 C++ 或 Java 需要的代码更少。
- **动态类型**：你不需要像 C++ 那样在声明变量时指定类型，解释器会在运行时自动推断。
- **解释执行**：Python 代码无需编译成机器码，写完直接运行，开发调试非常方便。
- **跨平台**：一份代码可以在 Windows、macOS、Linux 上运行，只需安装对应解释器。
- **标准库丰富**：Python 自带大量"电池"，网络、文件、正则、日期等都开箱即用。
- **生态庞大**：无论是数据科学（NumPy、Pandas）、人工智能（PyTorch、TensorFlow）、Web 开发（Django、Flask）还是自动化脚本，都有成熟的第三方库。

## 应用领域

- 数据分析与可视化
- 人工智能与机器学习
- Web 后端开发
- 自动化运维与脚本
- 爬虫与数据采集
- 教育与科研

## 环境搭建

### 安装 Python

1. 前往 [python.org](https://www.python.org) 下载对应系统的安装包。
2. 安装时务必勾选 **Add Python to PATH**，这样可以在命令行直接使用 `python` 命令。
3. 安装完成后，打开终端输入：

```bash
python --version
```

若看到类似 `Python 3.12.0` 的版本号，说明安装成功。

### 包管理工具 pip

pip 是 Python 的包管理器，用来安装第三方库：

```bash
pip install requests
```

## 第一个程序

最经典的入门程序，向屏幕输出一句问候：

```python
print("Hello Koyuki!")
```

把上面这行保存为 `hello.py`，然后在终端运行：

```bash
python hello.py
```

运行结果：

```text
Hello Koyuki!
```

`print()` 是 Python 内置函数，作用是把括号里的内容输出到控制台并换行。字符串用引号（单引号或双引号）包裹。

## 交互式解释器

除了写文件，Python 还提供了一个交互式环境（REPL），输入一行立刻看到结果，非常适合练习：

```bash
python
```

```text
>>> 1 + 2
3
>>> print("你好，Koyuki")
你好，Koyuki
>>> exit()
```

## 完整示例

下面用一个稍长的小程序，感受 Python 的简洁：

```python
# 计算圆的面积
radius = 5
pi = 3.14159
area = pi * radius * radius

print("半径为", radius, "的圆，面积是", area)
```

运行结果：

```text
半径为 5 的圆，面积是 78.53975
```

下一章我们将正式学习 Python 的基础语法结构。
