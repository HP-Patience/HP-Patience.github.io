# Firebase 后端管理系统部署指南

本文档详细介绍如何配置和使用基于Firebase的Hexo博客后端管理系统。

## 一、前置准备

### 1. Firebase 项目设置

1. **创建 Firebase 项目**：
   - 访问 [Firebase 控制台](https://console.firebase.google.com/)
   - 点击「添加项目」，按照提示创建新项目

2. **启用 Firestore**：
   - 在左侧菜单选择「Firestore 数据库」
   - 点击「创建数据库」，选择「测试模式」开始
   - 选择一个地理位置，完成创建

3. **配置 Storage**（用于媒体文件）：
   - 在左侧菜单选择「Storage」
   - 点击「开始使用」，设置规则并完成创建

4. **获取服务账号密钥**：
   - 点击右上角「设置」图标 >「项目设置」>「服务账号」
   - 点击「生成新的私钥」，下载 JSON 文件
   - 将下载的 JSON 文件重命名为 `serviceAccount.json`
   - 将该文件放置在博客根目录下

### 2. 安装依赖

```bash
npm install
```

## 二、配置管理系统

### 1. 修改 Firebase 配置

编辑 `source/js/custom.js` 文件中的 Firebase 配置：

```javascript
// 替换为你的 Firebase 配置
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
});
```

### 2. 修改 Firebase Admin 配置

编辑 `firebase-admin.js` 文件中的数据库 URL：

```javascript
databaseURL: 'https://your-project-id.firebaseio.com' // 替换为你的项目 URL
```

### 3. 设置允许登录的邮箱

在 `source/js/custom.js` 文件中修改允许登录的邮箱：

```javascript
const ALLOWED_EMAIL = '1249140039@qq.com'; // 根据需要修改
```

## 三、使用管理系统

### 1. 访问管理界面

启动 Hexo 服务器后，访问：

```
http://localhost:4000/admin/
```

### 2. 功能模块

#### 文章管理
- 添加新文章
- 编辑现有文章
- 删除文章
- 发布/取消发布文章
- 实时预览文章效果

#### 页面管理
- 添加/编辑/删除页面
- 页面设置（标题、布局等）

#### 媒体管理
- 上传图片、视频等媒体文件
- 管理媒体文件库
- 获取媒体文件链接

#### 设置
- 博客基本信息设置
- 标签和分类管理

#### 部署
- 手动触发部署
- 查看部署状态

### 3. 自动部署功能

#### 方式一：手动部署

```bash
node firebase-admin.js deploy
```

#### 方式二：监听模式（实时同步部署）

```bash
node firebase-admin.js watch
```

此模式会监听 Firestore 中的变化，当文章被修改时自动同步并部署。

## 四、Firestore 数据结构

### 1. articles 集合（文章）

```javascript
{
  id: "文章ID",
  title: "文章标题",
  content: "文章内容（Markdown格式）",
  date: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  tags: ["标签1", "标签2"],
  categories: ["分类1", "分类2"],
  published: true,
  description: "文章描述",
  cover: "封面图片URL",
  slug: "自定义URL"
}
```

### 2. pages 集合（页面）

```javascript
{
  id: "页面ID",
  title: "页面标题",
  content: "页面内容",
  date: "2024-01-01T00:00:00Z",
  layout: "页面布局",
  order: 0,
  published: true
}
```

### 3. deployments 集合（部署记录）

```javascript
{
  id: "current", // 当前部署状态
  status: "success|error|building",
  startTime: "2024-01-01T00:00:00Z",
  endTime: "2024-01-01T00:00:00Z",
  message: "部署消息"
}
```

## 五、安全注意事项

1. **保护 serviceAccount.json**：不要将此文件提交到版本控制中
2. **设置适当的 Firebase 安全规则**：生产环境应限制只有授权用户才能访问数据
3. **定期备份数据**：使用 Firebase 的导出功能定期备份 Firestore 数据

## 六、常见问题排查

### 1. 无法登录管理界面

- 检查 Firebase 配置是否正确
- 确认登录邮箱是否在允许列表中
- 检查浏览器控制台是否有错误信息

### 2. 部署失败

- 检查 `firebase-admin.js` 中的配置
- 确认 `serviceAccount.json` 文件存在且正确
- 检查网络连接和 GitHub 权限

### 3. 图片上传失败

- 确认 Firebase Storage 已正确配置
- 检查存储空间规则是否允许写入

## 七、扩展功能

### 1. 添加自定义字段

可以在 `source/js/admin-script.js` 中修改 `ArticleEditor` 类，添加自定义的文章字段。

### 2. 集成其他服务

可以扩展 `AdminSystem` 类，集成第三方服务，如评论系统、分析工具等。

## 八、后续优化方向

1. **添加用户角色系统**：区分管理员和编辑者权限
2. **实现内容版本控制**：记录文章修改历史
3. **添加批量操作功能**：批量删除、批量发布等
4. **优化编辑器体验**：添加更多 Markdown 快捷工具

---

如有任何问题，请参考 [Firebase 官方文档](https://firebase.google.com/docs) 或联系技术支持。