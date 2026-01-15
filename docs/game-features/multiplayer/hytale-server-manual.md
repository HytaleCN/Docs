---
displayed_sidebar: gameFeaturesSidebar
sidebar_position: 4
---

# Hytale 服务器手册

> 原文链接：[https://support.hytale.com/hc/en-us/articles/45326769420827-Hytale-Server-Manual](https://support.hytale.com/hc/en-us/articles/45326769420827-Hytale-Server-Manual)<br />
> 上次更新时间：2026/01/12 11:12

本文涵盖了专用 Hytale 服务器的安装、配置与运行。

:::info[注意：]

**目标读者:** 服务器管理员，以及托管专用服务器的玩家。

:::

## 目录

| 章节 | 主题 |
| :--- | :--- |
| [服务器设置](#服务器设置) | Java 安装、服务器文件、系统需求 |
| [运行 Hytale 服务器](#运行-hytale-服务器) | 启动命令、认证、端口、防火墙、文件结构 |
| [技巧与窍门](#技巧与窍门) | 模组、AOT 缓存、Sentry、推荐插件、视距 |
| [多服务器架构](#多服务器架构) | 玩家转接、重定向、回退、代理构建 |
| [杂项细节](#杂项细节) | JVM 参数、协议更新、配置文件 |
| [未来新增内容](#未来新增内容) | 服务器发现、队伍、集成支付、SRV 记录、API 端点 |

## 服务器设置

Hytale 服务器可以运行在任何至少具备 4GB 内存并安装了 Java 25 的设备上。支持 x64 与 arm64 架构。

我们建议在服务器运行期间监控 RAM 与 CPU 的使用情况，以了解在你的玩家数量与游玩方式下的典型资源消耗——资源使用情况在很大程度上取决于玩家行为。

**通用参考:**

| 资源 | 负载来源                                 |
| :--- | :--------------------------------------- |
| CPU  | 高玩家数量或高实体数量（NPC、生物）      |
| RAM  | 加载的大世界区域（高视距、玩家独立探索） |

:::info[注意：]

在没有专用工具的情况下，很难准确判断 Java 进程实际需要多少已分配的 RAM。请通过尝试不同的 Java `-Xmx` 参数值来设置明确的上限。内存压力的一个典型表现是由于垃圾回收而导致的 CPU 使用率上升。

:::

### 安装 Java 25

请安装 Java 25。我们推荐使用 [Adoptium](https://adoptium.net/temurin/releases)。

#### 确认安装

通过运行以下命令来验证安装：

```console
java --version
```

预期输出：

```console
openjdk 25.0.1 2025-10-21 LTS
OpenJDK Runtime Environment Temurin-25.0.1+8 (build 25.0.1+8-LTS)
OpenJDK 64-Bit Server VM Temurin-25.0.1+8 (build 25.0.1+8-LTS, mixed mode, sharing)
```

### 服务器文件

获取服务器文件有两种方式：

1. 从启动器安装目录手动复制
2. 使用 Hytale Downloader CLI

#### 从启动器手动复制

> **适用场景:** 快速测试。不便于保持更新。

在你的启动器安装目录中找到以下文件：

```
Windows: %appdata%\Hytale\install\release\package\game\latest
Linux: $XDG_DATA_HOME/Hytale/install/release/package/game/latest
MacOS: ~/Application Support/Hytale/install/release/package/game/latest
```

列出目录内容：

```console
ls
```

预期输出：

```console
    Directory: C:\Users\...\Hytale\install\release\package\game\latest

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        12/25/2025   9:25 PM                Client
d-----        12/25/2025   9:25 PM                Server
-a----        12/25/2025   9:04 PM     3298097359 Assets.zip
```

将 `Server` 文件夹与 `Assets.zip` 复制到你的目标服务器目录中。

#### Hytale Downloader CLI

> **适用场景:** 生产服务器。易于保持更新。

这是一个命令行工具，可通过 OAuth2 认证下载 Hytale 服务器与资源文件。请参阅压缩包内的 `QUICKSTART.md`。

**下载:** [hytale-downloader.zip（Linux 与 Windows）](https://downloader.hytale.com/hytale-downloader.zip)

| 命令 | 描述 |
| :--- | :--- |
| `./hytale-downloader` | 下载最新版本 |
| `./hytale-downloader -print-version` | 在不下载的情况下显示游戏版本 |
| `./hytale-downloader -version` | 显示 hytale-downloader 版本 |
| `./hytale-downloader -check-update` | 检查 hytale-downloader 更新 |
| `./hytale-downloader -download-path game.zip` | 下载到指定文件 |
| `./hytale-downloader -patchline pre-release` | 从 pre-release 渠道下载 |
| `./hytale-downloader -skip-update-check` | 跳过自动更新检查 |

## 运行 Hytale 服务器

使用以下命令启动服务器：

```console
java -jar HytaleServer.jar --assets PathToAssets.zip
```

### 认证

首次启动后，请对服务器进行认证。

```console
> /auth login device
===================================================================
DEVICE AUTHORIZATION
===================================================================
Visit: https://accounts.hytale.com/device
Enter code: ABCD-1234
Or visit: https://accounts.hytale.com/device?user_code=ABCD-1234
===================================================================
Waiting for authorization (expires in 900 seconds)...

[User completes authorization in browser]

> Authentication successful! Mode: OAUTH_DEVICE
```

认证完成后，你的服务器即可接受玩家连接。

#### 附加认证信息

Hytale 服务器需要认证，以启用与服务 API 的通信并防止滥用。

:::info[注意：]

每个 Hytale 游戏许可证最多允许 100 台服务器，以防止早期滥用。如果你需要更大的容量，请购买额外许可证或申请 Server Provider 账号。

:::

如果你需要为大量服务器进行认证，或希望自动、动态地为服务器完成认证，请阅读[《服务器提供商认证指南》](/game-features/multiplayer/server-provider-authentication-guide.md)以获取详细信息。

### 帮助

查看所有可用参数：

```console
java -jar HytaleServer.jar --help
```

预期输出：

```console
Option                                   Description
------                                   -----------
--accept-early-plugins                   Acknowledge that loading early plugins
                                           is unsupported and may cause stability issues
--allow-op
--assets <Path>                          Asset directory (default: ..\HytaleAssets)
--auth-mode <authenticated|offline>      Authentication mode (default: AUTHENTICATED)
-b, --bind <InetSocketAddress>           Address to listen on (default: 0.0.0.0:5520)
--backup                                 Enable automatic backups
--backup-dir <Path>                      Backup directory
--backup-frequency <Integer>             Backup interval in minutes (default: 30)
[...]
```

### 端口

默认端口为 5520。可通过 `--bind` 参数进行修改：

```console
java -jar HytaleServer.jar --assets PathToAssets.zip --bind 0.0.0.0:25565
```

### 防火墙与网络配置

Hytale 使用 **基于 UDP 的 QUIC 协议**（而非 TCP）。请据此配置防火墙与端口转发。

#### 端口转发

如果服务器位于路由器之后，请将 **UDP 端口 5520**（或你的自定义端口）**转发** 到服务器主机。无需进行 TCP 转发。

#### 防火墙规则

**Windows Defender 防火墙:**

```console
New-NetFirewallRule -DisplayName "Hytale Server" -Direction Inbound -Protocol UDP -LocalPort 5520 -Action Allow
```

**Linux（iptables）:**

```console
sudo iptables -A INPUT -p udp --dport 5520 -j ACCEPT
```

**Linux（ufw）:**

```console
sudo ufw allow 5520/udp
```

#### NAT 注意事项

在大多数情况下，QUIC 对 NAT 穿透的支持良好。如果玩家无法连接：

- 确认端口转发针对的是 **UDP**，而非 TCP
- 对称 NAT 配置可能导致问题——请考虑使用 VPS 或独立服务器
- 位于运营商级 NAT 之后的玩家（在移动网络中较常见）作为客户端通常可以正常连接

### 文件结构

| 路径 | 描述 |
| :--- | :--- |
| `.cache/` | 优化文件缓存 |
| `logs/` | 服务器日志文件 |
| `mods/` | 已安装的模组 |
| `universe/` | 世界与玩家存档数据 |
| `bans.json` | 被封禁玩家 |
| `config.json` | 服务器配置 |
| `permissions.json` | 权限配置 |
| `whitelist.json` | 白名单玩家 |

#### 宇宙结构

`universe/worlds/` 目录包含所有可游玩的世界。每个世界都有其独立的 `config.json`：

```json
{
  "Version": 4,
  "UUID": {
    "$binary": "j2x/idwTQpen24CDfH1+OQ==",
    "$type": "04"
  },
  "Seed": 1767292261384,
  "WorldGen": {
    "Type": "Hytale",
    "Name": "Default"
  },
  "WorldMap": {
    "Type": "WorldGen"
  },
  "ChunkStorage": {
    "Type": "Hytale"
  },
  "ChunkConfig": {},
  "IsTicking": true,
  "IsBlockTicking": true,
  "IsPvpEnabled": false,
  "IsFallDamageEnabled": true,
  "IsGameTimePaused": false,
  "GameTime": "0001-01-01T08:26:59.761606129Z",
  "RequiredPlugins": {},
  "IsSpawningNPC": true,
  "IsSpawnMarkersEnabled": true,
  "IsAllNPCFrozen": false,
  "GameplayConfig": "Default",
  "IsCompassUpdating": true,
  "IsSavingPlayers": true,
  "IsSavingChunks": true,
  "IsUnloadingChunks": true,
  "IsObjectiveMarkersEnabled": true,
  "DeleteOnUniverseStart": false,
  "DeleteOnRemove": false,
  "ResourceStorage": {
    "Type": "Hytale"
  },
  "Plugin": {}
}
```

每个世界都在其独立的主线程上运行，并将并行工作卸载到共享的线程池中。

---

## 技巧与窍门

### 安装模组

从 [CurseForge](https://www.curseforge.com/hytale) 等来源下载模组（`.zip` 或 `.jar`），并将其放入 `mods/` 文件夹中。

### 禁用 Sentry 崩溃报告

:::info[注意：]

在进行插件的活跃开发期间，请禁用 Sentry。

:::

我们使用 Sentry 来追踪崩溃。使用 `--disable-sentry` 禁用它，以避免提交你的开发错误：

```console
java -jar HytaleServer.jar --assets PathToAssets.zip --disable-sentry
```

### 利用预先编译缓存

服务器自带一个预训练的 AOT 缓存（`HytaleServer.aot`），可通过跳过 JIT 预热来提升启动速度。参见 [JEP-514](https://openjdk.org/jeps/514)。

```console
java -XX:AOTCache=HytaleServer.aot -jar HytaleServer.jar --assets PathToAssets.zip
```

### 推荐插件

我们在 Nitrado 与 Apex Hosting 的开发合作伙伴维护了一些用于常见服务器托管需求的插件：

| 插件 | 描述 |
| :--- | :--- |
| [Nitrado:WebServer](https://github.com/nitrado/hytale-plugin-webserver) | Web 应用与 API 的基础插件 |
| [Nitrado:Query](https://github.com/nitrado/hytale-plugin-query) | 通过 HTTP 暴露服务器状态（玩家数量等） |
| [Nitrado:PerformanceSaver](https://github.com/nitrado/hytale-plugin-performance-saver) | 根据资源使用情况动态限制视距 |
| [ApexHosting:PrometheusExporter](https://github.com/apexhosting/hytale-plugin-prometheus) | 暴露详细的服务器与 JVM 指标 |

### 可视距离

可视距离是 RAM 使用的主要驱动因素。我们建议将最大可视距离限制为 **12 个区块（384 格）**，以兼顾性能与玩法。

作为对比：Minecraft 服务器默认可视距离为 10 个区块（160 格）。Hytale 的默认 384 格大致相当于 24 个 Minecraft 区块。在默认设置下请预期更高的 RAM 使用量——请根据你的预期玩家数量调整该值。

---

## 多服务器架构

Hytale 原生支持在服务器之间路由玩家，无需像 BungeeCord 这样的反向代理。

### 玩家转介

将已连接的玩家转移到另一台服务器。服务器会发送一个包含目标主机、端口以及一个可选 4KB 负载的转接数据包。客户端会建立到目标服务器的新连接，并在握手时提交该负载。

```java
PlayerRef.referToServer(@Nonnull final String host, final int port, @Nullable byte[] data)
```

:::warning[警告：]

该负载会经由客户端传输，可能被篡改。请对负载进行加密签名（例如使用共享密钥的 HMAC），以便接收服务器验证其真实性。

:::

**使用场景:** 在游戏服务器之间转移玩家、传递会话上下文、通过匹配系统限制访问。

:::info[注意：]

**即将推出:** 按顺序尝试多个目标的回退连接数组。

:::

### 连接重定向

在连接握手期间，服务器可以拒绝玩家并将其重定向到另一台服务器。客户端会自动连接到被重定向的地址。

```java
PlayerSetupConnectEvent.referToServer(@Nonnull final String host, final int port, @Nullable byte[] data)
```

**使用场景:** 负载均衡、区域服务器路由、强制先进入大厅。

### 断开回退

当玩家意外断开连接（服务器崩溃、网络中断）时，客户端会自动重连到预配置的回退服务器，而不是返回主菜单。

**使用场景:** 游戏服务器崩溃后将玩家送回大厅、在重启期间保持玩家参与度。

:::info[注意：]

**即将推出:** 预计在抢先体验版发布后的数周内实现回退数据包。

:::

### 构建代理

使用 [Netty QUIC](https://github.com/netty/netty-incubator-codec-quic) 构建自定义代理服务器。Hytale 在客户端与服务器通信中专门使用 QUIC。

数据包定义与协议结构位于 `HytaleServer.jar` 中：

```java
com.hypixel.hytale.protocol.packets
```

你可以使用这些内容在客户端与后端服务器之间解码、检查、修改或转发流量。

---

## 杂项细节

### Java 命令行参数

有关 `-Xms` 与 `-Xmx` 等用于控制堆大小的主题，请参阅 [Guide to the Most Important JVM Parameters（最重要的 JVM 参数指南）](https://www.baeldung.com/jvm-parameters)。

### 协议更新

Hytale 协议使用哈希来验证客户端与服务器的兼容性。如果哈希值不完全匹配，连接将被拒绝。

> **当前限制:** 客户端与服务器必须处于完全相同的协议版本。当我们发布更新时，服务器必须立即更新，否则新版本的玩家将无法连接。

:::info[注意：]

**即将推出:** 协议容差机制，允许客户端与服务器之间存在 ±2 个版本的差异。服务器运营者将获得一个更新窗口，而不会失去玩家连接。

:::

### 配置文件

配置文件（`config.json`、`permissions.json` 等）会在服务器启动时读取，并在发生游戏内操作时写入（例如通过命令分配权限）。在服务器运行期间手动修改这些文件很可能会被覆盖。

### Maven Central 构件

HytaleServer jar 将发布到 Maven Central，以便在模组项目中作为依赖使用。

```xml
<dependency>
    <groupId>com.hypixel.hytale</groupId>
    <artifactId>Server</artifactId>
</dependency>
```

包括版本策略在内的具体细节将在发布时确定。请关注模组社区资源，以获取使用这些依赖的最新信息。

---

## 未来新增内容

### 服务器与小游戏发现

一个可从主菜单访问的发现目录，玩家可在其中浏览并查找服务器与小游戏。服务器运营者可以选择加入该目录，直接向玩家推广其内容。

**列出要求:**

| 要求 | 描述 |
| :--- | :--- |
| **服务器运营者指南** | 服务器必须遵守运营者指南与社区标准 |
| **自评级** | 运营者必须准确为服务器内容进行评级，评级用于内容过滤与家长控制 |
| **执法** | 违反自评级的服务器将根据服务器运营政策受到执法措施 |

**玩家数量验证:**

服务器发现中显示的玩家数量来自客户端遥测数据，而非服务器上报。这可以防止人数造假，并确保玩家在浏览服务器时看到可信的数据。服务器仍然可以向通过服务器发现之外方式添加服务器的用户报告未经验证的玩家数量。

### 队伍

一个队伍系统，使玩家能够组队，并在服务器转移与小游戏队列中保持在一起。

**与服务器发现的集成:**

玩家可以与队伍一起浏览服务器并一同加入。在加入之前即可看到队伍规模要求与限制，从而提前了解是否可以一起游玩。

该系统为无缝的社交体验奠定了基础，使好友能够作为一个整体在 Hytale 生态中流转，而无需手动协调。

### 集成式支付系统

一个内置于客户端的支付网关，服务器可用其接受玩家付款。可选，但我们鼓励使用。

**服务器运营者的优势:**

- 无需处理支付细节或搭建支付基础设施即可接受付款
- 交易通过可信且安全的系统处理

**玩家的优势:**

- 无需访问外部网站
- 所有交易均安全且可追踪
- 支付信息始终留在 Hytale 生态系统中

### SRV 记录支持

SRV 记录允许玩家使用域名（例如 `play.example.com`）而无需指定端口进行连接，由 DNS 负责解析实际的服务器地址与端口。

**当前状态:** 不支持，正在评估中。

**为何尚不可用:**

目前尚无经过充分实战验证的 C# SRV 记录解析库。现有方案要么需要引入完整的 DNS 客户端实现，从而增加不必要的复杂性与潜在的稳定性风险，要么尚未达到我们对核心网络功能所要求的生产就绪水平。

我们正在评估替代方案，并将在合适的解决方案出现后重新审视该功能。

### 第一方 API 端点

已认证的服务器将可以访问官方 API 端点，用于玩家数据、版本信息与服务器运维。这些端点减少了对第三方服务的依赖，并直接提供来自 Hytale 的权威数据。

**计划中的端点:**

| 端点 | 描述 |
| :--- | :--- |
| **UUID ↔ 名称查找** | 在玩家名称与 UUID 之间进行解析，支持单个与批量查询 |
| **游戏版本** | 查询当前游戏版本、协议版本并检查更新 |
| **玩家档案** | 获取玩家档案数据，包括外观、头像渲染与公开资料 |
| **服务器遥测** | 上报服务器状态、玩家数量与用于发现系统的元数据 |
| **举报** | 举报玩家违反 ToS |
| **付款** | 使用内置支付网关处理付款 |

**正在考虑中:**

| 端点 | 描述 |
| :--- | :--- |
| **UUID ↔ 名称查找** | 在玩家名称与 UUID 之间进行解析，支持单个与批量查询 |
| **全局制裁** | 查询玩家是否存在平台级制裁（非服务器专属封禁） |
| **好友列表** | 在适当权限下获取玩家好友列表，用于社交功能 |
| **Webhook 订阅** | 订阅玩家名称变更或制裁更新等事件的推送通知 |

**设计目标:**

- **宽松的速率限制:** 提供批量端点与易于缓存的响应，以支持大型网络
- **已认证的访问:** 所有端点均需服务器认证，以防止滥用
- **版本化 API:** 稳定的接口契约，并为破坏性变更提供弃用窗口

还有更多问题？[提交请求](https://support.hytale.com/hc/en-us/requests/new)
