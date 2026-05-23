---
title: 【Git】项目协作开发教程
date: 2026-05-19 03:07:51
tags:
- Git
- 协作开发
cover: /img/Git_workflow_visualization_with_commits_and_branches.png
description: GitHub协作开发全流程指南，从Conventional Commit规范到Fork+PR贡献代码的标准化操作。
---


# 1 前言
> 近期，我在 GitHub 平台参与项目协同开发的过程中，系统掌握了规范的 Git 操作流程。从遵循 Conventional Commit 规范撰写提交信息，到将代码提交至 Fork 后的个人仓库，再到通过 Pull Request（PR）向上游原仓库贡献代码，每一个环节都经过实践打磨，逐步形成了标准化的操作习惯。为了梳理所学、方便后续查阅，同时也为有类似协作需求的开发者提供参考，特此整理这份 Git 操作指南，涵盖从基础配置到协作收尾的全流程，力求步骤清晰、重点突出、可直接使用。

# 2 Git 基础全局配置
在使用 Git 前，需先配置**全局用户名**和**邮箱**，这是提交代码时的身份标识，仅需配置一次。

```
# 配置全局用户名（替换为你的 GitHub 用户名）
git config --global user.name "Celyn"

# 配置全局邮箱（替换为你的 GitHub 绑定邮箱）
git config --global user.email "1249140039@qq.com"
```

## 2.1 验证配置是否成功
执行以下命令，查看已配置的用户名和邮箱：
```
# 查看用户名
git config user.name

# 查看邮箱
git config user.email
```

==注意==：请务必确认好本地 Git 用户配置是否生效。
> 小故事😢：
> 我在实验室电脑执行 git push、提交 PR 时，由于疏忽检查，提交记录带入电脑里留存的其他用户信息，导致 pr 时对方被设为共同作者，并且在我 fork 的仓库中显示上传 commit的用户并不是自己。所以一定要提前核对清楚本地个人账号信息，不然你的辛苦付出最后反倒会为他人做了嫁衣。


![](Pasted-image-20260519032430.png)
注：pr 里面多了个不知名的 xxxu680
# 3 Git 代理配置（解决 GitHub 下载慢）
若访问 GitHub 速度缓慢，可配置 **7897 端口代理**（本地常用代理端口），提升克隆、拉取代码的效率。

![](Pasted-image-20260519031146.png)
## 3.1 设置 7897 端口代理
适用于 http/https 协议下载 GitHub
```
# 配置 HTTP 代理
git config --global http.proxy http://127.0.0.1:7897

# 配置 HTTPS 代理
git config --global https.proxy https://127.0.0.1:7897
```

## 3.2 验证代理是否生效
```
# 查看 HTTP 代理
git config --global --get http.proxy

# 查看 HTTPS 代理
git config --global --get https.proxy
```

![](Pasted-image-20260519031247.png)
## 3.3 取消代理（备用）
若无需代理，可执行以下命令清除配置：
```
# 取消 HTTP 代理
git config --global --unset http.proxy

# 取消 HTTPS 代理
git config --global --unset https.proxy
```

# 4 Fork 仓库与本地初始化

## 4.1 Fork 上游仓库
以==我参与开发的项目==为例：
在 GitHub 上将目标仓库（如 `jihe520/MathModelAgent`）Fork 到**自己的账号**下，生成个人副本（如 `HP-Patience/MathModelAgent`）。

![](Pasted-image-20260519031658.png)
## 4.2 本地初始化仓库

### 4.2.1 方式 1：下载 ZIP 压缩包后初始化
1. 下载 Fork 后仓库的 `.zip` 压缩包，解压到本地目录；
2. 进入目录，执行 `git init` 初始化 Git 仓库；
3. 关联**自己的远程仓库（origin）** 和**上游原仓库（upstream）**：
```bash
# 关联自己的 Fork 仓库（origin）
git remote add origin https://github.com/HP-Patience/MathModelAgent.git

# 关联上游原仓库（upstream，用于同步最新代码）
git remote add upstream https://github.com/jihe520/MathModelAgent.git
```
4. 拉取最新代码到本地：
```bash
git pull origin main
```

### 4.2.2 方式 2：直接 Git Clone（推荐）
`git clone` 会**自动执行 git init + 关联远程仓库 + 下载完整最新代码**，无需手动初始化和拉取：
```bash
# 克隆自己的 Fork 仓库到本地
git clone https://github.com/HP-Patience/MathModelAgent.git
```

![](Pasted-image-20260519031751.png)
# 5 分支开发与代码提交

## 5.1 创建开发分支
**永远不要直接在 main 分支修改代码**，需创建独立开发分支：
```
# 创建并切换到 myfeat 分支（分支名可自定义）
git checkout -b myfeat
```

## 5.2 修改代码与提交
在 `myfeat` 分支完成代码修改后，提交变更：
```
# 添加所有修改文件
git add .

# 提交代码（添加清晰的提交信息）
git commit -m "feat: 完成XX功能开发"
```
==注意==：请使用 **conventional commit** 进行提交内容说明
# 6 同步上游更新与推送代码

## 6.1 场景 1：上游仓库无新提交
若原仓库（upstream）未更新代码，直接将本地分支推送到自己的远程仓库：
```
# 将 myfeat 分支推送到自己的 GitHub 仓库
git push origin myfeat
```

## 6.2 场景 2：上游仓库有新提交
若原仓库已更新，需**先同步上游代码**，再推送，避免冲突：
1. 切换回 main 分支，拉取上游最新代码：
```
git checkout main
git pull upstream main
```
2. 切换回开发分支，将上游代码合并到当前分支：
```
git checkout myfeat
git rebase main
```
3. 若出现 **rebase 冲突**，手动修改冲突文件后，继续 rebase；
4. 无冲突或冲突解决后，**强制推送**到自己的远程仓库（必须加 `-f`）：
```
git push -f origin myfeat
```

## 6.3 提交 PR 到上游仓库
1. 进入自己的 GitHub 仓库（`HP-Patience/MathModelAgent`）；
2. 点击 `Compare & pull request`，选择目标分支；
3. 填写 PR 说明，提交后等待原仓库作者审核即可。

# 7 PR 被合并后：同步代码 + 清理分支
当你的 PR 被上游仓库**合并完成**后，执行以下命令同步代码并清理无用分支：
```
# 1. 切换到本地 main 分支
git checkout main

# 2. 拉取上游最新代码（包含你刚合并的功能）
git pull upstream main

# 3. 删除本地已完成的开发分支（强制删除）
git branch -D myfeat

# 4.（可选）同步到你自己的远程 main 分支
git push origin main
```

![](Pasted-image-20260519031920.png)

---

## 7.1 常见问题提示
1. 代理报错 `URL拼写可能存在错误`：检查代理地址是否为 `127.0.0.1:7897`，确认本地代理服务已启动；
2. Rebase 冲突：打开冲突文件，删除冲突标记（`<<<<<<<`/`=======`/`>>>>>>>`），保留正确代码后重新执行；
3. 推送失败：确认分支权限，非 main 分支无需强制推送，更新上游后务必加 `-f` 强制推送。
4. 删除分支报错：使用大写 `-D` 强制删除已合并完成的开发分支。

---

# 8 总结
本文介绍了**从配置 → 克隆 → 开发 → 提交 → 同步 → 提PR → 清理**的**完整闭环 Git 协作流程**，所有命令都是团队开源协作最标准的用法，可以直接使用。
