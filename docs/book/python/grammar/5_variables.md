---
title: Python 变量
description: 变量的赋值、动态类型、命名规范、多重赋值与对象引用
order: 5
---

# Python 变量

变量是程序用来"记住"数据的一个名字。在 Python 中，变量更像是**贴在对象上的标签**，而不是"装数据的盒子"。理解这一点，能避免很多初学者常见的困惑。

## 赋值语句

用等号 `=` 给变量赋值，左边是变量名，右边是要绑定的值：

```python
name = "Koyuki"
age = 18
print(name, age)
```

运行结果：

```text
Koyuki 18
```

Python 会在赋值时自动推断类型，无需声明：

```python
x = 10          # x 是整数
x = "hello"     # 现在 x 变成字符串，完全合法
```

这就是**动态类型**：同一个变量在不同时刻可以绑定不同类型的值。

## 命名规范

- 只能包含字母、数字、下划线，且不能以数字开头。
- 区分大小写。
- 不能使用关键字。
- 推荐风格（PEP 8）：小写字母 + 下划线。

```python
user_name = "Koyuki"
max_score = 100
is_ready = True
```

不推荐的写法：

```python
UserName = "X"     # 类才用大驼峰
user-name = "X"    # 含连字符，非法
1st_place = "X"    # 以数字开头，非法
```

## 多重赋值

一行可以给多个变量赋值，左右按顺序一一对应：

```python
a, b, c = 1, 2, 3
print(a, b, c)     # 1 2 3
```

也可以轻松交换两个变量的值（无需临时变量）：

```python
x, y = 10, 20
x, y = y, x
print(x, y)        # 20 10
```

还有一个常用的"拆包"技巧，用 `*` 收集剩余元素：

```python
first, *rest = [1, 2, 3, 4]
print(first)       # 1
print(rest)        # [2, 3, 4]
```

## 变量是"标签"而非"盒子"

在 Python 中，赋值 `a = 10` 的含义是：创建一个整数对象 `10`，然后让名字 `a` 指向它。多个名字可以指向同一个对象：

```python
a = [1, 2, 3]
b = a            # b 和 a 指向同一个列表
b.append(4)
print(a)         # [1, 2, 3, 4]  通过 b 修改，a 也变了
```

`id()` 函数可以查看对象在内存中的"身份证"：

```python
a = [1, 2, 3]
b = a
print(id(a) == id(b))   # True，两者指向同一对象
```

## is 与 == 的区别

- `==` 比较**值**是否相等。
- `is` 比较**是否为同一个对象**（内存地址相同）。

```python
a = [1, 2]
b = [1, 2]
print(a == b)    # True，值相等
print(a is b)    # False，是两个不同的对象
```

小整数和短字符串会被 Python 缓存复用，所以有时 `is` 会返回 `True`，但不要依赖这种优化，比较值请用 `==`。

## 删除变量

用 `del` 语句可以删除变量（解绑名字）：

```python
x = 100
del x
print(x)        # NameError: name 'x' is not defined
```

## 全局变量与局部变量

在函数内部定义的是局部变量，只在函数内可见；函数外定义的是全局变量。关于作用域的更多细节会在"函数"章节展开。

```python
count = 0        # 全局变量

def increment():
    local = 1    # 局部变量
    print(local)

increment()
# print(local)   # 报错：local 在函数外不可见
```

## 完整示例

```python
# 用变量描述一个学生
student_name = "Koyuki"
student_age = 18
is_monitor = True

# 多重赋值与交换
a, b = 5, 9
a, b = b, a

print("姓名：", student_name)
print("年龄：", student_age)
print("是班长吗：", is_monitor)
print("交换后 a, b =", a, b)
```

运行结果：

```text
姓名： Koyuki
年龄： 18
是班长吗： True
交换后 a, b = 9 5
```
