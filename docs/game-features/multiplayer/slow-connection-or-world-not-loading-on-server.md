---
displayed_sidebar: gameFeaturesSidebar
sidebar_position: 2
---

# 服务器连接缓慢 / 世界无法加载

:::tip[提示：]

这篇文章来自 Hytale 官方，我们仅对原文进行了翻译和排版处理。

> 原文链接：[https://support.hytale.com/hc/en-us/articles/45419578597403-Slow-Connection-World-Not-Loading-on-Server](https://support.hytale.com/hc/en-us/articles/45419578597403-Slow-Connection-World-Not-Loading-on-Server)<br />
> 上次更新时间：2026/01/14 14:19

:::

## 症状

- 你的网络连接整体稳定且速度正常。
  - 示例：你可以正常观看 Youtube 视频。
- 你的单人世界可以正常加载，并且可以进行单人游玩。
- 连接服务器 / 好友时非常缓慢，且世界无法加载。
  - 你的好友可能可以看到你移动，但你无法进行任何操作。
- 你正在使用 Windows。

## 问题

某些网络设备（例如 Intel 与 Realtek）存在较为罕见的驱动问题。游戏所使用的协议（QUIC）非常新，在并非所有计算机上都能得到完整支持。

这是一个已知问题，并且很可能不会再获得驱动更新。目前它仍然影响着现代平台。

该问题同时会影响 Wi-Fi 与以太网连接。

## 确认方式

你可以通过将一个以太网 USB 网卡连接到你的电脑，并尝试通过该方式进行连接来确认是否受到此问题影响。如果问题得到解决，请继续按照下方的解决方案操作。

## 解决方案

在完成每一种解决方案后，请验证问题是否已解决。你可能不需要应用此处描述的所有更改。

### 第 1 步：

- 打开开始菜单，并输入 “View network connections”（查看网络连接）。
- 选择下方显示的 Control Panel（控制面板）链接。

![](https://support.hytale.com/hc/article_attachments/45419578566299)

### 第 2 步：

- 选择当前用于互联网连接的网络连接。
- 右键点击并选择 “Properties”（属性）。
- 选择 “Configure”（配置）。

### 解决方案 1：

- 选择 “Priority & VLAN”，并将其设置为 “Priority & VLAN Disabled”。
- 点击 “Ok”，并等待网络连接恢复。
- 再次尝试连接服务器。

![](https://support.hytale.com/hc/article_attachments/45419639865499)

### 解决方案 2：

- 选择 “Recv. Segment Coalescing (IPv4)”，并设置为 “Disabled”。
- 选择 “Recv. Segment Coalescing (IPv6)”，并设置为 “Disabled”。
- 点击 “Ok”，并等待网络连接恢复。
- 再次尝试连接服务器。

![](https://support.hytale.com/hc/article_attachments/45419639866651)

### 解决方案 3：

- 选择 “Advanced EEE”，并设置为 “Disabled”。
- 选择 “ARP Offload”，并设置为 “Disabled”。
- 选择 “Energy-Efficient Ethernet”，并设置为 “Disabled”。
- 选择 “Flow Control”，并设置为 “Disabled”。
- 选择 “Green Ethernet”，并设置为 “Disabled”。
- 点击 “Ok”，并等待网络连接恢复。
- 再次尝试连接服务器。

![](https://support.hytale.com/hc/article_attachments/45419639868699)

### 解决方案 4：

如果以上解决方案均未生效，则需要采取更为彻底的方式。此操作具有较强的侵入性，并且由于默认值不会被保留，若不重新安装驱动，可能较难恢复原状。

以下数值来源于 Reddit：
[https://old.reddit.com/r/buildapc/comments/tft3u0/is_realtek_25gbe_lan_issue_fixed/k9evtu0/](https://old.reddit.com/r/buildapc/comments/tft3u0/is_realtek_25gbe_lan_issue_fixed/k9evtu0/)

1. Advanced EEE - Disabled
2. ARP Offload - Disabled
3. EEE Max Support Speed - 1.0 Gbps Full Duplex
4. Energy-Efficient Ethemet - Disabled
5. Flow Control - Disabled
6. Gigabit Lite - Disabled
7. Green Ethemet - Disabled
8. Interrupt Moderation - Disabled
9. IPv4 Checksum Offload - Rx & Tx Enabled
10. Jumbo Frame - Disabled
11. Large Send Offload v2 (IPv4) - Disabled
12. Large Send Offload v2 (IPv6) - Disabled
13. Maximum Number of RSS Queues - 4 Queues
14. Network Address - Not Present
15. NS Offload - Disabled
16. Power Saving Mode - Disabled
17. Priority & VLAN - Disabled
18. Receive Buffers - 512
19. Receive Side Scaling - Enabled
20. Shutdown Wake-On-Lan - Disabled
21. Speed & Duplex - Auto
22. TCP Checksum Offload (IPv4) - Disabled
23. TCP Checksum Offload (IPv6) - Disabled
24. Transmit Buffers - 1024 (/2048)
25. UDP Checksum Offload (IPv4) - Disabled
26. UDP Checksum Offload (IPv6) - Disabled
27. VLAN ID - 0
28. Wake on Magic Packet - Disabled
29. Wake on magic packet when system is in the S0ix power state - Disabled
30. Wake on pattern match - Disabled
31. WOL & Shutdown Link Speed - Not Speed Down
