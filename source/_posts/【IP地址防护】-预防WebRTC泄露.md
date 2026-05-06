---
title: 【IP地址防护】-预防WebRTC泄露
date: 2026-05-02 23:08:03
tags:
- 网络安全
---

# 1 什么是 WebRTC 泄露（WebRTC Leak），如何预防

> WebRTC（Web Real-Time Communication）是浏览器提供的实时音视频与点对点数据通道技术。**WebRTC 泄露** 指的是在使用浏览器或某些应用时，WebRTC 的连接流程（ICE 候选交换）意外暴露了本地或真实公网 IP 地址，导致即便你在用 VPN/代理，目标网站或第三方仍可能看到你的真实 IP 地址或局域网地址，从而破坏隐私与匿名性。

**WebRTC 泄露简要原理**

1. 建立 P2P 连接时，浏览器会通过 STUN/TURN server 获取 **ICE candidates**（候选连接地址），这些候选包括：
    - `host`（本机局域网 IP）
    - `srflx`（通过 STUN 获得的公网映射 IP）
    - `relay`（通过 TURN 中继的地址）
2. 如果浏览器本地或网页脚本暴露/发送了 `host` 或 `srflx` 类型的候选，第三方就可能获知本机真实 IP（包括局域网 IP 与公网真实 IP）。
3. VPN/代理通常只影响浏览器的普通 HTTP(S) 流量，但 WebRTC 的 STUN 请求可能绕过这些路径，从而暴露真实地址。

chrome需要安装扩展来避免WebRTC 泄露，推荐一个开源扩展
[chrome扩展地址](https://chromewebstore.google.com/detail/webrtc-control/fjkmabmdepjfammlpliljpnbhleegehm)


# 2 使用 IPPure 检查 WebRTC 泄露情况
## 2.1 安装前：
[IPPure链接地址](https://ippure.com/Browser-WebRTC-Leak-Detect.html)
![](PixPin_2026-05-02_22-53-07.png)

## 2.2 安装后 ：
![](PixPin_2026-05-02_22-53-10.png)
![](PixPin_2026-05-02_22-53-16.png)

Reference：
1. [WebRTC解释](https://ippure.com/Browser-WebRTC-Leak-Detect.html)
