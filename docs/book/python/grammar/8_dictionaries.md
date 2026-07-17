---
title: Python 字典
description: 字典的键值对结构、增删改查、常用方法，以及元组与集合简介
order: 8
---

# Python 字典

字典（Dictionary）用来存储键（key）和值（value）的对应关系，就像现实中的通讯录——用"名字"查"电话"。字典用花括号 `{}` 表示，内部是 `键: 值` 的形式。

:::tip 注意
字典里是 **冒号 `:`** 而不是等号。常见错误是写成 `"A" = "1234567"`，正确写法是 `"A": "1234567"`。
:::

```python
contact = {
    "A": "1234567",
    "B": "7654321",
}
```

通过**键**来取出对应的值：

```python
print(contact["A"])    # 1234567
```

## 为什么用字典

- 列表靠"位置（索引）"找元素，字典靠"名字（键）"找元素。
- 查找速度极快，与字典大小无关。
- 适合表达"属性集合"，如一个人名对应年龄、城市等。

## 键的限制

字典的键必须是**不可变类型**，例如字符串、数字、布尔值，或**元组**。列表等可变类型不能当键。

```python
# 普通字符串作为键
contact = {"A": "1234567"}

# 元组也可以作为键（因为元组不可变）
name_tuple = ("A", "32")
contact = {name_tuple: "1234567"}
print(contact[("A", "32")])    # 1234567
```

```python
# wrong = {["A"]: 1}    # TypeError: unhashable type: 'list'
```

## 添加与修改

如果键已经存在，赋值会**覆盖**原有的值；如果键不存在，则会**新增**这个键值对：

```python
contact = {"A": "1234567"}
contact["C"] = "999"        # 新增
contact["A"] = "0000000"    # 覆盖
print(contact)              # {'A': '0000000', 'C': '999'}
```

## 删除值

用 `del` 删除某个键。如果键不存在，会报错：

```python
del contact["A"]
print(contact)              # {'C': '999'}
# del contact["Z"]          # KeyError: 'Z'
```

也可以用 `pop()` 删除并取回它的值：

```python
phone = contact.pop("C")
print(phone)                # 999
```

## 求长度

```python
print(len(contact))         # 字典中键值对的个数
```

## 常用方法

| 方法 | 作用 |
| --- | --- |
| `keys()` | 返回所有键 |
| `values()` | 返回所有值 |
| `items()` | 返回所有 `(键, 值)` 元组 |
| `get(key)` | 安全取值，键不存在返回 `None` 而不会报错 |
| `pop(key)` | 删除键并返回值 |

```python
contact = {"A": "1234567", "B": "7654321"}

print(contact.keys())     # dict_keys(['A', 'B'])
print(contact.values())   # dict_values(['1234567', '7654321'])
print(contact.items())    # dict_items([('A', '1234567'), ('B', '7654321')])

print(contact.get("A"))   # 1234567
print(contact.get("Z"))   # None（不会报错）
```

## 遍历字典

结合 `for` 循环（详见后文），可以方便地遍历字典：

```python
contact = {"A": "1234567", "B": "7654321"}

for key in contact:
    print(key, "的电话是", contact[key])

for k, v in contact.items():
    print(k, "->", v)
```

## 元组（Tuple）简介

元组长得像列表，但用圆括号 `()`，而且**不可变**——创建后不能修改。字典的键可以用元组，正是因为它不可变：

```python
name_tuple = ("A", "32")    # 不可变
# name_tuple[0] = "B"       # TypeError: 'tuple' object does not support item assignment
```

当一组数据不需要改动（如坐标、RGB 颜色），用元组更安全。

## 集合（Set）简介

集合用花括号（但里面是单个元素，不是键值对），特点是**元素不重复、无序**，常用于去重和成员判断：

```python
s = {1, 2, 2, 3}
print(s)                    # {1, 2, 3}  自动去重
print(2 in s)               # True
```

## 完整示例

```python
# 用字典管理联系人
contact = {
    "Alice": "1234567",
    "Bob": "7654321",
}

# 新增与修改
contact["Cindy"] = "999"
contact["Alice"] = "1111111"

# 删除
del contact["Bob"]

# 遍历
print("当前联系人：")
for name, phone in contact.items():
    print(f"{name}: {phone}")

print("共有", len(contact), "位联系人")
```

运行结果：

```text
当前联系人：
Alice: 1111111
Cindy: 999
共有 2 位联系人
```
