---
title: Hexo搭建实遇问题
date: 2024-05-13 02:24:03
tags:
categories: 
- Blog搭建
---



# 1.spawn_failed问题



## 原因分析：



其实出现这个问题，很大可能是因为https和http的proxy的对应的分别是https和http开proxy server，

而https的proxy server可能无法正常工作。



## 解决办法：


修改_config.yml文件的deploy部分，将https 修改为http url 或者 设置为git url, 配置为https oauth2 加token

- 设置为git url(推荐) 亲测有效

```text
    deploy:
        type: git
        repo: git@github.com:your_github_id/your_github_id.github.io.git
        branch: gh-pages
```



# 2.头像无法显示问题



## 原因分析：



不明原因，猜测是路径问题



## 解决方法1：

1. 将想要显示的头像图片存入本地文件夹
2. 在根目录下进入git bash使用hexo g和hexo d上传代码到github仓库
3. 在github仓库找到该图片，鼠标右键复制图片链接
4. 修改主题配置文件，如我修改的为config.butterfly.yml文件

```YAML
#Avatar (頭像)
avatar:
  img: 输入你复制的图片链接
  # effect为true 则鼠标放于图片上，会使图片一直旋转
  effect: false
```



## 解决方法2：

更改默认头像路径

默认路径：`"C:\Users\陈荣伟\Desktop\Blog\Hexo-blog\blog\themes\butterfly\source\img\friend_404.gif"`

把需要的 头像 名称改为`friend_404.gif`，把`friend_404.gif` 重命名 成别的即可



_config.butterfly.yml内的配置文件

```YAML
# Replace Broken Images (替换无法显示的图片)
error_img:
  flink: /img/friend_404.gif
  post_page: /img/404.jpg
```



# 3.本地预览正常，但部署到GitHub 网站背景图片不加载



## 解决方法：



1. 分清背景图片是放在本地还是别处？
2. 记得用图片的网络链接，确保图片地址没有错误。
3. 然后**清除浏览器缓存**再试试

## hexo clean命令

```undefined
hexo clean
```

清除缓存文件 `db.json` 和已生成的静态文件 `public`。

- 网站显示异常时可以执行这条命令试试。

接着依次运行代码：

```
hexo g
```

```
hexo d
```

## 终极方法

删除`.deploy_git`和`public`文件



# 4.插入图片的显示问题

参考文章：

[在hexo博客中插入图片的方法_hexo插入图片-CSDN博客](https://blog.csdn.net/2301_77285173/article/details/130189857)

插入图片的方法
在完成了博客搭建、发布文章后，如果我们想在文章中插入图片，该怎么做呢？



如果图片保存在本地

## 方法一：全局资源文件夹
即，将所有文章的资源统一用一个全局资源文件夹管理。

此方法的优点是比较简便，并且当多篇文章需要引用同一资源时，也比较方便。

缺点是当文章很多时，各个文章的图片都在同一文件夹，不便管理。

**具体方法**：
在hexo文件夹下的source目录下，新建一个文件夹叫images(名字随意)，将要插入的图片放在该文件夹中。
md文档内，使用`![图片](图片链接地址)`的格式，圆括号内的链接地址写`(/images/name.jpeg)`。
这里的 / 指的是根目录，对于hexo，资源文件的根目录就是source(可以在config文件里修改资源的根目录)

例如，在md文档中写：`![图片](/images/20.jpeg "甘雨")`
同时将“20.jpeg”这个图片文件放在hexo文件夹`/source/images`下，则图片可以上传到博客。



## 方法二：文章资源文件夹

即，对于每篇文章，使用一个文件夹管理资源。

此方法的优点是，当文章很多时，便于结构化管理。

缺点是，比方法一麻烦一点。

**具体方法**：

2.1 修改hexo文件夹中的_config.yml文件，如下：

```YAML
post_asset_folder: true
marked:
  prependRoot: true
  postAsset: true

```

2.2 在终端cd到hexo文件夹，`hexo new 文章名   `命令创建一篇新文章，此时会在hexo文件夹的source目录下，自动创建一个文件夹和文章名.md文件。

**注**：如果文章名中有空格，务必将整个文章名用双引号引起来。如果文章名中没有空格，可以加双引号，也可以不加。

例如，执行hexo new "如何发布文章到hexo博客上"，如下：


会在`source/_post`文件夹下生成一个"如何发布文章到hexo博客上.md"文件。如下：

可以看到，同时还生成了一个同名的资源文件夹。

2.3 我们可以将所有与该文章有关的资源（包括图片）放在这个关联文件夹中
2.4 通过**相对路径**来引用图片资源。

例如，将“1.jpeg”这个图片资源放在该文件夹中，并在.md文件中像这样引用图片：`![图片](1.jpeg)`，这个方法在资源较多时方便管理。



另附Typora编辑器中不显示图片的解决方案：
安装下面的插件，可以使Typora等Markdown编辑器预览以及Hexo发布预览时，均能正常显示图片。
`npm install hexo-asset-img --save`
这样，如果你使用Typora编辑markdown文档，在typora内也可以显示图片了。



# 5.4000端口占用问题

## 查看端口:

```
netstat -ano
```

```
    每一列分别对应：协议、本地地址、外部地址、状态、PID  

  参数详解：
    -a            显示所有连接和侦听端口。
    -n            以数字形式显示地址和端口号。
    -o            显示拥有的与每个连接关联的进程 ID。
```

注：其余参数可使用help命令查看：

`netstat -help`

​        查询出的端口数量很多，我们可使用findstr命令进行过滤：

```
netstat -ano | findstr "被占用的端口"
```

## **释放被占用的端口**：

​      过滤出需要释放的端口后，在cmd窗口输入`task kill命令 `可释放被占用的端口：

```
taskkill -f -t /pid "占用端口的程序的pid"
```



# 6.网页渲染Latex问题

修改主题配置文件`_config.butterfly.yml`：

```YAML
mathjax:
  enable: true
  # true 表示每一頁都加載mathjax.js
  # false 需要時加載，須在使用的Markdown Front-matter 加上 mathjax: true
  per_page: false
```

以下操作在你 hexo 博客的目录下 (不是 Butterfly 的目录):

1. 安装插件

```BASH
npm uninstall hexo-renderer-marked --save
npm install hexo-renderer-kramed --save
```

2. 配置 hexo 根目录的配置文件`_config.yml`

```YAML
kramed:
  gfm: true
  pedantic: false
  sanitize: false
  tables: true
  breaks: true
  smartLists: true
  smartypants: true
```



# 7.引入CSS文件

打开config.butterfly.yml文件

CTRL+F 搜索下面的代码，增加`<link>`标签即可

```YAML
inject:
  head:
    # - <link rel="stylesheet" href="/xxx.css">
    - <link rel="stylesheet" href="/css/categories_dark_fit.css">
    - <link rel="stylesheet" href="/css/butterfly_article_double_row.css">
  bottom:
    # - <script src="xxxx"></script>
```

