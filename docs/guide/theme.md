---
title: 主题定制
description: Alice Future 设计系统在 VitePress 中的落地方式
order: 4
---

# 主题定制

本站视觉基于 `alice-future/` 文件夹中的 **Alice Future Design System**。

## 设计来源

- `alice-future/README.md` — 品牌叙事与视觉基础
- `alice-future/specs/Alice Future Design System/Alice Future Design System.md` — 设计规范
- `alice-future/colors_and_type.css` — CSS Token
- `alice-future/css.json` — 结构化 Token

## 主题文件

```
docs/.vitepress/theme/
├── index.ts                    # 主题入口
├── styles/
│   ├── alice-future.css        # Token 映射与全局覆盖
│   └── overrides.css           # 布局与组件微调
└── components/
    └── AIHero.vue              # AI Core 装饰组件
```

## 核心 Token

| Token | 值 | 用途 |
|---|---|---|
| `--af-future-blue` | `#3BA7FF` | 主交互色 |
| `--af-core-blue` | `#1769AA` | 强调色 |
| `--af-alice-sky` | `#8FD3FF` | 品牌浅色 |
| `--af-deep-space` | `#061A40` | 暗色背景 |
| `--af-shadow-sm` | `0 8px 24px rgba(23,105,170,0.12)` | 卡片阴影 |
| `--af-shadow-ai-glow` | `0 0 50px rgba(59,167,255,0.35)` | AI 光晕 |

> 设计原则：AI Glow 仅用于 AI Core 与激活状态，普通卡片使用 `shadow-sm`，保持单一光源。
