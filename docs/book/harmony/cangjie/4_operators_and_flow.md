---
title: 仓颉运算符与流程控制
description: 仓颉运算符、条件表达式与循环表达式
order: 4
---

# 仓颉运算符与流程控制

本章介绍仓颉中用于数据计算和逻辑控制的运算符与流程控制语句。

## 算术运算符

```cangjie
let a: Int64 = 10
let b: Int64 = 3

println(a + b)   // 13
println(a - b)   // 7
println(a * b)   // 30
println(a / b)   // 3
println(a % b)   // 1
```

## 赋值运算符

```cangjie
var x: Int64 = 10
x += 5   // x = 15
x -= 3   // x = 12
x *= 2   // x = 24
x /= 4   // x = 6
```

## 比较运算符

```cangjie
println(5 == 10)   // false
println(5 != 10)   // true
println(5 > 10)    // false
println(5 < 10)    // true
println(5 >= 5)    // true
println(5 <= 10)   // true
```

## 逻辑运算符

```cangjie
let isLogin = true
let isAdmin = false

println(isLogin && isAdmin)  // false
println(isLogin || isAdmin)  // true
println(!isLogin)            // false
```

## 条件表达式

### if 表达式

仓颉的 `if` 是表达式，可以返回值。条件必须是 `Bool` 类型，不能使用整数代替。

```cangjie
let score: Int64 = 85

if (score >= 90) {
    println("优秀")
} else if (score >= 80) {
    println("良好")
} else {
    println("继续努力")
}
```

作为表达式使用时，`if` 的值是所执行分支的值：

```cangjie
let level = if (score >= 60) { "及格" } else { "不及格" }
```

:::warning
仓颉中 `if` 条件只能是 `Bool` 类型，不能像 C/JS 那样用整数判断。
:::

```cangjie
let number = 1
// if (number) { }   // 编译错误！
if (number != 0) { }  // 正确
```

### 三元运算符

仓颉不支持 `?:` 三元运算符，但可以用 `if` 表达式替代：

```cangjie
let result = if (age >= 18) { "成年人" } else { "未成年人" }
```

## 循环表达式

### for-in 循环

`for-in` 用于遍历序列，是最常用的循环方式：

```cangjie
for (i in 1..=100) {
    println(i)
}
```

遍历数组：

```cangjie
let fruits = ["苹果", "香蕉", "橙子"]
for (fruit in fruits) {
    println(fruit)
}
```

遍历元组数组并解构：

```cangjie
let pairs = [(1, "A"), (2, "B"), (3, "C")]
for ((id, name) in pairs) {
    println("${id}: ${name}")
}
```

### while 循环

```cangjie
var count = 0
while (count < 3) {
    println(count)
    count++
}
```

### do-while 循环

```cangjie
var num = 0
do {
    println(num)
    num++
} while (num < 3)
```

### break 与 continue

```cangjie
for (i in 0..10) {
    if (i == 3) {
        continue
    }
    if (i == 6) {
        break
    }
    println(i)
}
```

## match 表达式

`match` 是仓颉中强大的模式匹配表达式，类似于其他语言的 switch 但功能更强：

```cangjie
let level = "B"

match (level) {
    case "A" => println("优秀")
    case "B" => println("良好")
    case "C" => println("一般")
    case _   => println("其他")
}
```

`match` 也可以作为表达式返回值：

```cangjie
let grade = match (score / 10) {
    case 10 => "A"
    case 9  => "A"
    case 8  => "B"
    case 7  => "C"
    case _  => "D"
}
```

匹配枚举：

```cangjie
enum Color {
    | Red
    | Green
    | Blue
    | RGB(Int64, Int64, Int64)
}

match (color) {
    case Red => println("红色")
    case Green => println("绿色")
    case Blue => println("蓝色")
    case RGB(r, g, b) => println("RGB(${r}, ${g}, ${b})")
}
```

## 本章小结

- `if` 是表达式，条件必须是 `Bool` 类型。
- `for-in` 是最常用的循环，支持区间和序列遍历。
- `match` 是强大的模式匹配表达式，支持常量模式、绑定模式和枚举匹配。
- 没有 `?:` 三元运算符，用 `if` 表达式替代。
