---
title: Python 类与对象
description: 面向对象编程全面讲解：类成员、构造方法、魔术方法、封装、继承、复写、多态、类型注解、Union 联合类型、Callable 等
order: 14
---

# Python 类与对象

面向对象编程（Object-Oriented Programming, OOP）是一种把**数据**和**操作数据的方法**打包在一起的编程范式。Python 是一门多范式的语言，既支持面向过程，也完全支持面向对象。本章将系统讲解 Python 中类与对象的全部核心知识。

## 类与对象的基本概念

- **类（Class）**：是一张"设计图纸"或"模板"，描述了某一类事物共有的属性和行为。
- **对象（Object）**：是根据类创建出来的具体实例，拥有类中定义的属性和方法。

可以把"类"比作"汽车设计图"，把"对象"比作"按图纸造出来的一辆真实的汽车"。同一张图纸可以造出很多辆车，每辆车都是独立的对象，但它们都具有图纸所规定的结构。

### 定义类

用 `class` 关键字定义类。类中的函数称为**方法**，第一个参数必须是 `self`，代表"当前这个对象本身"：

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

- `class Mammal:` 声明了一个名为 `Mammal` 的类。
- `__init__` 是**构造方法**，在创建对象时自动调用，用来初始化属性。
- `self.name = name` 把传入的 `name` 绑定到当前对象上，成为它的**实例属性**。
- 调用方法时，`self` 由 Python 自动传入，你只需要写 `对象.breathe()`。

### 创建对象

根据类创建对象的过程叫做**实例化**，通过"类名加括号"完成：

```python
cat = Mammal("咪咪", "母")
cat.breathe()     # 咪咪 Breathing
cat.poop()        # 咪咪 Pooping

print(cat.name)   # 咪咪
print(cat.sex)    # 母
```

每个对象都拥有自己独立的属性副本，互不影响：

```python
dog = Mammal("旺财", "公")
print(dog.name)   # 旺财
print(cat.name)    # 咪咪（互不影响）
```

## 类的成员

类的成员指的是类中定义的内容，主要包括**属性**和**方法**两大类。属性又分为实例属性和类属性；方法又分为实例方法、类方法和静态方法。

### 实例属性与类属性

```python
class Dog:
    # 类属性：属于类本身，所有实例共享
    species = "Canis lupus familiaris"
    count = 0

    def __init__(self, name):
        # 实例属性：每个对象独有
        self.name = name
        Dog.count += 1
```

使用：

```python
d1 = Dog("旺财")
d2 = Dog("小白")

print(d1.name)        # 旺财（实例属性）
print(d2.name)        # 小白（实例属性）

print(Dog.species)    # Canis lupus familiaris（类属性）
print(Dog.count)      # 2（所有实例共享，创建一个就 +1）
print(d1.count)       # 2（也可以通过实例访问）
```

:::warning 注意
类属性虽然是所有实例共享的，但**通过实例给类属性赋值**会在该实例上新建一个同名实例属性，而不会修改类属性本身：
```python
d1.species = "新物种"
print(d1.species)      # 新物种（实例属性屏蔽了类属性）
print(Dog.species)      # Canis lupus familiaris（类属性未变）
print(d2.species)       # Canis lupus familiaris（其他实例仍读类属性）
```
要修改类属性，必须通过 `类名.属性 = ...` 修改。
:::

### 实例方法、类方法与静态方法

Python 类中有三种方法，它们的定义和使用场景各不相同：

| 方法类型 | 装饰器 | 第一个参数 | 能否访问实例属性 | 能否访问类属性 | 典型用途 |
| --- | --- | --- | --- | --- | --- |
| 实例方法 | 无 | `self` | 能 | 能 | 操作对象数据，最常用 |
| 类方法 | `@classmethod` | `cls` | 不能 | 能 | 工厂方法、操作类属性 |
| 静态方法 | `@staticmethod` | 无 | 不能 | 不能 | 工具函数，逻辑上属于类 |

```python
class Math:
    pi = 3.14159

    # 实例方法：第一个参数是 self，访问实例数据
    def __init__(self, value):
        self.value = value

    def double(self):
        return self.value * 2

    # 类方法：第一个参数是 cls，代表类本身
    @classmethod
    def circle_area(cls, radius):
        return cls.pi * radius * radius

    @classmethod
    def from_zero(cls):
        # 工厂方法：用另一种方式创建对象
        return cls(0)

    # 静态方法：不需要 self 或 cls，相当于放在类里的普通函数
    @staticmethod
    def add(a, b):
        return a + b
```

使用：

```python
m = Math(5)
print(m.double())          # 10（实例方法，通过对象调用）

print(Math.circle_area(5)) # 78.53975（类方法，通过类或对象调用）
print(m.circle_area(5))    # 78.53975（也可以通过对象调用）

print(Math.add(3, 4))      # 7（静态方法）

m2 = Math.from_zero()       # 工厂方法创建对象
print(m2.value)             # 0
```

:::tip 提示
初学者最常用的是**实例方法**（带 `self`）。类方法常用于"工厂方法"（以不同方式创建对象），静态方法用于与类相关但不依赖实例数据的工具函数。
:::

## 构造方法 __init__

`__init__` 是 Python 中最重要的魔术方法之一，在创建对象时自动调用，用于初始化对象的属性。

```python
class Student:
    def __init__(self, name, age, grade):
        self.name = name
        self.age = age
        self.grade = grade

s = Student("小明", 18, "高三")
# 等价于：先创建空对象，再自动调用 s.__init__("小明", 18, "高三")
```

### 带默认值的构造方法

构造方法同样支持默认参数：

```python
class Student:
    def __init__(self, name, age=18, grade="高一"):
        self.name = name
        self.age = age
        self.grade = grade

s1 = Student("小明")              # 使用全部默认值
s2 = Student("小红", 17)           # age=17, grade 使用默认
s3 = Student("小刚", 19, "高三")    # 全部指定
```

### __new__ 与 __init__ 的区别

实际上对象的创建分两步：`__new__` 负责创建并返回对象，`__init__` 负责初始化对象。

```python
class Singleton:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, value):
        self.value = value

a = Singleton(1)
b = Singleton(2)
print(a is b)      # True（同一个对象）
print(a.value)      # 2（__init__ 被再次调用）
```

:::tip 单例模式
重写 `__new__` 是实现单例模式（保证一个类只有一个实例）的标准做法。
:::

## 魔术方法（Magic Methods）

魔术方法（又称双下方法，Dunder Methods）是以双下划线开头和结尾的特殊方法，形如 `__xxx__`。它们让自定义类能像内置类型一样支持各种运算和操作。

### __str__ 与 __repr__

- `__str__`：返回给最终用户看的"友好字符串"，由 `print()` 和 `str()` 调用。
- `__repr__`：返回给开发者看的"精确字符串"，由 `repr()` 调用，理想情况下能用来重建对象。

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"({self.x}, {self.y})"

    def __repr__(self):
        return f"Point({self.x!r}, {self.y!r})"

p = Point(3, 4)
print(p)        # (3, 4)         调用 __str__
print(repr(p))  # Point(3, 4)    调用 __repr__
print([p])      # [Point(3, 4)]  列表中调用 __repr__
```

:::tip 提示
如果只实现一个，建议实现 `__repr__`。因为当 `__str__` 未定义时，Python 会退回使用 `__repr__`；反之不行。
:::

### 比较类魔术方法

让自定义对象支持 `==`、`<`、`>` 等比较运算：

```python
from functools import total_ordering

@total_ordering
class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def __eq__(self, other):
        if not isinstance(other, Student):
            return NotImplemented
        return self.score == other.score

    def __lt__(self, other):
        if not isinstance(other, Student):
            return NotImplemented
        return self.score < other.score

s1 = Student("小明", 85)
s2 = Student("小红", 90)

print(s1 == s2)   # False
print(s1 < s2)    # True
print(s1 >= s2)   # False（@total_ordering 自动补全）
print(s1 != s2)   # True
```

常用比较魔术方法：

| 方法 | 对应运算符 | 说明 |
| --- | --- | --- |
| `__eq__` | `==` | 等于 |
| `__ne__` | `!=` | 不等于（默认基于 `__eq__`） |
| `__lt__` | `<` | 小于 |
| `__le__` | `<=` | 小于等于 |
| `__gt__` | `>` | 大于 |
| `__ge__` | `>=` | 大于等于 |

:::tip total_ordering
`@functools.total_ordering` 装饰器只需定义 `__eq__` 和一个比较方法（如 `__lt__`），就能自动补全其他所有比较方法。
:::

### 算术类魔术方法

让对象支持 `+`、`-`、`*` 等算术运算：

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __mul__(self, scalar):
        return Vector(self.x * scalar, self.y * scalar)

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

v1 = Vector(1, 2)
v2 = Vector(3, 4)
print(v1 + v2)      # Vector(4, 6)
print(v1 * 3)       # Vector(3, 6)
```

常用算术魔术方法：

| 方法 | 运算符 | 方法 | 运算符 |
| --- | --- | --- | --- |
| `__add__` | `+` | `__sub__` | `-` |
| `__mul__` | `*` | `__truediv__` | `/` |
| `__floordiv__` | `//` | `__mod__` | `%` |
| `__pow__` | `**` | `__neg__` | 一元 `-` |

### 容器类魔术方法

让对象像列表/字典一样支持索引、长度、迭代：

```python
class Playlist:
    def __init__(self, songs):
        self.songs = songs

    def __len__(self):
        return len(self.songs)

    def __getitem__(self, index):
        return self.songs[index]

    def __setitem__(self, index, value):
        self.songs[index] = value

    def __contains__(self, item):
        return item in self.songs

pl = Playlist(["歌A", "歌B", "歌C"])
print(len(pl))          # 3        __len__
print(pl[0])            # 歌A      __getitem__
pl[1] = "歌B改"
print("歌A" in pl)       # True     __contains__
```

### __call__：让对象像函数一样调用

```python
class Multiplier:
    def __init__(self, factor):
        self.factor = factor

    def __call__(self, x):
        return x * self.factor

double = Multiplier(2)
print(double(5))       # 10（像函数一样调用对象）
print(callable(double)) # True
```

### __iter__ 与 __next__：让对象可迭代

```python
class Countdown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        self.current -= 1
        return self.current + 1

for n in Countdown(5):
    print(n)   # 5 4 3 2 1
```

### __enter__ 与 __exit__：上下文管理器

支持 `with` 语句，常用于资源管理：

```python
class FileManager:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None

    def __enter__(self):
        self.file = open(self.filename, self.mode)
        return self.file

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()
        return False  # 不吞掉异常

with FileManager("test.txt", "w") as f:
    f.write("hello")
# 离开 with 块时自动调用 __exit__，文件被关闭
```

### 常用魔术方法速查表

| 方法 | 触发场景 | 方法 | 触发场景 |
| --- | --- | --- | --- |
| `__init__` | 对象初始化 | `__new__` | 创建对象 |
| `__str__` | `print()` / `str()` | `__repr__` | `repr()` / 调试 |
| `__len__` | `len(obj)` | `__bool__` | `bool(obj)` / `if obj:` |
| `__getitem__` | `obj[key]` | `__setitem__` | `obj[key] = v` |
| `__contains__` | `x in obj` | `__iter__` | `for x in obj` |
| `__call__` | `obj(...)` | `__eq__` / `__lt__` | `==` / `<` |
| `__add__` / `__mul__` | `+` / `*` | `__enter__` / `__exit__` | `with obj` |

## 封装

封装（Encapsulation）是指将数据（属性）和操作数据的方法绑在一起，并对外隐藏内部实现细节，只暴露必要的接口。Python 通过命名约定和 `property` 装饰器实现封装。

### 访问控制约定

Python 没有 `private`/`protected` 关键字，而是通过命名约定实现：

```python
class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner          # 公开属性，外部可访问
        self._rate = 0.05           # 受保护属性，约定不外部访问（但仍可访问）
        self.__balance = balance    # 私有属性，名称重整，外部难以直接访问
```

| 命名 | 约定级别 | 说明 |
| --- | --- | --- |
| `name` | 公开（public） | 可任意访问 |
| `_name` | 受保护（protected） | 约定不外部访问，但解释器不阻止 |
| `__name` | 私有（private） | 名称重整为 `_ClassName__name`，难以直接访问 |

```python
acc = BankAccount("小明", 1000)
print(acc.owner)           # 小明
print(acc._rate)           # 0.05（能访问，但不推荐）
# print(acc.__balance)     # AttributeError
print(acc._BankAccount__balance)  # 1000（名称重整后仍能访问，但不推荐）
```

:::warning Python 的私有是"君子约定"
Python 的 `__name` 只是名称重整（name mangling），并非真正的访问限制。这是一种设计哲学："We are all consenting adults"（大家都是成年人）。封装主要靠**约定**和 `property`，而非强制。
:::

### property 装饰器

`property` 装饰器可以优雅地实现 getter/setter，在读取或赋值属性时自动执行额外逻辑（如校验）：

```python
class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score        # 这里会触发 setter

    @property
    def score(self):
        return self._score

    @score.setter
    def score(self, value):
        if not isinstance(value, (int, float)):
            raise TypeError("成绩必须是数字")
        if not 0 <= value <= 100:
            raise ValueError("成绩必须在 0~100 之间")
        self._score = value

    @score.deleter
    def score(self):
        print("删除成绩")
        del self._score
```

使用：

```python
s = Student("小明", 85)
print(s.score)       # 85（调用 getter）
s.score = 95          # 调用 setter
print(s.score)        # 95

s.score = 150          # ValueError: 成绩必须在 0~100 之间
s.score = "A"          # TypeError: 成绩必须是数字
```

:::tip 何时使用 property
- 想在属性赋值时做校验
- 想把"方法调用"伪装成"属性访问"，让接口更自然
- 需要保留向后兼容（原本是公开属性，后来想加校验，用 property 即可，外部调用方式不变）
:::

## 继承

继承（Inheritance）让子类自动获得父类的属性和方法，实现代码复用，并可在其基础上扩展或修改。

### 单继承

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def eat(self):
        print(f"{self.name} 在吃东西")

    def sleep(self):
        print(f"{self.name} 在睡觉")


class Dog(Animal):       # Dog 继承自 Animal
    def bark(self):
        print(f"{self.name} 汪汪叫")


d = Dog("旺财")
d.eat()     # 旺财 在吃东西（继承自父类）
d.sleep()   # 旺财 在睡觉（继承自父类）
d.bark()    # 旺财 汪汪叫（子类独有）
```

### super() 调用父类

子类的 `__init__` 不会自动调用父类的 `__init__`，需要用 `super()` 显式调用：

```python
class Father:
    def __init__(self, name):
        self.name = name
        print("Father.__init__ 被调用")

class Son(Father):
    def __init__(self, name, age):
        super().__init__(name)    # 调用父类 Father 的 __init__
        self.age = age            # 子类自己新增的属性
        print("Son.__init__ 被调用")

son = Son("小明", 18)
print(son.name, son.age)   # 小明 18
```

:::warning 必须调用 super().__init__
如果子类定义了 `__init__` 但不调用 `super().__init__(...)`，父类的实例属性就不会被初始化，访问 `self.name` 会报 `AttributeError`。
:::

`super()` 也能调用父类的其他方法，不仅是 `__init__`：

```python
class Animal:
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        parent = super().speak()    # 调用父类方法
        return parent + " 汪汪！"

print(Dog().speak())   # ... 汪汪！
```

### 多继承与方法解析顺序（MRO）

Python 支持多继承，一个子类可以同时继承多个父类：

```python
class Flyable:
    def fly(self):
        print("在天上飞")

class Swimmable:
    def swim(self):
        print("在水里游")

class Duck(Flyable, Swimmable):    # 同时继承两个类
    def quack(self):
        print("嘎嘎叫")

d = Duck()
d.fly()     # 在天上飞
d.swim()    # 在水里游
d.quack()   # 嘎嘎叫
```

当多个父类有同名方法时，Python 按照方法解析顺序（Method Resolution Order, MRO）决定调用哪一个。MRO 使用 C3 线性化算法，可通过 `类名.mro()` 查看：

```python
print(Duck.mro())
# [<class 'Duck'>, <class 'Flyable'>, <class 'Swimmable'>, <class 'object'>]
```

:::warning 菱形继承
当多个父类有共同祖先时（菱形继承），可能出现方法被调用多次或顺序混乱的问题。Python 3 的 `super()` 配合 MRO 已能正确处理，但仍建议谨慎设计继承层次。
```python
class A:
    def hello(self):
        print("A")

class B(A):
    def hello(self):
        print("B")
        super().hello()

class C(A):
    def hello(self):
        print("C")
        super().hello()

class D(B, C):
    def hello(self):
        print("D")
        super().hello()

D().hello()
# D B C A（super 按 MRO 顺序链式调用，而非各自调用父类）
```
:::

### Mixin 模式

多继承的一种推荐用法是 Mixin：把一个小的、单一功能的方法集合作为"插件"混入主类：

```python
class JsonMixin:
    def to_json(self):
        import json
        return json.dumps(self.__dict__)

class PickleMixin:
    def to_pickle(self):
        import pickle
        return pickle.dumps(self)

class User(JsonMixin, PickleMixin):
    def __init__(self, name, age):
        self.name = name
        self.age = age

u = User("小明", 18)
print(u.to_json())    # {"name": "\u5c0f\u660e", "age": 18}
```

## 复写父类方法（Override）

子类可以重新定义父类已有的方法，覆盖其行为，这叫做**方法重写（Override）**。

```python
class Animal:
    def speak(self):
        print("动物发出声音")

class Cat(Animal):
    def speak(self):        # 复写父类方法
        print("喵喵")

class Dog(Animal):
    def speak(self):
        print("汪汪")

Animal().speak()   # 动物发出声音
Cat().speak()      # 喵喵
Dog().speak()      # 汪汪
```

### 复写时调用父类方法

复写不一定要完全替换父类逻辑，常常是"在父类基础上扩展"：

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def introduce(self):
        return f"我是 {self.name}"

class Cat(Animal):
    def introduce(self):
        parent = super().introduce()     # 先调用父类版本
        return parent + "，一只猫"

print(Cat("咪咪").introduce())   # 我是 咪咪，一只猫
```

### 复写魔术方法

魔术方法同样可以被复写：

```python
class MyList(list):
    def __getitem__(self, index):
        if isinstance(index, str) and index == "first":
            return self[0] if self else None
        return super().__getitem__(index)

ml = MyList([10, 20, 30])
print(ml["first"])   # 10
print(ml[1])          # 20
```

## 多态

多态（Polymorphism）指同一个方法调用，由于对象类型不同，可能表现出不同的行为。Python 的多态基于"鸭子类型"。

### 鸭子类型

> "如果它走起来像鸭子，叫起来像鸭子，那它就是鸭子。"

Python 不关心对象的类型，只关心它有没有所需的方法/属性：

```python
class Cat:
    def speak(self):
        print("喵喵")

class Dog:
    def speak(self):
        print("汪汪")

class Duck:
    def speak(self):
        print("嘎嘎")

def make_sound(animal):     # 不检查类型，只要有 speak() 方法即可
    animal.speak()

make_sound(Cat())    # 喵喵
make_sound(Dog())    # 汪汪
make_sound(Duck())   # 嘎嘎
```

`make_sound` 函数不关心传入的是 `Cat`、`Dog` 还是 `Duck`，只要对象有 `speak()` 方法就能工作。这就是鸭子类型——天然的多态。

### 抽象基类（abc）

鸭子类型很灵活，但有时我们希望"强制"子类必须实现某些方法。Python 提供 `abc`（Abstract Base Classes）模块：

```python
from abc import ABC, abstractmethod

class Shape(ABC):              # 继承 ABC
    @abstractmethod
    def area(self):            # 抽象方法，子类必须实现
        ...

    @abstractmethod
    def perimeter(self):
        ...

    def describe(self):        # 普通方法，子类直接继承
        return f"面积 {self.area()}，周长 {self.perimeter()}"

class Circle(Shape):
    def __init__(self, r):
        self.r = r

    def area(self):
        return 3.14 * self.r ** 2

    def perimeter(self):
        return 2 * 3.14 * self.r

# s = Shape()      # TypeError: 抽象类不能实例化
c = Circle(5)
print(c.describe())   # 面积 78.5，周长 31.400000000000002
```

:::tip 抽象基类的价值
- 在基类中声明接口（抽象方法），强制子类实现
- 提供公共代码复用（普通方法子类直接继承）
- 在大型项目中作为"契约"，规范团队开发
:::

### isinstance 与多态

`isinstance()` 用于检查对象是否是某个类的实例（含父类），是多态安全调用前的常用检查：

```python
print(isinstance(c, Circle))   # True
print(isinstance(c, Shape))    # True（Circle 是 Shape 子类）
print(isinstance(c, (int, str)))  # False（支持元组）

def print_area(shape: Shape):
    if isinstance(shape, Shape):
        print(shape.area())
    else:
        print("不是图形")

print_area(Circle(5))   # 78.5
```

## 类型注解

Python 是动态类型语言，但通过**类型注解（Type Hints）**可以为变量、函数参数和返回值标注类型。类型注解在运行时**不会被强制检查**，但能被 IDE、静态检查工具（如 mypy）和阅读代码的人使用，大幅提升可读性和可维护性。

### 变量类型注解

```python
name: str = "小明"
age: int = 18
height: float = 1.75
is_student: bool = True

# 也可以先声明类型再赋值
score: float
score = 95.5
```

### 函数参数与返回值注解

```python
def greet(name: str, age: int) -> str:
    return f"{name} 今年 {age} 岁"

def add(a: float, b: float) -> float:
    return a + b

print(greet("小明", 18))   # 小明 今年 18 岁
```

- 参数注解写在参数名后：`name: str`
- 返回值注解写在参数列表后：`-> str`
- 运行时不强制，传错类型不会报错（但 mypy 会警告）

### 容器类型注解

使用 `typing` 模块或 Python 3.9+ 的内置泛型：

```python
from typing import List, Dict, Tuple, Set

# Python 3.9+ 可以直接用 list/dict/tuple/set，无需 import
def average(scores: list[float]) -> float:
    return sum(scores) / len(scores)

def count_words(text: dict[str, int]) -> int:
    return sum(text.values())

def get_pos(point: tuple[float, float]) -> float:
    return point[0]

# 旧写法（Python 3.5-3.8，仍广泛使用）
def old_style(names: List[str]) -> Dict[str, int]:
    return {name: len(name) for name in names}
```

常用容器注解：

| 注解 | 含义 | 示例 |
| --- | --- | --- |
| `list[int]` | 整数列表 | `[1, 2, 3]` |
| `dict[str, int]` | 键 str 值 int 的字典 | `{"a": 1}` |
| `tuple[int, str]` | 固定长度元组 | `(1, "a")` |
| `tuple[int, ...]` | 任意长度整数元组 | `(1, 2, 3)` |
| `set[str]` | 字符串集合 | `{"a", "b"}` |

### 类的类型注解

在类内部和外部使用类名作为类型注解：

```python
class Node:
    def __init__(self, value: int, next_node: "Node | None" = None):
        # 注：next_node 的类型注解用字符串包裹，因为 Node 此时还未定义完
        self.value = value
        self.next = next_node

def print_list(head: Node) -> None:
    cur = head
    while cur:
        print(cur.value)
        cur = cur.next
```

:::tip 前向引用
当注解引用尚未定义的类（如自引用、循环引用）时，需要用字符串包裹：`"Node | None"`，或使用 `from __future__ import annotations`（Python 3.7+），它会让所有注解默认变成字符串。
:::

## Union 联合类型

`Union` 表示一个值可以是多种类型之一，是类型注解中非常常用的工具。

### Union 写法

```python
from typing import Union

def process(data: Union[int, str]) -> str:
    if isinstance(data, int):
        return f"数字: {data}"
    return f"字符串: {data}"

print(process(42))        # 数字: 42
print(process("hello"))   # 字符串: hello
```

### X | Y 语法（Python 3.10+）

Python 3.10 起支持更简洁的 `|` 语法，无需导入 `Union`：

```python
# 等价于 Union[int, str]
def process(data: int | str) -> str:
    if isinstance(data, int):
        return f"数字: {data}"
    return f"字符串: {data}"

# 多个类型联合
def handle(x: int | float | str | None) -> None:
    print(x)
```

:::tip 兼容旧版本
如果需要在 Python 3.9 及更早版本使用 `|` 语法，在文件开头加一行：
```python
from __future__ import annotations
```
这样所有注解都会被当作字符串延迟解析，`|` 语法在注解中即可使用。
:::

### Optional 类型

`Optional[X]` 等价于 `Union[X, None]`，表示值要么是 X，要么是 `None`：

```python
from typing import Optional

def find_user(user_id: int) -> Optional[str]:
    users = {1: "小明", 2: "小红"}
    return users.get(user_id)    # 找不到返回 None

result = find_user(1)
if result is not None:           # Optional 提醒你要判空
    print(result)

# Python 3.10+ 简写
def find_user2(user_id: int) -> str | None:
    ...
```

### 运行时检查联合类型

`isinstance` 支持元组形式，可一次性匹配多种类型：

```python
def process(data: int | str | float) -> str:
    if isinstance(data, (int, float)):    # 匹配 int 或 float
        return f"数字: {data}"
    elif isinstance(data, str):
        return f"字符串: {data}"
    return "未知"
```

## 函数方法类型（Callable）

在 Python 中，函数是一等对象，可以作为参数传递、作为返回值、赋值给变量。`Callable` 类型注解用于描述"可调用对象"的类型。

### Callable 基本用法

```python
from typing import Callable

# Callable[[参数类型列表], 返回值类型]
def apply(func: Callable[[int, int], int], a: int, b: int) -> int:
    return func(a, b)

def add(a: int, b: int) -> int:
    return a + b

def mul(a: int, b: int) -> int:
    return a * b

print(apply(add, 3, 4))   # 7
print(apply(mul, 3, 4))   # 12
```

- `Callable[[int, int], int]` 表示"接收两个 int 参数，返回 int 的可调用对象"。
- `Callable[..., str]` 表示"接收任意参数，返回 str"。
- `Callable[[], None]` 表示"无参，无返回值"。

### 各种可调用对象

Python 中很多对象都是"可调用"的，它们的类型都是 `Callable`：

```python
from typing import Callable

# 1. 普通函数
def greet(name: str) -> str:
    return f"Hello, {name}"

# 2. lambda 表达式
square: Callable[[int], int] = lambda x: x * x

# 3. 类（调用类就是实例化）
class Adder:
    def __init__(self, n: int):
        self.n = n
    # 4. 定义了 __call__ 的对象也可调用
    def __call__(self, x: int) -> int:
        return x + self.n

add5: Callable[[int], int] = Adder(5)

funcs: list[Callable[[int], int]] = [greet, square, add5]
for f in funcs:
    print(f(10))
# Hello, 10
# 100
# 15
```

### 方法类型注解

类中方法的类型注解，第一个参数是 `self`（实例方法）或 `cls`（类方法），它们不需要在注解中显式写出类型：

```python
class Calculator:
    pi: float = 3.14    # 类属性注解

    def __init__(self, value: float = 0) -> None:
        self.value: float = value    # 实例属性注解

    def add(self, x: float) -> float:          # 实例方法
        return self.value + x

    @classmethod
    def create(cls, v: float) -> "Calculator":  # 类方法
        return cls(v)

    @staticmethod
    def is_positive(x: float) -> bool:          # 静态方法
        return x > 0
```

## 进阶特性

### dataclass 数据类

`@dataclass` 装饰器自动生成 `__init__`、`__repr__`、`__eq__` 等方法，非常适合主要用来存储数据的类：

```python
from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float
    z: float = 0.0    # 带默认值

p1 = Point(1.0, 2.0)
p2 = Point(1.0, 2.0)
print(p1)            # Point(x=1.0, y=2.0, z=0.0)（自动生成 __repr__）
print(p1 == p2)      # True（自动生成 __eq__，按字段比较）
```

`dataclass` 还支持不可变实例、默认工厂等：

```python
from dataclasses import dataclass, field

@dataclass(frozen=True)    # 不可变，类似 tuple
class Color:
    r: int
    g: int
    b: int

@dataclass
class Student:
    name: str
    scores: list[int] = field(default_factory=list)  # 可变默认值必须用 default_factory

s = Student("小明")
s.scores.append(95)
```

### __slots__ 限制属性

默认情况下，Python 对象用一个 `__dict__` 字典存储属性，灵活但占内存。定义 `__slots__` 可以固定属性列表，**节省内存**并**阻止动态添加属性**：

```python
class Point:
    __slots__ = ("x", "y")    # 只允许有 x 和 y 两个属性

    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(1, 2)
# p.z = 3    # AttributeError（不能添加 __slots__ 之外的属性）
# print(p.__dict__)  # AttributeError（没有 __dict__ 了）
```

:::tip 何时用 __slots__
当需要创建大量对象（如百万级）时，`__slots__` 能显著降低内存占用。但会牺牲"动态添加属性"的灵活性，继承时也需要注意子类要重新定义 `__slots__`。
:::

## 综合示例

下面用一个完整的"图形系统"综合演示本章内容：

```python
from abc import ABC, abstractmethod
from typing import Optional
from dataclasses import dataclass
import math


# 1. 抽象基类：定义接口契约
class Shape(ABC):
    """所有图形的抽象基类"""

    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    def area(self) -> float:
        """子类必须实现：计算面积"""
        ...

    @abstractmethod
    def perimeter(self) -> float:
        """子类必须实现：计算周长"""
        ...

    # 普通方法，子类直接继承
    def describe(self) -> str:
        return f"{self.name}：面积 {self.area():.2f}，周长 {self.perimeter():.2f}"

    # 魔术方法：让图形可比较（按面积）
    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Shape):
            return NotImplemented
        return math.isclose(self.area(), other.area())

    def __lt__(self, other: "Shape") -> bool:
        if not isinstance(other, Shape):
            return NotImplemented
        return self.area() < other.area()

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(name={self.name!r})"


# 2. 具体子类：圆形
class Circle(Shape):
    def __init__(self, name: str, radius: float):
        super().__init__(name)      # 调用父类构造
        if radius < 0:
            raise ValueError("半径不能为负")
        self._radius = radius       # 私有属性

    @property
    def radius(self) -> float:      # property 封装
        return self._radius

    @radius.setter
    def radius(self, value: float) -> None:
        if value < 0:
            raise ValueError("半径不能为负")
        self._radius = value

    def area(self) -> float:
        return math.pi * self._radius ** 2

    def perimeter(self) -> float:
        return 2 * math.pi * self._radius


# 3. 具体子类：矩形（用 dataclass 简化）
@dataclass
class Rectangle(Shape):
    width: float
    height: float

    def __post_init__(self) -> None:
        # dataclass 自动生成 __init__，这里补充父类初始化
        super().__init__("矩形")
        if self.width < 0 or self.height < 0:
            raise ValueError("边长不能为负")

    def area(self) -> float:
        return self.width * self.height

    def perimeter(self) -> float:
        return 2 * (self.width + self.height)


# 4. 多态：同一个函数处理不同类型
def print_info(shape: Shape) -> None:
    print(shape.describe())


def largest(shapes: list[Shape]) -> Optional[Shape]:
    if not shapes:
        return None
    return max(shapes)          # 依赖 __lt__ 魔术方法


# 5. 使用
if __name__ == "__main__":
    circle = Circle("圆A", 5)
    rect = Rectangle(3, 4)

    # 多态：同一接口，不同行为
    print_info(circle)    # 圆A：面积 78.54，周长 31.42
    print_info(rect)      # 矩形：面积 12.00，周长 14.00

    # 比较运算（依赖 __lt__ 和 __eq__）
    print(circle > rect)       # True（按面积比较）
    print(largest([circle, rect]) is circle)   # True

    # property 封装
    circle.radius = 10         # 触发 setter
    print(circle.radius)      # 10.0（触发 getter）

    # 类型注解与鸭子类型
    shapes: list[Shape] = [circle, rect]
    shapes.sort()             # 排序依赖 __lt__
    for s in shapes:
        print(s.describe())
```

运行结果：

```text
圆A：面积 78.54，周长 31.42
矩形：面积 12.00，周长 14.00
True
True
10.0
矩形：面积 12.00，周长 14.00
圆A：面积 314.16，周长 62.83
```

这个示例涵盖了：抽象基类、继承、`super()`、复写、多态、魔术方法、封装（`property`）、类型注解、`dataclass` 等核心概念。

## 本章小结

| 概念 | 关键点 |
| --- | --- |
| 类与对象 | 类是模板，对象是实例；`self` 代表当前对象 |
| 类的成员 | 实例属性 / 类属性 / 实例方法 / 类方法 / 静态方法 |
| 构造方法 | `__init__` 初始化对象；`__new__` 创建对象 |
| 魔术方法 | 双下方法让对象支持各种运算和内置函数 |
| 封装 | `_` / `__` 命名约定 + `property` 装饰器 |
| 继承 | 单继承、多继承、`super()`、MRO、Mixin |
| 复写 | 子类重新定义父类方法，可用 `super()` 扩展 |
| 多态 | 鸭子类型 + 抽象基类（`abc`）+ `isinstance` |
| 类型注解 | 变量、参数、返回值均可标注，运行时不强制 |
| Union 联合类型 | `Union[X, Y]` 或 `X \| Y`，`Optional[X]` 即 `X \| None` |
| Callable | 描述可调用对象的类型：`Callable[[参数], 返回值]` |
| dataclass | 自动生成 `__init__` / `__repr__` / `__eq__` |
| __slots__ | 固定属性列表，节省内存，阻止动态添加属性 |

掌握这些概念后，你就拥有了用 Python 编写结构化、可维护、可扩展程序的核心能力。
