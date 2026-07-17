---
title: Python 基础语法
description: Python 程序结构、缩进规则、语句、标识符与关键字
order: 2
---

# Python 程序结构

与 C++ 不同，Python 没有大括号 `{}` 来划分代码块，而是用**缩进**来表达层次关系。理解缩进和基本的程序结构是写好 Python 的第一步。

## 缩进（Indentation）

在 Python 中，缩进不是"为了好看"，而是**语法的一部分**。同一代码块内的语句必须有相同的缩进量，通常使用 4 个空格。

```python
if 18 >= 18:
    print("已成年")
    print("可以投票")
print("这条语句不属于上面的 if 块")
```

运行结果：

```text
已成年
可以投票
这条语句不属于上面的 if 块
```

如果缩进不一致，Python 会报 `IndentationError`：

```python
if True:
    print("正确缩进")
     print("缩进不一致，会报错")
```

:::tip 提示
永远不要混用空格和 Tab，建议在编辑器里把 Tab 设置为"输入 4 个空格"。
:::

## 语句与换行

- 一条语句通常写在一行，Python 会自动把一行当作一条语句。
- 行尾**不需要分号**（写了也不会错，但不推荐）。
- 如果一行太长，可以用反斜杠 `\` 续行：

```python
total = 1 + 2 + 3 + \
        4 + 5 + 6
print(total)
```

- 在括号 `()`、`[]`、`{}` 内的内容可以自然换行，无需反斜杠：

```python
numbers = [
    1, 2, 3,
    4, 5, 6,
]
```

## 多个语句写在一行

用分号可以在一行写多条语句，但会降低可读性，一般不推荐：

```python
a = 1; b = 2; print(a + b)
```

## 代码块

由缩进划定的一组语句称为代码块。函数体、循环体、条件分支都是代码块：

```python
def greet(name):
    print("你好，", name)   # 这一行属于 greet 函数体
    print("欢迎来到 Koyuki Palace")

greet("Koyuki")
```

运行结果：

```text
你好， Koyuki
欢迎来到 Koyuki Palace
```

判断一个语句属于哪个代码块，看的就是它的缩进层级。

## 空行与注释

- 空行（完全空白的行）会被解释器忽略，用来分隔逻辑段落，提升可读性。
- 注释以 `#` 开头，详见下一章。

```python
# 这是注释
x = 10


# 上面一行空行不影响程序
y = 20
```

## 标识符

标识符是用来给变量、函数、类等命名的符号。规则如下：

- 由字母、数字和下划线 `_` 组成。
- 不能以数字开头。
- 区分大小写，`name` 和 `Name` 是不同的。
- 不能使用 Python 关键字。

合法的标识符：

```python
user_name
_score
data2
```

非法的标识符：

```python
2name     # 错误：以数字开头
user name # 错误：包含空格
class     # 错误：使用了关键字
```

命名习惯（PEP 8 规范建议）：

- 变量和函数用**小写 + 下划线**：`user_name`、`calculate_sum`。
- 常量用**全大写**：`MAX_SIZE`。
- 类用**大驼峰**：`StudentInfo`。

## 关键字

关键字是 Python 保留的特殊单词，不能用作标识符。常见关键字包括：

| 类别 | 关键字 |
| --- | --- |
| 控制流 | `if`、`elif`、`else`、`for`、`while`、`break`、`continue`、`pass`、`return` |
| 逻辑 | `and`、`or`、`not`、`is`、`in` |
| 定义 | `def`、`class`、`lambda`、`import`、`from`、`as`、`with` |
| 其它 | `True`、`False`、`None`、`try`、`except`、`finally`、`raise`、`global`、`nonlocal` |

可以用下面这行代码查看所有关键字：

```python
import keyword
print(keyword.kwlist)
```

## 完整示例

```python
# 判断一个数是奇数还是偶数
number = 7

if number % 2 == 0:
    print(number, "是偶数")
else:
    print(number, "是奇数")
```

运行结果：

```text
7 是奇数
```
