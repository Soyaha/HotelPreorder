# 易宿酒店预订平台接口文档

本文档基于当前后端实现文件 `hotel-server/index.js`（Express）整理。

---

## 1. 基本信息

- 本地开发基地址：`http://localhost:3001`
- 线上基地址（同域反代后）：
  - 管理端：`https://admin.soyaha.site/api`
  - 移动端：`https://soyaha.site/api`
- 数据格式：`Content-Type: application/json`
- 认证方式：`accessKey + secretKey` 签名鉴权（部分接口）

### 1.1 签名鉴权规则（管理端接口）

受保护接口需携带请求头：

| Header | 必填 | 说明 |
|---|---|---|
| accessKey | 是 | 用户 AK（登录后下发） |
| nonce | 是 | 随机数，要求为数字且 `0 ~ 100000` |
| timestamp | 是 | 毫秒时间戳，允许与服务端时间误差不超过 5 分钟 |
| body | 是 | `encodeURIComponent(JSON.stringify(payload))` |
| sign | 是 | 签名值，算法见下 |

签名算法：

```text
sign = SHA256(`${body}.${secretKey}`)
```

其中：

- `body` 为原始 JSON 字符串（未 URL 编码前）
- `secretKey` 由登录接口返回

说明：

- `GET /api/hotels/public`、`GET /api/hotels/:id`（游客模式）不要求签名
- `GET /api/hotels/:id` 若带 `accessKey`，会按用户角色判断可见性

### 1.2 前端生成签名头（可直接复制）

> 用途：PPT 演示“管理端如何生成签名并访问受保护接口”

```javascript
// 1) 计算 SHA256
const toHex = (buffer) => Array.from(new Uint8Array(buffer))
  .map((item) => item.toString(16).padStart(2, '0'))
  .join('');

const sha256 = async (text) => {
  const encoded = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return toHex(digest);
};

// 2) 生成签名头
const buildSignedHeaders = async ({ accessKey, secretKey, payload = {} }) => {
  const body = JSON.stringify(payload);
  const nonce = `${Math.floor(Math.random() * 100000)}`;
  const timestamp = `${Date.now()}`;
  const sign = await sha256(`${body}.${secretKey}`);

  return {
    'Content-Type': 'application/json',
    accessKey,
    nonce,
    timestamp,
    body: encodeURIComponent(body),
    sign,
  };
};
```

#### 示例 A：查询管理端酒店列表（GET /api/hotels）

```javascript
const user = JSON.parse(localStorage.getItem('user') || '{}');
const payload = {}; // GET 请求时 body 可传空对象
const headers = await buildSignedHeaders({
  accessKey: user.accessKey,
  secretKey: user.secretKey || user.secrectKey,
  payload,
});

const res = await fetch('/api/hotels?status=pending', {
  method: 'GET',
  headers,
});
const data = await res.json();
console.log(data);
```

#### 示例 B：管理员审核通过（POST /api/hotels/status）

```javascript
const user = JSON.parse(localStorage.getItem('user') || '{}');
const payload = {
  id: 12,
  status: 'approved',
  reason: '',
};
const headers = await buildSignedHeaders({
  accessKey: user.accessKey,
  secretKey: user.secretKey || user.secrectKey,
  payload,
});

const res = await fetch('/api/hotels/status', {
  method: 'POST',
  headers,
  body: JSON.stringify(payload),
});
const data = await res.json();
console.log(data);
```

#### 示例 C：商户提交酒店（POST /api/hotels）

```javascript
const user = JSON.parse(localStorage.getItem('user') || '{}');
const payload = {
  name: '演示酒店',
  address: '上海市浦东新区世纪大道100号',
  price: 399,
  star: 4,
  tags: ['地铁近', '商务出行'],
  facilities: ['WIFI', '健身房'],
  rooms: [
    { name: '标准大床房', description: '1张1.8米床 | 28m²', price: 399 },
  ],
};
const headers = await buildSignedHeaders({
  accessKey: user.accessKey,
  secretKey: user.secretKey || user.secrectKey,
  payload,
});

const res = await fetch('/api/hotels', {
  method: 'POST',
  headers,
  body: JSON.stringify(payload),
});
const data = await res.json();
console.log(data);
```

---

## 2. 返回结构约定

当前接口返回风格有两类：

1) 标准对象：

```json
{ "success": true, "message": "ok", "data": {} }
```

2) 列表接口 `GET /api/hotels`：直接返回数组（非 `{ success }` 包装）

```json
[
  { "id": 1, "name": "..." }
]
```

---

## 3. 接口清单

| 模块 | 方法 | 路径 | 说明 |
|---|---|---|---|
| 系统 | GET | `/` | 根路径健康文案 |
| 系统 | GET | `/api/health` | 健康检查 |
| 认证 | POST | `/api/login` | 登录 |
| 认证 | POST | `/api/register` | 注册 |
| 酒店 | GET | `/api/hotels` | 管理端酒店列表（需签名） |
| 酒店 | GET | `/api/hotels/public` | 移动端公开酒店列表 |
| 酒店 | GET | `/api/hotels/:id` | 酒店详情（按角色） |
| 酒店 | POST | `/api/hotels` | 新增/更新酒店（需签名，商户） |
| 审核 | POST | `/api/hotels/status` | 酒店状态流转（需签名，管理员） |

---

## 4. 详细接口说明

### 4.1 GET /

- 用途：服务存活文案
- 请求参数：无

**成功示例**

```text
Easy Stay Hotel Reservation API is running
```

---

### 4.2 GET /api/health

- 用途：健康检查
- 请求参数：无

**成功示例**

```json
{
  "success": true,
  "message": "ok",
  "time": "2026-02-23T12:00:00.000Z"
}
```

---

### 4.3 POST /api/login

- 用途：用户登录

**请求体**

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**请求示例**

```json
{
  "username": "admin",
  "password": "123"
}
```

**成功示例**

```json
{
  "success": true,
  "user": {
    "username": "admin",
    "role": "admin",
    "name": "系统管理员",
    "accessKey": "ak_admin_xxx",
    "secretKey": "sk_admin_xxx",
    "secrectKey": "sk_admin_xxx"
  }
}
```

**失败示例**

- 400：`用户名和密码不能为空`
- 401：`Invalid credentials`

---

### 4.4 POST /api/register

- 用途：注册账号

**请求体**

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| username | string | 是 | 用户名（唯一） |
| password | string | 是 | 密码 |
| role | string | 否 | `admin` 或 `merchant`，不合法时默认 `merchant` |

**请求示例**

```json
{
  "username": "merchant3",
  "password": "123",
  "role": "merchant"
}
```

**成功示例**

```json
{
  "success": true,
  "message": "Register success"
}
```

**失败示例**

- 400：`用户名和密码不能为空`
- 200+业务失败：`{ "success": false, "message": "User already exists" }`

---

### 4.5 GET /api/hotels

- 用途：查询酒店列表（管理端主接口）
- 说明：返回值是数组，不是 `{ success }` 包装
- 权限：需签名；仅 `admin/merchant` 可访问

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| status | string | 否 | 状态筛选：`pending/approved/rejected/offline` |
| q | string | 否 | 关键字搜索（name/englishName/address/area/description） |

**权限/可见性规则**

- `admin`：可见全部酒店
- `merchant`：仅可见 `owner=当前登录用户` 的酒店

**失败示例**

- 403：`缺少鉴权请求头`
- 403：`签名校验失败`
- 403：`无权限访问`

**成功示例**

```json
[
  {
    "id": 1,
    "name": "上海陆家嘴禧玥酒店",
    "status": "approved",
    "owner": "merchant",
    "updatedAt": "2026-02-23T12:00:00.000Z"
  }
]
```

---

### 4.6 GET /api/hotels/public

- 用途：移动端公开酒店列表
- 说明：仅返回 `approved` 酒店

**请求参数**：无

**成功示例**

```json
{
  "success": true,
  "hotels": [
    {
      "id": 1,
      "name": "上海陆家嘴禧玥酒店",
      "status": "approved"
    }
  ]
}
```

---

### 4.7 GET /api/hotels/:id

- 用途：酒店详情查询

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | number | 是 | 酒店 ID |

**Header（可选）**

| Header | 必填 | 说明 |
|---|---|---|
| accessKey | 否 | 带上后按用户角色判权；不带按游客规则 |

**可见性规则**

- `admin`（通过 `accessKey` 识别）：可查看任意酒店
- `merchant`（通过 `accessKey` 识别）：仅可查看自己录入的酒店
- 游客（不带 `accessKey`）：仅可查看 `approved` 酒店

**成功示例**

```json
{
  "success": true,
  "hotel": {
    "id": 1,
    "name": "上海陆家嘴禧玥酒店",
    "rooms": [],
    "images": []
  }
}
```

**失败示例**

- 404：`酒店不存在`
- 403：`无权限查看该酒店`
- 404：`酒店不存在或不可见`

---

### 4.8 POST /api/hotels

- 用途：新增或更新酒店
- 权限：需签名；仅 `merchant` 可访问
- 规则：
  - 不传 `id` => 新增酒店
  - 传 `id` => 更新酒店（仅 owner 本人可更新）
  - 更新后状态会重置为 `pending`

**请求体主要字段**

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | number | 否 | 更新时传 |
| name | string | 是 | 酒店名 |
| address | string | 是 | 地址 |
| englishName | string | 否 | 英文名 |
| area | string | 否 | 区域 |
| image | string | 否 | 主图 |
| images | string[] | 否 | 多图 |
| price | number | 否 | 价格（后端会转 number） |
| star | number | 否 | 星级，默认 3 |
| description | string | 否 | 描述 |
| tags | string[] | 否 | 标签 |
| facilities | string[] | 否 | 设施 |
| details | object[] | 否 | 详情字段数组 |
| rooms | object[] | 否 | 房型数组 |

**新增示例**

```json
{
  "name": "测试酒店",
  "address": "上海市浦东新区xx路",
  "price": 399,
  "images": [],
  "rooms": []
}
```

**成功示例**

```json
{
  "success": true,
  "hotel": {
    "id": 99,
    "name": "测试酒店",
    "status": "pending"
  }
}
```

**失败示例**

- 400：`name 和 address 为必填项`
- 404：`酒店不存在`（更新时）
- 403：`只能修改自己录入的酒店`
- 403：`无权限访问`
- 403：`签名校验失败`

---

### 4.9 POST /api/hotels/status

- 用途：管理员审核状态流转
- 权限：需签名；仅 `admin` 可访问

**请求体**

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| id | number | 是 | 酒店 ID |
| status | string | 是 | `pending`/`approved`/`rejected`/`offline` |
| reason | string | 否 | 当 `status=rejected` 时的驳回原因 |

**请求示例**

```json
{
  "id": 12,
  "status": "rejected",
  "reason": "资质图片不清晰"
}
```

**成功示例**

```json
{
  "success": true,
  "hotel": {
    "id": 12,
    "status": "rejected",
    "rejectReason": "资质图片不清晰"
  }
}
```

**失败示例**

- 400：`参数不合法`
- 404：`酒店不存在`
- 403：`无权限访问`
- 403：`签名校验失败`

---

## 5. 状态流转

- `pending`：待审核
- `approved`：已发布
- `rejected`：已拒绝
- `offline`：已下线

典型流程：

1. 商户新增/编辑酒店 -> `pending`
2. 管理员审核通过 -> `approved`
3. 管理员下线 -> `offline`
4. 管理员重新上线 -> `approved`

---

## 6. 联调建议

- 管理端与移动端统一使用 `VITE_API_BASE_URL=/api`
- 线上通过 Nginx 将 `/api` 转发到 `127.0.0.1:3001`
- 本地联调时若跨域，优先使用 Vite 代理而不是写死公网 IP
