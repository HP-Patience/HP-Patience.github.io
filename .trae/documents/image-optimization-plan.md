# 图片优化计划：懒加载 + WebP压缩

## 一、现状分析

| 功能     | 当前状态                      | 说明        |
| ------ | ------------------------- | --------- |
| 图片懒加载  | ❌ 未配置                     | 需要安装插件实现  |
| WebP压缩 | ❌ 未配置                     | 需要安装插件实现  |
| 现有插件   | hexo-renderer-markdown-it | 仅支持基础图片渲染 |

## 二、优化方案

### 2.1 图片懒加载 (Lazy Loading)

**插件**: `hexo-lazyload-image`

**功能**:

* 页面加载时只加载可视区域的图片

* 图片进入视口时才开始加载

* 提升页面首屏加载速度

* 减少初始HTTP请求

**配置**:

```yaml
lazyload:
  enable: true
  onlypost: false
  loadingImg: /img/loading.gif
```

### 2.2 WebP图片压缩

**插件**: `hexo-webp`

**功能**:

* 自动将JPG/PNG图片转换为WebP格式

* 保持原图质量的同时显著减小文件大小

* WebP格式通常比JPG小25-35%

* 自动生成`<picture>`标签支持降级

**配置**:

```yaml
webp:
  enable: true
  quality: 80
  alphaQuality: 80
  preset: default
  method: 4
```

## 三、执行步骤

### 步骤1: 安装依赖插件

```bash
npm install hexo-lazyload-image hexo-webp --save
```

### 步骤2: 配置懒加载 (\_config.yml)

添加懒加载配置

### 步骤3: 配置WebP压缩 (\_config.yml)

添加WebP配置

### 步骤4: 创建加载占位图（可选）

创建一个loading.gif或使用CSS动画

### 步骤5: 测试构建

确保构建正常，图片正确转换

## 四、预期效果

| 指标     | 优化前     | 优化后              |
| ------ | ------- | ---------------- |
| 首屏图片请求 | 全部加载    | 仅可视区域            |
| 图片格式   | JPG/PNG | WebP (降级JPG/PNG) |
| 图片大小   | 原始大小    | 减小25-35%         |
| 页面加载速度 | 较慢      | 显著提升             |

## 五、风险评估

| 风险      | 等级 | 应对措施           |
| ------- | -- | -------------- |
| 插件兼容性   | 低  | 使用Hexo官方推荐插件   |
| 构建失败    | 中  | 逐步配置并测试        |
| WebP兼容性 | 低  | 插件自动降级为JPG/PNG |

## 六、所需依赖

```json
{
  "hexo-lazyload-image": "^1.0.0",
  "hexo-webp": "^1.0.0"
}
```

