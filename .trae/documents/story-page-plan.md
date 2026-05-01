# Story页面文章显示方案

## 需求分析

用户希望上传的指定md文件显示在Story页面，而不显示在Home（首页）页面。

## 推荐方案：使用 hexo-generator-indexed 插件

### 方案说明

`hexo-generator-indexed` 是 `hexo-generator-index` 的增强版本，原生支持：

* `hide: true` - 隐藏单篇文章

* `hide_categories` - 隐藏整个分类的文章

### 实施步骤

#### 步骤1：替换首页生成器插件

```bash
npm uninstall hexo-generator-index
npm install hexo-generator-indexed
```

#### 步骤2：修改 \_config.yml 配置

在 `_config.yml` 中添加：

```yaml
index_generator:
  path: ''
  per_page: 10
  order_by: -date
  hide_categories:
    - Story
```

#### 步骤3：创建 Story 分类文章

在想要显示在 Story 页面的文章 Front-matter 中添加：

```yaml
---
title: 我的故事文章
date: 2026-05-01 17:00:00
categories:
  - Story
---
```

#### 步骤4：修改 Story 页面显示该分类文章

修改 `source/story/index.md`，使用 Hexo 模板语法列出 Story 分类的文章：

```yaml
---
title: Story
date: 2026-05-01 17:04:00
type: "story"
---

## 📖 我的故事

这里记录我的日常生活与经历。

{% for post in site.categories.Story %}
  <article class="story-item">
    <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
    <time>{{ post.date | date: "%Y-%m-%d" }}</time>
    <p>{{ post.excerpt }}</p>
  </article>
{% endfor %}
```

***

## 备选方案：使用 hexo-hide-posts 插件

### 方案说明

`hexo-hide-posts` 提供更细粒度的控制，可以配置哪些生成器可以访问隐藏的文章。

### 实施步骤

#### 步骤1：安装插件

```bash
npm install hexo-hide-posts
```

#### 步骤2：配置 \_config.yml

```yaml
hide_posts:
  enable: true
  filter: hidden
  noindex: false
  allowlist_generators: ['*']
  blocklist_generators: ['index']
```

#### 步骤3：在文章中标记隐藏

```yaml
---
title: 我的故事文章
date: 2026-05-01 17:00:00
hidden: true
---
```

***

## 文件修改清单

| 文件                      | 操作                                   |
| ----------------------- | ------------------------------------ |
| `package.json`          | 替换/添加插件依赖                            |
| `_config.yml`           | 添加 hide\_categories 或 hide\_posts 配置 |
| `source/story/index.md` | 修改为模板页面，显示特定分类文章                     |
| 文章 md 文件                | 添加 categories: Story 或 hidden: true  |

***

## 注意事项

1. 替换插件后需要运行 `hexo clean` 清除缓存
2. Story 页面需要使用模板语法来显示文章列表
3. 如果使用 `hexo-hide-posts`，隐藏的文章仍可通过直接链接访问

