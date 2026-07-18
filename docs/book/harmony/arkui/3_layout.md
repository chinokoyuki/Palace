---
title: ArkUI 布局系统
description: ArkUI 中 Column、Row、Flex、Stack、List、Grid 等布局容器的使用
order: 3
---

# ArkUI 布局系统

布局容器用于组织多个组件的排列方式。本章介绍 ArkUI 中常用的布局容器。

## Column 垂直布局

`Column` 将子组件沿垂直方向排列。

```typescript
Column({ space: 12 }) {
  Text('第一行')
  Text('第二行')
  Text('第三行')
}
.width('100%')
.height('100%')
.justifyContent(FlexAlign.Center)
.alignItems(HorizontalAlign.Center)
```

:::details 仓颉写法
```cangjie
Column(space: 12) {
    Text("第一行")
    Text("第二行")
    Text("第三行")
}
.width(100.percent)
.height(100.percent)
.justifyContent(FlexAlign.Center)
.alignItems(HorizontalAlign.Center)
```
:::

## Row 水平布局

`Row` 将子组件沿水平方向排列。

```typescript
Row({ space: 12 }) {
  Text('左侧')
  Text('中间')
  Text('右侧')
}
.width('100%')
.justifyContent(FlexAlign.SpaceBetween)
.alignItems(VerticalAlign.Center)
```

:::details 仓颉写法
```cangjie
Row(space: 12) {
    Text("左侧")
    Text("中间")
    Text("右侧")
}
.width(100.percent)
.justifyContent(FlexAlign.SpaceBetween)
.alignItems(VerticalAlign.Center)
```
:::

## Flex 弹性布局

`Flex` 提供更灵活的弹性布局能力。

```typescript
Flex({ direction: FlexDirection.Row, wrap: FlexWrap.Wrap, justifyContent: FlexAlign.SpaceAround }) {
  Text('A')
  Text('B')
  Text('C')
}
.width('100%')
```

:::details 仓颉写法
```cangjie
Flex(direction: FlexDirection.Row, wrap: FlexWrap.Wrap, justifyContent: FlexAlign.SpaceAround) {
    Text("A")
    Text("B")
    Text("C")
}
.width(100.percent)
```
:::

## Stack 层叠布局

`Stack` 允许子组件堆叠显示。

```typescript
Stack({ alignContent: Alignment.Center }) {
  Image($r('app.media.bg'))
    .width('100%')
    .height(200)

  Text('叠加文字')
    .fontColor(Color.White)
    .fontSize(24)
}
.width('100%')
.height(200)
```

:::details 仓颉写法
```cangjie
Stack(alignContent: Alignment.Center) {
    Image(@r(app.media.bg))
        .width(100.percent)
        .height(200)

    Text("叠加文字")
        .fontColor(Color.White)
        .fontSize(24)
}
.width(100.percent)
.height(200)
```
:::

## List 列表布局

`List` 用于展示大量数据，支持滚动。

```typescript
List() {
  ListItem() {
    Text('项目 1')
  }
  ListItem() {
    Text('项目 2')
  }
}
.width('100%')
.height('100%')
```

:::details 仓颉写法
```cangjie
List {
    ListItem {
        Text("项目 1")
    }
    ListItem {
        Text("项目 2")
    }
}
.width(100.percent)
.height(100.percent)
```
:::

## Grid 网格布局

`Grid` 用于创建网格视图。

```typescript
Grid() {
  GridItem() {
    Text('1')
  }
  GridItem() {
    Text('2')
  }
  GridItem() {
    Text('3')
  }
}
.columnsTemplate('1fr 1fr 1fr')
.width('100%')
.height(200)
```

:::details 仓颉写法
```cangjie
Grid {
    GridItem {
        Text("1")
    }
    GridItem {
        Text("2")
    }
    GridItem {
        Text("3")
    }
}
.columnsTemplate("1fr 1fr 1fr")
.width(100.percent)
.height(200)
```
:::

## 常用对齐方式

| 属性 | 说明 |
| --- | --- |
| `justifyContent` | 主轴对齐方式 |
| `alignItems` | 交叉轴对齐方式 |
| `alignSelf` | 子组件在交叉轴上的对齐方式 |

## 本章小结

- `Column` 垂直排列，`Row` 水平排列。
- `Flex` 更灵活，`Stack` 用于层叠。
- `List` 适合长列表，`Grid` 适合网格展示。
