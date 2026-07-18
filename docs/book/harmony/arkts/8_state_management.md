---
title: ArkTS 状态管理
description: ArkTS 中状态管理装饰器的工作原理与使用场景
order: 8
---

# ArkTS 状态管理

状态管理是 ArkTS 的核心能力。当状态变量发生变化时，绑定了该状态的 UI 会自动刷新。本章介绍常用的状态管理装饰器。

## @State

`@State` 用于声明组件内部的状态变量。状态变化会自动触发 UI 刷新。

```typescript
@Entry
@Component
struct CounterPage {
  @State count: number = 0;

  build() {
    Column() {
      Text(`点击次数：${this.count}`)
        .fontSize(20)

      Button('点击 +1')
        .onClick(() => {
          this.count++;
        })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
  }
}
```

## @Prop

`@Prop` 用于父组件向子组件传递数据。子组件可以读取并修改该数据，但修改不会同步回父组件。

```typescript
@Component
struct Child {
  @Prop message: string;

  build() {
    Text(this.message)
      .onClick(() => {
        this.message = '子组件修改了';  // 只影响子组件自身
      })
  }
}

@Entry
@Component
struct Parent {
  @State parentMsg: string = '来自父组件';

  build() {
    Column() {
      Child({ message: this.parentMsg })
    }
  }
}
```

## @Link

`@Link` 用于建立父子组件之间的双向数据绑定。子组件对数据的修改会同步回父组件。

```typescript
@Component
struct SwitchButton {
  @Link isOn: boolean;

  build() {
    Button(this.isOn ? '开启' : '关闭')
      .onClick(() => {
        this.isOn = !this.isOn;
      })
  }
}

@Entry
@Component
struct Parent {
  @State lightOn: boolean = false;

  build() {
    Column() {
      SwitchButton({ isOn: $lightOn })
      Text(`当前状态：${this.lightOn ? '开启' : '关闭'}`)
    }
  }
}
```

## @Provide / @Consume

`@Provide` 和 `@Consume` 用于跨层级组件共享状态，无需逐层传递。

```typescript
@Entry
@Component
struct GrandParent {
  @Provide themeColor: ResourceColor = Color.Blue;

  build() {
    Column() {
      Parent()
    }
  }
}

@Component
struct Parent {
  build() {
    Child()
  }
}

@Component
struct Child {
  @Consume themeColor: ResourceColor;

  build() {
    Text('子组件文本')
      .fontColor(this.themeColor)
  }
}
```

## @Watch

`@Watch` 用于监听状态变量的变化，并执行自定义回调。

```typescript
@Entry
@Component
struct WatchDemo {
  @State @Watch('onCountChanged') count: number = 0;

  onCountChanged() {
    console.log('count 变化为：' + this.count);
  }

  build() {
    Column() {
      Text(`${this.count}`)
      Button('增加')
        .onClick(() => {
          this.count++;
        })
    }
  }
}
```

## 状态装饰器对比

| 装饰器 | 作用范围 | 数据流向 |
| --- | --- | --- |
| `@State` | 组件内部 | 内部自管理 |
| `@Prop` | 父子组件 | 父 → 子，单向 |
| `@Link` | 父子组件 | 双向同步 |
| `@Provide` / `@Consume` | 跨层级 | 双向同步 |

## 本章小结

- `@State` 管理组件内部状态。
- `@Prop` 实现父到子的单向数据传递。
- `@Link` 实现父子双向绑定。
- `@Provide` / `@Consume` 适合跨层级状态共享。
