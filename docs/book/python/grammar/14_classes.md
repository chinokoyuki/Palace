---
title: Python 类
description: 类与对象、构造方法、继承、方法重写与 super()
order: 14
---

# Python 类

面向对象编程（OOP）把数据和操作数据的方法打包在一起，形成"类（Class）"。类是**模板**，根据类创建出来的具体个体叫做**对象（Object）**。

## 定义类

用 `class` 关键字定义类。方法（类里的函数）第一个参数必须是 `self`，代表"当前这个对象"：

```python
class Mammal:
    def __init__(self, name, sex):
        self.name = name
        self.sex = sex

    def breathe(self):
        print(self.name + " Breathing")

    def poop(self):
        print(self.name + " Pooping")
```

- `__init__` 是**构造方法**，在创建对象时自动调用，用来初始化属性。
- `self.name = name` 把传入的 `name` 绑定到当前对象上，成为它的属性。
- 调用方法时，`self` 由 Python 自动传入，你只需要写 `对象.breathe()`。

## 创建对象

```python
cat = Mammal("咪咪", "母")
cat.breathe()     # 咪咪 Breathing
cat.poop()        # 咪咪 Pooping
```

## 继承

一个类可以**继承**另一个类，从而拥有父类的属性和方法，还能扩展自己的功能：

```python
class Human(Mammal):
    def read(self):
        print(self.name + " Reading")

class Cat(Mammal):
    def scratch(self):
        print(self.name + " Scratching")
```

`Human` 和 `Cat` 都继承自 `Mammal`，所以它们自动拥有 `name`、`sex`、`breathe()`、`poop()`，又各自新增了 `read()`、`scratch()`：

```python
alice = Human("Alice", "女")
alice.breathe()    # Alice Breathing
alice.read()       # Alice Reading

kitty = Cat("咪咪", "母")
kitty.scratch()    # 咪咪 Scratching
```

## super() 调用父类

在子类中，可以用 `super()` 调用父类的方法，最常见的是调用父类的构造方法，避免重复写初始化代码：

```python
class Father:
    def __init__(self, name):
        self.name = name

class Son(Father):
    def __init__(self, name):
        super().__init__(name)    # 调用父类 Father 的 __init__
        self.age = 0              # 子类自己新增的属性
```

:::tip 注意
子类定义时必须写成 `class Son(Father):` 表明继承关系；而 `super().__init__(name)` 里是**两个下划线**的 `__init__`。原笔记中这两处都写成了不带括号的 `class Son:` 和 `super().__init__()`，这里已修正。
:::

使用：

```python
son = Son("小明")
print(son.name)     # 小明
```

## 方法重写

子类可以重新定义父类已有的方法，覆盖它的行为：

```python
class Cat(Mammal):
    def breathe(self):
        print(self.name + " 正在用猫的方式呼吸")

kitty = Cat("咪咪", "母")
kitty.breathe()     # 咪咪 正在用猫的方式呼吸
```

## 类方法与静态方法

除了普通方法（第一个参数是 `self`），还有两种特殊方法：

- **类方法** `@classmethod`：第一个参数是 `cls`（代表类本身），可以访问类属性。
- **静态方法** `@staticmethod`：不需要 `self` 或 `cls`，相当于放在类里的普通函数。

```python
class Math:
    pi = 3.14159

    @classmethod
    def circle_area(cls, radius):
        return cls.pi * radius * radius

    @staticmethod
    def add(a, b):
        return a + b

print(Math.circle_area(5))   # 78.53975
print(Math.add(3, 4))        # 7
```

:::tip 提示
初学者最常见的场景是普通方法（带 `self`）。类方法和静态方法在编写工具类或工厂方法时会用到，了解即可。
:::

## 完整示例

```python
class Mammal:
    def __init__(self, name, sex):
        self.name = name
        self.sex = sex

    def breathe(self):
        print(self.name + " Breathing")


class Human(Mammal):
    def read(self):
        print(self.name + " Reading")


class Cat(Mammal):
    def scratch(self):
        print(self.name + " Scratching")


alice = Human("Alice", "女")
kitty = Cat("咪咪", "母")

alice.breathe()
alice.read()

kitty.breathe()
kitty.scratch()
```

运行结果：

```text
Alice Breathing
Alice Reading
咪咪 Breathing
咪咪 Scratching
```
