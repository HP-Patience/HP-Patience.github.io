---
title: 【n8n】基于WSL2+Docker完整部署教程
date: 2026-05-12 12:22:27
tags:
  - agent
cover: /img/n8n.png
---


# 1 引言：为什么使用 n8n

> n8n 是一款**开源免费低代码自动化工作流工具**，支持可视化拖拽、对接海量第三方服务（数据库、企业微信、飞书、网盘、接口等），可自建部署、数据私有不托管，搭配 WSL2 + Docker 一键部署，轻量化不占用 Windows 主环境，方便日常自动化流程搭建、定时任务、数据同步等场景。


# 2 WSL 下载配置


## 2.1 WSL 内核更新

在 CMD/PowerShell 里输入：

```cmd
wsl --update
```

等待自动下载安装 WSL2 内核，跑完就好了。

## 2.2 手动安装 Ubuntu22.04（清华镜像离线导入）

使用[清华镜像源](https://mirrors.tuna.tsinghua.edu.cn/ubuntu-cloud-images/jammy/current/)进行下载，点击该链接后：
如果你电脑是 Windows 64 位，下滑找到`jammy-server-cloudimg-amd64-root.tar.xz`下载即可

1. 下载好后操作把文件放到：`F:\wsl\`，没有文件夹自行创建即可

2. 接着打开 CMD 或者 PowerShell创建文件夹，输入：

```cmd
mkdir F:\wsl\Ubuntu2204
```


3. 接着导入安装，运行：

```cmd
wsl --import Ubuntu-22.04 F:\wsl\Ubuntu2204 F:\wsl\jammy-server-cloudimg-amd64-root.tar.xz --version 2
```

等着跑完就行，几分钟搞定，直接装在 **F 盘**。

## 2.3 常见报错处理：

### 2.3.1 开启系统必要功能（管理员 PowerShell 逐条执行）

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
dism.exe /online /enable-feature /featurename:Hyper-V-Online /all /norestart
```

### 2.3.2 图形化检查 Windows 功能

1. 按下 `Win + R` 输入 `optionalfeatures.exe` 回车
2. 查看是否勾选下面 3 个，若无则**打勾**：

- ✅ Windows 子系统用于 Linux
- ✅ 虚拟机平台
- ✅ Hyper-V（能看到就勾）

确定后**重启电脑**。

![](Pasted image 20260512121830.png)

### 2.3.3 开启 CPU 虚拟化

重启开机马上按 **Del / F2 / F1** 进 BIOS：

- Intel 找：**Intel VT-x** 设为 Enabled
- AMD 找：**AMD-V / SVM Mode** 设为 Enabled

保存退出重启。

### 2.3.4 重新执行导入命令


```powershell
wsl --import Ubuntu-22.04 F:\wsl\Ubuntu2204 F:\wsl\jammy-server-cloudimg-amd64-root.tar.xz --version 2
```

# 3 Docker下载与配置

## 3.1 Docker Desktop下载

[Docker Desktop下载链接](https://www.docker.com/products/docker-desktop/)
## 3.2 Docker Resources

### 3.2.1 Advanced 设置

修改 `Disk image location`，把 Docker 存储路径迁移到**非 C 盘**。

![](Pasted image 20260512114819.png)
## 3.3 WSL integration 配置

开启对应 `Ubuntu-22.04` 的 WSL 集成，让 Docker 与 WSL 互通

![](Pasted image 20260512114718.png)
## 3.4 Docker Engine 镜像加速配置
粘贴以下完整配置，配置国内镜像源加速拉取：
```
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false,
  "features": {
    "buildkit": true
  },
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://docker.xuanyuan.me",
    "https://registry-1.docker.io"
  ]
}
```
配置后重启 Docker 生效。
![](Pasted image 20260512114943.png)

# 4 n8n 部署与使用
## 4.1 Docker 部署启动 n8n

在bash中输入docker命令：
1. 创建持久化数据卷
```bash
docker volume create n8n_data
```
2. 启动 n8n 容器（时区设为上海、端口映射、数据持久化）
```
docker run -it --rm ` --name n8n ` -p 5678:5678 ` -e GENERIC_TIMEZONE="Asia/Shanghai" ` -e TZ="Asia/Shanghai" ` -v n8n_data:/home/node/.n8n ` n8nio/n8n
```

3. 访问地址

浏览器打开：[http://localhost:5678/](http://localhost:5678/)

![](Pasted image 20260512115338.png)

同时在docker desktop中的Containers中出现该容器

![](Pasted image 20260512115207.png)

## 4.2 n8n 的webui界面操作

![](Pasted image 20260512115650.png)

![](Pasted image 20260512115812.png)

![](Pasted image 20260512115832.png)


# 5 参考文档：

1. [Docker | n8n Docs](https://docs.n8n.io/hosting/installation/docker/#prerequisites)
2. [GitHub | n8n-io/n8n](https://github.com/n8n-io/n8n)
