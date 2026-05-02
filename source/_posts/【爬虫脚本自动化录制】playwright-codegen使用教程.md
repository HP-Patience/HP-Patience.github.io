---
title: 【爬虫脚本自动化录制】playwright codegen使用教程
date: 2026-05-02 23:24:38
tags:
- 爬虫
---


# 1 前言
> 在做 Web 自动化测试、爬虫脚本开发时，手动写定位、写操作步骤往往耗时又容易出错。Playwright 官方提供了一个**零代码录制神器：`codegen`**，只需要在浏览器里用鼠标点击，就能自动生成可直接运行的 Python/Java/JS 自动化代码，极大提升开发效率。

---
# 2 什么是 playwright codegen？
`codegen` 是 Playwright 内置的**交互式录制工具**，核心功能：
- 记录鼠标点击、输入、选择、滚动、切换页面等操作
- 实时生成高质量、可直接运行的代码
- 自动识别 iframe、弹窗、下拉框等复杂场景
- 支持 Python / Node. js / Java / C# 多语言导出

适用场景：快速生成登录脚本、表单提交、页面遍历、爬虫操作等。

---
# 3 环境准备
## 3.1 安装 Playwright
```bash
pip install playwright
```
## 3.2 安装浏览器驱动
```bash
playwright install
```
会自动安装 Chromium、Firefox、WebKit 内核。

---
# 4 codegen 基础使用
## 4.1 直接启动录制
```bash
playwright codegen 网址
```

示例：打开百度并录制
```bash
playwright codegen https://www.baidu.com
```

执行后会弹出两个窗口：
- 左侧：浏览器页面（你手动操作）
- 右侧：Playwright Inspector（实时生成代码）

![](https://i-blog.csdnimg.cn/direct/4c089f544cae46cdbe3171c56538a6c9.png#pic_center)



## 4.2 操作演示
1. 在百度搜索框输入“CSDN”
2. 点击“百度一下”
3. 等待页面跳转
4. 关闭浏览器

![](https://i-blog.csdnimg.cn/direct/d18062e6311e4ba18073c5fe0afa6449.png#pic_center)



右侧会**自动生成完整 Python 代码**，复制即可直接运行。
生成代码如下：
```python
import re
from playwright.sync_api import Playwright, sync_playwright, expect


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://www.baidu.com/")
    page.get_by_role("textbox", name="中央音乐学院教授安平病逝").click()
    page.get_by_role("textbox", name="中央音乐学院教授安平病逝").fill("CSDN")
    page.get_by_role("button", name="百度一下").click()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
```

---
# 5 常用高级参数

| 参数            | 作用                             | 示例                                                    |
| ------------- | ------------------------------ | ----------------------------------------------------- |
| `-o 文件名.py`   | 将录制代码保存到文件                     | `playwright codegen -o test.py https://www.baidu.com` |
| `--browser`   | 指定浏览器（chromium/firefox/webkit） | `--browser firefox`                                   |
| `--device`    | 模拟手机设备                         | `--device "iPhone 15"`                                |
| `--slowmo 毫秒` | 慢放操作，避免录制过快                    | `--slowmo 1000`                                       |
| `--lang`      | 指定生成语言（python/js/java/csharp）  | `--lang java`                                         |
| `--viewport`  | 指定窗口大小                         | `--viewport 1920,1080`                                |

常用组合示例：
```bash
# 录制并保存，慢放 1 秒，模拟 iPhone 15
playwright codegen -o auto_test.py --slowmo 1000 --device="iPhone 15" https://www.baidu.com
```

---

# 6 实战案例：录制 CSDN 登录脚本
## 6.1 开始录制
```bash
playwright codegen -o csdn_login.py https://passport.csdn.net/login
```
![](https://i-blog.csdnimg.cn/direct/3559a9c3596149588b0f37b8c513a3e3.png#pic_center)




## 6.2 手动操作步骤
1. 选择“密码登录”
2. 输入用户名
3. 输入密码
4. 处理滑块/验证（手动完成）
5. 点击登录

## 6.3 自动生成代码示例
```python
from playwright.sync_api import Playwright, sync_playwright, expect

def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://passport.csdn.net/login")
    
    # 切换密码登录
    page.get_by_role("tab", name="密码登录").click()
    # 输入账号
    page.get_by_placeholder("手机号/邮箱/账号").click()
    page.get_by_placeholder("手机号/邮箱/账号").fill("你的账号")
    # 输入密码
    page.get_by_placeholder("请输入密码").click()
    page.get_by_placeholder("请输入密码").fill("你的密码")
    # 登录
    page.get_by_role("button", name="登录").click()
    
    # ---------------------
    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
```

---

# 7 录制后代码必须优化
codegen 生成的代码**能跑，但不够健壮**，建议优化：

## 7.1 添加显示等待（防止页面未加载）
```python
page.get_by_role("button", name="登录").wait_for(state="visible")
```
## 7.2 使用 expect 断言
```python
expect(page.get_by_role("button", name="登录")).to_be_enabled()
```

![](https://i-blog.csdnimg.cn/direct/8b9cf6295b7246e9a66831db8ffb93a0.png#pic_center)



```PYTHON
# 1.断言“验证码登录”文字对应的元素在页面上可见，用于判断登录区域加载完成 
expect(page.get_by_text("验证码登录")).to_be_visible() 

# 2.断言页面 body 中包含“登录可享更多权益”文本，用于校验页面是否正常加载
expect(page.locator("body")).to_contain_text("登录可享更多权益") 

# 3.可选取复制页面文字

# 4.校验元素的无障碍 ARIA 属性是否匹配，由 codegen 自动生成，实际使用中一般可删除 
expect(page.locator("#thirdLogin")).to_match_aria_snapshot("") 
```
## 7.3 处理 iframe
如果页面嵌套 iframe，codegen 会自动生成 `frame_locator`，建议精简：
```python
login_frame = page.frame_locator("iframe[name='login_frame']")
login_frame.get_by_text("登录").click()
```
## 7.4 去掉冗余操作
删除重复的 `click()`、无用的等待和多余定位。
