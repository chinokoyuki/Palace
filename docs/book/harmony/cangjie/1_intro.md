---
title: 仓颉简介
description: 仓颉编程语言的起源、特性与程序结构
order: 1
---

# 仓颉简介

仓颉（Cangjie）是华为为 HarmonyOS 生态自研的编程语言，定位为面向全场景应用开发的现代编程语言，具备高效编程、安全可靠、轻松并发和卓越性能四大特性。

## 仓颉是什么

仓颉是一门多范式编程语言，支持函数式、命令式和面向对象等多种编程范式。它的主要特性包括：

- **高效编程**：支持值类型、类和接口、泛型、代数数据类型、模式匹配、高阶函数以及类型推断，减少冗余书写。
- **安全可靠**：静态类型系统、自动内存管理、空引用安全、运行时检查（数组越界、类型转换、溢出检查等）。
- **轻松并发**：轻量化用户态线程模型，并发对象库提供线程安全接口，无需手动加锁。
- **卓越性能**：多层级编译优化、值类型加速、全并发 GC 算法、超轻量运行时。

## 仓颉与 ArkTS 的关系

仓颉和 ArkTS 都是 HarmonyOS 生态的编程语言，但定位不同：

| 特性 | 仓颉 | ArkTS |
| --- | --- | --- |
| 定位 | 通用编程语言 | 声明式 UI 开发语言 |
| 文件后缀 | `.cj` | `.ets` |
| 类型系统 | 静态强类型 | 静态强类型（TypeScript 子集） |
| 编程范式 | 多范式（OOP/FP/命令式） | 以声明式 UI 为核心 |
| 并发模型 | 用户态线程 + 并发对象 | 单线程事件循环 |
| 内存管理 | 自动 GC | 自动 GC |

仓颉适合编写业务逻辑、数据处理、网络请求等非 UI 代码，而 ArkTS 适合声明式 UI 开发。两者可以互操作。

## 第一个仓颉程序

仓颉源文件后缀为 `.cj`，程序入口是 `main` 函数：

```cangjie
main() {
    println("Hello, HarmonyOS!")
}
```

`main` 函数可以接受 `Array<String>` 类型的参数，返回值可以是 `Int64` 或 `Unit`：

```cangjie
main(args: Array<String>): Int64 {
    println("参数数量：${args.size}")
    return 0
}
```

## 程序结构

仓颉源文件的顶层作用域中可以定义：

- 全局变量（`let` / `var`）
- 全局函数（`func`）
- 自定义类型（`struct`、`class`、`enum`、`interface`）

```cangjie
let appName = "我的应用"

func greet(name: String): Unit {
    println("你好，${name}")
}

class User {
    let name: String
    public init(name: String) {
        this.name = name
    }
}

main() {
    greet(appName)
    let user = User("仓颉")
    println(user.name)
}
```

## 本章小结

- 仓颉是华为自研的多范式编程语言，具备高效、安全、并发和性能优势。
- 仓颉与 ArkTS 互补：仓颉负责逻辑层，ArkTS 负责 UI 层。
- 仓颉程序入口是 `main` 函数，文件后缀为 `.cj`。
