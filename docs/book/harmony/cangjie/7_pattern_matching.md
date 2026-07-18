---
title: 仓颉模式匹配
description: 仓颉 match 表达式与各种模式的使用
order: 7
---

# 仓颉模式匹配

模式匹配是仓颉的核心特性之一，提供了比传统 switch 更强大的分支匹配能力。`match` 表达式可以匹配常量、类型、枚举、元组等多种模式。

## match 表达式基础

`match` 表达式的结构：

```cangjie
match (value) {
    case pattern1 => expression1
    case pattern2 => expression2
    case _        => defaultExpression
}
```

`case _` 是通配符模式，匹配任何值，通常放在最后作为默认分支。

## 常量模式

匹配具体的常量值：

```cangjie
let level = "B"

match (level) {
    case "A" => println("优秀")
    case "B" => println("良好")
    case "C" => println("一般")
    case _   => println("其他")
}
```

## 绑定模式

将匹配的值绑定到变量：

```cangjie
let value = 42

match (value) {
    case 0     => println("零")
    case n     => println("非零：${n}")  // n 绑定为 42
}
```

## 枚举模式

匹配枚举的不同构造器，并提取参数：

```cangjie
enum Shape {
    | Circle(Float64)
    | Rectangle(Float64, Float64)
    | Triangle(Float64, Float64, Float64)
}

func area(shape: Shape): Float64 {
    match (shape) {
        case Circle(r) => 3.14159 * r * r
        case Rectangle(w, h) => w * h
        case Triangle(a, b, c) => {
            let s = (a + b + c) / 2.0
            (s * (s - a) * (s - b) * (s - c)) ** 0.5
        }
    }
}
```

## 元组模式

匹配元组的结构并解构：

```cangjie
let point = (0, 5)

match (point) {
    case (0, 0) => println("原点")
    case (0, y) => println("Y轴上，y = ${y}")
    case (x, 0) => println("X轴上，x = ${x}")
    case (x, y) => println("坐标(${x}, ${y})")
}
```

## 类型模式

根据值的类型进行匹配：

```cangjie
func describe(value: Any): String {
    match (value) {
        case n: Int64 => "整数：${n}"
        case s: String => "字符串：${s}"
        case b: Bool => "布尔：${b}"
        case _ => "未知类型"
    }
}
```

## Option 模式匹配

`match` 是处理 `Option<T>` 的标准方式：

```cangjie
func showOption(opt: Option<Int64>): Unit {
    match (opt) {
        case Some(value) => println("值为 ${value}")
        case None => println("无值")
    }
}
```

## 守卫条件

使用 `where` 为模式添加额外条件：

```cangjie
match (score) {
    case s where s >= 90 => "优秀"
    case s where s >= 80 => "良好"
    case s where s >= 60 => "及格"
    case _               => "不及格"
}
```

## 嵌套模式

模式可以嵌套使用：

```cangjie
enum Expr {
    | Num(Float64)
    | Add(Expr, Expr)
    | Mul(Expr, Expr)
}

func eval(expr: Expr): Float64 {
    match (expr) {
        case Num(n) => n
        case Add(e1, e2) => eval(e1) + eval(e2)
        case Mul(e1, e2) => eval(e1) * eval(e2)
    }
}
```

## 本章小结

- `match` 是仓颉的核心模式匹配机制，功能远超 switch。
- 支持常量模式、绑定模式、枚举模式、元组模式、类型模式。
- 使用 `where` 添加守卫条件。
- `Option<T>` 使用 `Some`/`None` 模式匹配处理。
- 模式可以嵌套组合使用。
