---
title: JSON 数据格式转换
description: Python 中 JSON 的序列化与反序列化、json 模块常用方法、自定义类型处理与实战案例
order: 20
---

# JSON 数据格式转换

JSON（JavaScript Object Notation）是一种轻量级的数据交换格式，因其结构清晰、易于阅读和解析，被广泛用于网络接口、配置文件和数据存储。Python 内置了 `json` 模块，可以方便地在 Python 对象和 JSON 字符串之间进行转换。

## JSON 基本结构

JSON 的数据类型与 Python 有很高的对应关系：

| JSON 类型 | Python 类型 | 示例 |
| --- | --- | --- |
| 对象 | `dict` | `{"name": "Koyuki", "age": 18}` |
| 数组 | `list` | `[1, 2, 3]` |
| 字符串 | `str` | `"hello"` |
| 数字 | `int` / `float` | `42` / `3.14` |
| 布尔 | `bool` | `true` / `false` |
| 空值 | `None` | `null` |

:::tip
JSON 的字符串必须使用**双引号**，不能使用单引号。JSON 中也没有 Python 的元组、集合等类型。
:::

## 将 Python 对象转为 JSON 字符串

使用 `json.dumps()` 可以把 Python 对象序列化为 JSON 字符串。

```python
import json

person = {
    "name": "Koyuki",
    "age": 18,
    "is_student": True,
    "courses": ["Python", "C++"],
    "address": None
}

json_str = json.dumps(person)
print(json_str)
print(type(json_str))  # <class 'str'>
```

输出：

```text
{"name": "Koyuki", "age": 18, "is_student": true, "courses": ["Python", "C++"], "address": null}
```

### 格式化输出

如果希望 JSON 字符串更易读，可以使用 `indent` 参数：

```python
pretty_json = json.dumps(person, indent=2, ensure_ascii=False)
print(pretty_json)
```

输出：

```json
{
  "name": "Koyuki",
  "age": 18,
  "is_student": true,
  "courses": [
    "Python",
    "C++"
  ],
  "address": null
}
```

- `indent=2`：每一层缩进 2 个空格。
- `ensure_ascii=False`：允许输出中文字符，而不是转义成 `\uXXXX`。

### 控制分隔符

```python
compact = json.dumps(person, separators=(',', ':'))
print(compact)
```

`separators=(',', ':')` 会去掉冒号和逗号后的空格，生成更紧凑的 JSON。

## 将 JSON 字符串转为 Python 对象

使用 `json.loads()` 可以把 JSON 字符串反序列化为 Python 对象。

```python
import json

json_str = '{"name": "Koyuki", "age": 18, "courses": ["Python", "C++"]}'
data = json.loads(json_str)

print(data)
print(type(data))       # <class 'dict'>
print(data["name"])     # Koyuki
print(data["courses"])  # ['Python', 'C++']
```

## 读写 JSON 文件

### 写入 JSON 文件

使用 `json.dump()` 直接把 Python 对象写入文件：

```python
import json

person = {"name": "Koyuki", "age": 18}

with open("person.json", "w", encoding="utf-8") as f:
    json.dump(person, f, indent=2, ensure_ascii=False)
```

生成的 `person.json` 文件内容：

```json
{
  "name": "Koyuki",
  "age": 18
}
```

### 读取 JSON 文件

使用 `json.load()` 从文件中读取 JSON 并转为 Python 对象：

```python
import json

with open("person.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(data)        # {'name': 'Koyuki', 'age': 18}
print(data["name"])  # Koyuki
```

:::tip
读写文件时建议显式指定 `encoding="utf-8"`，避免中文字符在不同平台出现乱码。
:::

## 处理自定义类型

JSON 默认不能序列化 Python 的自定义对象、日期时间、集合等类型。可以通过自定义转换函数来处理。

### 自定义类转 JSON

```python
import json

class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def to_dict(self):
        return {"name": self.name, "age": self.age}

s = Student("Koyuki", 18)
json_str = json.dumps(s, default=lambda obj: obj.to_dict(), ensure_ascii=False)
print(json_str)
```

输出：

```text
{"name": "Koyuki", "age": 18}
```

### JSON 转自定义类

```python
import json

json_str = '{"name": "Koyuki", "age": 18}'
data = json.loads(json_str)
student = Student(data["name"], data["age"])
```

### 处理日期时间

```python
import json
from datetime import datetime

now = datetime.now()

# 序列化时把 datetime 转为字符串
def datetime_to_str(obj):
    if isinstance(obj, datetime):
        return obj.strftime("%Y-%m-%d %H:%M:%S")
    raise TypeError("Type not serializable")

json_str = json.dumps({"time": now}, default=datetime_to_str, ensure_ascii=False)
print(json_str)
```

输出：

```text
{"time": "2026-07-17 12:34:56"}
```

## 排序与缩进

### 按键排序

```python
import json

data = {"b": 2, "a": 1, "c": 3}
sorted_json = json.dumps(data, sort_keys=True, indent=2)
print(sorted_json)
```

输出：

```json
{
  "a": 1,
  "b": 2,
  "c": 3
}
```

## 实战案例：保存和读取配置

下面是一个保存程序配置到 JSON 文件，并在启动时读取的完整示例。

### 保存配置

```python
import json

config = {
    "theme": "dark",
    "language": "zh-CN",
    "window": {
        "width": 1280,
        "height": 720
    },
    "recent_files": ["main.py", "utils.py"]
}

with open("config.json", "w", encoding="utf-8") as f:
    json.dump(config, f, indent=2, ensure_ascii=False)
```

### 读取配置

```python
import json

try:
    with open("config.json", "r", encoding="utf-8") as f:
        config = json.load(f)
    print("主题：", config["theme"])
    print("语言：", config["language"])
    print("窗口尺寸：", config["window"]["width"], "x", config["window"]["height"])
except FileNotFoundError:
    print("配置文件不存在，使用默认配置")
except json.JSONDecodeError:
    print("配置文件格式错误")
```

## 常见问题

### `TypeError: Object of type xxx is not JSON serializable`

JSON 不支持某些 Python 类型。解决方法：

- 自定义 `default` 函数进行转换。
- 把对象转为字典或列表后再序列化。

### 中文字符显示为 `\uXXXX`

在 `json.dumps()` 或 `json.dump()` 中加入 `ensure_ascii=False`。

### JSON 文件读取后内容错乱

检查文件是否以 UTF-8 编码保存和读取，避免 Windows 默认编码导致的中文乱码。

### JSON 字符串用了单引号

JSON 标准只支持双引号。如果手里是单引号的字符串，Python 可以解析为字典，但不是标准 JSON。建议统一使用双引号。

## 本章小结

- `json.dumps()`：Python 对象 → JSON 字符串。
- `json.loads()`：JSON 字符串 → Python 对象。
- `json.dump()`：Python 对象 → JSON 文件。
- `json.load()`：JSON 文件 → Python 对象。
- `indent` 用于格式化，`ensure_ascii=False` 用于保留中文。
- 自定义类型需要手动提供转换函数或方法。

JSON 是 Python 与外部系统交换数据时最常用的格式之一，熟练掌握其序列化与反序列化是 Web 开发、数据处理和自动化脚本中的必备技能。
