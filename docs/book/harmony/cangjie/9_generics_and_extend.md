---
title: 仓颉泛型与扩展
description: 仓颉泛型编程、类型扩展与操作符重载
order: 9
---

# 仓颉泛型与扩展

泛型和类型扩展是仓颉实现代码复用的两大核心机制。泛型提供参数化类型能力，类型扩展允许为已有类型添加功能。

## 泛型函数

泛型函数可以处理多种类型的数据：

```cangjie
func swap<T>(a: T, b: T): (T, T) {
    (b, a)
}

let (x, y) = swap(1, 2)
let (s1, s2) = swap("A", "B")
```

## 泛型类

```cangjie
class Stack<T> {
    var items = Array<T>()

    public func push(item: T): Unit {
        items.append(item)
    }

    public func pop(): Option<T> {
        if (items.isEmpty) {
            None
        } else {
            Some(items.removeAt(items.size - 1))
        }
    }

    public func isEmpty(): Bool {
        items.isEmpty
    }
}

let intStack = Stack<Int64>()
intStack.push(1)
intStack.push(2)
println(intStack.pop())  // Some(2)
```

## 泛型约束

使用 `where` 子句约束泛型参数必须满足的条件：

```cangjie
interface Comparable<T> {
    func compareTo(other: T): Ordering
}

func max<T>(a: T, b: T): T where T <: Comparable<T> {
    match (a.compareTo(b)) {
        case Ordering.GT => a
        case _ => b
    }
}
```

多个约束：

```cangjie
func process<T>(value: T): Unit where T <: Serializable & Comparable<T> {
    // T 必须同时实现 Serializable 和 Comparable
}
```

## 类型扩展（extend）

类型扩展允许在不修改原有类型代码的情况下，为类型添加功能。

### 添加成员函数

```cangjie
extend Int64 {
    public func isEven(): Bool {
        this % 2 == 0
    }

    public func isPositive(): Bool {
        this > 0
    }
}

println(4.isEven())      // true
println((-5).isPositive())  // false
```

### 添加属性

```cangjie
extend Array<T> {
    public prop first: Option<T> {
        get() {
            if (this.isEmpty) { None } else { Some(this[0]) }
        }
    }
}
```

### 实现接口

```cangjie
interface Printable {
    func print(): Unit
}

extend Int64 <: Printable {
    public func print(): Unit {
        println("Int64: ${this}")
    }
}
```

### 操作符重载

通过类型扩展为自定义类型重载操作符：

```cangjie
struct Vector2 {
    var x: Float64
    var y: Float64

    public init(x: Float64, y: Float64) {
        this.x = x
        this.y = y
    }
}

extend Vector2 {
    public operator func +(other: Vector2): Vector2 {
        Vector2(this.x + other.x, this.y + other.y)
    }

    public operator func *(scalar: Float64): Vector2 {
        Vector2(this.x * scalar, this.y * scalar)
    }
}

let v1 = Vector2(1.0, 2.0)
let v2 = Vector2(3.0, 4.0)
let v3 = v1 + v2          // Vector2(4.0, 6.0)
let v4 = v1 * 2.0         // Vector2(2.0, 4.0)
```

### 可重载的操作符

| 类别 | 操作符 |
| --- | --- |
| 算术 | `+`、`-`、`*`、`/`、`%`、`**` |
| 一元 | `-`、`!` |
| 比较 | `==`、`!=`、`<`、`>`、`<=`、`>=` |
| 索引 | `[]`（取值和赋值） |

## 本章小结

- 泛型函数和泛型类实现类型参数化，提升代码复用。
- `where` 子句约束泛型参数。
- `extend` 为已有类型添加函数、属性、接口实现和操作符重载。
- 操作符重载让自定义类型支持自然语法。
