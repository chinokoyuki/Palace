---
title: 仓颉函数
description: 仓颉函数声明、参数、返回值、高阶函数与 Lambda 表达式
order: 5
---

# 仓颉函数

函数是仓颉中组织代码的基本单元。仓颉支持函数式编程范式，函数可以作为值传递。

## 函数声明

使用 `func` 关键字声明函数：

```cangjie
func add(a: Int64, b: Int64): Int64 {
    return a + b
}

let result = add(2, 3)
println(result)  // 5
```

函数体最后一个表达式作为返回值时，可以省略 `return`：

```cangjie
func add(a: Int64, b: Int64): Int64 {
    a + b
}
```

返回值类型也可以推断：

```cangjie
func add(a: Int64, b: Int64) {
    a + b  // 推断返回类型为 Int64
}
```

## 参数类型

### 必填参数

```cangjie
func greet(name: String): Unit {
    println("你好，${name}")
}

greet("仓颉")
```

### 默认参数

```cangjie
func greet(name: String, prefix: String = "你好"): String {
    "${prefix}，${name}"
}

println(greet("仓颉"))           // 你好，仓颉
println(greet("仓颉", "欢迎"))   // 欢迎，仓颉
```

### 可选参数

仓颉不支持 TypeScript 风格的 `?` 可选参数，可以使用默认值或 `Option<T>` 代替：

```cangjie
func buildUser(name: String, age: Option<Int64> = None): String {
    match (age) {
        case Some(a) => "${name}，${a}岁"
        case None => name
    }
}
```

## 可变参数

使用 `Array<T>` 类型接收可变参数：

```cangjie
func sum(numbers: Array<Int64>): Int64 {
    var total: Int64 = 0
    for (n in numbers) {
        total += n
    }
    total
}

println(sum([1, 2, 3, 4, 5]))  // 15
```

## Lambda 表达式

仓颉使用 `{ => }` 语法定义 Lambda 表达式：

```cangjie
let square = { x: Int64 => x * x }
println(square(5))  // 25
```

多行 Lambda：

```cangjie
let greet = { name: String =>
    let msg = "你好，${name}"
    println(msg)
    msg
}
```

## 高阶函数

函数可以作为参数传递或作为返回值：

### 函数作为参数

```cangjie
func processData(data: Array<Int64>, handler: (Int64) -> Int64): Array<Int64> {
    var result = Array<Int64>()
    for (item in data) {
        result.append(handler(item))
    }
    result
}

let doubled = processData([1, 2, 3], { x => x * 2 })
println(duplicated)  // [2, 4, 6]
```

### 函数作为返回值

```cangjie
func makeMultiplier(factor: Int64): (Int64) -> Int64 {
    { x: Int64 => x * factor }
}

let triple = makeMultiplier(3)
println(triple(10))  // 30
```

## 嵌套函数

函数内部可以定义局部函数：

```cangjie
func outer(): Unit {
    let message = "外部"

    func inner(): Unit {
        println("内部访问：${message}")
    }

    inner()
}
```

## 本章小结

- 使用 `func` 声明函数，最后一个表达式可省略 `return`。
- 支持默认参数，可选参数用 `Option<T>` 代替。
- Lambda 使用 `{ => }` 语法。
- 函数可以作为参数和返回值，支持高阶函数。
