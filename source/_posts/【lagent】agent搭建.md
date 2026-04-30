---
title: 【lagent】agent搭建
date: 2024-09-18 20:54:29
tags:
categories: 
- 书生·浦语三期实战营
---

# 启动webui服务



==使用lmdeploy启动一个api_server==



```BASH
conda activate agent_camp3
lmdeploy serve api_server /share/new_models/Shanghai_AI_Laboratory/internlm2_5-7b-chat --model-name internlm2_5-7b-chat
```

![](1.png)



==另开一个终端==，<font color="#ff0000">使用stremlit启动agent_web应用</font>



```BASH
cd /root/agent_camp3/lagent
conda activate agent_camp3
streamlit run examples/internlm2_agent_web_demo.py
```

![](2.png)



==本地powershell建立ssh连接，进行端口映射==



![](3.png)

# Q&A

## 遇到的问题：
```
ModuleNotFoundError: No module named 'griffe.enumerations
```
## 解决方法：
```
Due to griffe's recent 1.x release, the `griffe.enumerations` module has been removed, resulting in a break change, which can be resolved by
`pip install griffe==0.48`.
```

# 修改模型名称以及模型IP地址



==启动streamlit的web应用如下==：



![](4.png)



==修改红框内的内容==



![](5.png)



==终端的反馈==：



PS:很是可惜，没有找到我想要的内容[[1706.03762] Attention Is All You Need (arxiv.org)](https://arxiv.org/abs/1706.03762)

![](6.png)

# 自定义工具

![](7.png)



==进入lagent_web_demo的py文件中==



==添加&修改代码：==



```PYTHON
from lagent.actions import ActionExecutor, ArxivSearch, IPythonInterpreter
+ from lagent.actions.magicmaker import MagicMaker
from lagent.agents.internlm2_agent import INTERPRETER_CN, META_CN, PLUGIN_CN, Internlm2Agent, Internlm2Protocol

...
        action_list = [
            ArxivSearch(),
+             MagicMaker(),
        ]
```

![](8.png)



==重新启动agent_web服务==



使用`MagicMaker`工具绘画



==Prompt==：帮我画一个微笑的女孩，穿着校服在学校的走廊上，阳光照耀在她身上



![](9.png)

![](10.png)

![](11.png)



==可以看到对于用户输入的提示词，有自动进行填充完善==



![](12.png)

![](13.png)
