---
title: 仓颉数据类型
description: 仓颉基本数据类型、数组、元组、枚举、Option 及类型推断
order: 3
---

# 仓颉数据类型

仓颉是静态强类型语言，每个变量都有明确类型。本章介绍仓颉的常用数据类型。

## 基本数据类型

### 整数类型

| 类型 | 说明 |
| --- | --- |
| `Int8` | 8 位有符号整数 |
| `Int16` | 16 位有符号整数 |
| `Int32` | 32 位有符号整数 |
| `Int64` | 64 位有符号整数（最常用） |
| `UInt8` | 8 位无符号整数 |
| `UInt16` | 16 位无符号整数 |
| `UInt32` | 32 位无符号整数 |
| `UInt64` | 64 位无符号整数 |

```cangjie
let age: Int64 = 18
let byte: UInt8 = 255
```

### 浮点类型

| 类型 | 说明 |
| --- | --- |
| `Float16` | 半精度浮点 |
| `Float32` | 单精度浮点 |
| `Float64` | 双精度浮点（最常用） |

```cangjie
let pi: Float64 = 3.14159
```

### 布尔类型

```cangjie
let isOnline: Bool = true
let isEmpty: Bool = false
```

### 字符与字符串

```cangjie
let ch: Rune = 'A'
let name: String = "仓颉"
```

模板字符串使用 `${}` 嵌入表达式：

```cangjie
let version = 5.0
let info = "HarmonyOS ${version}"
```

### Unit 类型

`Unit` 类型表示没有有意义的返回值，类似于其他语言的 `void`。

```cangjie
func log(msg: String): Unit {
    println(msg)
}
```

### Nothing 类型

`Nothing` 是所有类型的子类型，表示永远不会正常返回（如抛出异常或无限循环）。

## 数组

数组使用 `Array<T>` 表示：

```cangjie
let scores: Array<Int64> = [85, 90, 78]
let names = ["Alice", "Bob", "Carol"]  // 类型推断为 Array<String>
```

访问和修改：

```cangjie
println(scores[0])  // 85
var items = [1, 2, 3]
items[1] = 20
items.append(4)      // 添加元素
println(items.size)   // 4
```

## 元组

元组用于组合多个不同类型的值：

```cangjie
let pair: (Int64, String) = (1, "仓颉")
let (id, name) = pair   // 解构
println("${id}, ${name}")
```

## 枚举

仓颉的枚举功能强大，支持带参数的构造器：

```cangjie
enum Color {
    | Red
    | Green
    | Blue
    | RGB(Int64, Int64, Int64)
}

let c1 = Color.Red
let c2 = Color.RGB(0xFF, 0x00, 0x00)
```

枚举中还可以定义成员函数：

```cangjie
enum Color {
    | Red
    | Green
    | Blue

    func show(): String {
        match (this) {
            case Red => "红色"
            case Green => "绿色"
            case Blue => "蓝色"
        }
    }
}
```

## Option 类型

`Option<T>` 用于表示可能为空的值，替代 null 引用：

```cangjie
let someValue: Option<Int64> = Some(42)
let noneValue: Option<Int64> = None
```

使用 `match` 处理 Option：

```cangjie
func showValue(opt: Option<Int64>): Unit {
    match (opt) {
        case Some(value) => println("值为 ${value}")
        case None => println("无值")
    }
}
```

使用 `??` 提供默认值：

```cangjie
let value = noneValue ?? 0  // 如果为 None，使用默认值 0
```

## 类型推断

仓颉支持类型推断，许多情况下可以省略类型注解：

```cangjie
let count = 10           // 推断为 Int64
let title = "仓颉"       // 推断为 String
let scores = [85, 90]    // 推断为 Array<Int64>
```

函数返回值也可以推断：

```cangjie
func add(a: Int64, b: Int64) {
    a + b  // 返回类型推断为 Int64
}
```

## 本章小结

- 整数最常用 `Int64`，浮点最常用 `Float64`。
- 数组 `Array<T>`，元组 `(T1, T2)`。
- 枚举支持带参构造器和成员函数。
- `Option<T>` 代替 null，使用 `Some`/`None` 和 `??` 处理。
- 仓颉支持类型推断，但建议在函数参数中显式声明类型。
