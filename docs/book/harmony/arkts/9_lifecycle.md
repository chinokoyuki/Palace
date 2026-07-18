---
title: ArkTS 生命周期
description: ArkTS 组件与页面的生命周期回调函数
order: 9
---

# ArkTS 生命周期

生命周期指组件从创建到销毁的整个过程。理解生命周期有助于在合适的时机执行初始化、资源释放等操作。

## 页面生命周期

页面生命周期由 `@Entry` 标记的页面组件拥有。

| 回调函数 | 触发时机 |
| --- | --- |
| `onPageShow` | 页面显示时触发 |
| `onPageHide` | 页面隐藏时触发 |
| `onBackPress` | 用户点击返回键时触发，返回 `true` 可拦截返回事件 |

### 示例

```typescript
@Entry
@Component
struct LifePage {
  @State message: string = '页面生命周期';

  onPageShow() {
    console.log('页面显示');
  }

  onPageHide() {
    console.log('页面隐藏');
  }

  onBackPress(): boolean {
    console.log('用户点击返回');
    return false;  // 返回 false 允许默认返回行为
  }

  build() {
    Column() {
      Text(this.message)
    }
    .width('100%')
    .height('100%')
  }
}
```

## 组件生命周期

普通 `@Component` 组件拥有以下生命周期回调：

| 回调函数 | 触发时机 |
| --- | --- |
| `aboutToAppear` | 组件即将显示时触发，适合执行初始化操作 |
| `aboutToDisappear` | 组件即将销毁时触发，适合释放资源 |

### 示例

```typescript
@Component
struct LifeComponent {
  aboutToAppear() {
    console.log('组件即将出现');
  }

  aboutToDisappear() {
    console.log('组件即将消失');
  }

  build() {
    Text('带生命周期的组件')
  }
}
```

## 生命周期执行顺序

假设一个页面中包含一个自定义组件，它们的执行顺序如下：

1. 页面 `aboutToAppear`
2. 子组件 `aboutToAppear`
3. 页面 `onPageShow`
4. 页面 `onPageHide`
5. 子组件 `aboutToDisappear`
6. 页面 `aboutToDisappear`

## 实战：页面进入时加载数据

```typescript
interface Article {
  id: number;
  title: string;
}

@Entry
@Component
struct ArticlePage {
  @State articleList: Article[] = [];

  aboutToAppear() {
    this.loadData();
  }

  loadData() {
    // 模拟网络请求
    setTimeout(() => {
      this.articleList = [
        { id: 1, title: 'ArkTS 入门' },
        { id: 2, title: 'ArkUI 布局' },
      ];
    }, 500);
  }

  build() {
    Column() {
      List() {
        ForEach(this.articleList, (item: Article) => {
          ListItem() {
            Text(item.title)
              .padding(12)
          }
        }, (item: Article) => item.id.toString())
      }
    }
    .width('100%')
    .height('100%')
  }
}
```

## 本章小结

- 页面生命周期包括 `onPageShow`、`onPageHide` 和 `onBackPress`。
- 组件生命周期包括 `aboutToAppear` 和 `aboutToDisappear`。
- 初始化数据通常放在 `aboutToAppear` 中执行。
