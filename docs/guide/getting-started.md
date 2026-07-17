---
title: 快速开始
description: 在本地启动 KoyukiStudyHub
order: 2
---

# 快速开始

## 环境要求

- Node.js >= 18
- pnpm（推荐）或 npm
- Docker（用于生产部署）

## 安装依赖

```bash
pnpm install
```

## 本地预览

```bash
pnpm dev
```

打开 `http://localhost:5173` 即可预览站点。

## 构建静态站点

```bash
pnpm docs:build
```

构建产物位于 `docs/.vitepress/dist/`。

## 本地 Docker 验证

```bash
docker compose up --build -d
```

访问 `http://localhost:8080` 查看容器化效果。

## 下一步

- 阅读 [撰写文章](writing.md) 了解 Markdown 写作规范
