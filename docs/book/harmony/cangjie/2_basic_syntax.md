---
title: 仓颉基础语法
description: 仓颉变量、常量、注释、标识符及基本代码结构
order: 2
---

# 仓颉基础语法

本章介绍仓颉中最基础的语法元素，包括变量声明、常量、注释和标识符规则。

## 注释

仓颉支持三种注释方式：

```cangjie
// 单行注释

/*
 * 多行注释
 */

/**
 * 文档注释
 */
```

## 标识符规则

标识符分为普通标识符和原始标识符。

**普通标识符**：

- 由 XID_Start 字符开头，后接任意长度的 XID_Continue 字符。
- 由 `_` 开头，后接至少一个 XID_Continue 字符。
- 不能与仓颉关键字相同。

```cangjie
let userName = "Koyuki"    // 合法
let _count = 0              // 合法
let 仓颉 = "Cangjie"        // 合法，支持 Unicode
// let 3abc = "x"           // 非法，不能以数字开头
// let while = "x"          // 非法，不能使用关键字
```

**原始标识符**：在普通标识符或关键字外加反引号，可以将关键字作为标识符使用：

```cangjie
let `if` = 10     // 合法，将关键字 if 作为标识符
let `class` = "A" // 合法
```

## 变量声明

仓颉使用 `let` 声明不可变变量，使用 `var` 声明可变变量。

:::warning
注意：仓颉的 `let` / `var` 语义与 JavaScript 相反！仓颉中 `let` 是不可变，`var` 是可变。
:::

```cangjie
let message = "Hello"   // 不可变
// message = "World"    // 编译错误

var count = 0            // 可变
count = 10               // 合法
```

变量声明的完整形式：

```cangjie
修饰符 变量名: 变量类型 = 初始值

let pi: Float64 = 3.14159
var score: Int64 = 95
```

### 全局变量必须初始化

在顶层作用域和静态成员变量中，变量必须初始化：

```cangjie
let global: Int64 = 100    // 正确
// let global2: Int64       // 错误，顶层变量必须初始化
```

## 值类型与引用类型

仓颉区分值类型和引用类型：

- **值类型**：基础数据类型（`Int64`、`Float64`、`Bool` 等）和 `struct`。赋值时拷贝数据。
- **引用类型**：`class`、`Array` 等。赋值时共享引用。

```cangjie
struct Copy {
    var data = 2012
}

class Share {
    var data = 2012
}

main() {
    let c1 = Copy()
    var c2 = c1       // 值拷贝
    c2.data = 2023
    println("${c1.data}, ${c2.data}")  // 2012, 2023

    let s1 = Share()
    let s2 = s1       // 引用共享
    s2.data = 2023
    println("${s1.data}, ${s2.data}")  // 2023, 2023
}
```

:::tip
`let` 修饰引用类型变量时，只是引用不可变（不能指向其他对象），但引用对象的内容仍可修改。
:::

## 输出

使用 `println` 输出到控制台：

```cangjie
println("Hello")
println("分数：${score}")
```

## 本章小结

- `let` 声明不可变变量，`var` 声明可变变量（与 JS 相反）。
- 仓颉区分值类型和引用类型，`struct` 是值类型，`class` 是引用类型。
- 全局变量和静态变量必须初始化。
- 标识符支持 Unicode，原始标识符用反引号包裹关键字。
