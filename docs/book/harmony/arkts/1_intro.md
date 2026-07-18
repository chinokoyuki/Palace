---
title: ArkTS 简介
description: HarmonyOS ArkTS 语言的起源、特点及其与 TypeScript 的关系
order: 1
---

# ArkTS 简介

ArkTS 是 HarmonyOS 应用开发的主力编程语言，由 TypeScript 扩展而来，专为声明式 UI 和状态管理进行了优化。掌握 ArkTS 是开发鸿蒙应用的第一步。

## ArkTS 是什么

ArkTS（Ark TypeScript）是华为为 HarmonyOS 设计的一门编程语言。它在 TypeScript 的基础上，增加了用于声明式 UI 开发的装饰器语法和更严格的状态管理规则。

ArkTS 的主要特点包括：

- **声明式语法**：用简洁的方式描述界面结构和交互逻辑。
- **强类型支持**：继承 TypeScript 的类型系统，减少运行时错误。
- **状态驱动 UI**：通过状态变化自动刷新界面。
- **性能优化**：ArkTS 在编译阶段进行静态检查，提升运行效率。

## ArkTS 与 TypeScript 的关系

ArkTS 是 TypeScript 的**严格子集**，而非简单的超集。ArkTS 在 TypeScript 的基础上同时做了**扩展**和**限制**：

**扩展部分：**

- `@Component`、`@Entry`、`@State` 等装饰器。
- 针对 UI 的状态管理规则。
- 对 ArkUI 框架的原生支持。

**限制部分：**

- 禁止使用 `any` 和 `unknown` 类型。
- 禁止使用 `as` 类型断言（需使用显式类型声明）。
- 禁止使用 `for...in` 循环。
- 对象字面量必须有显式类型声明。
- 采用名义类型系统，结构相同的两个类不可互赋值。
- 禁止使用 `eval`、`with` 等动态特性。

这些限制的目的是确保编译器在编译期就能确定每个变量的精确类型和内存布局，从而支持 AOT 编译、跨线程 Sendable 和 UI 状态追踪。

:::warning
并非所有有效的 TypeScript 代码都能在 ArkTS 中运行。从 TypeScript 迁移到 ArkTS 时，需要注意上述限制。
:::

如果你已经熟悉 TypeScript，学习 ArkTS 的扩展部分会非常轻松，但同时也需要了解 ArkTS 的限制规则。

## 第一个 ArkTS 程序

一个最简单的 ArkTS 页面如下：

```typescript
@Entry
@Component
struct Index {
  build() {
    Column() {
      Text('Hello HarmonyOS')
        .fontSize(24)
        .fontColor(Color.Blue)
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }
}
```

:::tip
`@Entry` 表示页面入口，`@Component` 表示这是一个组件，`build()` 是构建 UI 的方法。
:::

## 本章内容安排

本大章节将从 ArkTS 的基础语法讲起，逐步深入到类型系统、函数、类与接口、装饰器、状态管理和生命周期，最后通过一个待办事项数据层的实战案例串联所学知识。
