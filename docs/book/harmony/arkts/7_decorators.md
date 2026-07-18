---
title: ArkTS 装饰器
description: ArkTS 常用装饰器的作用与使用方式
order: 7
---

# ArkTS 装饰器

装饰器是 ArkTS 的核心特性之一，用于为类、方法、属性等添加元数据或改变行为。在 ArkUI 开发中，装饰器主要用于声明组件、页面入口和状态管理。

## 什么是装饰器

装饰器是一种特殊的语法，以 `@` 开头，放在被装饰的目标之前。它可以在不修改目标代码的情况下，为目标添加额外能力。

```typescript
@Component
struct MyComponent {
  // ...
}
```

## @Component

`@Component` 用于声明一个自定义组件。所有可以在 ArkUI 中使用的界面单元都需要用该装饰器标记。

```typescript
@Component
struct HelloComponent {
  build() {
    Text('Hello')
      .fontSize(20)
  }
}
```

## @Entry

`@Entry` 标记一个组件为页面入口。一个页面对应一个独立的文件，且通常只有一个 `@Entry` 组件。

```typescript
@Entry
@Component
struct Index {
  build() {
    Text('首页')
  }
}
```

## @Preview

`@Preview` 用于在 DevEco Studio 的预览窗口中预览组件效果。

```typescript
@Preview
@Component
struct PreviewDemo {
  build() {
    Text('预览组件')
  }
}
```

## @Builder

`@Builder` 用于声明一个 UI 构建函数，可以在 `build()` 中复用一段 UI 结构。

```typescript
@Builder
function Header() {
  Row() {
    Text('标题')
      .fontSize(20)
      .fontWeight(FontWeight.Bold)
  }
  .width('100%')
}

@Entry
@Component
struct Page {
  build() {
    Column() {
      Header()
      Text('内容')
    }
  }
}
```

## @BuilderParam

`@BuilderParam` 用于在自定义组件中接收外部传入的 `@Builder` 函数，实现类似插槽的效果。

```typescript
@Component
struct Card {
  @BuilderParam content: () => void;

  build() {
    Column() {
      this.content()
    }
    .padding(16)
    .backgroundColor('#f5f5f5')
  }
}

@Entry
@Component
struct Page {
  @Builder cardContent() {
    Text('卡片内容')
  }

  build() {
    Column() {
      Card({ content: this.cardContent })
    }
  }
}
```

## @Styles

`@Styles` 用于定义可复用的样式函数。

```typescript
@Styles
function commonText() {
  .fontSize(16)
  .fontColor(Color.Black)
}

@Entry
@Component
struct Page {
  build() {
    Text('普通文本')
      .commonText()
  }
}
```

## @Extend

`@Extend` 用于扩展特定组件的样式函数。

```typescript
@Extend(Text)
function titleStyle() {
  .fontSize(24)
  .fontWeight(FontWeight.Bold)
  .fontColor(Color.Blue)
}

@Entry
@Component
struct Page {
  build() {
    Text('标题')
      .titleStyle()
  }
}
```

## 本章小结

- `@Component` 声明组件，`@Entry` 声明页面入口。
- `@Builder` 复用 UI 结构，`@BuilderParam` 实现组件插槽。
- `@Styles` 定义通用样式，`@Extend` 扩展特定组件样式。
