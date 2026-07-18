---
title: 仓颉类与接口
description: 仓颉 class、struct、接口、继承、访问修饰符与类型扩展
order: 6
---

# 仓颉类与接口

仓颉支持面向对象编程，提供 `class`、`struct`、`interface` 等类型定义机制，同时支持类型扩展和泛型。

## class 类

使用 `class` 定义引用类型：

```cangjie
class Person {
    let name: String
    var age: Int64

    public init(name: String, age: Int64) {
        this.name = name
        this.age = age
    }

    public func introduce(): String {
        "${this.name}，${this.age}岁"
    }
}

let person = Person("仓颉", 20)
println(person.introduce())
```

### 属性

仓颉使用 `prop` 定义属性，包含 getter 和 setter：

```cangjie
class Rectangle {
    var width: Int64 = 0
    var height: Int64 = 0

    public prop area: Int64 {
        get() {
            width * height
        }
    }
}
```

### open 修饰符

默认情况下，仓颉的类是**封闭的**（不可被继承），成员函数也是**不可重写**的。需要使用 `open` 修饰符开放继承和重写：

```cangjie
open class Animal {
    let name: String

    public init(name: String) {
        this.name = name
    }

    open func speak(): Unit {
        println("${this.name}发出声音")
    }
}

class Dog <: Animal {
    public init(name: String) {
        super(name)
    }

    public override func speak(): Unit {
        println("汪汪汪")
    }
}
```

:::tip
仓颉只允许单继承，每个类只能有一个父类。使用 `<:` 表示继承关系。
:::

## struct 结构体

`struct` 是值类型，赋值时拷贝数据：

```cangjie
struct Point {
    var x: Float64
    var y: Float64

    public init(x: Float64, y: Float64) {
        this.x = x
        this.y = y
    }

    public func distance(): Float64 {
        (this.x * this.x + this.y * this.y) ** 0.5
    }
}

let p = Point(3.0, 4.0)
println(p.distance())  // 5.0
```

### class 与 struct 对比

| 特性 | class | struct |
| --- | --- | --- |
| 类型 | 引用类型 | 值类型 |
| 赋值 | 共享引用 | 拷贝数据 |
| 继承 | 支持（单继承） | 不支持 |
| 默认封闭性 | 封闭（需 `open` 开放） | 封闭 |

## interface 接口

接口定义行为规范，类可以实现多个接口：

```cangjie
interface Drawable {
    func draw(): Unit
}

interface Sizable {
    func resize(factor: Float64): Unit
}

class Shape <: Drawable & Sizable {
    public func draw(): Unit {
        println("绘制图形")
    }

    public func resize(factor: Float64): Unit {
        println("缩放 ${factor} 倍")
    }
}
```

接口可以包含默认实现：

```cangjie
interface Printable {
    func print(): Unit {
        println("默认打印")
    }
}
```

## 访问修饰符

| 修饰符 | 说明 |
| --- | --- |
| `public` | 公有，任何地方可访问 |
| `private` | 私有，仅本类型内部可访问 |
| `protected` | 受保护，本类型和子类可访问 |
| `internal` | 模块内可访问（默认） |

```cangjie
class BankAccount {
    private var balance: Int64 = 0

    public func deposit(amount: Int64): Unit {
        if (amount > 0) {
            balance += amount
        }
    }

    public func getBalance(): Int64 {
        balance
    }
}
```

## 类型扩展（extend）

仓颉支持在不修改原有类型代码的情况下，为类型添加功能：

```cangjie
extend String {
    public func isNullOrEmpty(): Bool {
        this.isEmpty
    }
}

let s = ""
println(s.isNullOrEmpty())  // true
```

类型扩展可以：

- 添加成员函数
- 添加属性
- 添加操作符重载
- 实现接口

## 泛型

仓颉支持泛型编程，函数、struct、class、interface 都可以引入泛型参数：

```cangjie
class Box<T> {
    var value: T
    public init(value: T) {
        this.value = value
    }
    public func getValue(): T {
        value
    }
}

let intBox = Box<Int64>(42)
let strBox = Box<String>("仓颉")
```

泛型函数：

```cangjie
func identity<T>(value: T): T {
    value
}

println(identity(10))       // 10
println(identity("hello")) // hello
```

泛型约束：

```cangjie
interface Comparable<T> {
    func compareTo(other: T): Int64
}

func max<T>(a: T, b: T): T where T <: Comparable<T> {
    if (a.compareTo(b) >= 0) { a } else { b }
}
```

## 本章小结

- `class` 是引用类型，`struct` 是值类型。
- 默认封闭，使用 `open` 开放继承和重写。
- 接口可以多实现，支持默认实现。
- 类型扩展 `extend` 可为已有类型添加功能。
- 泛型支持函数和类型，可使用 `where` 约束。
