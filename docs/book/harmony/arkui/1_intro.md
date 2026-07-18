---
title: ArkUI 简介
description: HarmonyOS ArkUI 声明式 UI 框架的设计理念与基本结构
order: 1
---

# ArkUI 简介

ArkUI 是 HarmonyOS 的声明式 UI 开发框架。开发者只需描述界面“应该是什么样子”，框架会根据状态变化自动更新界面。

## 声明式 UI 的特点

传统的命令式 UI 需要手动操作每个视图节点，而声明式 UI 只需要描述界面结构：

```typescript
Column() {
  Text('标题')
  Button('按钮')
}
```

当状态变化时，ArkUI 会自动计算出需要更新的部分，并高效刷新界面。

## ArkUI 的核心概念

| 概念 | 说明 |
| --- | --- |
| 组件 | UI 的基本构建单元，如 Text、Button、Column |
| 状态 | 驱动 UI 变化的数据 |
| 属性方法 | 用于设置组件样式，如 `.width()`、`.fontSize()` |
| 布局容器 | 用于组织多个组件的排列方式，如 Column、Row |

## 基本页面结构

```typescript
@Entry
@Component
struct Index {
  build() {
    Column() {
      Text('Hello ArkUI')
        .fontSize(24)
        .fontColor(Color.Blue)

      Button('点击我')
        .onClick(() => {
          console.log('按钮被点击');
        })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }
}
```

:::details 仓颉写法
```cangjie
import kit.ArkUI.*
import ohos.arkui.state_macro_manage.*

@Entry
@Component
class Index {
    @State var message: String = "Hello ArkUI"
    @State var clickCount: Int64 = 0

    func build() {
        Column {
            Text(message)
                .fontSize(24)
                .fontColor(Color.Blue)

            Button("点击我")
                .onClick { evt =>
                    clickCount += 1
                }
        }
        .width(100.percent)
        .height(100.percent)
        .justifyContent(FlexAlign.Center)
    }
}
```
:::

## 本章内容安排

本大章节将系统学习 ArkUI 的基础组件、布局系统、事件处理、状态驱动、自定义组件、动画，最后完成一个待办列表界面实战。
