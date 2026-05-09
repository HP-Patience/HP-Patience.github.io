---
title: 【Prompt Engineering】LangGPT结构化提示词编写
date: 2024-09-03 13:36:50
tags:
- 提示词工程
categories: 
- 书生·浦语三期实战营
description: 学习使用LangGPT结构化提示词框架优化大模型输出，提升LLM在数字比对等任务上的准确性。
---

# 前言
>在日常使用大模型时，我发现它经常在数字比对这类基础问题上出错，并且输出结果很不严谨。为了解决这个问题，我尝试使用Prompt Engineering，
并在网上找到了一个开源的「结构化提示词框架」-- LangGPT，以下是我的使用过程记录。


---
# 实现步骤

step0：前期准备
1. 创建虚拟环境->激活虚拟环境->安装必要包文件
2. 创建项目路径->进入项目
3. 安装必要软件，如tmux

step1：模型部署
模型下载->部署模型为OpenAI server->图形化界面调用
‬﻿⁠﻿⁠⁠﻿
step3：langgpt结构化提示词⁠‬编写⁠‍‬⁠‬‬﻿‬‌‌‌‍﻿﻿‌‌﻿
偷懒大法：GPTS有LangGPT提示词专家，用大模型生成即可

---

# tmux使用

tmux可以在终端中创建终端，将进程维持在后台。
	
所以当我们下载模型，使用tmux在后台下载时，即便我们断开ssh连接，下载也不会中断。

step1：部署模型为OpenAI server

## tmux常见命令

1.**创建窗口命令**：

==PS：t表示target(目标)，用于指定会话、窗口或面板的名称==
```shell
tmux new -t <session_name>
```

PS：创建完成后，运行下面的命令进入新的命令窗口(==首次创建自动进入，之后需要连接==)：
其中`a` 是 **`attach`** 的简写
```shell
tmux a -t <session_name>
```

2.**查看当前 tmux 会话**：

```shell
tmux ls
```

3.**连接到特定的 tmux 会话**：

```bash
tmux attach -t <session_name>
```

将 `<session_name>` 替换为你要连接的会话的实际名称或编号。

4.**杀死整个 tmux 会话：**

```bash
tmux kill-session -t <session_name>
```

5.**退出tmux**:

Ctrl+B进入`tmux`的控制模式，然后按d退出窗口连接

## 模型部署

进入命令窗口后，需要在新窗口中再次激活环境，命令参考**0.1节**。然后，使用LMDeploy进行部署，参考如下命令：

使用LMDeploy进行部署，参考如下命令：

```shell
CUDA_VISIBLE_DEVICES=0 lmdeploy serve api_server /share/new_models/Shanghai_AI_Laboratory/internlm2-chat-1_8b --server-port 23333 --api-keys internlm2
```

更多设置参考：[https://lmdeploy.readthedocs.io/en/latest/index.html](https://lmdeploy.readthedocs.io/en/latest/index.html)

部署成功后，可以利用如下脚本调用部署的InternLM2-chat-1_8b模型并测试是否部署成功。

```python
from openai import OpenAI

client = OpenAI(
    api_key = "internlm2",
    base_url = "http://0.0.0.0:23333/v1"
)

response = client.chat.completions.create(
    model=client.models.list().data[0].id,
    messages=[
        {"role": "system", "content": "请介绍一下你自己"}
    ]
)

print(response.choices[0].message.content)
```

服务启动完成后，可以按Ctrl+B进入`tmux`的控制模式，然后按D退出窗口连接，更多操作[参考](https://aik9.top/)。

---
# 作业：

基础任务 (完成此任务即完成闯关)：

- **背景问题**：近期相关研究发现，LLM在对比浮点数字时表现不佳，经验证，internlm2-chat-1.8b (internlm2-chat-7b)也存在这一问题，例如认为`13.8<13.11`。
  
- **任务要求**：利用LangGPT优化提示词，使LLM输出正确结果。**完成一次并提交截图即可**

使用GPTS中LangGPT提示词专家，配合我们的需求生成LangGPT结构化提示词

![](1.png)
==生成结果如下==：

```
# Role: 数学助手

## Profile
- author: LangGPT
- version: 1.0
- language: 中文
- description: 一个能够进行基本数学加减法运算，并能够比较两个数字大小的助手。

## Skills
1. 能够进行基本的数学加法和减法运算。
2. 能够比较两个数字的大小，并给出相应的判断。
3. 能够理解用户输入的简单数学表达式或问题描述。

## Rules
1. 用户输入可以是任意两个数字或一个包含加法、减法的表达式。
2. 当输入两个数字时，助手应比较它们的大小，并返回结果。
3. 当输入一个加法或减法表达式时，助手应计算出结果并返回。
4. 如果用户输入有误或不符合数学表达式规则，助手应给出提示并要求重新输入。

## Workflows
1. 接收用户输入的数字或数学表达式。
2. 判断输入的类型（两个数字或数学表达式）。
3. 如果是两个数字，执行大小比较，并返回结果。
4. 如果是数学表达式，进行加法或减法计算，返回结果。
5. 如果输入不符合预期格式，返回错误提示，要求用户重新输入。

## Init
1. 向用户介绍助手的功能和使用方法。
2. 提示用户可以输入两个数字进行比较，或输入一个加法、减法表达式进行计算。

```

==加入系统提示词前：==
PS：估计InternLM2-chat-1_8b版本太久远了，所以回答不出来🤔
![](2.png)

==加入系统提示词后：==
PS：效果明显变好了😋
![](3.png)

# Reference：

1.LangGPT社区：[‌‌‬﻿⁠﻿⁠⁠﻿‌⁠‬‌⁠‍‬⁠‬‬﻿‬‌‌‌‍﻿﻿‌‌﻿‬⁠LangGPT结构化提示词 - 飞书云文档](https://langgptai.feishu.cn/wiki/QaArwzc7biR5nqkSo3mcwzGfnhf)
2.浦语开源文档[书生浦语-浦语提示词工程实践](https://github.com/InternLM/Tutorial/tree/camp3/docs/L1/Prompt)
3.文档：[系统论述文章： 构建高性能 Prompt 之路——结构化 Prompt](https://mp.weixin.qq.com/s/N9BrkDqvkIHQD7TTnhNk6Q)
