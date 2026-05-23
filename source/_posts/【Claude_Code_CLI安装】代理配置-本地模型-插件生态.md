---
title: 【Claude_Code_CLI安装】代理配置-本地模型-插件生态
date: 2026-05-23 18:03:20
tags:
- Claude Code
- AI工具
cover: /img/Claude_Code_CLI安装.png
description: Claude Code CLI完整安装指南，涵盖代理配置、DeepSeek/本地模型接入、内网穿透及插件生态。
---

# 1 前言

> 最近在使用Claude Code (简称 cc )帮助我进行日常学习、项目开发，本文记录下 Claude Code CLI 的安装、DeepSeek 模型配置、llama.cpp 本地模型内网穿透后进行公网连接的操作，最后简单提及下 skill、plugin 等功能的安装，后续也会更新下 cc 的一些进阶操作。

---

# 2 安装

先安装 [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) 与 [Node.js](https://nodejs.org/zh-cn)。

```powershell
# 国内用户（winget 源）
winget install Anthropic.ClaudeCode

# 官方渠道（npm 全局安装）
npm install -g @anthropic-ai/claude-code
```

安装完成后，在终端输入 `claude` 即可启动。

---

# 3 `cc switch` 多模型配置切换

下载：[CC Switch](https://www.ccswitch.io/zh/)

`cc switch` 用于在多个模型配置之间快速切换，并对齐模型所需格式。

![](Pasted-image-20260523155037.png)

# 4 配置 DeepSeek 兼容端点

Claude Code 默认走 Anthropic 官方 API，但也可以通过自定义端点接入 DeepSeek 等兼容模型，降低成本。

## 4.1 获取 API Key

前往 [DeepSeek 开放平台](https://platform.deepseek.com/usage) 申请 API Key，然后在 Claude Code 中配置。

## 4.2 配置自定义端点

使用 `cc switch` 创建一套新配置，填入 DeepSeek 的 API 地址和 Key 即可。

> 注意：DeepSeek 兼容的是 OpenAI API 格式，Claude Code 内部已做适配，直接使用社区提供的端点地址即可。

![](Pasted-image-20260523154919.png)

![](Pasted-image-20260523164457.png)
点击获取模型列表，再点击一键设置即可
记得勾选1M，表示可以使用1百万token上下文，当然前提是你的模型支持(比如deepseek)

---

# 5 接入本地模型（llama.cpp）

llama.cpp 默认提供的是 OpenAI 兼容 API，而 Claude Code 走的是 Anthropic 协议。直接在 `settings.json` 里填 llama.cpp 的地址是不行的，需要配合 `cc switch` 的自定义端点功能来桥接。

## 5.1 内网穿透（ngrok）

使用 [ngrok](https://ngrok.com/) 进行内网穿透，下载客户端即可使用

如果 llama.cpp 跑在本地，想让外网也能访问（比如在另一台机器上用 Claude Code），可以用 ngrok 做内网穿透，把本地端口暴露到公网：

```bash
ngrok http 8080
```

## 5.2 在 Claude Code 中连接 llama.cpp

配置步骤如下：

1. **如果 llama.cpp 没有配置 API Key**，`cc switch` 处的 API Key 可以**随意填写**，不会校验。
2. 输入请求地址后，点击**管理与测速**，测试是否连通。
3. 点击**高级选项**展开。
4. 点击**获取模型列表**（上方弹窗会显示获取到的模型数量）。
5. 在模型下拉列表中选择你的模型。
6. 点击**一键设置**。
7. **保存**配置。

> 注意：请保持 **API 格式**与**认证字段**不变，不要随意修改。

配置完成后，在任意文件夹打开终端输入 `claude`，测试是否正常启用。

![](Pasted-image-20260523164024.png)

![](Pasted-image-20260523164123.png)

![](Pasted-image-20260523164159.png)

## 5.3 切换模型

在 `cc switch` 界面中，你可以随时在不同配置之间切换——远程大模型干活，本地小模型摸鱼，灵活选择。

## 5.4 缺点

存在这样一种情景，我需要同时使用多家大模型，但是ccswitch只能选择启用一个供应商。

而且由于目前deepseek v4仅为文本推理llm，不具备图片理解能力，导致我必须额外配置一个具有视觉的大模型，此时我就必须使用python自己写一个网关脚本，用于对齐agent要求的格式并连接上我视觉模型，当然我们可以将其配置成全局skill，当需要视觉理解时进行调用。

## 5.5 CC switch实际修改配置

![](Pasted-image-20260523165709.png)

![](Pasted-image-20260523165830.png)

cc switch实际就是建立网关，将baseurl改成自己的端口，再填写供应商的api调用地址和映射模型进行模型调用

---

# 6 Skill、Plugin、Agent 扩展

Claude Code 的真正威力在于可扩展生态。通过插件市场，你可以安装社区提供的 Skill、Plugin 和 Agent，极大扩展能力边界。

## 6.1 添加市场

首先添加 Anthropic 官方市场：

```
/plugin marketplace add anthropics/skills
```

市场地址：[https://github.com/anthropics/skills](https://github.com/anthropics/skills)
![](Pasted-image-20260523184257.png)
## 6.2 浏览与安装

添加市场后，输入 `/plugin` 即可浏览所有可用插件。按需安装，最后执行一次插件重载/reload-plugin即可生效。

![](Pasted-image-20260523184311.png)

安装完成后，右下角状态栏会显示各服务的可用状态。如果某个 MCP 服务启动失败或需要官方验证，也会有相应提示，方便排查。

![](Pasted-image-20260523184326.png)


---

# 7 小结

| 场景   | 方案                            |
| ---- | ----------------------------- |
| 安装使用 | 官方地址 或`winget`安装              |
| 模型接入 | DeepSeek + `cc switch`        |
| 本地模型 | llama.cpp 本地模型 + `cc switch`  |
| 扩展能力 | Marketplace 安装 Skill / Plugin |

折腾一圈下来，Claude Code CLI 就配置好了—— 一套工具，多种后端模型，按需切换。希望这篇笔记能帮你少走弯路。
