# KoyukiStudyHub

> Pure Intelligence · Living Technology — 纯净智能，有生命的科技

一个类 GitBook 的 Markdown 文档站，基于 [VitePress](https://vitepress.dev/) 与 `alice-future/` 中的 **Alice Future Design System** 构建。

## 特性

- 左侧可折叠章节目录，右侧直接渲染 Markdown 内容
- Alice Future 视觉风格：玻璃材质、Future Blue 色板、蓝色光阴影
- 本地撰写 Markdown，Docker 打包部署到自有服务器与域名
- 一键 `deploy.sh` 重新构建并更新文章

## 快速开始

```bash
# 安装依赖
pnpm install

# 本地开发预览
pnpm dev

# 构建静态站点
pnpm docs:build

# 本地 Docker 验证（需安装 Docker）
docker compose up --build -d
```

## 项目结构

```
.
├── docs/                       # VitePress 文档源
│   ├── .vitepress/
│   │   ├── config.ts           # 站点与侧栏配置
│   │   └── theme/              # Alice Future 自定义主题
│   ├── guide/                  # 指南章节
│   ├── deploy/                 # 部署章节
│   ├── reference/              # 参考章节
│   ├── public/                 # 静态资源
│   └── index.md                # 首页
├── alice-future/               # UI 设计方案（已存在）
├── Dockerfile                  # 多阶段构建
├── docker-compose.yml          # 容器编排
├── nginx.conf                  # Nginx 托管配置
├── deploy.sh                   # 服务器一键更新脚本
└── package.json
```

## 部署到服务器

1. 将代码推送到 Git，服务器 clone 到 `/opt/KoyukiStudyHub`
2. 执行：

```bash
bash /opt/KoyukiStudyHub/deploy.sh
```

3. 配置域名 DNS 与反向代理（Nginx / Caddy）

详见 `docs/deploy/` 章节。

## 设计系统

UI 设计方案位于 `alice-future/` 文件夹：

- `alice-future/README.md` — 品牌与视觉基础
- `alice-future/colors_and_type.css` — Token
- `alice-future/components.css` — 组件样式
- `alice-future/specs/Alice Future Design System/Alice Future Design System.md` — 设计规范
