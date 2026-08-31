# 极简风格静态博客

由 [Eleventy](https://www.11ty.dev/) 生成纯静态页面：无框架、无客户端 JavaScript、无追踪，全站只有一个手写 CSS 文件。

## 快速开始

```bash
npm install        # 安装依赖（仅需一次）
npm run serve      # 本地开发：http://localhost:8080/，文件改动自动刷新
npm run build      # 生产构建：生成 _site/ 目录
```

## 目录结构

```
├── eleventy.config.js        # 构建配置：集合、过滤器、插件
├── package.json
└── src/
    ├── _data/
    │   ├── site.json         # 站点信息（名称、描述、URL）
    │   └── cats.json         # 板块映射（tech→技术 等）——单一数据源
    ├── _includes/            # 模板（Nunjucks）
    │   ├── base.njk          # HTML 骨架 + 页脚（全站共用）
    │   ├── index.njk         # 首页：居中标题 + Shortcuts 标签流 + 分类索引
    │   ├── post.njk          # 文章页
    │   ├── page.njk          # 独立页（关于我、友链）
    │   ├── category.njk      # 板块列表页
    │   ├── tag.njk           # 标签页
    │   └── changelog.njk     # 最近更新页
    ├── tech/                 # 技术板块（文章 + index.md 入口页）
    ├── essays/               # 随笔板块
    ├── photography/          # 摄影板块
    ├── static/
    │   ├── style.css         # 全站唯一样式文件
    │   └── img/              # 图片资源
    ├── index.md              # 首页入口
    ├── about.md              # 关于我
    ├── links.md              # 友链
    ├── changelog.md          # 最近更新入口
    ├── feed.njk              # RSS（/feed.xml，Atom 格式）
    └── tags.njk              # 标签页自动分页模板
```

## 写文章

在对应板块目录（`src/tech/`、`src/essays/`、`src/photography/`）新建 `.md` 文件，顶部带 front-matter：

```markdown
---
title: 文章标题
date: 2026-09-30
category: tech
tags: [标签1, 标签2]
desc: 一句话摘要（显示在分类页、标签页和 RSS）
layout: post
---

正文，支持标准 Markdown……
```

| 字段 | 说明 |
|---|---|
| `title` | 文章标题 |
| `date` | 发布日期，决定全站排序（首页"最近更新"、ChangeLog、RSS） |
| `category` | 所属板块：`tech` / `essays` / `photography` |
| `tags` | 标签。用于首页 Shortcuts（按频次取前 15，自动排除与分类同名的标签）和 `/tags/` 页 |
| `desc` | 一句话摘要 |
| `layout` | 固定 `post` |

**URL 规则**：文件名即网址。`src/tech/foo.md` → `/tech/foo/`。建议文件名用英文或拼音。

保存后自动收录进：首页对应板块、分类页、标签页、ChangeLog、RSS——无需任何手动操作。

### 摄影文章配图

1. 照片放进 `src/static/img/`
2. 正文引用：

```markdown
<img src="/static/img/照片.jpg" alt="描述">
```

### 剧透遮罩

默认模糊、悬停显示的文字（纯 CSS）：

```markdown
凶手是<span class="spoiler">管家</span>。
```

### 代码高亮

构建时静态着色（Eleventy 官方 syntaxhighlight 插件，无客户端 JS）。用标准围栏标记语言名即可：

````markdown
```python
print("hello")
```
````

## 修改站点信息

- **站名 / 描述 / URL**：`src/_data/site.json`。部署后把 `url` 改成真实域名（影响 RSS 内链接）
- **板块名 / 顺序**：`src/_data/cats.json`。改名、调顺序只动这一个文件，首页和文章页自动跟随；新增板块还需在 `eleventy.config.js` 的 `POST_GLOB` 与 `CATEGORIES` 中加上目录名，并建立 `src/<目录>/index.md`（参照现有板块入口页，front-matter 带 `indexPage: true`）
- **页脚**：`src/_includes/base.njk`（导航链接、版权、备案号）
- **关于我 / 友链**：`src/about.md`、`src/links.md`，普通 Markdown

## 页面一览

| 路径 | 内容 |
|---|---|
| `/` | 首页索引：站名、许可声明、最近更新 + RSS、Shortcuts 标签流、分类列表 |
| `/tech/` `/essays/` `/photography/` | 板块文章列表（标题 + 日期 + 摘要） |
| `/tags/<标签>/` | 标签聚合页（自动生成，支持中文标签） |
| `/changelog/` | 全站文章按日期倒序 |
| `/about/` `/links/` | 关于我、友链 |
| `/feed.xml` | Atom RSS（最近 20 篇） |

## 构建配置说明（eleventy.config.js）

- **集合**：`postList`（全站文章）、`tech` / `essays` / `photography`（各板块，排除入口页）、`shortcuts`（高频标签）、`tagList`（全量标签）
- **过滤器**：`isoDate`（日期格式化为 YYYY-MM-DD）、`byDateDesc`（标签集合倒序）
- **插件**：`@11ty/eleventy-plugin-rss`（feed 生成）、`@11ty/eleventy-plugin-syntaxhighlight`（代码高亮）
- `src/static/` 直通复制到输出

## 部署

1. `site.json` 的 `url` 改为真实域名
2. `npm run build`
3. 上传 `_site/` 内全部内容到任意静态托管（GitHub Pages / Netlify / Vercel / Cloudflare Pages 均可），无需服务器