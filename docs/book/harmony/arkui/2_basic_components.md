---
title: ArkUI 基础组件
description: ArkUI 中 Text、Button、Image、TextInput 等基础组件的使用
order: 2
---

# ArkUI 基础组件

组件是构建界面的基本单元。本章介绍 ArkUI 中最常用的基础组件及其属性方法。

## Text 文本组件

`Text` 用于显示文本。

```typescript
Text('Hello ArkUI')
  .fontSize(20)
  .fontColor(Color.Black)
  .fontWeight(FontWeight.Bold)
  .maxLines(2)
  .textOverflow({ overflow: TextOverflow.Ellipsis })
```

常用属性：

| 属性 | 说明 |
| --- | --- |
| `fontSize` | 字体大小 |
| `fontColor` | 字体颜色 |
| `fontWeight` | 字重 |
| `textAlign` | 文本对齐方式 |
| `maxLines` | 最大行数 |

:::details 仓颉写法
```cangjie
Text("Hello ArkUI")
    .fontSize(20)
    .fontColor(Color.Black)
    .fontWeight(FontWeight.Bold)
    .maxLines(2)
    .textOverflow(TextOverflow.Ellipsis)
```
:::

## Button 按钮组件

`Button` 用于响应点击事件。

```typescript
Button('确认')
  .type(ButtonType.Capsule)
  .backgroundColor('#007dff')
  .fontColor(Color.White)
  .width(120)
  .height(40)
  .onClick(() => {
    console.log('确认 clicked');
  })
```

`ButtonType` 取值：

- `ButtonType.Capsule`：胶囊形
- `ButtonType.Circle`：圆形
- `ButtonType.Normal`：普通矩形

:::details 仓颉写法
```cangjie
Button("确认")
    .type(ButtonType.Capsule)
    .backgroundColor("#007dff")
    .fontColor(Color.White)
    .width(120)
    .height(40)
    .onClick { evt =>
        println("确认 clicked")
    }
```
:::

## Image 图片组件

`Image` 用于显示图片。

```typescript
Image($r('app.media.icon'))
  .width(100)
  .height(100)
  .objectFit(ImageFit.Cover)
  .borderRadius(8)
```

:::details 仓颉写法
```cangjie
Image(@r(app.media.icon))
    .width(100)
    .height(100)
    .objectFit(ImageFit.Cover)
    .borderRadius(8)
```
:::

图片来源可以是：

- 本地资源：`$r('app.media.icon')`
- 网络图片：`'https://example.com/image.png'`

## TextInput 输入框

`TextInput` 用于接收用户输入。

```typescript
@State inputValue: string = '';

TextInput({ placeholder: '请输入用户名', text: $$this.inputValue })
  .width('80%')
  .height(40)
  .backgroundColor('#f5f5f5')
  .onChange((value: string) => {
    this.inputValue = value;
  })
```

:::details 仓颉写法
```cangjie
@State var inputValue: String = ""

TextInput(placeholder: "请输入用户名", text: inputValue)
    .width(80.percent)
    .height(40)
    .backgroundColor("#f5f5f5")
    .onChange { value =>
        inputValue = value
    }
```
:::

## Slider 滑块

```typescript
@State progress: number = 50;

Slider({ value: this.progress, min: 0, max: 100 })
  .onChange((value: number) => {
    this.progress = value;
  })
```

:::details 仓颉写法
```cangjie
@State var progress: Float64 = 50.0

Slider(value: progress, min: 0, max: 100)
    .onChange { value =>
        progress = value
    }
```
:::

## Toggle 开关

```typescript
@State isOn: boolean = false;

Toggle({ type: ToggleType.Switch, isOn: this.isOn })
  .onChange((isOn: boolean) => {
    this.isOn = isOn;
  })
```

:::details 仓颉写法
```cangjie
@State var isOn: Bool = false

Toggle(type: ToggleType.Switch, isOn: isOn)
    .onChange { isOn =>
        isOn = isOn
    }
```
:::

## 本章小结

- `Text` 显示文本，`Button` 响应点击。
- `Image` 显示本地或网络图片。
- `TextInput`、`Slider`、`Toggle` 用于接收用户输入。
