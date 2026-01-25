---
displayed_sidebar: gameFeaturesSidebar
sidebar_position: 4
---

# Hytale 服务器手册

:::tip[提示：]

这篇文章来自 Hytale 官方，我们仅对原文进行了翻译和排版处理。

> 原文链接：[https://support.hytale.com/hc/en-us/articles/45326769420827-Hytale-Server-Manual](https://support.hytale.com/hc/en-us/articles/45326769420827-Hytale-Server-Manual)<br />
> 上次更新时间：2026/01/19 08:57

:::

本文介绍了专用 Hytale 服务器的搭建、配置与运行。

:::info[注意：]

**目标读者:** 服务器管理员以及自行托管专用服务器的玩家。

:::

## 目录

| 章节 | 主题 |
| :--- | :--- |
| [服务器搭建](#服务器搭建) | Java 安装、服务器文件、系统要求 |
| [运行 Hytale 服务器](#运行-hytale-服务器) | 启动命令、身份验证、端口、防火墙、文件结构 |
| [技巧与提示](#技巧与提示) | 模组、AOT 缓存、Sentry、推荐插件、视距 |
| [多服务器架构](#多服务器架构) | 玩家转接、重定向、回退、代理构建 |
| [杂项细节](#杂项细节) | JVM 参数、协议更新、配置文件 |
| [未来新增](#未来新增) | 服务器发现、队伍、集成支付、SRV 记录、API 端点 |

## 服务器搭建

Hytale 服务器可运行在任何至少具备 4GB 内存并安装 Java 25 的设备上。支持 x64 与 arm64 架构。

我们建议在服务器运行期间监控 RAM 与 CPU 使用情况，以了解在当前玩家数量与玩法风格下的典型资源消耗——资源使用高度依赖玩家行为。

**通用指导:**

| 资源 | 驱动因素 |
| :--- | :--- |
| CPU  | 玩家数量或实体数量较高（NPC、怪物） |
| RAM  | 已加载的世界区域较大（较高视距、玩家分散探索） |

:::info[注意：]

在没有专用工具的情况下，往往难以判断 Java 进程实际需要多少已分配的 RAM。请尝试为 Java 的 -Xmx 参数设置不同的值以明确限制。内存压力的一个典型表现是由于垃圾回收而导致的 CPU 使用率上升。

:::

### 安装 Java 25

请安装 Java 25。我们推荐使用 [Adoptium](https://adoptium.net/temurin/releases)。

#### 确认安装

通过运行以下命令验证安装：

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

> **适用场景:** 快速测试。更新维护较为繁琐。

在启动器安装目录中找到以下文件：

```
Windows：%appdata%\Hytale\install\release\package\game\latest
Linux：$XDG_DATA_HOME/Hytale/install/release/package/game/latest
MacOS：~/Application Support/Hytale/install/release/package/game/latest
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

将 `Server` 文件夹与 `Assets.zip` 复制到目标服务器目录。

#### Hytale Downloader CLI

> **适用场景:** 生产环境服务器。便于保持更新。

这是一个使用 OAuth2 身份验证下载 Hytale 服务器与资源文件的命令行工具。请参阅压缩包内的 `QUICKSTART.md`。

**下载:** [hytale-downloader.zip（Linux 与 Windows）](https://downloader.hytale.com/hytale-downloader.zip)

| 命令 | 说明 |
| :--- | :--- |
| `./hytale-downloader` | 下载最新版本 |
| `./hytale-downloader -print-version` | 显示游戏版本而不下载 |
| `./hytale-downloader -version` | 显示 hytale-downloader 版本 |
| `./hytale-downloader -check-update` | 检查 hytale-downloader 更新 |
| `./hytale-downloader -download-path game.zip` | 下载到指定文件 |
| `./hytale-downloader -patchline pre-release` | 从预发布（pre-release）渠道下载 |
| `./hytale-downloader -skip-update-check` | 跳过自动更新检查 |

## 运行 Hytale 服务器

使用以下命令启动服务器：

```console
java -XX:AOTCache=HytaleServer.aot -jar HytaleServer.jar --assets Assets.zip
```

### 身份验证

首次启动后，请对服务器进行身份验证。

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

完成身份验证后，服务器即可接受玩家连接。

#### 其他身份验证信息

Hytale 服务器需要身份验证，以启用与服务 API 的通信并防止滥用。

:::info[注意：]

为防止早期滥用，每个 Hytale 游戏许可证最多允许 100 台服务器。如需更大容量，请购买额外许可证或申请服务器提供商账户。

:::

如果需要为大量服务器进行身份验证，或自动、动态地为服务器完成身份验证，请阅读[《服务器提供商身份验证指南》](/game-features/multiplayer/server-provider-authentication-guide.md)以获取详细信息。

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

默认端口为 **5520**。可使用 `--bind` 参数进行修改：

```console
java -jar HytaleServer.jar --assets Assets.zip --bind 3500
```

### 防火墙与网络配置

Hytale **通过 UDP 使用 QUIC 协议**（非 TCP）。请相应配置防火墙与端口转发。

#### 端口转发

如果服务器位于路由器之后，请将 **UDP 端口 5520**（或自定义端口）转发至服务器设备。无需进行 TCP 转发。

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

在大多数情况下，QUIC 能很好地处理 NAT 穿透。如果玩家连接存在问题：

- 确保端口转发明确为 **UDP**，而非 TCP
- 对称型 NAT 可能导致问题——可考虑使用 VPS 或专用服务器
- 位于运营商级 NAT 之后的玩家（移动网络中常见）作为客户端通常可以正常连接

### 文件结构

| 路径 | 说明 |
| :--- | :--- |
| `.cache/` | 优化文件缓存 |
| `logs/` | 服务器日志文件 |
| `mods/` | 已安装的模组 |
| `universe/` | 世界与玩家存档数据 |
| `bans.json` | 被封禁的玩家 |
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

每个世界都运行在各自的主线程上，并将并行任务卸载到共享线程池中。

---

## 技巧与提示

### 安装模组

从 [CurseForge](https://www.curseforge.com/hytale) 等来源下载模组（`.zip` 或 `.jar`），并放入 `mods/` 目录。

### 禁用 Sentry 崩溃报告

:::info[注意：]

在进行插件开发时请禁用 Sentry。

:::

我们使用 Sentry 追踪崩溃。使用 `--disable-sentry` 可避免提交开发阶段的错误：

```console
java -jar HytaleServer.jar --assets Assets.zip --disable-sentry
```

### 利用预先编译缓存

服务器自带预训练的 AOT 缓存（`HytaleServer.aot`），可通过跳过 JIT 预热来缩短启动时间。参见 [JEP-514](https://openjdk.org/jeps/514)。

```console
java -XX:AOTCache=HytaleServer.aot -jar HytaleServer.jar --assets Assets.zip
```

### 推荐插件

我们在 Nitrado 与 Apex Hosting 的开发合作伙伴维护了常见托管需求的插件：

| 插件 | 说明 |
| :--- | :--- |
| [Nitrado:WebServer](https://github.com/nitrado/hytale-plugin-webserver) | Web 应用与 API 的基础插件 |
| [Nitrado:Query](https://github.com/nitrado/hytale-plugin-query) | 通过 HTTP 暴露服务器状态（玩家数量等） |
| [Nitrado:PerformanceSaver](https://github.com/nitrado/hytale-plugin-performance-saver) | 根据资源使用情况动态限制视距 |
| [ApexHosting:PrometheusExporter](https://github.com/apexhosting/hytale-plugin-prometheus) | 暴露详细的服务器与 JVM 指标 |

### 视距

视距是 RAM 使用的主要驱动因素。我们建议将最大视距限制为 **12 个区块（384 个方块）**，以兼顾性能与玩法。

对比而言：Minecraft 服务器默认视距为 10 个区块（160 个方块）。Hytale 默认的 384 个方块大致相当于 Minecraft 的 24 个区块。默认设置下 RAM 使用更高——请根据预期玩家数量进行调优。

---

## 多服务器架构

Hytale 原生支持在服务器之间路由玩家，无需像 BungeeCord 这样的反向代理。

### 玩家转接

将已连接的玩家转移至另一台服务器。服务器会发送一个包含目标主机、端口以及可选 4KB 负载的转接数据包。客户端会打开到目标的全新连接，并在握手期间提交该负载。

```java
PlayerRef.referToServer(@Nonnull final String host, final int port, @Nullable byte[] data)
```

:::warning[警告：]

该负载通过客户端传输，可能被篡改。请对负载进行加密签名（例如使用共享密钥的 HMAC），以便接收服务器验证其真实性。

:::

**使用场景:** 在游戏服务器之间转移玩家、传递会话上下文、在匹配系统之后限制访问。

:::info[注意：]

**即将推出:** 按顺序尝试的目标数组，用于回退连接。

:::

### 连接重定向

在连接握手期间，服务器可以拒绝玩家并将其重定向到另一台服务器。客户端会自动连接至被重定向的地址。

```java
PlayerSetupConnectEvent.referToServer(@Nonnull final String host, final int port, @Nullable byte[] data)
```

**使用场景:** 负载均衡、区域服务器路由、强制先进入大厅。

### 断线回退

当玩家意外断线（服务器崩溃、网络中断）时，客户端会自动重新连接到预先配置的回退服务器，而不是返回主菜单。

**使用场景:** 在游戏服务器崩溃后将玩家送回大厅、在重启期间保持玩家参与度。

:::info[注意：]

**即将推出:** 预计在抢先体验上线后数周内实现回退数据包。

:::

### 构建代理

使用 [Netty QUIC](https://github.com/netty/netty-incubator-codec-quic) 构建自定义代理服务器。Hytale 客户端与服务器通信完全基于 QUIC。

数据包定义与协议结构位于 `HytaleServer.jar` 中：

```java
com.hypixel.hytale.protocol.packets
```

可使用这些内容对客户端与后端服务器之间的流量进行解码、检查、修改或转发。

---

## 杂项细节

### Java 命令行参数

有关 `-Xms` 与 `-Xmx` 等用于控制堆大小的主题，请参阅[《最重要的 JVM 参数指南》](https://www.baeldung.com/jvm-parameters)。

### 协议更新

Hytale 协议使用哈希来验证客户端与服务器的兼容性。如果哈希不完全一致，连接将被拒绝。

> **当前限制:** 客户端与服务器必须使用完全相同的协议版本。当我们发布更新时，服务器必须立即更新，否则使用新版本的玩家将无法连接。

:::info[注意：]

**即将推出:** 协议容忍机制，允许客户端与服务器之间存在 ±2 个版本差异。服务器运营者将拥有更新窗口期，而不会失去玩家连接。

:::

### 配置文件

配置文件（`config.json`、`permissions.json` 等）会在服务器启动时读取，并在发生游戏内操作时写入（例如通过命令分配权限）。服务器运行期间进行的手动修改很可能会被覆盖。

### Maven Central 构件

HytaleServer jar 将发布至 Maven Central，供模组项目作为依赖使用。

```xml
<dependency>
    <groupId>com.hypixel.hytale</groupId>
    <artifactId>Server</artifactId>
</dependency>
```

包括版本在内的具体细节将在上线时确定。请关注模组社区资源以获取最新信息。

---

## 未来新增

### 服务器与小游戏发现

一个可从主菜单访问的发现目录，玩家可浏览并查找服务器与小游戏。服务器运营者可选择加入目录，将内容直接推广给玩家。

**上架要求:**

| 要求 | 说明 |
| :--- | :--- |
| **服务器运营者规范** | 服务器必须遵守运营者规范与社区标准 |
| **自我评级** | 运营者必须准确为服务器内容评级，评级将用于内容过滤与家长控制 |
| **执行** | 违反自我评级的服务器将依据服务器运营者政策受到处罚 |

**玩家数量验证:**

服务器发现中显示的玩家数量来自客户端遥测数据，而非服务器自行上报。这可防止数量伪造，确保玩家在浏览服务器时信任所见数据。服务器仍可向通过非发现方式添加服务器的用户显示未经验证的玩家数量。

### 队伍

一个允许玩家组队并在服务器转移与小游戏队列中保持在一起的系统。

**与服务器发现的集成:**

玩家可与队伍一同浏览服务器并共同加入。加入前会显示队伍人数要求与限制，使团队提前了解是否可以一起游玩。

该系统为无缝的社交体验奠定基础，使好友无需手动协调即可作为一个整体在 Hytale 生态中行动。

### 集成支付系统

一个内置于客户端的支付网关，服务器可用于向玩家收款。可选但强烈建议使用。

**对服务器运营者的好处:**

- 无需处理支付细节或搭建基础设施即可收款
- 交易通过受信任且安全的系统处理

**对玩家的好处:**

- 无需访问外部网站
- 所有交易均安全且可追溯
- 支付信息保留在 Hytale 生态系统内

### SRV 记录支持

SRV 记录允许玩家使用域名（例如 `play.example.com`）而无需指定端口进行连接，由 DNS 解析实际的服务器地址与端口。

**当前状态:** 不支持，正在评估中。

**尚未提供的原因:**

目前尚无经过实战检验的 C# SRV 记录解析库。现有方案要么需要引入完整的 DNS 客户端实现，增加不必要的复杂度与潜在稳定性风险，要么尚未达到我们对核心网络功能的生产就绪要求。

我们正在评估替代方案，并将在具备合适解决方案后重新考虑。

### 第一方 API 端点

已通过身份验证的服务器将可访问官方 API 端点，用于玩家数据、版本信息与服务器操作。这些端点可减少对第三方服务的依赖，并直接从 Hytale 提供权威数据。

**计划中的端点:**

| 端点 | 说明 |
| :--- | :--- |
| **UUID ↔ 名称查找** | 在玩家名称与 UUID 之间相互解析，支持单条与批量查询 |
| **游戏版本** | 查询当前游戏版本、协议版本并检查更新 |
| **玩家档案** | 获取玩家资料，包括外观、头像渲染与公开资料信息 |
| **服务器遥测** | 上报服务器状态、玩家数量与发现目录所需的元数据 |
| **举报** | 举报玩家违反 ToS |
| **付款** | 使用内置支付网关处理支付 |

**正在考虑中:**

| 端点 | 说明 |
| :--- | :--- |
| **全局制裁** | 查询玩家是否存在平台级制裁（非服务器专属封禁） |
| **好友列表** | 在具备适当权限的情况下获取玩家好友列表，用于社交功能 |
| **Webhook 订阅** | 订阅事件推送通知，如玩家改名或制裁状态更新 |

**设计目标:**

- **宽松的速率限制:** 提供批量端点与利于缓存的响应，以支持大型网络
- **经身份验证的访问:** 所有端点均需服务器身份验证，以防止滥用
- **版本化 API:** 提供稳定契约，并为破坏性变更设置弃用窗口

还有更多问题？[提交请求](https://support.hytale.com/hc/en-us/requests/new)
