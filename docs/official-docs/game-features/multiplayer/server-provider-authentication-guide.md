---
displayed_sidebar: officialDocsSidebar
sidebar_position: 3
---

# 服务器提供商身份验证指南

> 原文链接：[https://support.hytale.com/hc/en-us/articles/45328341414043-Server-Provider-Authentication-Guide](https://support.hytale.com/hc/en-us/articles/45328341414043-Server-Provider-Authentication-Guide)<br />
> 上次更新时间：2026/01/16 06:06

本指南介绍了服务器托管提供商如何使用具备 `sessions.unlimited_servers` 权限的账户，对 Hytale 专用服务器进行身份验证。

## 先决条件

:::info[注意：]

由于申请数量巨大以及临近上线，我们决定在自动化解决方案就绪之前<ins>关闭申请流程</ins>。<br />

很抱歉，目前我们无法向你授予该权限。如果你仍计划向客户提供 Hytale 服务器服务，可以购买多个标准许可证，并为每个许可证生成 100 台服务器。<br />

我们正在开发一套自动化解决方案，届时服务器提供商将可再次进行注册。<br />

:::

若未能在 24 小时 SLA 内响应滥用报告，可能会导致你的 `sessions.unlimited_servers` 权限被撤销，从而终止所有活跃的服务器会话，并使客户服务器下线。

## 摘要

**适用于希望为 100 台以上服务器实现自动化、零点击身份验证的 GSP 与服务器网络运营者：**

1. **获得权限** - 联系 [Hytale Support](https://support.hytale.com/hc/en-us/requests/new) 并提供你的公司信息，以获取 `sessions.unlimited_servers` 权限。**你已无法再获得该权限。请阅读上文。**

2. **一次性获取令牌** - 使用[设备码流程](https://support.hytale.com/hc/en-us/articles/45328341414043-Server-Provider-Authentication-Guide#method-b-device-code-flow-rfc-8628-)完成身份验证并获取 `refresh_token`。

3. **创建会话** - 调用 `/my-account/get-profiles`，然后调用 `/game-session/new` 获取 `sessionToken` 与 `identityToken`。

4. **将令牌传递给服务器** - 使用以下方式启动每个服务器实例：

   ```java
   java -jar HytaleServer.jar \
     --session-token "<sessionToken>" \
     --identity-token "<identityToken>"
   ```

   或通过环境变量：`HYTALE_SERVER_SESSION_TOKEN` 与 `HYTALE_SERVER_IDENTITY_TOKEN`。

5. **在过期前刷新** - 游戏会话有效期为 1 小时。通过 `/oauth2/token` 使用 `grant_type=refresh_token` 刷新令牌（TTL 为 30 天），并按需创建新的游戏会话。

你的部署系统将集中处理令牌管理——客户不会看到任何身份验证提示。

> **计划中:** 我们正在开发一个 CLI 工具，用于为 GSP 部署系统自动获取与刷新令牌。该工具未能赶在上线前准备就绪——请关注 GSP Discord 获取更新。

### Hytale Downloader CLI

如需自动化服务器文件下载与更新，请使用 Hytale Downloader CLI。该工具处理 OAuth2 身份验证，并可集成到你的部署流水线中，以保持服务器安装的最新状态。

**下载:** [hytale-downloader.zip（快速开始 + Linux 与 Windows）](https://downloader.hytale.com/hytale-downloader.zip)

完整使用文档请参阅[《服务器手册：Hytale Downloader CLI》](https://support.hytale.com/hc/en-us/articles/45326769420827-Hytale-Server-Manual#hytale-downloader-cli)。

---

## 概述

服务器身份验证使用 OAuth 2.0 获取令牌，以授权服务器执行以下操作：

1. 为服务器运营者的配置文件创建游戏会话
2. 验证加入服务器的玩家
3. 访问游戏资源与版本信息

服务器使用预配置的 `hytale-server` OAuth 客户端：

```
Client ID: hytale-server
Scopes: openid, offline, auth:server
```

---

## OAuth 端点

所有端点均遵循标准 OAuth 2.0 规范（[RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)、[RFC 8628](https://datatracker.ietf.org/doc/html/rfc8628)）。

| 端点 | URL |
| :--- | :--- |
| Authorization | `https://oauth.accounts.hytale.com/oauth2/auth` |
| Token | `https://oauth.accounts.hytale.com/oauth2/token` |
| Device Authorization | `https://oauth.accounts.hytale.com/oauth2/device/auth` |

> __**阶段环境:** 将 `hytale.com` 替换为 `arcanitegames.ca`。__

---

## 身份验证方式

### 方式 A：服务器控制台命令（交互式）

适用于可访问控制台的服务器，使用内置身份验证命令：

| 命令 | 说明 |
| :--- | :--- |
| `/auth login device` | 启动设备码流程（推荐用于无界面服务器） |
| `/auth login browser` | 启动浏览器 PKCE 流程（需要桌面环境） |
| `/auth select <number>` | 当存在多个游戏配置文件时进行选择 |
| `/auth status` | 检查当前身份验证状态 |
| `/auth cancel` | 取消正在进行的身份验证流程 |
| `/auth logout` | 清除身份验证并终止会话 |

**示例流程:**

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

### 方法 B：设备码流程（RFC 8628）

适用于需要以编程方式获取令牌的自动化或无界面部署。

#### 第 1 步：请求设备码

```bash
curl -X POST "https://oauth.accounts.hytale.com/oauth2/device/auth" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=hytale-server" \
  -d "scope=openid offline auth:server"
```

**响应:**

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

#### 第 2 步：向用户显示指引

向用户展示：

- **URL:** `verification_uri` 或 `verification_uri_complete`
- **Code:** `user_code`（使用 `verification_uri` 时）

#### 第 3 步：轮询获取令牌

按指定 `interval`（间隔，默认 5 秒）轮询令牌端点：

```bash
curl -X POST "https://oauth.accounts.hytale.com/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=hytale-server" \
  -d "grant_type=urn:ietf:params:oauth:grant-type:device_code" \
  -d "device_code=GmRhmhcxhwAzkoEqiMEg_DnyEysNkuNhszIySk9eS"
```

**等待中的响应**（用户尚未授权）：

```json
{
  "error": "authorization_pending"
}
```

**成功响应:**

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "xreEsdDGrfIaQc...",
  "scope": "openid offline auth:server"
}
```

#### 第 4 步：获取可用配置文件

```bash
curl -X GET "https://account-data.hytale.com/my-account/get-profiles" \
  -H "Authorization: Bearer <access_token>"
```

**响应:**

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

#### 第 5 步：创建游戏会话

```bash
curl -X POST "https://sessions.hytale.com/game-session/new" \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"uuid": "123e4567-e89b-12d3-a456-426614174000"}'
```

**响应:**

```json
{
  "sessionToken": "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...",
  "identityToken": "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2026-01-07T15:00:00Z"
}
```

`sessionToken` 与 `identityToken` 即服务器用于身份验证的令牌。

---

### 方式 C：令牌透传（环境变量 / CLI）

适用于由托管提供商在外部管理令牌获取，并在启动时将令牌传递给服务器的场景。

#### 环境变量

| 变量 | 说明 |
| :--- | :--- |
| `HYTALE_SERVER_SESSION_TOKEN` | 会话令牌（JWT） |
| `HYTALE_SERVER_IDENTITY_TOKEN` | 身份令牌（JWT） |
| `HYTALE_SERVER_AUDIENCE` | 覆盖服务器 audience（仅用于测试） |

#### CLI 选项

| 选项 | 说明 |
| :--- | :--- |
| `--session-token <token>` | 会话令牌 |
| `--identity-token <token>` | 身份令牌 |
| `--owner-uuid <uuid>` | 通过 UUID 自动选择配置文件 |

**示例:**

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

服务器在 `EXTERNAL_SESSION` 模式下会在令牌过期前 5 分钟自动刷新。

---

### 方式 D：凭据存储 API（插件/编程）

该功能正在开发中。

适用于希望通过插件以编程方式管理凭据，并在服务器重启之间持久化令牌的托管提供商。

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

#### 用法

1. 实现 `IAuthCredentialStore` 以持久化令牌（例如数据库、文件或外部服务）
2. 在身份验证前注册：`ServerAuthManager.getInstance().registerCredentialStore(store)`
3. 服务器将通过存储自动获取并刷新令牌
4. 身份验证模式变为 `OAUTH_STORE`

#### 关键行为

- **注册时机:** 必须在任何身份验证发生前注册
- **令牌获取:** 当需要 OAuth 令牌时，服务器调用 `getTokens()`
- **令牌持久化:** 成功刷新令牌后，服务器调用 `setTokens()`
- **配置文件选择:** 若 `getProfile()` 返回 UUID，则自动选择该配置文件

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

获取已通过身份验证账户的可用游戏配置文件。

```
GET /my-account/get-profiles
Host: account-data.hytale.com
Authorization: Bearer <oauth_access_token>
```

### 刷新会话

刷新当前会话以延长有效期。

```
POST /game-session/refresh
Host: sessions.hytale.com
Authorization: Bearer <session_token>
```

### 终止会话

结束当前会话（在服务器关闭时调用）。

```
DELETE /game-session
Host: sessions.hytale.com
Authorization: Bearer <session_token>
```

### 刷新 OAuth 令牌

使用刷新令牌交换新的访问令牌。

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
| Game Session | 1 小时 | 在过期前 5 分钟自动刷新 |

**刷新策略:** 服务器会在令牌过期前 5 分钟安排自动刷新。如果游戏会话刷新失败，则回退为刷新 OAuth 令牌。

---

## 错误处理

### 常见 HTTP 错误

| 状态 | 含义 |
| :--- | :--- |
| `400 Bad Request` | 请求格式无效或缺少必填字段 |
| `401 Unauthorized` | 缺少或无效的身份验证 |
| `403 Forbidden` | 身份验证有效但权限不足（缺少权限、会话数量受限） |
| `404 Not Found` | 资源不存在（无效的配置文件 UUID 等） |

### 会话数量限制错误

在未具备 `sessions.unlimited_servers` 权限的情况下，账户最多只能**同时存在 100 个服务器会话**。尝试创建更多会话将返回 `403 Forbidden` 错误。

### 令牌校验错误

服务器在启动时会验证令牌。若验证失败：

```
Token validation failed. Server starting unauthenticated.
Use /auth login to authenticate.
```

常见原因：

- 令牌已过期
- 令牌签名无效
- 缺少必需的 scope（`hytale:server`）

---

## JWKS 端点

服务器使用以下公钥验证玩家 JWT：

```
GET /.well-known/jwks.json
Host: sessions.hytale.com
```

**响应:**

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

## 参考

- [RFC 6749 - OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
- [RFC 8628 - OAuth 2.0 Device Authorization Grant](https://datatracker.ietf.org/doc/html/rfc8628)
- [RFC 7636 - PKCE (Proof Key for Code Exchange)](https://datatracker.ietf.org/doc/html/rfc7636)
