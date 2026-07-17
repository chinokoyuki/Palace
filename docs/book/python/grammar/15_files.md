---
title: Python 文件
description: 文件读写、open 模式、with 语句与逐行读取
order: 15
---

# Python 文件

程序运行时产生的数据默认只存在于内存中，程序一关就没了。把数据写入**文件**，就能长久保存；反过来，也可以从文件读取数据。

## 打开文件

用内置函数 `open()` 打开文件，返回一个文件对象：

```python
f = open("example.txt", encoding="utf-8")
print(f.read())     # 读取全部内容
f.close()           # 用完记得关闭
```

- 第一个参数是文件路径。
- `encoding="utf-8"` 指定字符编码，处理中文时强烈建议加上，否则容易乱码。
- `f.read()` 一次性读取全部内容；`f.readline()` 只读取一行。

## 逐行读取

用 `readline()` 配合循环可以一行一行地处理大文件：

```python
f = open("example.txt", encoding="utf-8")
line = f.readline()
while line != "":
    print(line, end="")     # end="" 避免重复换行
    line = f.readline()
f.close()
```

也可以用 `readlines()` 一次性读取所有行，得到一个**字符串列表**（每行一个元素）：

```python
lines = f.readlines()
print(lines)
```

或者更简单地直接 `for` 遍历文件对象：

```python
for line in f:
    print(line, end="")
```

## with 语句（推荐）

忘记 `close()` 会导致资源泄漏。用 `with` 语句可以在代码块结束后**自动关闭**文件，更安全也更简洁：

```python
with open("example.txt", encoding="utf-8") as f:
    content = f.read()
    print(content)
# 离开 with 块后，文件已自动关闭
```

## 写文件

`open()` 的第二个参数指定**打开模式**：

| 模式 | 含义 |
| --- | --- |
| `r` | 只读（默认） |
| `w` | 只写，**会清空**原文件 |
| `a` | 追加，写在文件末尾 |
| `r+` | 读写，文件必须已存在 |
| `w+` / `a+` | 读写，会创建/追加 |

```python
# 写入（会清空原有内容后写入）
with open("example.txt", "w", encoding="utf-8") as f:
    f.write("hello\n")
    f.write("world\n")
```

```python
# 追加
with open("example.txt", "a", encoding="utf-8") as f:
    f.write("Koyuki\n")
```

:::tip 提示
`"r+"` 模式可以同时读写，但不会新建文件——文件不存在时会报错。
:::

## 完整示例

```python
# 1. 写入
with open("diary.txt", "w", encoding="utf-8") as f:
    f.write("2026-07-17 天气晴\n")
    f.write("今天学会了 Python 文件操作！\n")

# 2. 读取
with open("diary.txt", "r", encoding="utf-8") as f:
    print("读取内容：")
    for line in f:
        print(line, end="")
```

运行结果：

```text
读取内容：
2026-07-17 天气晴
今天学会了 Python 文件操作！
```
