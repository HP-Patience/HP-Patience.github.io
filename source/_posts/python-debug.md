---
title: python-debug
date: 2024-07-19 23:16:46
tags:
- Python
categories: 
- python
description: 书生浦语三期任务打卡-python-debug
swiper_index: 50 #置顶轮播图顺序，非负整数，数字越大越靠前
---

# 任务一

  请用Python实现一个wordcount函数，统计英文字符串中每个单词出现的次数。返回一个字典，key为单词，value为对应单词出现的次数。

## 源程序：

```PYTHON
"""  请用Python实现一个wordcount函数，统计英文字符串中每个单词出现的次数。返回一个字典，key为单词，value为对应单词出现的次数。

    TIPS：记得先去掉标点符号,然后把每个单词转换成小写。不需要考虑特别多的标点符号，只需要考虑实例输入中存在的就可以。"""

text = """
Got this panda plush toy for my daughter's birthday,
who loves it and takes it everywhere. It's soft and
super cute, and its face has a friendly look. It's
a bit small for what I paid though. I think there
might be other options that are bigger for the
same price. It arrived a day earlier than expected,
so I got to play with it myself before I gave it
to her.
"""

def wordcount(text):

    text=text.replace(",","")
    text=text.replace(".","")
    text=text.replace("\n","")

    text_list=text.split(" ")
    text_dict={}
    for i in text_list:
        if i not in text_dict:
            text_dict[i]=1
        else:
            text_dict[i]+=1
            
    return text_dict
    
print(wordcount(text))
```

# 任务二

请使用本地vscode连接远程开发机，将上面你写的wordcount函数在开发机上进行debug，体验debug的全流程，并完成一份debug笔记(需要截图)。

1.首先重命名debug命令

在bashrc配置文件中输入:
`alias pyd='python -m debugpy --wait-for-client --listen 5678'`

再输入保存命令：
`source ~/.bashrc`

![](1.png)

2.执行debug命令，启动服务端

`pyd ./wordcount.py `

![](2.png)

3.启动客户端

![](3.png)

响应返回：

![](4.png)

