---
title: Python 数据类型
description: Python 中的数字、字符串、布尔、空值类型，以及类型检查与转换
order: 4
---

# Python 数据类型

Python 是**动态类型**语言——你不需要在声明变量时指定类型，但每个值依然有明确的类型。理解数据类型，才能正确地存储、计算和传递数据。

## 为什么需要数据类型

不同类型的数据支持的操作不同：数字可以加减，字符串可以拼接，布尔值用于判断。类型决定了"能做什么"以及"在计算机里如何存储"。

## 内置基本类型

| 类型 | 名称 | 示例 | 说明 |
| --- | --- | --- | --- |
| `int` | 整数 | `10`、`-3`、`0` | 任意大小的整数（Python 3 没有 int/long 之分） |
| `float` | 浮点数 | `3.14`、`-0.5` | 小数，存在精度限制 |
| `complex` | 复数 | `1 + 2j` | 科学计算用，日常少用 |
| `str` | 字符串 | `"Koyuki"` | 由字符组成的文本 |
| `bool` | 布尔值 | `True`、`False` | 逻辑真/假，本质是 0/1 的特殊整数 |
| `NoneType` | 空值 | `None` | 表示"没有值" |

## 查看与判断类型

用内置函数 `type()` 查看某个值的类型：

```python
print(type(10))          # <class 'int'>
print(type(3.14))        # <class 'float'>
print(type("Koyuki"))    # <class 'str'>
print(type(True))        # <class 'bool'>
print(type(None))        # <class 'NoneType'>
```

用 `isinstance()` 判断是否属于某类型，比直接比较 `type` 更灵活（支持继承）：

```python
print(isinstance(10, int))        # True
print(isinstance(3.14, int))      # False
```

## 整数（int）

Python 的整数没有大小上限，可以轻松表示超大数字：

```python
big = 2 ** 100
print(big)        # 1267650600228229401496703205376
print(type(big))  # <class 'int'>
```

进制写法：

```python
a = 0b1010    # 二进制，等于 10
b = 0o17      # 八进制，等于 15
c = 0xFF      # 十六进制，等于 255
```

## 浮点数（float）

浮点数用于表示小数，但受二进制存储限制，会有微小误差：

```python
print(0.1 + 0.2)    # 0.30000000000000004
```

对精度要求高的场景（如金额），应使用 `decimal` 模块。此外，可以用 `round()` 控制小数位数：

```python
print(round(0.1 + 0.2, 2))    # 0.3
```

## 字符串（str）

字符串是字符的序列，用单引号、双引号或三引号包裹：

```python
s1 = '单引号'
s2 = "双引号"
s3 = """三引号
可以跨多行"""
```

字符串支持拼接、重复、索引等操作，后续章节会详细展开。这里先看基础：

```python
name = "Koyuki"
print(name + " Palace")     # 拼接：Koyuki Palace
print(name * 2)             # 重复：KoyukiKoyuki
print(name[0])              # 索引：K
```

## 布尔值（bool）

布尔值只有 `True` 和 `False` 两种，常用于条件判断：

```python
is_student = True
print(is_student)           # True
print(type(is_student))     # <class 'bool'>
```

布尔值其实是整数的子类：`True == 1`、`False == 0`，但请把它当作逻辑值使用，不要用于算术。

## 空值 None

`None` 表示"没有值"或"空"，不同于 `0`、空字符串或空列表：

```python
result = None
print(result)               # None
print(result is None)       # True
```

函数没有显式 `return` 时，默认返回 `None`。

## 类型转换

Python 提供了内置转换函数，可以在兼容类型之间转换：

```python
print(int("10"))            # 字符串 -> 整数：10
print(float("3.14"))        # 字符串 -> 浮点：3.14
print(str(100))             # 整数 -> 字符串："100"
print(bool(0))              # 整数 -> 布尔：False
print(bool("hi"))           # 字符串 -> 布尔：True
```

转换失败会抛出错误：

```python
int("abc")    # ValueError: invalid literal for int()
```

## 不可变与可变

数据类型可以分为两类：

- **不可变（immutable）**：`int`、`float`、`str`、`bool`、`tuple`。创建后不能修改其中的值，修改会生成新对象。
- **可变（mutable）**：`list`、`dict`、`set`。创建后内容可以被修改。

这个概念在后续"列表""字典"章节中非常关键。

## 完整示例

```python
age = 18
height = 1.75
name = "Koyuki"
is_active = True
note = None

# type(x) 返回类型对象（如 <class 'int'>），.__name__ 取其名称字符串（如 'int'）
print("姓名：", name, type(name).__name__)
print("年龄：", age, type(age).__name__)
print("身高：", height, type(height).__name__)
print("活跃：", is_active, type(is_active).__name__)
print("备注：", note, type(note).__name__)
```

运行结果：

```text
姓名： Koyuki str
年龄： 18 int
身高： 1.75 float
活跃： True bool
备注： None NoneType
```
