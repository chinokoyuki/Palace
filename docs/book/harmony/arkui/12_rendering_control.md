---
title: ArkUI 渲染控制
description: ArkUI 条件渲染、ForEach 与 LazyForEach 的使用与性能优化
order: 12
---

# ArkUI 渲染控制

ArkUI 提供了条件渲染（if/else）和循环渲染（ForEach、LazyForEach）两种渲染控制方式。理解它们的工作机制对编写高性能界面至关重要。

## 条件渲染 if/else

使用 `if`/`else if`/`else` 根据状态条件决定是否渲染某段 UI。

### 基本用法

```typescript
@Entry
@Component
struct ConditionDemo {
  @State count: number = 0;

  build() {
    Column() {
      Text(`当前计数：${this.count}`)

      if (this.count > 0) {
        Text('正数')
          .fontColor(Color.Green)
      } else if (this.count < 0) {
        Text('负数')
          .fontColor(Color.Red)
      } else {
        Text('零')
          .fontColor(Color.Gray)
      }

      Button('+1').onClick(() => this.count++)
      Button('-1').onClick(() => this.count--)
    }
  }
}
```

### 更新机制

当条件变化时，ArkTS 会执行以下操作：

1. 检测条件变化
2. 删除不再满足条件的旧组件
3. 创建满足条件的新组件

这意味着条件分支切换时，组件会被**销毁并重建**，之前的状态不会保留。

### 使用规则

- 条件必须使用**状态变量**，普通变量变化不会触发 UI 更新。
- 每个分支应创建有效的组件，不能写空函数。
- `if/else` 可以嵌套使用。
- `if/else` 必须在 `build()` 或 `@Builder` 函数内使用。

## ForEach 循环渲染

`ForEach` 基于数组数据源重复渲染 UI 组件，是构建动态列表的核心方式。

### 基本语法

```typescript
ForEach(
  arr: Array,                  // 数据源
  itemGenerator: (item, index) => void,  // 子组件生成函数
  keyGenerator?: (item, index) => string  // 键值生成函数
)
```

### 使用示例

```typescript
@State fruits: string[] = ['苹果', '香蕉', '橙子'];

Column() {
  ForEach(this.fruits, (fruit: string, index: number) => {
    Text(`${index + 1}. ${fruit}`)
      .fontSize(16)
      .padding(8)
  }, (fruit: string) => fruit)
}
```

### 键值生成函数

键值生成函数（第三个参数）非常重要，它决定了 ForEach 如何识别和复用组件：

- **必须提供稳定的唯一标识**，避免使用 `index` 作为键值。
- 键值相同 → 复用组件（仅更新变化部分）。
- 键值不同 → 销毁旧组件，创建新组件。

```typescript
interface TodoItem {
  id: number;
  title: string;
}

ForEach(this.todos, (item: TodoItem) => {
  Text(item.title)
}, (item: TodoItem) => item.id.toString())  // 使用 id 作为键值
```

### 数据更新

当数组被重新赋值时，ForEach 会根据键值对比差异并更新 UI：

```typescript
// ✅ 重新赋值触发更新
this.fruits = [...this.fruits, '葡萄'];

// ✅ 使用 splice 修改
this.fruits.splice(0, 1);
```

## LazyForEach 懒加载

当列表数据量很大时（如上千条），`ForEach` 会一次性创建所有组件，导致内存占用高和滚动卡顿。`LazyForEach` 只创建可视区域内的组件，滑出区域的组件会被回收。

### IDataSource 接口

LazyForEach 需要一个实现了 `IDataSource` 接口的数据源：

```typescript
class BasicDataSource implements IDataSource {
  private listeners: DataChangeListener[] = [];
  private dataArray: string[] = [];

  public totalCount(): number {
    return this.dataArray.length;
  }

  public getData(index: number): string {
    return this.dataArray[index];
  }

  registerDataChangeListener(listener: DataChangeListener): void {
    if (this.listeners.indexOf(listener) < 0) {
      this.listeners.push(listener);
    }
  }

  unregisterDataChangeListener(listener: DataChangeListener): void {
    let pos: number = this.listeners.indexOf(listener);
    if (pos >= 0) {
      this.listeners.splice(pos, 1);
    }
  }

  notifyDataReload(): void {
    this.listeners.forEach(listener => listener.onDataReloaded());
  }

  notifyDataAdd(index: number): void {
    this.listeners.forEach(listener => listener.onDataAdd(index));
  }

  notifyDataChange(index: number): void {
    this.listeners.forEach(listener => listener.onDataChange(index));
  }

  notifyDataDelete(index: number): void {
    this.listeners.forEach(listener => listener.onDataDelete(index));
  }
}
```

### 自定义数据源

```typescript
class MyDataSource extends BasicDataSource {
  private dataArray: string[] = [];

  public totalCount(): number {
    return this.dataArray.length;
  }

  public getData(index: number): string {
    return this.dataArray[index];
  }

  public addData(index: number, data: string): void {
    this.dataArray.splice(index, 0, data);
    this.notifyDataAdd(index);
  }

  public pushData(data: string): void {
    this.dataArray.push(data);
    this.notifyDataAdd(this.dataArray.length - 1);
  }
}
```

### 使用 LazyForEach

```typescript
@State dataSource: MyDataSource = new MyDataSource();

aboutToAppear() {
  for (let i = 0; i < 100; i++) {
    this.dataSource.pushData(`项目 ${i}`);
  }
}

build() {
  List() {
    LazyForEach(this.dataSource, (item: string) => {
      ListItem() {
        Text(item)
          .height(80)
          .padding(12)
      }
    }, (item: string) => item)
  }
  .width('100%')
  .height('100%')
  .cachedCount(5)  // 可视区域外缓存 5 个组件
}
```

### LazyForEach 限制

- 只能在 `List`、`Grid`、`Swiper`、`WaterFlow` 容器中使用。
- 每次迭代必须创建且只创建一个子组件。
- 数据变化必须通过 `DataChangeListener` 通知，直接修改数据源不会触发更新。

## ForEach vs LazyForEach

| 特性 | ForEach | LazyForEach |
| --- | --- | --- |
| 数据源 | 普通数组 | IDataSource 接口 |
| 渲染策略 | 一次性全量渲染 | 按需懒加载 |
| 适用数据量 | 小（几十条） | 大（上百上千条） |
| 更新方式 | 重新赋值触发 | DataChangeListener 通知 |
| 容器限制 | 无 | List/Grid/Swiper/WaterFlow |

## 本章小结

- `if/else` 实现条件渲染，条件变化时组件销毁并重建。
- `ForEach` 适合小数据量列表，必须提供稳定的键值。
- `LazyForEach` 适合大数据量列表，按需加载提升性能。
- 数据量小时用 `ForEach`，数据量大时用 `LazyForEach`。

:::details 仓颉写法
```cangjie
// ForEach 仓颉语法
ForEach(fruits, itemGeneratorFunc: { fruit, index =>
    Text("${index + 1}. ${fruit}")
        .fontSize(16)
        .padding(8)
}, keyGeneratorFunc: { fruit =>
    fruit
})

// LazyForEach 仓颉语法
LazyForEach(dataSource, itemGeneratorFunc: { item =>
    ListItem {
        Text(item)
            .height(80)
            .padding(12)
    }
}, keyGeneratorFunc: { item =>
    item
})

// 条件渲染
if (count > 0) {
    Text("正数").fontColor(Color.Green)
} else if (count < 0) {
    Text("负数").fontColor(Color.Red)
} else {
    Text("零").fontColor(Color.Gray)
}
```
:::
