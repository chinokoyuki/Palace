---
title: ArkUI 事件处理
description: ArkUI 中点击、触摸、滑动、输入等事件的处理方式
order: 5
---

# ArkUI 事件处理

事件处理是实现用户交互的关键。本章介绍 ArkUI 中常见的事件类型和处理方式。

## 点击事件

使用 `.onClick()` 监听点击。

```typescript
@State clickCount: number = 0;

Button(`点击次数：${this.clickCount}`)
  .onClick(() => {
    this.clickCount++;
  })
```

:::details 仓颉写法
```cangjie
@State var clickCount: Int64 = 0

Button("点击次数：${clickCount}")
    .onClick { evt =>
        clickCount += 1
    }
```
:::

## 触摸事件

使用 `.onTouch()` 获取触摸细节。

```typescript
Text('触摸我')
  .width(200)
  .height(100)
  .backgroundColor('#f5f5f5')
  .onTouch((event: TouchEvent) => {
    console.log('触摸类型：' + event.type);
    console.log('触摸坐标：' + event.touches[0].screenX + ', ' + event.touches[0].screenY);
  })
```

:::details 仓颉写法
```cangjie
Text("触摸我")
    .width(200)
    .height(100)
    .backgroundColor("#f5f5f5")
    .onTouch { event =>
        println("触摸类型：${event.type}")
        println("触摸坐标：${event.touches[0].screenX}, ${event.touches[0].screenY}")
    }
```
:::

## 滑动事件

### onScroll

```typescript
Scroll() {
  Column() {
    ForEach([1, 2, 3, 4, 5], (item: number) => {
      Text(`内容 ${item}`).height(120)
    })
  }
}
.onScroll((scrollOffset: number, scrollState: ScrollState) => {
  console.log('滚动偏移：' + scrollOffset);
})
```

### 手势事件

```typescript
Image($r('app.media.icon'))
  .width(100)
  .gesture(
    PinchGesture()
      .onActionStart(() => { console.log('捏合开始'); })
      .onActionUpdate((event: GestureEvent) => {
        console.log('捏合比例：' + event.scale);
      })
  )
```

## 输入事件

### onChange

```typescript
@State inputValue: string = '';

TextInput({ placeholder: '请输入', text: $$this.inputValue })
  .onChange((value: string) => {
    this.inputValue = value;
  })
```

:::details 仓颉写法
```cangjie
@State var inputValue: String = ""

TextInput(placeholder: "请输入", text: inputValue)
    .onChange { value =>
        inputValue = value
    }
```
:::

### onSubmit

```typescript
TextInput({ placeholder: '搜索' })
  .onSubmit((enterKey: EnterKeyType) => {
    console.log('用户按下了：' + enterKey);
  })
```

## 事件传参

可以在事件处理中访问组件状态或传入自定义参数。

```typescript
@State items: string[] = ['A', 'B', 'C'];

ForEach(this.items, (item: string, index: number) => {
  Button(`删除 ${item}`)
    .onClick(() => {
      this.items.splice(index, 1);
    })
})
```

:::details 仓颉写法
```cangjie
@State var items: Array<String> = ["A", "B", "C"]

ForEach(items, itemGeneratorFunc: { item, index =>
    Button("删除 ${item}")
        .onClick { evt =>
            items.removeAt(index)
        }
})
```
:::

## 本章小结

- `.onClick()` 处理点击事件。
- `.onTouch()` 获取触摸信息。
- `.onScroll()` 和手势事件处理滑动交互。
- `.onChange()` 监听输入框内容变化。
