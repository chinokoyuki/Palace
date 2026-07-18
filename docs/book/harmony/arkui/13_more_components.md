---
title: ArkUI 更多组件
description: ArkUI 中 Swiper、Progress、Divider、Blank、Checkbox 等常用组件
order: 13
---

# ArkUI 更多组件

除了前面章节介绍的基础组件，ArkUI 还提供了许多常用组件，用于构建更丰富的界面效果。

## Swiper 轮播组件

Swiper 用于实现轮播图效果，支持自动播放和手势滑动。

```typescript
@State currentIndex: number = 0;

Swiper() {
  Text('第一页')
    .width('100%')
    .height(200)
    .backgroundColor('#ff0000')
    .textAlign(TextAlign.Center)
    .fontColor(Color.White)

  Text('第二页')
    .width('100%')
    .height(200)
    .backgroundColor('#00ff00')
    .textAlign(TextAlign.Center)

  Text('第三页')
    .width('100%')
    .height(200)
    .backgroundColor('#0000ff')
    .textAlign(TextAlign.Center)
    .fontColor(Color.White)
}
.autoPlay(true)
.interval(3000)
.indicator(true)
.loop(true)
.onChange((index: number) => {
  this.currentIndex = index;
})
```

常用属性：

| 属性 | 说明 |
| --- | --- |
| `autoPlay` | 是否自动播放 |
| `interval` | 自动播放间隔（毫秒） |
| `indicator` | 是否显示导航指示器 |
| `loop` | 是否可循环滑动 |
| `vertical` | 是否为垂直方向 |
| `cachedCount` | 预加载的子组件数量 |

## Progress 进度条

Progress 用于显示操作进度。

```typescript
@State progress: number = 30;

Column() {
  Progress({ value: this.progress, total: 100, type: ProgressType.Linear })
    .width('80%')
    .color('#007dff')

  Progress({ value: 50, total: 100, type: ProgressType.Ring })
    .width(60)
    .height(60)

  Progress({ value: 70, total: 100, type: ProgressType.Eclipse })
    .width(60)
    .height(60)
}
```

ProgressType 取值：

- `ProgressType.Linear`：线性进度条
- `ProgressType.Ring`：环形进度条
- `ProgressType.Eclipse`：月牙进度条
- `ProgressType.ScaleRing`：刻度环形进度条
- `ProgressType.Capsule`：胶囊进度条

## Divider 分割线

Divider 用于绘制分割线。

```typescript
Column() {
  Text('项目 A')
  Divider()
    .color('#e0e0e0')
    .strokeWidth(1)
    .margin({ left: 16, right: 16 })
  Text('项目 B')
}
```

常用属性：

| 属性 | 说明 |
| --- | --- |
| `vertical` | 是否为垂直分割线 |
| `color` | 分割线颜色 |
| `strokeWidth` | 分割线宽度 |
| `lineCap` | 端点样式 |

## Blank 填充组件

Blank 在父容器中自动填充空白空间，常用于实现两端对齐布局。

```typescript
Row() {
  Text('左侧')
  Blank()
  Text('右侧')
}
.width('100%')
.padding(16)
```

也可以设置 `layoutWeight` 效果，但 Blank 更语义化。

## Checkbox 复选框

Checkbox 用于多选场景。

```typescript
@State isChecked: boolean = false;

Row() {
  Checkbox()
    .select(this.isChecked)
    .onChange((value: boolean) => {
      this.isChecked = value;
    })
  Text('同意用户协议')
}
```

## RadioButton 单选按钮

RadioButton 配合 RadioContainer 实现单选效果。

```typescript
@State selectedValue: string = 'A';

RadioContainer() {
  Row() {
    RadioButton({ value: 'A', group: 'options' })
      .checked(this.selectedValue === 'A')
      .onChange((isChecked: boolean) => {
        if (isChecked) this.selectedValue = 'A';
      })
    Text('选项 A')
  }

  Row() {
    RadioButton({ value: 'B', group: 'options' })
      .checked(this.selectedValue === 'B')
      .onChange((isChecked: boolean) => {
        if (isChecked) this.selectedValue = 'B';
      })
    Text('选项 B')
  }
}
```

## Rating 评分组件

```typescript
@State rating: number = 3;

Rating({ rating: this.rating, indicator: false })
  .onChange((value: number) => {
    this.rating = value;
  })
```

- `indicator` 为 `true` 时只显示不可交互。
- `stars` 设置星星数量（默认 5）。

## Badge 角标组件

Badge 用于在组件右上角显示提示信息。

```typescript
Badge({ count: 5, maxCount: 99 }) {
  Text('消息')
    .fontSize(16)
    .padding(8)
}

Badge({ count: 0, badgePosition: BadgePosition.RightTop }) {
  Text('无消息')
}
```

## LoadingProgress 加载动画

```typescript
LoadingProgress()
  .color('#007dff')
  .width(40)
  .height(40)
```

## Refresh 下拉刷新

```typescript
@State refreshing: boolean = false;

Refresh({ refreshing: $refreshing }) {
  List() {
    ForEach(this.items, (item: string) => {
      ListItem() {
        Text(item)
      }
    })
  }
}
.onRefreshing(() => {
  setTimeout(() => {
    this.items = ['新数据 1', '新数据 2'];
    this.refreshing = false;
  }, 1000);
})
```

## 本章小结

- `Swiper` 实现轮播效果，支持自动播放和手势滑动。
- `Progress` 显示进度，支持多种样式。
- `Divider` 分割线，`Blank` 填充空白。
- `Checkbox`/`RadioButton` 用于选择场景。
- `Rating` 评分，`Badge` 角标，`LoadingProgress` 加载动画。
- `Refresh` 下拉刷新。

:::details 仓颉写法
仓颉 ArkUI 同样支持上述组件，主要语法差异：
- `class` 替代 `struct`，`var`/`let` 声明变量
- `@State var isChecked: Bool = false`
- `{ }` 块定义子组件，`100.percent` 替代 `'100%'`
- `onChange { value => ... }` 替代 `.onChange((value) => { ... })`
- `@r(app.media.xxx)` 替代 `$r('app.media.xxx')`

```cangjie
import kit.ArkUI.*
import ohos.arkui.state_macro_manage.*

@State var currentIndex: Int64 = 0

Swiper {
    Text("第一页")
        .width(100.percent)
        .height(200)
        .backgroundColor("#ff0000")
        .textAlign(TextAlign.Center)
        .fontColor(Color.White)
}
.autoPlay(true)
.interval(3000)
.indicator(true)
.loop(true)
.onChange { index =>
    currentIndex = index
}

@State var isChecked: Bool = false

Row {
    Checkbox()
        .select(isChecked)
        .onChange { value =>
            isChecked = value
        }
    Text("同意用户协议")
}
```
:::
