---
title: ArkUI 自定义组件
description: ArkUI 中如何封装和复用自定义组件
order: 7
---

# ArkUI 自定义组件

自定义组件是 ArkUI 中复用 UI 和业务逻辑的重要手段。通过将常用功能封装成组件，可以提高代码的可维护性。

## 创建自定义组件

使用 `@Component` 装饰器声明自定义组件。

```typescript
@Component
struct MyButton {
  label: string = '按钮';
  onClick?: () => void;

  build() {
    Button(this.label)
      .width(120)
      .height(40)
      .backgroundColor('#007dff')
      .fontColor(Color.White)
      .onClick(() => {
        if (this.onClick) {
          this.onClick();
        }
      })
  }
}
```

:::details 仓颉写法
```cangjie
import kit.ArkUI.*
import ohos.arkui.state_macro_manage.*

@Component
class MyButton {
    var label: String = "按钮"
    var onClick: (() -> Unit)? = None

    func build() {
        Button(label)
            .width(120)
            .height(40)
            .backgroundColor("#007dff")
            .fontColor(Color.White)
            .onClick { evt =>
                if (let Some(handler) <- onClick) {
                    handler()
                }
            }
    }
}
```
:::

## 使用自定义组件

```typescript
@Entry
@Component
struct Page {
  build() {
    Column() {
      MyButton({ label: '确认', onClick: () => { console.log('确认'); } })
      MyButton({ label: '取消', onClick: () => { console.log('取消'); } })
    }
  }
}
```

## 组件属性与事件回调

自定义组件可以通过成员变量接收外部传入的属性，通过函数类型成员接收事件回调。

```typescript
@Component
struct GoodsCard {
  title: string = '';
  price: number = 0;
  onBuy?: () => void;

  build() {
    Column() {
      Text(this.title)
        .fontSize(18)
      Text(`¥${this.price}`)
        .fontColor(Color.Red)
      Button('购买')
        .onClick(() => {
          if (this.onBuy) {
            this.onBuy();
          }
        })
    }
    .padding(12)
    .backgroundColor('#f9f9f9')
  }
}
```

## 插槽效果

使用 `@BuilderParam` 可以让自定义组件接收外部传入的 UI 片段。

```typescript
@Component
struct Card {
  @BuilderParam content: () => void;

  build() {
    Column() {
      this.content()
    }
    .padding(16)
    .backgroundColor('#ffffff')
    .borderRadius(8)
    .shadow({ radius: 4, color: '#cccccc' })
  }
}

@Entry
@Component
struct Page {
  @Builder cardBody() {
    Text('卡片内容')
      .fontSize(16)
  }

  build() {
    Card({ content: this.cardBody })
  }
}
```

:::details 仓颉写法
```cangjie
@Component
class Card {
    @BuilderParam var content: () -> Unit

    func build() {
        Column {
            content()
        }
        .padding(16)
        .backgroundColor("#ffffff")
        .borderRadius(8)
        .shadow(ShadowOptions(radius: 4, color: "#cccccc"))
    }
}

@Entry
@Component
class Page {
    @Builder func cardBody() {
        Text("卡片内容")
            .fontSize(16)
    }

    func build() {
        Card(content: cardBody)
    }
}
```
:::

## 本章小结

- 使用 `@Component` 创建自定义组件。
- 通过成员变量传递属性，通过函数类型传递事件。
- 使用 `@BuilderParam` 实现组件插槽效果。
