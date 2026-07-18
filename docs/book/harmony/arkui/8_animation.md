---
title: ArkUI 动画
description: ArkUI 中属性动画、显示动画、转场动画的使用
order: 8
---

# ArkUI 动画

动画可以让界面过渡更加自然流畅。ArkUI 提供了属性动画、显示动画和转场动画等多种动画能力。

## 属性动画

属性动画通过 `.animation()` 方法实现，当组件的属性变化时会产生过渡效果。

```typescript
@State rotateAngle: number = 0;

Text('旋转')
  .fontSize(24)
  .rotate({ angle: this.rotateAngle })
  .animation({
    duration: 1000,
    curve: Curve.EaseInOut,
  })
  .onClick(() => {
    this.rotateAngle += 90;
  })
```

:::details 仓颉写法
```cangjie
@State var rotateAngle: Float64 = 0.0

Text("旋转")
    .fontSize(24)
    .rotate(RotateOptions(angle: rotateAngle))
    .animation(
        duration: 1000,
        curve: Curve.EaseInOut
    )
    .onClick { evt =>
        rotateAngle += 90.0
    }
```
:::

## 显示动画

使用 `animateTo` 可以触发动画块中多个状态变化的过渡效果。

```typescript
@State widthValue: number = 100;

Button('放大')
  .onClick(() => {
    animateTo({ duration: 500 }, () => {
      this.widthValue = 200;
    });
  })

Text('会变宽')
  .width(this.widthValue)
  .height(50)
  .backgroundColor('#007dff')
```

:::details 仓颉写法
```cangjie
@State var widthValue: Float64 = 100.0

Button("放大")
    .onClick { evt =>
        animateTo(duration: 500) {
            widthValue = 200.0
        }
    }

Text("会变宽")
    .width(widthValue)
    .height(50)
    .backgroundColor("#007dff")
```
:::

## 转场动画

### 透明度转场

```typescript
@State isShow: boolean = true;

Button('切换显示')
  .onClick(() => {
    this.isShow = !this.isShow;
  })

if (this.isShow) {
  Text('淡入淡出')
    .transition(TransitionOpacity)
}
```

:::details 仓颉写法
```cangjie
@State var isShow: Bool = true

Button("切换显示")
    .onClick { evt =>
        isShow = !isShow
    }

if (isShow) {
    Text("淡入淡出")
        .transition(TransitionOpacity)
}
```
:::

### 移动转场

```typescript
if (this.isShow) {
  Text('移动出现')
    .transition(TransitionEffect.translate({ x: 100 }))
}
```

:::details 仓颉写法
```cangjie
if (isShow) {
    Text("移动出现")
        .transition(TransitionEffect.translate(x: 100))
}
```
:::

## 动画参数

| 参数 | 说明 |
| --- | --- |
| `duration` | 动画时长，单位毫秒 |
| `curve` | 动画曲线，如 `Curve.Linear`、`Curve.EaseInOut` |
| `delay` | 延迟时间 |
| `iterations` | 动画播放次数，`-1` 表示无限循环 |

## 本章小结

- `.animation()` 实现属性变化时的过渡动画。
- `animateTo()` 控制多个状态变化的动画效果。
- `transition()` 实现组件显示/隐藏时的转场动画。
