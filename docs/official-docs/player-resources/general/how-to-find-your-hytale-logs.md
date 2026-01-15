---
displayed_sidebar: officialDocsSidebar
sidebar_position: 2
---

# 如何查找你的 Hytale 日志

> 原文链接：[https://support.hytale.com/hc/en-us/articles/45315447521947-How-to-Find-Your-Hytale-Logs](https://support.hytale.com/hc/en-us/articles/45315447521947-How-to-Find-Your-Hytale-Logs)<br />
> 上次更新时间：2026/01/14 07:20

## 定位日志文件

要查找日志文件，请先打开 Hytale 启动器，并点击右上角的设置齿轮图标。随后，在 _Directory_（目录）下方可以看到一个 _Open directory_（打开目录）按钮，点击后将打开你的 Hytale 游戏目录。

![](https://support.hytale.com/hc/article_attachments/45315420914715)

在该文件夹中，你会看到一个 `logs` 文件夹。打开它，并找到最新的日志文件，通常这就是我们所需要的文件。你可以将该文件拖出或复制出来，以便与我们的团队分享。

### 日志文件位置

#### Hytale 启动器

| 操作系统 | 文件路径 |
| :--- | :--- |
| Windows | `%APPDATA%\Hytale\hytale-launcher.log` |
| macOS | `~/Library/Application Support/Hytale/hytale-launcher.log` |
| Linux | `$XDG_DATA_HOME/Hytale` 或 `~/.local/share/Hytale/hytale-launcher.log` |

#### Hytale 客户端

| 操作系统 | 文件路径 |
| :--- | :--- |
| Windows | `%APPDATA%\Hytale\UserData\logs` |
| macOS | `~/Library/Application Support/Hytale/UserData/Logs` |
| Linux | `$XDG_DATA_HOME/Hytale/UserData/logs` 或 `~/.local/share/Hytale/UserData/logs` |

#### Hytale 服务器

| 操作系统 | 文件路径 |
| :--- | :--- |
| Windows | `%APPDATA%\Hytale\UserData\Saves[world]\logs` |
| macOS | `~/Library/Application Support/Hytale/UserData/Saves/[world]/logs` |
| Linux | `$XDG_DATA_HOME/Hytale/UserData/Saves/[world]/logs` 或 `~/.local/share/Hytale/UserData/Saves/[world]/logs` |

## 与我们分享日志文件

如果你遇到了 Bug，或被要求提供日志，可以通过提交 Bug 报告的方式将日志文件分享给我们的支持团队。前往你的 Hytale 账户，并点击 [Bugs & Feedback](https://accounts.hytale.com/feedback)（错误与反馈）选项卡。

填写你正在遇到的问题所需的相关信息，并在提交报告前，于文件上传区域附上日志文件。
