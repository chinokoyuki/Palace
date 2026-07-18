---
title: 仓颉异常处理
description: 仓颉 try-catch-finally 异常处理与自定义异常
order: 8
---

# 仓颉异常处理

仓颉提供了结构化的异常处理机制，使用 `try`-`catch`-`finally` 捕获和处理运行时错误。

## 基本异常处理

```cangjie
func divide(a: Int64, b: Int64): Int64 {
    if (b == 0) {
        throw Exception("除数不能为零")
    }
    a / b
}

main() {
    try {
        let result = divide(10, 0)
        println(result)
    } catch (e: Exception) {
        println("发生异常：${e.message}")
    }
}
```

## try 表达式

仓颉的 `try` 也是表达式，可以返回值：

```cangjie
let result = try {
    divide(10, 2)
} catch (e: Exception) {
    0
}
println(result)  // 5
```

## finally 块

`finally` 块无论是否发生异常都会执行，常用于资源释放：

```cangjie
try {
    let result = divide(10, 0)
    println(result)
} catch (e: Exception) {
    println("异常：${e.message}")
} finally {
    println("清理完成")
}
```

## 自定义异常

通过继承 `Exception` 类创建自定义异常：

```cangjie
class ValidationError <: Exception {
    let field: String

    public init(field: String, message: String) {
        super(message)
        this.field = field
    }
}

func validateAge(age: Int64): Unit {
    if (age < 0) {
        throw ValidationError("age", "年龄不能为负数")
    }
    if (age > 150) {
        throw ValidationError("age", "年龄不合理")
    }
}

main() {
    try {
        validateAge(-5)
    } catch (e: ValidationError) {
        println("字段 ${e.field} 验证失败：${e.message}")
    } catch (e: Exception) {
        println("其他异常：${e.message}")
    }
}
```

## try-with-resources

仓颉支持 `try-with-resources` 语法，自动管理实现了 `Resource` 接口的资源：

```cangjie
class FileResource <: Resource {
    var path: String

    public init(path: String) {
        this.path = path
        println("打开文件：${path}")
    }

    public func close(): Unit {
        println("关闭文件：${this.path}")
    }
}

main() {
    try (resource = FileResource("data.txt")) {
        println("使用资源")
    }
    // 无论是否异常，close() 都会被调用
}
```

## 常见运行时异常

| 异常 | 触发场景 |
| --- | --- |
| `IndexOutOfBoundsException` | 数组越界访问 |
| `OverflowException` | 数值计算溢出 |
| `IllegalArgumentException` | 非法参数 |
| `ConcurrentModificationException` | 并发修改冲突 |

## 本章小结

- 使用 `try`-`catch`-`finally` 处理异常。
- `try` 是表达式，可以返回值。
- 继承 `Exception` 创建自定义异常。
- `try-with-resources` 自动管理资源生命周期。
