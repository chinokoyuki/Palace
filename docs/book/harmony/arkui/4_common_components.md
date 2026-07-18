---
title: ArkUI 常用组件
description: ArkUI 中 List、Tabs、Navigation、Dialog 等常用组件的使用
order: 4
---

# ArkUI 常用组件

本章介绍 ArkUI 中除了基础组件外，开发中常用的列表、标签页、导航等组件。

## List 与 ForEach

`List` 配合 `ForEach` 可以高效渲染数据列表。

```typescript
@State items: string[] = ['苹果', '香蕉', '橙子', '葡萄'];

List() {
  ForEach(this.items, (item: string, index: number) => {
    ListItem() {
      Text(item)
        .width('100%')
        .height(50)
        .padding(12)
    }
  }, (item: string) => item)
}
.width('100%')
.height('100%')
```

:::details 仓颉写法
```cangjie
@State var items: Array<String> = ["苹果", "香蕉", "橙子", "葡萄"]

List {
    ForEach(items, itemGeneratorFunc: { item, index =>
        ListItem {
            Text(item)
                .width(100.percent)
                .height(50)
                .padding(12)
        }
    }, keyGeneratorFunc: { item =>
        item
    })
}
.width(100.percent)
.height(100.percent)
```
:::

:::tip
`ForEach` 的第三个参数是键值生成函数，建议提供稳定的唯一标识，以提升列表更新性能。
:::

## Tabs 标签页

`Tabs` 用于实现标签页切换效果。

```typescript
Tabs({ barPosition: BarPosition.Start }) {
  TabContent() {
    Text('首页内容')
  }
  .tabBar('首页')

  TabContent() {
    Text('我的内容')
  }
  .tabBar('我的')
}
.width('100%')
.height('100%')
```

:::details 仓颉写法
```cangjie
Tabs(barPosition: BarPosition.Start) {
    TabContent {
        Text("首页内容")
    }.tabBar("首页")

    TabContent {
        Text("我的内容")
    }.tabBar("我的")
}
.width(100.percent)
.height(100.percent)
```
:::

## Navigation 导航

`Navigation` 用于构建带有导航栏的页面结构。

```typescript
Navigation() {
  Text('页面内容')
}
.title('标题')
.mode(NavigationMode.Auto)
.width('100%')
.height('100%')
```

:::details 仓颉写法
```cangjie
Navigation {
    Text("页面内容")
}
.title("标题")
.mode(NavigationMode.Auto)
.width(100.percent)
.height(100.percent)
```
:::

## Dialog 对话框

可以通过 `AlertDialog.show` 显示对话框。

```typescript
AlertDialog.show({
  title: '提示',
  message: '确认删除吗？',
  primaryButton: {
    value: '取消',
    action: () => { console.log('取消'); }
  },
  secondaryButton: {
    value: '确认',
    action: () => { console.log('确认'); }
  }
});
```

:::details 仓颉写法
```cangjie
AlertDialog.show(
    title: "提示",
    message: "确认删除吗？",
    primaryButton: AlertDialogButton(
        value: "取消",
        action: { => println("取消") }
    ),
    secondaryButton: AlertDialogButton(
        value: "确认",
        action: { => println("确认") }
    )
)
```
:::

## Scroll 滚动容器

```typescript
Scroll() {
  Column() {
    ForEach([1, 2, 3, 4, 5], (item: number) => {
      Text(`内容 ${item}`)
        .height(100)
    })
  }
  .width('100%')
}
.width('100%')
.height('100%')
```

:::details 仓颉写法
```cangjie
Scroll {
    Column {
        ForEach(Array<Int64>([1, 2, 3, 4, 5]), itemGeneratorFunc: { item, index =>
            Text("内容 ${item}")
                .height(100)
        })
    }
    .width(100.percent)
}
.width(100.percent)
.height(100.percent)
```
:::

## 本章小结

- `List` + `ForEach` 是列表渲染的标准组合。
- `Tabs` 实现标签页，`Navigation` 实现导航结构。
- `AlertDialog.show` 可快速显示对话框。
