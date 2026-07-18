---
title: ArkUI 导航与路由
description: ArkUI Navigation 组件与 NavPathStack 路由管理
order: 10
---

# ArkUI 导航与路由

Navigation 是 ArkUI 提供的导航容器组件，用于管理页面间的路由跳转。它支持单栏（Stack）、分栏（Split）和自适应（Auto）三种显示模式，是构建多页面应用的标准方案。

## 基本结构

### 创建导航栈

每个 Navigation 需要绑定一个 `NavPathStack` 对象，用于管理页面栈。

```typescript
@Entry
@Component
struct Index {
  private pageStack: NavPathStack = new NavPathStack();

  build() {
    Navigation(this.pageStack) {
      Column() {
        Text('首页内容')
      }
    }
  }
}
```

### 三种显示模式

```typescript
Navigation(this.pageStack) {
  // ...
}
.mode(NavigationMode.Stack)   // 单栏模式，适合手机
// .mode(NavigationMode.Split)  // 分栏模式，适合平板
// .mode(NavigationMode.Auto)   // 自适应，宽度 < 600vp 用 Stack，>= 600vp 用 Split
```

## 配置路由表

### 创建路由映射文件

在 `resources/base/profile/` 目录下创建 `router_map.json`：

```json
{
  "routerMap": [
    {
      "name": "DetailPage",
      "pageSourceFile": "src/main/ets/pages/DetailPage.ets",
      "buildFunction": "buildDetailPage"
    }
  ]
}
```

### 在 module.json5 中注册

```json5
{
  "pages": "$profile:main_pages",
  "routerMap": "$profile:router_map"
}
```

## 目标页面结构

所有在路由表中注册的页面必须以 `NavDestination` 为根组件，并导出对应的 `@Builder` 函数。

```typescript
@Component
struct DetailPage {
  build() {
    NavDestination() {
      Column() {
        Text('详情页')
      }
    }
    .title('详情')
  }
}

@Builder
export function buildDetailPage() {
  DetailPage()
}
```

## 路由操作

### 跳转到新页面

```typescript
Button('跳转详情')
  .onClick(() => {
    this.pageStack.pushPath({ name: 'DetailPage' });
  })
```

### 携带参数跳转

```typescript
interface DetailParams {
  id: string;
}

Button('跳转详情')
  .onClick(() => {
    let params: DetailParams = { id: '123' };
    this.pageStack.pushPath({ name: 'DetailPage', param: params });
  })
```

在目标页面中获取参数：

```typescript
@Component
struct DetailPage {
  @State id: string = '';

  aboutToAppear() {
    let params = this.pageStack.getParamByName('DetailPage')[0] as DetailParams;
    this.id = params.id;
  }

  build() {
    NavDestination() {
      Text(`详情页 ID: ${this.id}`)
    }
  }
}
```

### 返回上一页

```typescript
Button('返回')
  .onClick(() => {
    this.pageStack.pop();
  })
```

### 替换当前页面

适用于登录页跳转首页后不希望用户返回登录页的场景：

```typescript
this.pageStack.replacePath({ name: 'HomePage' });
```

### 清空页面栈

```typescript
this.pageStack.clear();
```

## 常用路由方法

| 方法 | 说明 |
| --- | --- |
| `pushPath` | 入栈跳转 |
| `pushPathByName` | 通过名称跳转 |
| `pop` | 出栈返回上一页 |
| `popToName` | 返回到指定名称的页面 |
| `popToIndex` | 返回到指定索引的页面 |
| `replacePath` | 替换当前栈顶页面 |
| `clear` | 清空页面栈 |
| `moveToTop` | 将已有页面移到栈顶 |

## 导航栏配置

### 隐藏导航栏

单栏应用推荐隐藏默认导航栏，使用自定义标题栏：

```typescript
Navigation(this.pageStack) {
  // ...
}
.hideNavBar(true)
```

### 自定义导航栏标题

```typescript
NavDestination() {
  // ...
}
.title('页面标题')
.titleMode(NavigationTitleMode.Mini)
```

## 路由拦截

通过 `setInterception` 可以在跳转前拦截，实现登录鉴权等逻辑：

```typescript
aboutToAppear() {
  this.pageStack.setInterception({
    willShow: (from: NavDestination, to: NavDestination) => {
      if (to.name === 'PayPage' && !isLoggedIn()) {
        this.pageStack.replacePath({ name: 'LoginPage' });
      }
    }
  });
}
```

## 本章小结

- 使用 `Navigation` + `NavPathStack` 管理页面路由。
- 通过 `router_map.json` 配置路由映射表。
- 目标页面必须以 `NavDestination` 为根组件。
- 常用操作：`pushPath` 跳转、`pop` 返回、`replacePath` 替换。
- 使用 `setInterception` 实现路由拦截。

:::details 仓颉写法
```cangjie
import kit.ArkUI.*
import ohos.arkui.state_macro_manage.*

@Entry
@Component
class Index {
    var pageStack: NavPathStack = NavPathStack()

    func build() {
        Navigation(pageStack) {
            Column {
                Text("首页内容")
            }
        }
    }
}

// 路由跳转
Button("跳转详情")
    .onClick { evt =>
        pageStack.pushPath(name: "DetailPage")
    }

// 携带参数跳转
Button("跳转详情")
    .onClick { evt =>
        pageStack.pushPath(name: "DetailPage", param: DetailParams(id: "123"))
    }

// 返回
Button("返回")
    .onClick { evt =>
        pageStack.pop()
    }

// 目标页面
@Component
class DetailPage {
    @State var id: String = ""

    func aboutToAppear() {
        let params = pageStack.getParamByName("DetailPage")[0] as DetailParams
        id = params.id
    }

    func build() {
        NavDestination {
            Text("详情页 ID: ${id}")
        }
    }
}
```
:::
