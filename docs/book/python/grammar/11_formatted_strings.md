---
title: Python 格式化字符串
description: format 方法、f-string 与小数保留，三种字符串格式化方式
order: 11
---

# Python 格式化字符串

把变量的值"填"进一段文字里，就是字符串格式化。Python 主要有三种方式：`%` 占位符、`str.format()` 方法，以及最推荐的 **f-string**（Python 3.6+）。

## f-string（推荐）

在字符串前加字母 `f`，用花括号 `{}` 直接放入变量或表达式：

```python
year = 2026
name = "Koyuki"

message = f"""
{year} 年，
欢迎你，{name}！
"""
print(message)
```

运行结果：

```text
2026 年，
欢迎你，Koyuki！
```

花括号里甚至可以是运算：

```python
a, b = 3, 4
print(f"{a} + {b} = {a + b}")    # 3 + 4 = 7
```

## format() 方法

通过关键字或编号占位，将变量填入字符串中：

```python
year = 2026
name = "Koyuki"

message = "{year}年，你好{name}！".format(year=year, name=name)
print(message)
```

更简洁一点的写法是按位置（不推荐，可读性差）：

```python
message = "{0}年，你好{1}！".format(year, name)
```

:::tip 提示
`{0}`、`{1}` 按位置对应 `format()` 的参数顺序（下标从 0 开始），而 `{year}`、`{name}` 则按关键字名称对应。实际开发中推荐使用关键字形式的 f-string（上文），最直观。
:::

## % 占位符（旧式，了解即可）

类似 C 语言的 `printf`：

```python
name = "Koyuki"
print("欢迎你，%s！" % name)
```

`%s` 表示字符串，`%d` 表示整数，`%f` 表示浮点数。这种方式已不推荐在新代码中使用。

## 保留小数

用 `:.2f` 可以保留两位小数（`f` 表示浮点，`.2` 表示两位小数）：

```python
pi = 3.1415926
print(f"pi 约等于 {pi:.2f}")     # pi 约等于 3.14
print(f"pi 约等于 {pi:.3f}")     # pi 约等于 3.142
```

如果是 `format()` 写法：

```python
print("pi 约等于 {:.2f}".format(pi))    # pi 约等于 3.14
```

## 数字格式化补充

| 写法 | 含义 | 示例 |
| --- | --- | --- |
| `{:.2f}` | 保留两位小数 | `3.14` |
| `{:>5}` | 右对齐，宽度 5 | `..3.14` |
| `{:,}` | 千分位逗号 | `1,000,000` |
| `{:%}` | 百分比 | `0.25 -> 25.000000%` |

```python
print(f"{1234567:,}")     # 1,234,567
print(f"{0.25:.0%}")      # 25%
```

## 完整示例

```python
year = 2026
name = "Koyuki"
score = 92.5

info = f"""
年份：{year}
姓名：{name}
成绩：{score:.1f} 分
"""
print(info)

report = "{} 在 {} 年的成绩是 {:.1f}".format(name, year, score)
print(report)
```

运行结果：

```text
年份：2026
姓名：Koyuki
成绩：92.5 分

Koyuki 在 2026 年的成绩是 92.5
```
