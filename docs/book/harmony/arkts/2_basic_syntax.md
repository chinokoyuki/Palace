---
title: ArkTS 基础语法
description: ArkTS 变量、常量、注释、标识符及基本代码结构
order: 2
---

# ArkTS 基础语法

本章介绍 ArkTS 中最基础的语法元素，包括变量声明、常量、注释规则以及代码组织方式。这些内容与 TypeScript 基本一致。

## 注释

ArkTS 支持三种注释方式：

```typescript
// 单行注释

/*
 * 多行注释
 */

/**
 * 文档注释，常用于类和函数说明
 */
```

## 标识符规则

标识符用于命名变量、函数、类等。ArkTS 的标识符规则如下：

- 由字母、数字、下划线和美元符号组成。
- 不能以数字开头。
- 区分大小写。
- 不能使用保留关键字，如 `let`、`const`、`function`、`class` 等。

```typescript
let userName: string = 'Koyuki'  // 合法
let _count: number = 0           // 合法
let $price: number = 99.9        // 合法
// let 1stName: string = 'x'     // 非法，不能以数字开头
```

## 变量声明

ArkTS 使用 `let` 声明变量，使用 `const` 声明常量。

```typescript
let message: string = 'Hello'
message = 'World'  // 变量可以重新赋值

const PI: number = 3.14159
// PI = 3.14       // 常量不能被重新赋值
```

:::tip
建议优先使用 `const`，只有在需要重新赋值时才使用 `let`。这样可以让代码意图更清晰。
:::

## 语句与分号

ArkTS 使用分号 `;` 结束一条语句。虽然大多数情况下可以省略分号，但为了代码风格统一，建议在团队项目中保持一致。

```typescript
let a: number = 1;
let b: number = 2;
let sum: number = a + b;
```

## 代码块

使用大括号 `{}` 定义代码块。代码块常用于函数体、条件分支和循环中。

```typescript
function greet(): void {
  let name: string = 'ArkTS';
  console.log('Hello, ' + name);
}
```

## 基础输出

在 ArkTS 中，可以使用 `console.log` 在 DevEco Studio 的控制台输出调试信息。

```typescript
let score: number = 95;
console.log('当前分数：' + score);
```

## 本章小结

- 使用 `//` 和 `/* */` 添加注释。
- 使用 `let` 声明变量，`const` 声明常量。
- 标识符区分大小写，不能以数字开头。
- 用大括号组织代码块。
