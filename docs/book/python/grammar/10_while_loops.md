---
title: Python while 循环
description: while 循环的语法、与 for 的区别、break/continue 与死循环
order: 10
---

# Python while 循环

`while` 循环会在**条件成立时反复执行**，直到条件不再满足才停止。它适合"不知道要循环几次，只知道何时该停"的场景。

语法：

```python
while 条件A:        # 条件可以是直接的布尔值，也可以是表达式
    行动B
```

## 基本用法

```python
i = 0
while i < 5:
    print(i)
    i = i + 1     # 必须修改条件相关的变量，否则会死循环
```

运行结果：

```text
0
1
2
3
4
```

和 `for` 不同，`while` 不会自动帮你"走到尽头"，你必须在循环体里手动更新条件，否则循环永远不会结束。

## 用 while 遍历列表

```python
list1 = ["苹果", "香蕉", "橙子"]
i = 0
while i < len(list1):
    print(list1[i])
    i = i + 1
```

运行结果：

```text
苹果
香蕉
橙子
```

## 条件也可以是布尔值

```python
running = True
while running:
    answer = input("输入 q 退出：")
    if answer == "q":
        running = False
```

## break 与 continue

与 `for` 一样，`while` 也支持 `break`（跳出循环）和 `continue`（跳过本次）：

```python
count = 0
while True:                  # 无限循环
    count += 1
    if count == 3:
        continue
    if count > 5:
        break
    print(count)
```

运行结果：

```text
1
2
4
5
```

## 死循环与防范

如果条件永远为真且循环体内没有改变它的可能，就会形成**死循环**：

```python
# while True:
#     print("停不下来")    # 除非用 break 或强制终止
```

编写 `while` 时，务必确认循环里存在让条件最终变为 `False` 的逻辑。

## while...else

Python 的 `while` 还可以带 `else`，当循环**正常结束**（不是被 `break` 打断）时执行：

```python
n = 1
while n <= 3:
    print(n)
    n += 1
else:
    print("循环正常结束")
```

运行结果：

```text
1
2
3
循环正常结束
```

如果被 `break` 打断，`else` 则不会执行：

```python
n = 1
while n <= 5:
    print(n)
    if n == 3:
        break
    n += 1
else:
    print("这段不会执行")     # 被 break 跳过了
```

运行结果：

```text
1
2
3
```

:::tip 注意
`while...else` 里的 `else` 只在循环条件变为 `False`（正常结束）时才运行。被 `break` 强制退出时，`else` 不会执行。
:::

## 完整示例

```python
# 用 while 计算 1 到 100 的和
i = 1
total = 0
while i <= 100:
    total += i
    i += 1

print("1 到 100 的和是：", total)
```

运行结果：

```text
1 到 100 的和是： 5050
```
