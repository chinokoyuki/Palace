---
title: 撰写文章
description: KoyukiStudyHub 的 Markdown 写作规范
order: 3
---

# 撰写文章

所有文章均为 Markdown 文件，存放在 `docs/` 目录下。

## 创建文章

新建文件：`docs/guide/my-article.md`

```markdown
---
title: 文章标题
description: 一句话描述
order: 1
---

# 正文大标题

正文内容……
```

## Frontmatter

| 字段 | 说明 |
|---|---|
| `title` | 文章标题，用于 SEO 与侧栏 |
| `description` | 一句话描述，用于 SEO |
| `order` | 章节内排序，数字越小越靠前 |

## 章节与折叠

章节在 `docs/.vitepress/config.ts` 中配置：

```ts
{
  text: '指南',
  collapsed: false,  // 默认展开；true 为默认折叠
  items: [
    { text: '介绍', link: '/guide/introduction' },
    { text: '快速开始', link: '/guide/getting-started' },
  ],
}
```

## 常用 Markdown

### 提示块

```markdown
::: tip 提示
这是一个提示块。
:::
```

::: tip 提示
这是一个提示块。
:::

### 代码块

````markdown
```ts
console.log('Hello Alice Future')
```
````

```ts
console.log('Hello Alice Future')
```

### 表格

| 字段 | 说明 |
|---|---|
| `title` | 标题 |
| `order` | 排序 |
