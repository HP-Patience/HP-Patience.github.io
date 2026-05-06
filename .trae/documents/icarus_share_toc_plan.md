# Icarus 主题 Share 和 Table of Contents 配置方案

## 一、需求分析

用户希望在博客中配置：
1. **Share（分享功能）**：在文章底部添加分享按钮
2. **Table of Contents（目录）**：在侧边栏显示文章目录

## 二、配置方案

### 2.1 Share 配置

选择 AddToAny 分享服务（无需 API Key，开箱即用）：

```yaml
share:
    type: addtoany
```

### 2.2 Table of Contents 配置

在右侧侧边栏添加目录 widget：

```yaml
widgets:
    - position: right
      type: toc
      post: true
      collapsed: false
      depth: 3
```

## 三、修改步骤

1. 编辑 `_config.icarus.yml`
2. 添加 share 配置块
3. 在 widgets 数组中添加 toc widget

## 四、预期效果

- 文章底部显示分享按钮（支持多种社交平台）
- 右侧侧边栏显示文章目录导航
- 目录支持自动折叠/展开

## 五、风险提示

- 当前主题 schema 文件不完整，可能需要完整安装主题依赖
- 如果配置后出现验证错误，可能需要调整配置项