# Story 页面使用说明

## 功能介绍

Story 页面是一个独立于首页的文章展示区域，用于记录日常生活和经历。标记为 `Story` 分类的文章将：
- **不显示在首页**主内容区域
- **显示在 Story 页面**，以卡片形式展示（和首页一样的样式）
- 支持分页功能

---

## 如何创建 Story 文章

### 方式一：手动创建

在 `source/_posts/` 目录下新建 `.md` 文件，添加以下 Front-matter：

```yaml
---
title: 文章标题
date: 2026-05-01 18:00:00
categories:
  - Story
tags:
  - 生活  # 可选，可以添加多个标签
---

这里是文章内容...
```

### 方式二：使用命令行生成

```bash
hexo new "我的故事标题"
```

然后编辑生成的文件，修改 Front-matter：

```yaml
---
title: 我的故事标题
date: 2026-05-01 18:00:00
categories:
  - Story
tags:
  - 生活
  - 旅行
---

文章内容...
```

> **注意**：必须添加 `categories: - Story`，否则文章会同时显示在首页！

---

## 访问 Story 页面

- 本地预览：`http://localhost:4002/story/`
- 部署后：`https://你的域名/story/`

---

## 技术实现说明

### 涉及的文件

| 文件 | 作用 |
|------|------|
| `_config.yml` | 配置 `hide_categories: Story` 隐藏首页文章 |
| `scripts/story-generator.js` | Story 页面生成器，过滤 Story 分类文章 |
| `themes/icarus/layout/story.jsx` | Story 页面布局模板 |
| `_config.icarus.yml` | 导航栏配置，包含 Story 菜单项 |

### 工作原理

1. **首页隐藏**：`hexo-generator-indexed` 插件读取顶层 `hide_categories` 配置，过滤掉指定分类的文章
2. **Story 页面展示**：自定义生成器 `story-generator.js` 筛选 `Story` 分类的文章，使用 `hexo-pagination` 生成分页数据
3. **页面渲染**：Icarus 主题的 `story.jsx` 布局文件复用首页的文章卡片组件

---

## 常见问题

### Q: 为什么文章还是显示在首页？

**A**: 检查以下几点：
1. 确认 `_config.yml` 中有顶层配置 `hide_categories: - Story`
2. 确认文章的 Front-matter 中有 `categories: - Story`
3. 运行 `hexo clean && hexo generate` 清除缓存后重新生成

### Q: Story 页面没有显示文章？

**A**: 检查以下几点：
1. 确认文章的 `categories` 包含 `Story`
2. 检查 `scripts/story-generator.js` 文件是否存在
3. 运行 `hexo clean && hexo generate` 重新生成

### Q: 可以在其他分类页面看到 Story 文章吗？

**A**: 是的。`hide_categories` 只影响首页，文章仍然会在归档页、分类页、标签页等地方显示。如果需要完全隐藏，可以考虑使用 `hexo-hide-posts` 插件。

### Q: 如何添加更多隐藏的分类？

**A**: 在 `_config.yml` 的 `hide_categories` 中添加即可：

```yaml
hide_categories:
  - Story
  - Diary  # 新增其他要隐藏的分类
```

---

## 示例文章模板

```yaml
---
title: 周末游记
date: 2026-05-03 20:00:00
categories:
  - Story
tags:
  - 生活
  - 旅行
cover: /img/旅行封面.jpg  # 可选，文章封面图
---

## 周末去了哪里

今天天气很好，和朋友一起去了...

## 有趣的事情

发生了这些有趣的事...

## 总结

这次旅行的感受...
```
