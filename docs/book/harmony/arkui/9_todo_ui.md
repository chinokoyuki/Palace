---
title: 实战：待办列表界面
description: 综合运用 ArkUI 知识实现一个完整的待办列表界面
order: 9
---

# 实战：待办列表界面

本章综合运用前面所学的 ArkUI 知识，实现一个完整的待办列表应用界面。

## 数据准备

复用 ArkTS 章节定义的待办数据层：

```typescript
import { TodoModel, FilterType, TodoItem } from '../model/TodoModel';

@Entry
@Component
struct TodoPage {
  @State todoModel: TodoModel = new TodoModel();
  @State inputText: string = '';
  @State currentFilter: FilterType = FilterType.ALL;

  // ...
}
```

## 整体布局

页面分为三个区域：

1. 顶部标题栏
2. 中间输入区
3. 底部待办列表

```typescript
build() {
  Column() {
    this.Header()
    this.InputArea()
    this.FilterBar()
    this.TodoList()
  }
  .width('100%')
  .height('100%')
  .padding(16)
  .backgroundColor('#f5f5f5')
}
```

## 顶部标题

```typescript
@Builder
Header() {
  Row() {
    Text('待办事项')
      .fontSize(24)
      .fontWeight(FontWeight.Bold)

    Text(`${this.todoModel.getActiveCount()} 项待完成`)
      .fontSize(14)
      .fontColor(Color.Gray)
  }
  .width('100%')
  .justifyContent(FlexAlign.SpaceBetween)
  .margin({ bottom: 16 })
}
```

## 输入区域

```typescript
@Builder
InputArea() {
  Row({ space: 12 }) {
    TextInput({ placeholder: '添加待办事项', text: $$this.inputText })
      .layoutWeight(1)
      .height(44)
      .onChange((value: string) => {
        this.inputText = value;
      })

    Button('添加')
      .height(44)
      .onClick(() => {
        this.todoModel.addTodo(this.inputText);
        this.inputText = '';
      })
  }
  .width('100%')
  .margin({ bottom: 16 })
}
```

## 筛选栏

```typescript
@Builder
FilterBar() {
  Row({ space: 12 }) {
    ForEach([FilterType.ALL, FilterType.ACTIVE, FilterType.COMPLETED], (filter: FilterType) => {
      Button(filter)
        .type(ButtonType.Capsule)
        .backgroundColor(this.currentFilter === filter ? '#007dff' : '#e0e0e0')
        .fontColor(this.currentFilter === filter ? Color.White : Color.Black)
        .onClick(() => {
          this.currentFilter = filter;
        })
    }, (filter: FilterType) => filter)
  }
  .margin({ bottom: 16 })
}
```

## 待办列表

```typescript
@Builder
TodoList() {
  List({ space: 12 }) {
    ForEach(this.todoModel.getTodos(this.currentFilter), (item: TodoItem) => {
      ListItem() {
        Row() {
          Row({ space: 12 }) {
            Checkbox()
              .select(item.completed)
              .onChange((value: boolean) => {
                this.todoModel.toggleTodo(item.id);
              })

            Text(item.title)
              .fontSize(16)
              .decoration(item.completed ? TextDecorationType.LineThrough : TextDecorationType.None)
              .fontColor(item.completed ? Color.Gray : Color.Black)
          }

          Button('删除')
            .type(ButtonType.Circle)
            .fontSize(12)
            .backgroundColor(Color.Red)
            .onClick(() => {
              this.todoModel.deleteTodo(item.id);
            })
        }
        .width('100%')
        .padding(12)
        .justifyContent(FlexAlign.SpaceBetween)
        .backgroundColor(Color.White)
        .borderRadius(8)
      }
    }, (item: TodoItem) => item.id.toString())
  }
  .width('100%')
  .layoutWeight(1)
}
```

## 完整页面代码

```typescript
import { TodoModel, FilterType, TodoItem } from '../model/TodoModel';

@Entry
@Component
struct TodoPage {
  @State todoModel: TodoModel = new TodoModel();
  @State inputText: string = '';
  @State currentFilter: FilterType = FilterType.ALL;

  build() {
    Column() {
      this.Header()
      this.InputArea()
      this.FilterBar()
      this.TodoList()
    }
    .width('100%')
    .height('100%')
    .padding(16)
    .backgroundColor('#f5f5f5')
  }

  @Builder
  Header() { /* ... */ }

  @Builder
  InputArea() { /* ... */ }

  @Builder
  FilterBar() { /* ... */ }

  @Builder
  TodoList() { /* ... */ }
}
```

## 本章小结

- 使用 `Column`、`Row`、`List` 组合复杂页面布局。
- 使用 `@State` 管理页面状态。
- 使用 `@Builder` 拆分页面结构，提高可读性。
- 将数据层与 UI 层分离，实现清晰的代码架构。

:::details 仓颉写法
本实战页面的仓颉版本与 ArkTS 版本结构基本一致，主要差异：
- 使用 `class` 替代 `struct`
- 添加 `import kit.ArkUI.*` 和 `import ohos.arkui.state_macro_manage.*`
- `@Builder func name() { ... }` 定义构建函数
- `TextInput(placeholder: "...", text: inputText)` 使用命名参数
- `ForEach(arr, itemGeneratorFunc: { item, index => ... })` 使用仓颉语法
- `.width(100.percent)` 替代 `.width('100%')`
- `.onClick { evt => ... }` 替代 `.onClick(() => { ... })`

完整仓颉版待办列表可参考上述语法差异进行改写。
:::
