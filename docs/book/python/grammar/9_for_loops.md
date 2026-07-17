---
title: Python for 循环
description: for 循环遍历可迭代对象、range 函数与嵌套循环
order: 9
---

# Python for 循环

`for` 循环用于**遍历**一个可迭代对象（如列表、字符串、字典、range 等），依次取出其中的每一个元素。

语法：

```python
for 变量名 in 可迭代对象:
    循环体（要缩进）
```

## 遍历列表

```python
temperature_list = [36.4, 37.0, 38.2, 37.5]

for temperature in temperature_list:
    if temperature >= 38:
        print("Warning")
```

运行结果：

```text
Warning
```

每循环一次，`temperature` 依次被赋值为列表里的每个元素。注意 `for` 行末尾的**冒号**和循环体的**缩进**。

## range() 函数

`range()` 用来生成一个整数序列，常配合 `for` 使用。

- `range(stop)`：从 0 到 stop-1。
- `range(start, stop)`：从 start 到 stop-1。
- `range(start, stop, step)`：**步长**为 step，即每次增加多少。

```python
# 从 5 到 10（不包含 10），步长为 2
for number in range(5, 10, 2):
    print(number)
```

运行结果：

```text
5
7
9
```

常用写法：

```python
for i in range(5):        # 0,1,2,3,4
    print(i)

for i in range(1, 6):     # 1,2,3,4,5
    print(i)
```

## 遍历字符串

字符串也是可迭代对象，可以逐个取出字符：

```python
for ch in "Koyuki":
    print(ch)
```

## 遍历字典

结合字典的 `items()` 等方法：

```python
scores = {"Alice": 90, "Bob": 85}
for name, score in scores.items():
    print(name, "考了", score, "分")
```

## 结合索引遍历：range + len

如果想同时拿到"索引"和"元素"，可用 `range(len(...))` 或 `enumerate()`：

```python
fruits = ["苹果", "香蕉", "橙子"]

for i in range(len(fruits)):
    print(i, fruits[i])

# 更优雅的写法：enumerate 同时给出索引和元素
for i, fruit in enumerate(fruits):
    print(i, fruit)
```

## 嵌套循环

循环里可以再套循环，比如打印九九乘法表：

```python
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i}×{j}={i * j}", end="  ")
    print()     # 每行结束换行
```

运行结果：

```text
1×1=1  1×2=2  1×3=3
2×1=2  2×2=4  2×3=6
3×1=3  3×2=6  3×3=9
```

## break 与 continue

- `break`：立刻结束整个循环。
- `continue`：跳过本次循环剩余部分，进入下一次。

```python
for i in range(10):
    if i == 3:
        break        # 遇到 3 就停
    print(i)         # 输出 0 1 2
```

```python
for i in range(5):
    if i % 2 == 0:
        continue     # 跳过偶数
    print(i)         # 输出 1 3
```

## for...else

Python 的 `for` 循环也可以带 `else`：当循环**正常结束**（没有被 `break` 打断）时执行 `else` 块。常用于"搜索到就提前退出，没搜到就执行后备逻辑"的场景：

```python
names = ["Alice", "Bob", "Cindy"]

for name in names:
    if name == "Eve":
        print("找到了 Eve！")
        break
else:
    print("没找到 Eve")
```

运行结果：

```text
没找到 Eve
```

:::tip 注意
`for...else` 中的 `else` 在循环被 `break` 打断时**不会执行**。这和直觉上的"if-else"不太一样，初学时需要特别注意。
:::

## 完整示例

```python
temperature_list = [36.4, 37.0, 38.2, 37.5]

print("体温检测：")
for temperature in temperature_list:
    if temperature >= 38:
        print(f"{temperature}℃ -> Warning！")
    else:
        print(f"{temperature}℃ -> 正常")

print("计数：")
for number in range(5, 10, 2):
    print("数字", number)
```

运行结果：

```text
体温检测：
36.4℃ -> 正常
37.0℃ -> 正常
38.2℃ -> Warning！
37.5℃ -> 正常
计数：
数字 5
数字 7
数字 9
```
