# hotel-server（易宿后端）

基于当前工程（`hotel-admin` + `hotel-mobile`）搭建的 Node.js 后端服务。

- 技术栈：Express + CORS + JSON 文件持久化
- 端口：`3001`（可用环境变量 `PORT` 覆盖）
- 兼容你当前管理端已写好的接口调用

---

## 1. 快速启动

在 `hotel-server` 目录执行：

```bash
npm install
npm run dev
```

服务启动后：

- 健康检查：`GET http://localhost:3001/api/health`
- 根路径：`GET http://localhost:3001/`

> 首次启动会自动创建数据文件：`hotel-server/data/db.json`

---

## 2. 默认账号

- 管理员：`admin / 123`
- 商户1：`merchant / 123`
- 商户2：`merchant2 / 123`

---

## 3. 已实现接口

### 认证

- `POST /api/login`
  - body: `{ username, password }`
  - return: `{ success, user }`

- `POST /api/register`
  - body: `{ username, password, role }`
  - role 仅支持 `admin | merchant`，默认 `merchant`

### 酒店

- `GET /api/hotels`
  - 用于管理端列表（需签名鉴权）
  - 根据登录用户角色自动过滤：
    - `admin`：返回全部
    - `merchant`：返回该商户自己的酒店
  - 可选筛选：`status`、`q`

- `GET /api/hotels/public`
  - 用于移动端公开酒店列表（仅 `approved`）
  - return: `{ success, hotels }`

- `GET /api/hotels/:id`
  - 支持按角色查看单个酒店详情（可选携带 `accessKey`）

- `POST /api/hotels`
  - 商户创建/更新酒店（需签名鉴权，且必须 merchant）
  - 创建：不带 `id`
  - 更新：带 `id`，且必须是原录入商户本人
  - 更新后会自动进入 `pending` 待审核

- `POST /api/hotels/status`
  - 管理员审核状态流转（需签名鉴权，且必须 admin）：`pending | approved | rejected | offline`
  - body: `{ id, status, reason? }`

### 鉴权请求头（受保护接口）

- `accessKey`
- `nonce`
- `timestamp`
- `body`（`encodeURIComponent(JSON.stringify(payload))`）
- `sign`（`SHA256(body.secretKey)`）

---

## 4. 状态流转说明

酒店状态：

- `pending`：审核中
- `approved`：已发布
- `rejected`：审核拒绝
- `offline`：已下线

典型流程：

1. 商户录入酒店 -> `pending`
2. 管理员审核通过 -> `approved`
3. 管理员可下线 -> `offline`
4. 重新上线 -> `approved`

---

## 5. 数据持久化说明

当前后端使用 `data/db.json` 进行持久化，适合训练营开发与联调。

- 优点：零配置、启动快
- 限制：单机文件，不适合生产并发场景

如果你要切到 MySQL，可直接使用：

- 初始化脚本：`hotel-server/sql/init.sql`

---

## 6. 与前端对接建议

### hotel-admin（已可直接对接）

你当前 `Login.jsx`、`HotelEntry.jsx`、`HotelAudit.jsx` 使用的接口路径与返回结构，已与本后端兼容。

### hotel-mobile（下一步建议）

目前 `HotelList.jsx` 还是本地 mock 数据。建议改为：

1. 页面加载请求 `GET /api/hotels/public`
2. 列表点击后请求 `GET /api/hotels/:id`
3. 房型筛选在前端按 `rooms` 进行二次过滤（你现在已在做）

---

## 7. 目录说明

```text
hotel-server/
  index.js          # 主服务入口
  data/db.json      # 自动生成的数据文件
  sql/init.sql      # MySQL 初始化脚本
  README.md
```

---

## 8. 常见问题

### Q1: 端口冲突怎么办？

```bash
# Windows PowerShell
$env:PORT=3002
npm run dev
```

### Q2: 想重置测试数据？

删除 `hotel-server/data/db.json` 后重启服务即可恢复初始数据。

---

## 9. 后续可扩展（可选）

- 接入 JWT（替代 query 里的 role/username）
- 接入 MySQL + ORM（Prisma / Sequelize）
- 增加订单模块（下单、取消、支付状态）
- 增加房态库存（按日期扣减）
