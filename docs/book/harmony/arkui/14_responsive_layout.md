---
title: ArkUI 响应式布局
description: ArkUI 响应式开发与媒体查询
order: 14
---

# ArkUI 响应式布局

HarmonyOS 应用需要适配不同屏幕尺寸的设备。ArkUI 提供了栅格布局、媒体查询和断点机制来实现响应式界面。

## 断点系统

ArkUI 定义了标准的断点范围：

| 断点 | 范围 | 典型设备 |
| --- | --- | --- |
| sm | [0, 320) vp | 小屏手机 |
| md | [320, 520) vp | 大屏手机 |
| lg | [520, 840) vp | 平板竖屏 |
| xl | [840, +∞) vp | 平板横屏/折叠屏 |

## GridRow / GridCol 栅格布局

`GridRow` 和 `GridCol` 是 ArkUI 提供的栅格布局组件，会根据断点自动调整列数。

### 基本用法

```typescript
GridRow({ columns: { sm: 4, md: 8, lg: 12 } }) {
  ForEach([1, 2, 3, 4], (item: number) => {
    GridCol({ span: { sm: 2, md: 4, lg: 3 } }) {
      Column() {
        Text(`卡片 ${item}`)
      }
      .height(100)
      .backgroundColor('#f0f0f0')
      .borderRadius(8)
    }
  })
}
.width('100%')
.padding(16)
```

### 栅格参数

| 参数 | 说明 |
| --- | --- |
| `columns` | 总列数，支持按断点配置 |
| `span` | 子组件占的列数 |
| `offset` | 子组件偏移的列数 |
| `gutter` | 栅格间距 |

### 间距配置

```typescript
GridRow({ gutter: { x: 16, y: 12 } }) {
  // ...
}
```

## 媒体查询

媒体查询允许根据设备特征（如屏幕宽度、方向）应用不同样式。

### 使用媒体查询监听断点变化

```typescript
import { mediaQuery } from '@kit.ArkUI';

@Entry
@Component
struct ResponsivePage {
  @State currentBreakpoint: string = 'md';
  private listener: mediaQuery.MediaQueryListener | null = null;

  aboutToAppear() {
    let rule: mediaQuery.MediaQueryCondition = mediaQuery.matchMediaSync('(320vp<=width<520vp)');
    this.listener = rule;
    rule.on('change', (result: mediaQuery.MediaQueryResult) => {
      if (result.matches) {
        this.currentBreakpoint = 'md';
      }
    });
  }

  aboutToDisappear() {
    if (this.listener) {
      this.listener.off('change');
    }
  }

  build() {
    Column() {
      Text(`当前断点：${this.currentBreakpoint}`)
        .fontSize(20)
    }
    .width('100%')
    .height('100%')
  }
}
```

### 常用媒体查询条件

```typescript
// 屏幕宽度范围
mediaQuery.matchMediaSync('(320vp<=width<520vp)')

// 屏幕方向
mediaQuery.matchMediaSync('(orientation: landscape)')

// 深色模式
mediaQuery.matchMediaSync('(prefers-color-scheme: dark)')
```

## 自适应布局实践

### 响应式列数

根据断点动态调整列表列数：

```typescript
@State columns: number = 1;

build() {
  Grid() {
    ForEach(this.items, (item: string) => {
      GridItem() {
        Text(item)
      }
    })
  }
  .columnsTemplate(`1fr `.repeat(this.columns).trimEnd())
  .width('100%')
}
```

### 响应式隐藏/显示

根据屏幕尺寸决定是否显示某些元素：

```typescript
@State isLargeScreen: boolean = false;

build() {
  Row() {
    if (this.isLargeScreen) {
      Column() {
        Text('侧边栏')
      }
      .width(240)
    }

    Column() {
      Text('主内容')
    }
    .layoutWeight(1)
  }
  .width('100%')
  .height('100%')
}
```

## 尺寸单位

ArkUI 中常用的尺寸单位：

| 单位 | 说明 |
| --- | --- | --- |
| `px` | 物理像素 |
| `vp` | 虚拟像素，密度无关，推荐使用 |
| `fp` | 字体像素，跟随系统字体缩放 |
| `%` | 百分比，相对父容器 |

推荐使用 `vp` 作为布局尺寸单位，使用 `fp` 作为字体尺寸单位。

## 本章小结

- ArkUI 定义了 sm/md/lg/xl 四个标准断点。
- `GridRow`/`GridCol` 实现自适应栅格布局。
- 使用媒体查询监听屏幕变化，动态调整 UI。
- 布局尺寸使用 `vp`，字体尺寸使用 `fp`。

:::details 仓颉写法
仓颉 ArkUI 支持 GridRow/GridCol 栅格布局和媒体查询，语法差异同前：
- `class` 替代 `struct`
- `{ }` 块定义子组件
- `100.percent` 替代 `'100%'`
- `ForEach` 使用 `itemGeneratorFunc: { item, index => ... }` 语法
- `mediaQuery` API 导入方式可能为 `import ohos.mediaQuery.*` 或等效路径

```cangjie
import kit.ArkUI.*
import ohos.arkui.state_macro_manage.*

GridRow(columns: GridRowColumns(sm: 4, md: 8, lg: 12)) {
    ForEach([1, 2, 3, 4], itemGeneratorFunc: { item, index =>
        GridCol(span: GridColSpan(sm: 2, md: 4, lg: 3)) {
            Column {
                Text("卡片 ${item}")
            }
            .height(100)
            .backgroundColor("#f0f0f0")
            .borderRadius(8)
        }
    })
}
.width(100.percent)
.padding(16)
```
:::
