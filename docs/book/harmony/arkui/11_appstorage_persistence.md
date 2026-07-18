---
title: ArkUI 应用级状态管理
description: AppStorage、PersistentStorage、LocalStorage 与 Environment
order: 11
---

# ArkUI 应用级状态管理

前面的章节介绍了组件级的状态管理装饰器（`@State`、`@Prop`、`@Link`、`@Provide`/`@Consume`）。当需要在应用级别或跨页面共享状态时，需要使用 AppStorage、PersistentStorage 和 LocalStorage。

## 状态管理分层

| 层级 | 工具 | 作用范围 |
| --- | --- | --- |
| 组件内部 | `@State` | 单个组件 |
| 父子组件 | `@Prop`、`@Link` | 父子之间 |
| 跨层级组件 | `@Provide`/`@Consume` | 组件树内 |
| 页面级 | `LocalStorage` | UIAbility 内页面间 |
| 应用级 | `AppStorage` | 全局进程内 |
| 持久化 | `PersistentStorage` | 磁盘持久存储 |
| 环境变量 | `Environment` | 设备环境参数 |

## AppStorage

AppStorage 是应用全局的 UI 状态存储，由 UI 框架在应用启动时创建，是应用进程内的单例。所有页面和组件都可以访问。

### 写入数据

```typescript
AppStorage.setOrCreate('token', 'abc123');
AppStorage.setOrCreate('isLogin', false);
AppStorage.setOrCreate('count', 0);
```

### @StorageProp（单向同步）

`@StorageProp` 建立从 AppStorage 到组件的**单向**数据同步。AppStorage 变化会同步到组件，但组件修改不会同步回 AppStorage。

```typescript
@Component
struct Header {
  @StorageProp('isLogin') isLogin: boolean = false;

  build() {
    Text(this.isLogin ? '已登录' : '未登录')
  }
}
```

### @StorageLink（双向同步）

`@StorageLink` 建立 AppStorage 与组件之间的**双向**数据同步。

```typescript
@Entry
@Component
struct CounterPage {
  @StorageLink('count') count: number = 0;

  build() {
    Column() {
      Text(`计数：${this.count}`)
      Button('+1')
        .onClick(() => {
          this.count++;
        })
    }
  }
}
```

## LocalStorage

LocalStorage 是页面级的 UI 状态存储，通常用于 UIAbility 内、页面间共享状态。

### 创建与绑定

```typescript
let storage: LocalStorage = new LocalStorage();
storage.setOrCreate('theme', 'blue');

@Entry(storage)
@Component
struct PageA {
  @LocalStorageProp('theme') theme: string = 'blue';

  build() {
    Column() {
      Text(`主题：${this.theme}`)
    }
  }
}
```

### @LocalStorageProp / @LocalStorageLink

- `@LocalStorageProp`：单向同步，LocalStorage → 组件。
- `@LocalStorageLink`：双向同步，LocalStorage ↔ 组件。

```typescript
@Component
struct Child {
  @LocalStorageLink('theme') theme: string = 'blue';

  build() {
    Text(`子组件主题：${this.theme}`)
      .onClick(() => {
        this.theme = 'red';  // 会同步回 LocalStorage
      })
  }
}
```

## PersistentStorage

PersistentStorage 将选定的 AppStorage 属性持久化到设备磁盘上。应用退出后再次启动，数据依然存在。

### 基本用法

```typescript
PersistentStorage.persistProp('isFirstLaunch', true);
PersistentStorage.persistProp('userName', '');

@Entry
@Component
struct LaunchPage {
  @StorageLink('isFirstLaunch') isFirstLaunch: boolean = true;
  @StorageLink('userName') userName: string = '';

  build() {
    Column() {
      if (this.isFirstLaunch) {
        Text('欢迎使用！')
        Button('开始使用')
          .onClick(() => {
            this.isFirstLaunch = false;
          })
      } else {
        Text(`欢迎回来，${this.userName}`)
      }
    }
  }
}
```

### 注意事项

- 持久化变量建议小于 2KB，大量数据应使用数据库 API。
- 不支持嵌套对象（对象数组、对象的属性是对象等）。
- 持久化是同步操作，避免频繁变化的变量持久化。

## Environment

Environment 是框架创建的单例，提供设备环境参数，如深浅色模式、语言等。环境变量会写入 AppStorage，通过 `@StorageProp` 读取。

### 读取环境变量

```typescript
Environment.envProp('colorMode', ColorMode.LIGHT);

@Entry
@Component
struct ThemePage {
  @StorageProp('colorMode') colorMode: ColorMode = ColorMode.LIGHT;

  build() {
    Column() {
      Text(this.colorMode === ColorMode.DARK ? '深色模式' : '浅色模式')
    }
    .backgroundColor(this.colorMode === ColorMode.DARK ? '#1a1a1a' : '#ffffff')
  }
}
```

### 内置环境变量

| 键 | 类型 | 说明 |
| --- | --- | --- |
| `accessibilityEnabled` | boolean | 无障碍是否启用 |
| `colorMode` | ColorMode | 深浅色模式 |
| `fontScale` | number | 字体大小比例 |
| `fontWeightScale` | number | 字体粗细比例 |
| `layoutDirection` | LayoutDirection | 布局方向 |
| `languageCode` | string | 系统语言 |

## 使用建议

1. **优先使用 AppStorage** 进行全局状态管理。
2. **使用顺序**：先 `PersistentStorage.persistProp()`，再 `AppStorage.setOrCreate()`，避免持久化值被覆盖。
3. **Environment 变量名**不要与 AppStorage 中已有属性重名。
4. **非 UI 通信**不要通过状态装饰器，推荐使用 `emitter` 方式。

## 本章小结

- `AppStorage` 是应用全局状态存储，配合 `@StorageProp`/`@StorageLink` 使用。
- `LocalStorage` 是页面级状态存储，配合 `@LocalStorageProp`/`@LocalStorageLink` 使用。
- `PersistentStorage` 实现磁盘持久化，与 AppStorage 双向同步。
- `Environment` 提供设备环境参数，写入 AppStorage 后读取。

:::details 仓颉写法
仓颉 ArkUI 的状态管理装饰器名称与 ArkTS 相同（`@State`、`@Prop`、`@Link`、`@StorageProp`、`@StorageLink`、`@LocalStorageProp`、`@LocalStorageLink`），但导入方式不同，需通过 `import ohos.arkui.state_macro_manage.*` 引入。AppStorage、PersistentStorage、LocalStorage、Environment 的 API 调用方式与 ArkTS 一致。

主要差异：
- 组件使用 `class` 而非 `struct`
- 变量声明使用 `var`/`let`
- `@State var count: Int64 = 0` 替代 `@State count: number = 0`
- `@StorageLink('count') var count: Int64 = 0` 替代 `@StorageLink('count') count: number = 0`
```cangjie
import kit.ArkUI.*
import ohos.arkui.state_macro_manage.*

@Entry
@Component
class CounterPage {
    @StorageLink("count") var count: Int64 = 0

    func build() {
        Column {
            Text("计数：${count}")
            Button("+1")
                .onClick { evt =>
                    count += 1
                }
        }
    }
}
```
:::
