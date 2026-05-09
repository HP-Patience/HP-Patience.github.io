---
title: 8G显存玩转书生大模型Demo
date: 2024-08-20 22:57:31
tags:
- 大模型
categories: 
- 书生·浦语三期实战营
description: 详细介绍如何在8G显存环境下部署和运行书生大模型Demo，包括InternLM2-Chat-1.8B、InternLM-XComposer2-VL-1.8B和InternVL2-2B模型的部署教程。
---

# 环境配置

```
# 创建环境
conda create -n demo python=3.10 -y
# 激活环境
conda activate demo
# 安装 torch
conda install pytorch==2.1.2 torchvision==0.16.2 torchaudio==2.1.2 pytorch-cuda=12.1 -c pytorch -c nvidia -y
# 安装其他依赖
pip install transformers==4.38
pip install sentencepiece==0.1.99
pip install einops==0.8.0
pip install protobuf==5.27.2
pip install accelerate==0.33.0
pip install streamlit==1.37.0
```

![](P1.png)

# InternLM2-Chat-1.8B 模型部署

## 一、用Cli Demo 部署

1.创建`demo`文件夹，用于存放代码。并创建 `cli_demo.py`文件

```
mkdir -p /root/demo
touch /root/demo/cli_demo.py
```

![](P2.png)

 其中`cli_demo.py` 的代码为：

```PYTHON
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM


model_name_or_path = "/root/share/new_models/Shanghai_AI_Laboratory/internlm2-chat-1_8b"

tokenizer = AutoTokenizer.from_pretrained(model_name_or_path, trust_remote_code=True, device_map='cuda:0')
model = AutoModelForCausalLM.from_pretrained(model_name_or_path, trust_remote_code=True, torch_dtype=torch.bfloat16, device_map='cuda:0')
model = model.eval()

system_prompt = """You are an AI assistant whose name is InternLM (书生·浦语).
- InternLM (书生·浦语) is a conversational language model that is developed by Shanghai AI Laboratory (上海人工智能实验室). It is designed to be helpful, honest, and harmless.
- InternLM (书生·浦语) can understand and communicate fluently in the language chosen by the user such as English and 中文.
"""

messages = [(system_prompt, '')]

print("=============Welcome to InternLM chatbot, type 'exit' to exit.=============")

while True:
    input_text = input("\nUser  >>> ")
    input_text = input_text.replace(' ', '')
    if input_text == "exit":
        break

    length = 0
    for response, _ in model.stream_chat(tokenizer, input_text, messages):
        if response is not None:
            print(response[length:], flush=True, end="")
            length = len(response)
```

2.在终端执行`python /root/demo/cli_demo.py`命令启动Demo

3.使用 Cli Demo 完成 InternLM2-Chat-1.8B 模型的部署，并生成 300 字小故事

![](P3.png)

## 二、用Streamlit Web Demo 部署

1.clone InternLM 的github仓库 到本地：

```shell
cd /root/demo
git clone https://github.com/InternLM/Tutorial.git
```

2.启动Streamlit 服务：

```shell
cd /root/demo
streamlit run /root/demo/Tutorial/tools/streamlit_demo.py --server.address 127.0.0.1 --server.port 6006
```

![](P4.png)

3.在**本地**的 PowerShell 中输入以下命令，将端口映射到本地：

```shell
ssh -CNg -L 6006:127.0.0.1:6006 root@ssh.intern-ai.org.cn -p 你的 ssh 端口号
```

![](P5.png)

4.完成端口映射后，通过浏览器访问 `http://localhost:6006` 来启动我们的 Demo。

![](P6.png)

# LMDeploy 部署

## 一、InternLM-XComposer2-VL-1.8B 模型

### 模型介绍：

InternLM-XComposer2 是一款基于 InternLM2 的视觉语言大模型，其擅长自由形式的文本图像合成和理解。其主要特点包括：

- 自由形式的交错文本图像合成：InternLM-XComposer2 可以根据大纲、详细文本要求和参考图像等不同输入，生成连贯且上下文相关，具有交错图像和文本的文章，从而实现高度可定制的内容创建。
- 准确的视觉语言问题解决：InternLM-XComposer2 基于自由形式的指令准确地处理多样化和具有挑战性的视觉语言问答任务，在识别，感知，详细标签，视觉推理等方面表现出色。

### 部署步骤：

1.激活环境并安装 LMDeploy 以及其他依赖。

```shell
conda activate demo
pip install lmdeploy[all]==0.5.1
pip install timm==1.0.7
```

![](P7.png)

2.使用 LMDeploy 启动一个与 InternLM-XComposer2-VL-1.8B 模型交互的 Gradio 服务。

```shell
lmdeploy serve gradio /share/new_models/Shanghai_AI_Laboratory/internlm-xcomposer2-vl-1_8b --cache-max-entry-count 0.1
```

![](P8.png)

3.若已关闭端口映射，重新输入以下代码即可:

```
ssh -CNg -L 6006:127.0.0.1:6006 root@ssh.intern-ai.org.cn -p 36558
```

![](P9.png)

通过浏览器访问 `http://localhost:6006` 来启动==InternLM-XComposer2-VL-1.8B==模型

![](P10.png)

输入图片并询问图片里有什么：

![](cat.png)

输出：

![](P11.png)

## 二、InternVL2-2B 模型

### 模型介绍:

InternVL2 是上海人工智能实验室推出的新一代视觉-语言多模态大模型，是首个综合性能媲美国际闭源商业模型的开源多模态大模型。InternVL2 系列从千亿大模型到端侧小模型全覆盖，通专融合，支持多种模态。

### 部署步骤：

1.通过下面的命令来启动 InternVL2-2B 模型的 Gradio 服务:

```shell
conda activate demo
lmdeploy serve gradio /share/new_models/OpenGVLab/InternVL2-2B --cache-max-entry-count 0.1
```

2.若已关闭端口映射，重新输入以下代码即可:

```
ssh -CNg -L 6006:127.0.0.1:6006 root@ssh.intern-ai.org.cn -p 36558
```

![](P9.png)

通过浏览器访问 `http://localhost:6006` 来启动==InternVL2-2B==模型


输入图片并询问详细描述图片内容：

![](cat2.png)
输出：

![](P12.png)
