---
title: Python 函数
description: 函数的定义、参数、返回值、默认参数与作用域
order: 12
---

# Python 函数

函数是一段可以**重复调用**的代码块。把常用逻辑封装成函数，既能减少重复，又让程序结构更清晰。

## 定义函数

用 `def` 关键字，后面是函数名、参数列表和冒号。缩进的部分是函数体：

```python
def calculate_1(central, a):
    s = central + a
    print(f"{s}")
    return s

s = calculate_1(1, 2)
print(s)
```

运行结果：

```text
3
3
```

- `def calculate_1(central, a):` 定义函数并声明两个参数。
- 函数体里先算出 `s = central + a`。
- `return s` 把结果返回给调用者；如果不写 `return`，函数默认返回 `None`。

## 参数

调用函数时，按位置把值传给参数：

```python
def greet(name, age):
    print(f"{name} 今年 {age} 岁")

greet("Koyuki", 18)
```

### 默认参数

给参数一个默认值，调用时可以不传：

```python
def greet(name, greeting="你好"):
    print(f"{greeting}，{name}")

greet("Koyuki")            # 你好，Koyuki
greet("Koyuki", "早上好")   # 早上好，Koyuki
```

:::tip 注意
默认参数要放在普通参数之后。
:::

### 关键字参数

调用时可以用 `参数名=值` 的形式，顺序就无所谓了：

```python
greet(age=18, name="Koyuki")
```

### 可变参数 *args 与 **kwargs

- `*args` 接收任意个**位置参数**，组织成元组。
- `**kwargs` 接收任意个**关键字参数**，组织成字典。

```python
def show(*args, **kwargs):
    print("位置参数：", args)
    print("关键字参数：", kwargs)

show(1, 2, 3, name="Koyuki", age=18)
```

运行结果：

```text
位置参数： (1, 2, 3)
关键字参数： {'name': 'Koyuki', 'age': 18}
```

## 返回值

`return` 可以返回单个值，也可以返回多个值（其实是打包成一个元组）：

```python
def divide(a, b):
    return a // b, a % b

quotient, remainder = divide(7, 3)
print(quotient, remainder)     # 2 1
```

## 作用域：局部与全局

函数内部定义的变量是**局部变量**，只在函数内有效；函数外定义的是**全局变量**。如果想在函数内修改全局变量，需要 `global` 声明：

```python
count = 0

def increment():
    global count
    count += 1

increment()
print(count)     # 1
```

## 空函数与 pass

用 `pass` 占位，表示"暂时什么都不做"，保证语法完整：

```python
def todo():
    pass     # 待实现
```

## 文档字符串

函数开头的三引号字符串会自动成为它的说明文档：

```python
def add(a, b):
    """返回 a 与 b 的和。"""
    return a + b

print(add.__doc__)    # 返回 a 与 b 的和。
```

## lambda 匿名函数

`lambda` 用来写一行就能搞定的简单函数，不需要 `def` 和函数名，常用于 `sorted()`、`map()`、`filter()` 等需要传入短函数的场景：

```python
# 普通写法
def square(x):
    return x * x

# lambda 写法
square = lambda x: x * x

print(square(5))     # 25
```

更常见的用法是直接作为参数传入：

```python
pairs = [(1, "one"), (3, "three"), (2, "two")]
pairs.sort(key=lambda x: x[0])    # 按每个元组的第一个元素排序
print(pairs)  # [(1, 'one'), (2, 'two'), (3, 'three')]
```

:::tip 提示
`lambda` 适合极短的逻辑（一行内写完）。如果逻辑复杂，还是老老实实用 `def`，代码更容易读懂。
:::

## 完整示例

```python
def calculate(central, a):
    s = central + a
    return s

result = calculate(1, 2)
print("计算结果：", result)

# 带默认参数与多返回值
def stats(numbers, label="数据"):
    return label, sum(numbers), max(numbers)

name, total, peak = stats([3, 1, 4, 1, 5], "成绩")
print(f"{name}：总和 {total}，最高 {peak}")
```

运行结果：

```text
计算结果： 3
成绩：总和 14，最高 5
```
