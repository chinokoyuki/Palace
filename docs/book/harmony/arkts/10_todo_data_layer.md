---
title: 实战：待办数据层
description: 使用 ArkTS 实现待办事项应用的数据模型与业务逻辑
order: 10
---

# 实战：待办数据层

本章综合运用前面所学的 ArkTS 知识，实现一个待办事项应用的数据层。

## 需求分析

待办事项应用需要支持以下功能：

- 添加待办事项
- 标记完成/未完成
- 删除待办事项
- 过滤显示全部/未完成/已完成

## 定义数据模型

使用接口定义待办事项的数据结构：

```typescript
export interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
  createTime: number;
}

export enum FilterType {
  ALL = '全部',
  ACTIVE = '未完成',
  COMPLETED = '已完成',
}
```

## 实现数据管理类

使用类封装待办事项的业务逻辑：

```typescript
export class TodoModel {
  private todos: TodoItem[] = [];
  private nextId: number = 1;

  addTodo(title: string): void {
    if (title.trim().length === 0) {
      return;
    }
    this.todos.push({
      id: this.nextId++,
      title: title.trim(),
      completed: false,
      createTime: Date.now(),
    });
  }

  toggleTodo(id: number): void {
    let todo = this.todos.find((item) => item.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter((item) => item.id !== id);
  }

  getTodos(filter: FilterType = FilterType.ALL): TodoItem[] {
    switch (filter) {
      case FilterType.ACTIVE:
        return this.todos.filter((item) => !item.completed);
      case FilterType.COMPLETED:
        return this.todos.filter((item) => item.completed);
      default:
        return this.todos;
    }
  }

  getActiveCount(): number {
    return this.todos.filter((item) => !item.completed).length;
  }
}
```

## 在页面中使用

```typescript
import { TodoModel, FilterType } from '../model/TodoModel';

@Entry
@Component
struct TodoPage {
  @State todoModel: TodoModel = new TodoModel();
  @State filter: FilterType = FilterType.ALL;
  @State inputText: string = '';

  build() {
    Column() {
      TextInput({ placeholder: '请输入待办事项', text: $$this.inputText })
        .onChange((value: string) => {
          this.inputText = value;
        })

      Button('添加')
        .onClick(() => {
          this.todoModel.addTodo(this.inputText);
          this.inputText = '';
        })

      List() {
        ForEach(this.todoModel.getTodos(this.filter), (item: TodoItem) => {
          ListItem() {
            Row() {
              Text(item.title)
                .decoration(item.completed ? TextDecorationType.LineThrough : TextDecorationType.None)

              Button('删除')
                .onClick(() => {
                  this.todoModel.deleteTodo(item.id);
                })
            }
            .width('100%')
            .justifyContent(FlexAlign.SpaceBetween)
          }
        }, (item: TodoItem) => item.id.toString())
      }
    }
    .padding(16)
  }
}
```

## 本章小结

- 使用接口定义数据结构。
- 使用类封装业务逻辑。
- 将数据层与 UI 层分离，便于维护和测试。
