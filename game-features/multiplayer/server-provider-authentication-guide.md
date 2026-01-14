---
sidebar_position: 3
---

# 服务器提供商认证指南

> 原文链接：[https://support.hytale.com/hc/en-us/articles/45328341414043-Server-Provider-Authentication-Guide](https://support.hytale.com/hc/en-us/articles/45328341414043-Server-Provider-Authentication-Guide)
> 上次更新时间：2026/01/15 00:58

本指南说明服务器托管提供商如何使用具备 `sessions.unlimited_servers` 权限的账户，对 Hytale 专用服务器进行认证。

## 前置条件

**由于申请数量庞大以及临近上线，我们决定在自动化方案到位之前，暂时关闭申请流程。**

**很抱歉目前无法向你授予该权限。如果你仍计划向客户提供 Hytale 服务器，可以购买多个标准许可证，并使用每个许可证生成 100 个服务器。**

**我们正在开发一套自动化解决方案，届时将允许服务器提供商再次进行注册。**

## 简要说明

**面向希望为 100+ 台服务器实现自动化、0 次点击服务器认证的 GSP 与服务器网络运营方：**

1. ~~获取权限 - 通过向 [Hytale 支持团队](https://support.hytale.com/hc/en-us/requests/new) 提供公司信息以获取 `sessions.unlimited_servers` 权限。~~**你已无法再获取该权限。请参阅上文。**
2. **一次性获取令牌** - 使用 [Device Code Flow](#方法-B：Device-Code-Flow（RFC-8628）) 进行认证并获取 `refresh_token`。
3. **创建会话** - 调用 `/my-account/get-profiles`，然后调用 `/game-session/new` 以获取 `sessionToken` 与 `identityToken`。
4. **将令牌传递给服务器** - 使用以下方式启动每个服务器实例：

   ```java
   java -jar HytaleServer.jar \
     --session-token "<sessionToken>" \
     --identity-token "<identityToken>"
   ```

   或通过环境变量：`HYTALE_SERVER_SESSION_TOKEN` 与 `HYTALE_SERVER_IDENTITY_TOKEN`。
5. **在过期前刷新** - 游戏会话在 1 小时后过期。通过 `/oauth2/token` 且使用 `grant_type=refresh_token` 刷新令牌（TTL 为 30 天），并在需要时创建新的游戏会话。

你的部署系统将集中处理令牌管理——客户永远不会看到任何认证提示。

> **计划中：**我们正在开发一个 CLI 工具，用于为 GSP 的部署系统自动获取与刷新令牌。该工具未能赶上上线时间——请关注 GSP Discord 以获取更新。

### Hytale Downloader CLI

若需自动化服务器文件下载与更新，请使用 Hytale Downloader CLI。该工具可处理 OAuth2 认证，并可集成到你的部署流水线中，以保持服务器安装为最新状态。

**下载：**[hytale-downloader.zip（快速开始 + Linux 与 Windows）](https://downloader.hytale.com/hytale-downloader.zip)

完整用法文档请参阅：[《服务器手册：Hytale Downloader CLI》](/game-features/multiplayer/hytale-server-manual.md#Hytale-Downloader-CLI)。

---

## 概览

服务器认证使用 OAuth 2.0 获取令牌，以授权服务器：

1. 创建服务器运营方个人资料的游戏会话
2. 验证加入服务器的玩家
3. 访问游戏资源与版本信息

服务器使用预配置的 `hytale-server` OAuth 客户端：

```
Client ID：hytale-server
Scopes：openid、offline、auth:server
```

---

## OAuth 端点

所有端点均遵循 OAuth 2.0 标准规范（[RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)、[RFC 8628](https://datatracker.ietf.org/doc/html/rfc8628)）。

| 端点 | URL |
| :--- | :--- |
| Authorization | `https://oauth.accounts.hytale.com/oauth2/auth` |
| Token | `https://oauth.accounts.hytale.com/oauth2/token` |
| Device Authorization | `https://oauth.accounts.hytale.com/oauth2/device/auth` |

__**Stage 环境：**将 `hytale.com` 替换为 `arcanitegames.ca`。__

---

## 认证方式

### 方法 A：服务器控制台命令（交互式）

适用于可访问控制台的服务器，使用内置认证命令：

| 命令 | 说明 |
| :--- | :--- |
| `/auth login device` | 启动设备码流程（推荐用于无界面服务器） |
| `/auth login browser` | 启动浏览器 PKCE 流程（需要桌面环境） |
| `/auth select <number>` | 在有多个可用配置文件时选择游戏配置文件 |
| `/auth status` | 检查当前认证状态 |
| `/auth cancel` | 取消进行中的认证流程 |
| `/auth logout` | 清除认证并终止会话 |

**示例流程：**

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

---

### 方法 B：Device Code Flow（RFC 8628）

适用于需要以程序方式获取令牌的自动化或无界面部署。

#### 步骤 1：请求设备码

```bash
curl -X POST "https://oauth.accounts.hytale.com/oauth2/device/auth" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=hytale-server" \
  -d "scope=openid offline auth:server"
```

**响应：**

```json
{
  "device_code": "GmRhmhcxhwAzkoEqiMEg_DnyEysNkuNhszIySk9eS",
  "user_code": "ABCD-1234",
  "verification_uri": "https://accounts.hytale.com/device",
  "verification_uri_complete": "https://accounts.hytale.com/device?user_code=ABCD-1234",
  "expires_in": 900,
  "interval": 5
}
```

#### 步骤 2：向用户展示指引

向用户显示：

- **URL：**`verification_uri` 或 `verification_uri_complete`
- **Code：**`user_code`（使用 `verification_uri` 时）

#### 步骤 3：轮询令牌

按指定 `interval`（间隔，默认 5 秒）轮询令牌端点：

```bash
curl -X POST "https://oauth.accounts.hytale.com/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=hytale-server" \
  -d "grant_type=urn:ietf:params:oauth:grant-type:device_code" \
  -d "device_code=GmRhmhcxhwAzkoEqiMEg_DnyEysNkuNhszIySk9eS"
```

**待授权响应**（用户尚未完成授权）：

```json
{
  "error": "authorization_pending"
}
```

**成功响应：**

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "xreEsdDGrfIaQc...",
  "scope": "openid offline auth:server"
}
```

#### 步骤 4：获取可用配置文件

```bash
curl -X GET "https://account-data.hytale.com/my-account/get-profiles" \
  -H "Authorization: Bearer <access_token>"
```

**响应：**

```json
{
  "owner": "550e8400-e29b-41d4-a716-446655440000",
  "profiles": [
    {
      "uuid": "123e4567-e89b-12d3-a456-426614174000",
      "username": "ServerOperator"
    }
  ]
}
```

#### 步骤 5：创建游戏会话

```bash
curl -X POST "https://sessions.hytale.com/game-session/new" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"uuid": "123e4567-e89b-12d3-a456-426614174000"}'
```

**响应：**

```json
{
  "sessionToken": "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...",
  "identityToken": "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2026-01-07T15:00:00Z"
}
```

`sessionToken` 与 `identityToken` 即服务器用于认证的凭据。

---

### 方法 C：令牌直传（环境变量 / CLI）

适用于由托管提供商在外部获取令牌，并在启动时传递给服务器的场景。

#### 环境变量

| 变量 | 说明 |
| :--- | :--- |
| `HYTALE_SERVER_SESSION_TOKEN` | 会话令牌（JWT） |
| `HYTALE_SERVER_IDENTITY_TOKEN` | 身份令牌（JWT） |
| `HYTALE_SERVER_AUDIENCE` | 覆盖服务器受众（仅用于测试） |

#### CLI 选项

| 选项 | 说明 |
| :--- | :--- |
| `--session-token <token>` | 会话令牌 |
| `--identity-token <token>` | 身份令牌 |
| `--owner-uuid <uuid>` | 通过 UUID 自动选择配置文件 |

**示例：**

```bash
./hytale-server \
  --session-token "eyJhbGciOiJFZERTQSIs..." \
  --identity-token "eyJhbGciOiJFZERTQSIs..." \
  --owner-uuid "123e4567-e89b-12d3-a456-426614174000"
```

或通过环境变量：

```bash
export HYTALE_SERVER_SESSION_TOKEN="eyJhbGciOiJFZERTQSIs..."
export HYTALE_SERVER_IDENTITY_TOKEN="eyJhbGciOiJFZERTQSIs..."
./hytale-server
```

在 `EXTERNAL_SESSION` 模式下，服务器会在令牌过期前 5 分钟自动刷新。

---

### 方法 D：凭据存储 API（插件 / 程序化）

该功能仍在开发中。

适用于希望通过插件以程序方式管理凭据，并在服务器重启后持久化令牌的托管提供商。

#### 接口

```java
public interface IAuthCredentialStore {
    record OAuthTokens(
        @Nullable String accessToken,
        @Nullable String refreshToken,
        @Nullable Instant accessTokenExpiresAt
    ) {}

    void setTokens(@Nonnull OAuthTokens tokens);
    @Nonnull OAuthTokens getTokens();

    void setProfile(@Nullable UUID uuid);
    @Nullable UUID getProfile();

    void clear();
}
```

#### 使用方式

1. 实现 `IAuthCredentialStore` 以持久化令牌（例如数据库、文件、外部服务）
2. 在认证前注册：`ServerAuthManager.getInstance().registerCredentialStore(store)`
3. 服务器会通过存储自动获取并刷新令牌
4. 认证模式将变为 `OAUTH_STORE`

#### 关键行为

- **注册时机：**存储必须在任何认证发生前完成注册
- **令牌获取：**当需要 OAuth 令牌时，服务器调用 `getTokens()`
- **令牌持久化：**成功刷新令牌后，服务器调用 `setTokens()`
- **配置文件选择：**若 `getProfile()` 返回 UUID，将自动选择该配置文件

---

## 游戏会话 API 参考

### 创建会话

为指定配置文件创建新的游戏会话。

```
POST /game-session/new
Host: sessions.hytale.com
Authorization: Bearer <oauth_access_token>
Content-Type: application/json

{"uuid": "<profile_uuid>"}
```

### 获取配置文件

获取已验证账户可用的游戏配置文件。

```
GET /my-account/get-profiles
Host: account-data.hytale.com
Authorization: Bearer <oauth_access_token>
```

### 刷新会话

刷新当前会话以延长其生命周期。

```
POST /game-session/refresh
Host: sessions.hytale.com
Authorization: Bearer <session_token>
```

### 终止会话

结束当前会话（服务器关闭时调用）。

```
DELETE /game-session
Host: sessions.hytale.com
Authorization: Bearer <session_token>
```

### 刷新 OAuth 令牌

将刷新令牌交换为新的访问令牌。

```bash
curl -X POST "https://oauth.accounts.hytale.com/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=hytale-server" \
  -d "grant_type=refresh_token" \
  -d "refresh_token=<refresh_token>"
```

---

## 令牌生命周期

| 令牌类型 | TTL | 说明 |
| :--- | :--- | :--- |
| OAuth Access Token | 1 小时 | 用于创建游戏会话 |
| OAuth Refresh Token | 30 天 | 用于获取新的访问令牌 |
| Game Session | 1 小时 | 在到期前 5 分钟自动刷新 |

**刷新策略：**服务器会在令牌到期前 5 分钟自动执行刷新。如果游戏会话刷新失败，则回退到 OAuth 令牌刷新。

---

## 错误处理

### 常见 HTTP 错误

| 状态 | 含义 |
| :--- | :--- |
| `400 Bad Request` | 请求格式无效或缺少必填字段 |
| `401 Unauthorized` | 缺失或无效的认证 |
| `403 Forbidden` | 认证有效但权限不足（缺少权限、会话数量限制） |
| `404 Not Found` | 资源不存在（无效的配置文件 UUID 等） |

### 会话数量限制错误

在未具备 `sessions.unlimited_servers` 权限的情况下，账户最多只能 **同时运行 100 个服务器会话**。尝试创建更多会话将返回 `403 Forbidden` 错误。

### 令牌校验错误

服务器在启动时会校验令牌。如果校验失败：

```
Token validation failed. Server starting unauthenticated.
Use /auth login to authenticate.
```

常见原因：

- 令牌已过期
- 令牌签名无效
- 缺少必要的 scope（`hytale:server`）

---

## JWKS 端点

服务器通过以下地址获取公钥，用于校验玩家 JWT：

```
GET /.well-known/jwks.json
Host: sessions.hytale.com
```

**响应：**

```json
{
  "keys": [
    {
      "kty": "OKP",
      "alg": "EdDSA",
      "use": "sig",
      "kid": "key-id-1",
      "crv": "Ed25519",
      "x": "base64url-encoded-public-key"
    }
  ]
}
```

---

## 参考资料

- [RFC 6749 - OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
- [RFC 8628 - OAuth 2.0 Device Authorization Grant](https://datatracker.ietf.org/doc/html/rfc8628)
- [RFC 7636 - PKCE（Proof Key for Code Exchange）](https://datatracker.ietf.org/doc/html/rfc7636)
