---
title: ArkUI 状态驱动 UI
description: ArkUI 中状态变化如何驱动界面自动刷新
order: 6
---

# ArkUI 状态驱动 UI

状态驱动是声明式 UI 的核心理念。当状态发生变化时，绑定了该状态的 UI 会自动更新，无需手动操作视图。

## 状态与 UI 的关系

在 ArkUI 中，状态是 UI 的数据源。状态变化后，框架会重新执行 `build()` 中相关的部分，并对比差异，只更新变化的内容。

```typescript
@Entry
@Component
struct StateDemo {
  @State message: string = '初始文本';

  build() {
    Column() {
      Text(this.message)
        .fontSize(20)

      Button('修改文本')
        .onClick(() => {
          this.message = '更新后的文本';
        })
    }
  }
}
```

:::details 仓颉写法
```cangjie
import kit.ArkUI.*
import ohos.arkui.state_macro_manage.*

@Entry
@Component
class StateDemo {
    @State var message: String = "初始文本"

    func build() {
        Column {
            Text(message)
                .fontSize(20)

            Button("修改文本")
                .onClick { evt =>
                    message = "更新后的文本"
                }
        }
    }
}
```
:::

## 状态更新的规则

### 直接赋值

基础类型状态直接赋值即可触发刷新：

```typescript
this.count = 10;
```

### 数组更新

需要给数组重新赋值才能触发刷新：

```typescript
// 错误：直接 push 不会触发刷新
this.items.push('新项');

// 正确：重新赋值
this.items = [...this.items, '新项'];
```

### 对象更新

对象属性的修改需要重新赋值整个对象：

```typescript
// 错误：直接修改属性不会触发刷新
this.user.name = 'New Name';

// 正确：重新赋值
this.user = { ...this.user, name: 'New Name' };
```

## 状态提升

当多个组件需要共享状态时，可以将状态提升到它们的共同父组件中。

```typescript
@Entry
@Component
struct Parent {
  @State count: number = 0;

  build() {
    Column() {
      CounterDisplay({ count: this.count })
      CounterButton({ count: $count })
    }
  }
}

@Component
struct CounterDisplay {
  @Prop count: number;

  build() {
    Text(`当前计数：${this.count}`)
  }
}

@Component
struct CounterButton {
  @Link count: number;

  build() {
    Button('增加')
      .onClick(() => {
        this.count++;
      })
  }
}
```

:::details 仓颉写法
```cangjie
@Entry
@Component
class Parent {
    @State var count: Int64 = 0

    func build() {
        Column {
            CounterDisplay(count: count)
            CounterButton(count: count)  // 仓颉通过引用传递实现 @Link 语义
        }
    }
}

@Component
class CounterDisplay {
    @Prop var count: Int64 = 0

    func build() {
        Text("当前计数：${count}")
    }
}

@Component
class CounterButton {
    @Link var count: Int64 = 0

    func build() {
        Button("增加")
            .onClick { evt =>
                count += 1
            }
    }
}
```
:::

## 局部状态与全局状态

| 状态类型 | 说明 | 示例 |
| --- | --- | --- |
| 局部状态 | 只在单个组件内部使用 | `@State` |
| 父子状态 | 在父子组件之间传递 | `@Prop`、`@Link` |
| 全局状态 | 跨层级或跨页面共享 | `@Provide`/`@Consume`、AppStorage |

## 本章小结

- 状态变化会自动驱动 UI 刷新。
- 数组和对象更新时需要重新赋值。
- 状态提升可以解决兄弟组件共享状态的问题。
