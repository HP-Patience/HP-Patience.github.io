# APlayer 音乐播放器使用指南

## 概述

本博客使用 [APlayer](https://github.com/DIYgod/APlayer) 作为全局固定式音乐播放器，播放器会**自动固定在页面左下角**，支持迷你模式和完整播放列表。

## 当前配置

- **位置**：页面左下角（`fixed: true`, `mini: true`）
- **模式**：循环播放全部歌曲（`loop: 'all'`）
- **音量**：50%（`volume: 0.5`）
- **主题色**：`#46718b`

## 歌曲管理

### 📁 文件结构

```
blog/source/
├── blog_music/                    # 音乐文件存放目录
│   ├── Collapsing World.mp3       # 音频文件
│   ├── Collapsing World.jpg       # 封面图片
│   ├── Daylight.mp3
│   ├── Daylight.jpg
│   ├── Kingdom Hearts • Xion's Theme.mp3
│   ├── Kingdom Hearts • Xion's Theme.jpg
│   ├── Komorebi.mp3
│   ├── Komorebi.jpg
│   ├── 愛-seto.mp3
│   └── 愛-seto.jpg
```

### ➕ 添加新歌曲

#### 第一步：准备音频和封面

1. 将 `.mp3` 音频文件放入 `source/blog_music/` 目录
2. 准备对应的封面图片（`.jpg` 或 `.png`），**建议尺寸 300x300 像素**
3. 封面图片命名必须与音频文件名一致（扩展名除外）

> ⚠️ **重要提示**：文件名中**不要包含空格或特殊字符**（如 `•` `'` `!` 等）。如果已有空格字符，需要在代码中进行 URL 编码。

#### 第二步：编辑配置文件

打开 `themes/icarus/layout/plugin/aplayer.jsx`，在 `audio` 数组中添加新的歌曲对象：

```js
audio: [
    // 已有歌曲...
    {
        name: '歌曲名称',
        artist: '歌手/艺术家',
        url: '${musicPath}歌曲文件名.mp3',     // 注意 URL 编码
        cover: '${musicPath}封面文件名.jpg'    // 注意 URL 编码
    },
    {
        name: '我的新歌',           // 示例：添加一首新歌
        artist: '某歌手',
        url: '${musicPath}MyNewSong.mp3',
        cover: '${musicPath}MyNewSong.jpg'
    }
]
```

#### 第三步：URL 编码规则

如果你的文件名包含中文或特殊字符，需要进行 URL 编码：

| 原始字符 | 编码后 |
|---------|--------|
| 空格 | `%20` |
| • (圆点) | `%E2%80%A2` |
| ' (单引号) | `%27` 或 `\'` |
| 中文「愛」 | `%E6%84%9B` |

**快速编码方法**：在浏览器控制台输入 `encodeURIComponent('你的文件名')` 即可获取编码结果。

#### 第四步：重新生成

```bash
npx hexo clean && npx hexo g
```

然后本地预览 `npx hexo s` 或部署 `npx hexo d`。

---

### ❌ 删除歌曲

#### 方法一：从配置中移除（推荐）

在 `themes/icarus/layout/plugin/aplayer.jsx` 的 `audio` 数组中，删除对应歌曲的整个对象块：

```js
// 删除前
audio: [
    { name: '要删除的歌曲', artist: 'xxx', url: '...', cover: '...' },  // ← 删除这行
    { name: '保留的歌曲', ... }
]

// 删除后
audio: [
    { name: '保留的歌曲', ... }
]
```

#### 方法二：完全移除（包括文件）

1. 从 `source/blog_music/` 目录删除对应的 `.mp3` 和 `.jpg` 文件
2. 从 `aplayer.jsx` 的 `audio` 数组中删除对应配置
3. 执行 `npx hexo clean && npx hexo g`

---

### ✏️ 修改歌曲信息

#### 修改显示名称或歌手

直接编辑 `themes/icarus/layout/plugin/aplayer.jsx` 中对应歌曲的 `name` 和 `artist` 字段：

```js
{
    name: '新的歌曲名称',    // ← 修改这里
    artist: '新的歌手名',    // ← 修改这里
    url: '${musicPath}原有文件名.mp3',   // URL 不变
    cover: '${musicPath}原有封面.jpg'    // Cover 不变
}
```

#### 替换音频/封面文件

1. 将新的 `.mp3` 或 `.jpg` 文件放入 `source/blog_music/` 目录
2. **保持文件名不变**（直接覆盖同名文件），或者：
   - 使用新文件名，同时更新 `aplayer.jsx` 中的 `url` 和 `cover` 路径
3. 执行 `npx hexo clean && npx hexo g`

---

## 高级配置选项

以下参数可在 `themes/icarus/layout/plugin/aplayer.jsx` 中调整：

```js
new APlayer({
    container: container,
    fixed: true,           // 固定模式（true/false）
    mini: true,            // 迷你模式（true/false）
    autoplay: false,       // 自动播放（注意：大多数浏览器会阻止）
    theme: '#46718b',      // 主题颜色（十六进制）
    loop: 'all',           // 循环模式: 'all' 全部循环 / 'one' 单曲循环 / 'none' 不循环
    order: 'list',         // 播放顺序: 'list' 列表顺序 / 'random' 随机
    preload: 'auto',       // 预加载: 'auto' / 'metadata' / 'none'
    volume: 0.5,           // 音量（0~1）
    mutex: true,           // 互斥：暂停其他播放器
    listFolded: true,      // 默认折叠播放列表
    audio: [...]           // 歌曲列表
});
```

## 常见问题

### Q: 播放器不显示？

1. 确认 `_config.icarus.yml` 中有 `aplayer: true`
2. 检查浏览器控制台是否有报错（F12 → Console）
3. 确认 `npx hexo clean && npx hexo g` 已执行

### Q: 歌曲无法播放？

1. 检查音频文件路径是否正确（F12 → Network 标签查看 404 错误）
2. 确认文件名中的特殊字符已进行 URL 编码
3. 部分浏览器可能不支持某些音频格式（推荐 MP3）

### Q: 如何更换播放器位置？

当前设置为左下角。如需改为右下角，修改 `aplayer.jsx` 中的容器样式：

```js
// 左下角（当前）
container.style.cssText = 'position:fixed;left:0;bottom:0;z-index:99999;width:400px;';

// 右下角
container.style.cssText = 'position:fixed;right:0;bottom:0;z-index:99999;width:400px;';
```

### Q: 如何调整播放器宽度？

修改容器样式中的 `width` 值（默认 `400px`），迷你模式下默认宽度较小。
