---
title: Python 列表
description: 列表的创建、索引、切片、常用方法（增删改查）与常见操作
order: 7
---

# Python 列表

在 Python 笔记中，列表（List）是我们接触的第一个**容器类型**。它能把一组有序的数据放在一起，并且**列表是可变的**——创建之后还能随意增删改。这也是它和字符串、元组最大的区别。

:::tip 调用方式的小区分
- **方法**用 `对象.方法名()` 的形式，例如 `shopping_list.append("显示器")`。
- **函数**用 `函数名(操作对象)` 的形式，例如 `len(shopping_list)`。
:::

## 创建列表

用方括号 `[]` 把元素包起来，元素之间用逗号分隔。列表里的元素可以是任意类型，甚至可以混合：

```python
shopping_list = ["键盘", "键帽"]
empty_list = []
mixed = [1, "Koyuki", True, 3.14]
```

## 索引（从 0 开始）

列表里的每个元素都有一个编号，称为**索引**，从 0 开始。也可以用负数从末尾倒数：

```python
fruits = ["苹果", "香蕉", "橙子", "西瓜"]

print(fruits[0])     # 苹果
print(fruits[1])     # 香蕉
print(fruits[-1])    # 西瓜（最后一个）
print(fruits[-2])    # 橙子（倒数第二个）
```

## 通过索引修改元素

因为列表是可变的，可以直接用索引赋值来替换某个元素：

```python
shopping_list = ["键盘", "键帽"]
shopping_list[1] = "鼠标"      # 把第 2 个元素改为"鼠标"
print(shopping_list)           # ['键盘', '鼠标']
```

## 切片（截取子列表）

用 `列表[起点:终点]` 取出一段，注意**包含起点、不包含终点**：

```python
numbers = [0, 1, 2, 3, 4, 5]
print(numbers[1:4])     # [1, 2, 3]
print(numbers[:3])      # [0, 1, 2]  省略起点表示从开头
print(numbers[3:])      # [3, 4, 5]  省略终点表示到末尾
print(numbers[::2])     # [0, 2, 4]  第三个值表示步长
print(numbers[::-1])    # [5, 4, 3, 2, 1, 0]  步长为负表示反转
```

## 求长度

用内置函数 `len()` 获取列表中元素的个数：

```python
shopping_list = ["键盘", "键帽", "显示器"]
print(len(shopping_list))   # 3
```

`len()` 是一个**函数**，所以是 `len(对象)` 而不是 `对象.len()`。

## 增加元素

### append() —— 追加到末尾

```python
shopping_list = ["键盘", "键帽"]
shopping_list.append("显示器")     # 在末尾添加一个元素
print(shopping_list)               # ['键盘', '键帽', '显示器']
```

### insert() —— 插入到指定位置

```python
shopping_list.insert(1, "鼠标")    # 在索引 1 处插入
print(shopping_list)               # ['键盘', '鼠标', '键帽', '显示器']
```

### extend() —— 合并另一个列表

```python
a = [1, 2]
a.extend([3, 4])
print(a)        # [1, 2, 3, 4]
```

## 删除元素

### remove() —— 按值删除

`remove()` 会删除**第一个**匹配到的元素。如果元素不存在，会报错：

```python
shopping_list = ["键盘", "键帽", "显示器"]
shopping_list.remove("显示器")
print(shopping_list)     # ['键盘', '键帽']
# shopping_list.remove("手机")   # ValueError: list.remove(x): x not in list
```

### pop() —— 按索引删除并返回

`pop()` 默认删除最后一个元素，也可以指定索引，并返回被删掉的元素：

```python
shopping_list = ["键盘", "键帽", "显示器"]
item = shopping_list.pop()        # 删除并返回最后一个
print(item)                        # 显示器
print(shopping_list)               # ['键盘', '键帽']
```

### del —— 用索引删除

```python
del shopping_list[0]     # 删除第一个元素
```

## 查找与统计

```python
nums = [10, 20, 30, 20]

print(nums.index(20))    # 1  第一次出现 20 的索引
print(nums.count(20))    # 2  20 出现的次数
print(20 in nums)        # True  是否包含
```

## 排序与反转

```python
scores = [88, 56, 92, 71]

scores.sort()            # 原地升序排序
print(scores)            # [56, 71, 88, 92]

scores.sort(reverse=True)
print(scores)            # [92, 88, 71, 56]

scores.reverse()         # 原地反转顺序
print(scores)

print(sorted([3, 1, 2])) # [1, 2, 3]  返回新列表，不修改原列表
```

## 常用内置函数

列表常常配合这些内置函数使用：

```python
nums = [3, 1, 4, 1, 5, 9]

print(max(nums))     # 9
print(min(nums))     # 1
print(sum(nums))     # 23
print(len(nums))     # 6
```

## 嵌套列表

列表的元素可以是另一个列表，用来表达"表格"或"矩阵"：

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
]
print(matrix[0][1])   # 2  第 1 行第 2 列
```

## 完整示例

```python
# 一个简单的购物车
cart = ["键盘", "键帽"]

cart.append("显示器")
cart.insert(1, "鼠标")
print("加入商品后：", cart)

cart.remove("键帽")
print("移除键帽后：", cart)

cart[0] = "机械键盘"
print("改名后：", cart)

print("购物车共有", len(cart), "件商品")
print("是否包含显示器：", "显示器" in cart)
```

运行结果：

```text
加入商品后： ['键盘', '鼠标', '键帽', '显示器']
移除键帽后： ['键盘', '鼠标', '显示器']
改名后： ['机械键盘', '鼠标', '显示器']
购物车共有 3 件商品
是否包含显示器： True
```
