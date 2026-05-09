---
title: 【RAG】使用Llamaindex框架部署InternLM2-1.8B
date: 2024-09-04 14:04:00
tags:
- RAG
categories: 
- 书生·浦语三期实战营
description: 学习使用LlamaIndex框架结合InternLM2-1.8B大模型实现RAG检索增强生成，为模型注入外部知识库。
---

# 一、前置知识

- **给模型注入新知识的方式**：
  - 内部方式：更新模型的权重，但训练代价较大。
  - 外部方式：给模型注入额外的上下文或外部信息，不改变其权重。
- **RAG 工作原理**：
  - 将问题编码成向量，在向量数据库中找到最相关的文档块（top-k chunks）。
  - 将知识源分割成小块，编码成向量并存储在向量数据库中。
  - 将检索到的文档块与原始问题一起作为提示输入到 LLM 中，生成最终的回答。
- **RAG 效果比对**：
  - 由于 `xtuner` 是较新的框架，`InternLM2-Chat-1.8B` 训练数据库中未收录相关信息，使用 RAG 前问答均未给出准确答案，使用后能获得想要的答案。

# 二、环境、模型准备

## （一）配置基础环境

- 在 `Intern Studio` 服务器上部署 `LlamaIndex`：

  - 打开 `Intern Studio` 界面，点击 `创建开发机` 配置开发机系统。
  - 填写 `开发机名称` 后，点击 `选择镜像` 使用 `Cuda11.7-conda` 镜像，在资源配置中选择 `30% A100 * 1` 的选项，立即创建开发机器。
  - 进入开发机后，创建新的 `conda` 环境，命名为 `llamaindex`，运行以下命令：

  ```bash
  conda create -n llamaindex python=3.10
  conda env list
  conda activate llamaindex
  conda install pytorch==2.0.1 torchvision==0.15.2 torchaudio==2.0.2 pytorch-cuda=11.7 -c pytorch -c nvidia
  pip install einops==0.7.0 protobuf==5.26.1
  ```

  - 环境激活后，命令行左边会显示当前环境名称。

## （二）安装 LlamaIndex

- 安装 `LlamaIndex` 和相关的包：

  ```bash
  conda activate llamaindex
  pip install llama-index==0.10.38 llama-index-llms-huggingface==0.2.0 "transformers[torch]==4.41.1" "huggingface_hub[inference]==0.23.1" huggingface_hub==0.23.1 sentence-transformers==2.7.0 sentencepiece==0.2.0
  ```

## （三）下载 Sentence Transformer 词嵌入模型

- 新建一个 `python` 文件，贴入以下代码：

  ```python
  import os
  
  # 设置环境变量
  os.environ['HF_ENDPOINT'] = 'https://hf-mirror.com'
  
  # 下载模型
  os.system('huggingface-cli download --resume-download sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2 --local-dir /root/model/sentence-transformer')
  ```

- 在 `/root/llamaindex_demo` 目录下执行该脚本自动开始下载。

## （四）下载 NLTK 相关资源

- 使用以下命令下载 `nltk` 资源并解压到服务器上：

  ```bash
  cd /root
  git clone https://gitee.com/yzy0612/nltk_data.git --branch gh-pages
  cd nltk_data
  mv packages/* ./
  cd tokenizers
  unzip punkt.zip
  cd ../taggers
  unzip averaged_perceptron_tagger.zip
  ```

# 三、LlamaIndex HuggingFaceLLM

- 运行以下指令，把 `InternLM2 1.8B` 软连接出来：

  ```bash
  cd ~/model
  ln -s /root/share/new_models/Shanghai_AI_Laboratory/internlm2-chat-1_8b/ ./
  ```

- 新建一个 `python` 文件，贴入以下代码：

  ```python
  from llama_index.llms.huggingface import HuggingFaceLLM
  from llama_index.core.llms import ChatMessage
  
  llm = HuggingFaceLLM(
      model_name="/root/model/internlm2-chat-1_8b",
      tokenizer_name="/root/model/internlm2-chat-1_8b",
      model_kwargs={"trust_remote_code": True},
      tokenizer_kwargs={"trust_remote_code": True}
  )
  
  rsp = llm.chat(messages=[ChatMessage(content="xtuner 是什么？")])
  print(rsp)
  ```

- 运行以下命令：

  ```bash
  conda activate llamaindex
  cd ~/llamaindex_demo/
  python llamaindex_internlm.py
  ```

- 结果回答效果并不好，不是想要的 `xtuner`。

# 四、LlamaIndex RAG

- 安装 `LlamaIndex` 词嵌入向量依赖：

  ```bash
  conda activate llamaindex
  pip install llama-index-embeddings-huggingface==0.2.0 llama-index-embeddings-instructor==0.1.3
  ```

- 获取知识库：

  ```bash
  cd ~/llamaindex_demo
  mkdir data
  cd data
  git clone https://github.com/InternLM/xtuner.git
  mv xtuner/README_zh-CN.md ./
  ```

- 新建一个 `python` 文件，贴入以下代码：

  ```python
  from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
  from llama_index.embeddings.huggingface import HuggingFaceEmbedding
  from llama_index.llms.huggingface import HuggingFaceLLM
  
  # 初始化一个 HuggingFaceEmbedding 对象，用于将文本转换为向量表示
  embed_model = HuggingFaceEmbedding(
      model_name="/root/model/sentence-transformer"
  )
  Settings.embed_model = embed_model
  
  llm = HuggingFaceLLM(
      model_name="/root/model/internlm2-chat-1_8b",
      tokenizer_name="/root/model/internlm2-chat-1_8b",
      model_kwargs={"trust_remote_code": True},
      tokenizer_kwargs={"trust_remote_code": True}
  )
  Settings.llm = llm
  
  # 从指定目录读取所有文档，并加载数据到内存中
  documents = SimpleDirectoryReader("/root/llamaindex_demo/data").load_data()
  index = VectorStoreIndex.from_documents(documents)
  query_engine = index.as_query_engine()
  response = query_engine.query("xtuner 是什么?")
  
  print(response)
  ```

- 运行以下命令：

  ```bash
  conda activate llamaindex
  cd ~/llamaindex_demo/
  python llamaindex_RAG.py
  ```

- 结果借助 RAG 技术后，能获得想要的答案。

# 五、LlamaIndex Web

- 安装依赖：

  ```bash
  pip install streamlit==1.36.0
  ```

- 新建一个 `python` 文件，贴入以下代码：

  ```python
  import streamlit as st
  from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
  from llama_index.embeddings.huggingface import HuggingFaceEmbedding
  from llama_index.llms.huggingface import HuggingFaceLLM
  
  st.set_page_config(page_title="llama_index_demo", page_icon="🦜🔗")
  st.title("llama_index_demo")
  
  # 初始化模型
  @st.cache_resource
  def init_models():
      embed_model = HuggingFaceEmbedding(
          model_name="/root/model/sentence-transformer"
      )
      Settings.embed_model = embed_model
  
      llm = HuggingFaceLLM(
          model_name="/root/model/internlm2-chat-1_8b",
          tokenizer_name="/root/model/internlm2-chat-1_8b",
          model_kwargs={"trust_remote_code": True},
          tokenizer_kwargs={"trust_remote_code": True}
      )
      Settings.llm = llm
  
      documents = SimpleDirectoryReader("/root/llamaindex_demo/data").load_data()
      index = VectorStoreIndex.from_documents(documents)
      query_engine = index.as_query_engine()
  
      return query_engine
  
  # 检查是否需要初始化模型
  if 'query_engine' not in st.session_state:
      st.session_state['query_engine'] = init_models()
  
  def greet2(question):
      response = st.session_state['query_engine'].query(question)
      return response
  ```


    # Store LLM generated responses
    if "messages" not in st.session_state.keys():
        st.session_state.messages = [{"role": "assistant", "content": "你好，我是你的助手，有什么我可以帮助你的吗？"}]
    
    # Display or clear chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.write(message["content"])
    
    def clear_chat_history():
        st.session_state.messages = [{"role": "assistant", "content": "你好，我是你的助手，有什么我可以帮助你的吗？"}]
    
    st.sidebar.button('Clear Chat History', on_click=clear_chat_history)
    
    # Function for generating LLaMA2 response


    def generate_llama_response(question):
        response = greet2(question)
        return response
    
    # User-provided prompt
    if prompt := st.chat_input("What's on your mind?"):
        st.chat_message("user").write(prompt)
        with st.chat_message("assistant"):
            message_placeholder = st.empty()
            response = generate_llama_response(prompt)
            message_placeholder.write(response)
        st.session_state.messages.append({"role": "assistant", "content": response})
    
    ```

- 启动 Streamlit 服务：

  ```bash
  cd ~/llamaindex_demo/
  streamlit run llamaindex_streamlit.py
  ```

- 打开浏览器，访问 `https://locahost:XXX`。

# 六、总结

- 本文介绍如何结合 `LlamaIndex` 和 `InternLM2` 部署 `RAG`，为大模型注入最新知识库，效果显著。


# 七、作业

![](1.png)

==RAG前==

![](2.png)

==RAG后==

![](3.png)

==使用Streamlit部署webui（使用RAG）==

![](4.png)
