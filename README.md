# 易宿酒店预订平台 (HotelPreorder)

一个前后端分离的酒店预订训练营项目，包含：

- C 端移动站（用户浏览与筛选酒店）
- B 端管理站（商户录入酒店、管理员审核）
- Node.js 后端 API（登录注册、酒店数据与状态流转）

---

## 在线地址（已部署）

- 管理端（PC）：https://admin.soyaha.site
- 移动端（H5）：https://soyaha.site

## 文档导航

- 接口文档：[`docs/api_interface.md`](docs/api_interface.md)

> 当前线上方案为“前端同域 `/api` 反向代理到后端服务”，前端无需写死服务器 IP。

---

## 项目结构

```text
HotelPreorder/
├─ README.md
├─ hotel-server/                           # 后端服务（Node.js + Express）
│  ├─ index.js                             # 服务入口，路由与业务逻辑
│  ├─ package.json                         # 后端依赖与脚本
│  ├─ data/
│  │  └─ db.json                           # JSON 持久化数据（用户、酒店等）
│  ├─ sql/
│  │  └─ init.sql                          # 预留 SQL 初始化脚本
│  └─ README.md                            # 后端说明文档
│
├─ hotel-admin/                            # 管理端（商户/管理员）
│  ├─ package.json
│  ├─ vite.config.js
│  ├─ .env.production                      # 生产环境变量（VITE_API_BASE_URL=/api）
│  └─ src/
│     ├─ main.jsx                          # 前端入口
│     ├─ App.jsx                           # 路由与主框架
│     ├─ pages/
│     │  ├─ Login.jsx                      # 登录/注册
│     │  ├─ HotelEntry.jsx                 # 酒店录入/编辑（商户）
│     │  └─ HotelAudit.jsx                 # 酒店审核（管理员）
│     └─ index.css
│
├─ hotel-mobile/                           # 移动端（用户侧 H5）
│  ├─ package.json
│  ├─ vite.config.js
│  ├─ .env.production                      # 生产环境变量（VITE_API_BASE_URL=/api）
│  └─ src/
│     ├─ main.jsx
│     ├─ App.jsx
│     ├─ pages/
│     │  ├─ HotelList.jsx                  # 酒店列表页
│     │  └─ HotelDetail.jsx                # 酒店详情页
│     ├─ components/
│     │  ├─ home/                          # 首页组件（轮播、筛选弹层等）
│     │  └─ hotel/                         # 酒店卡片、筛选、详情组件
│     ├─ utils/
│     └─ data/                             # 行政区划等静态数据
│
├─ AntDesignPro/                           # 训练营附带模板工程（可独立运行）
│  ├─ package.json
│  ├─ config/
│  ├─ src/
│  └─ mock/
│
├─ admin.soyaha.site_nginx/                # 历史/备用 nginx 目录
└─ soyaha.site_nginx/                      # 历史/备用 nginx 目录
```

说明：实际业务主链路使用 `hotel-server` + `hotel-admin` + `hotel-mobile` 三个目录，`AntDesignPro` 为独立模板工程，不是当前线上主站运行依赖。

---

## 技术栈

- 前端：React、Vite、React Router、Ant Design、Ant Design Mobile
- 后端：Node.js、Express、CORS
- 数据：`hotel-server/data/db.json`（文件持久化）
- 部署：Nginx + PM2（腾讯云 CVM）

---

## 核心功能

### 移动端 `hotel-mobile`

- 首页：城市/日期/人数选择与快捷入口
- 列表：关键词、区域、价格、星级等筛选
- 详情：图片轮播、酒店详情、房型信息

### 管理端 `hotel-admin`

- 商户：录入/编辑酒店，支持多图上传（Base64）
- 管理员：审核酒店（通过/拒绝/下线/重新上线）
- 登录注册：支持 `admin` 与 `merchant` 角色

### 后端 `hotel-server`

- 认证：`/api/login`、`/api/register`
- 酒店：`/api/hotels`、`/api/hotels/public`、`/api/hotels/:id`
- 状态流转：`/api/hotels/status`
- 健康检查：`/api/health`

---

## 默认测试账号

- 管理员：`admin / 123`
- 商户1：`merchant / 123`
- 商户2：`merchant2 / 123`

---

## 本地开发启动

建议开 3 个终端，按顺序启动：

### 1) 启动后端

```bash
cd hotel-server
npm install
npm run dev
```

默认地址：`http://localhost:3001`

### 2) 启动管理端

```bash
cd hotel-admin
npm install
npm run dev
```

默认地址：`http://localhost:5173`

### 3) 启动移动端

```bash
cd hotel-mobile
npm install
npm run dev
```

默认地址（项目配置）：`http://localhost:8888`

---

## 前端 API 配置说明（已统一）

项目已统一使用：

```env
VITE_API_BASE_URL=/api
```

对应文件：

- hotel-admin/.env.production
- hotel-mobile/.env.production

这意味着：

- 本地可通过 Vite 代理或直接改 `.env` 对接后端
- 线上由 Nginx 转发 `/api` 到后端 `127.0.0.1:3001`

---

## 生产部署（腾讯云）

### 1) 服务规划

- `https://admin.soyaha.site` -> 管理端静态资源（`hotel-admin/dist`）
- `https://soyaha.site` -> 移动端静态资源（`hotel-mobile/dist`）
- 两个站点的 `/api` -> 反向代理到 `http://127.0.0.1:3001`

### 2) 构建前端

```bash
cd hotel-admin
npm install
npm run build

cd ../hotel-mobile
npm install
npm run build
```

### 3) 启动后端（PM2）

```bash
cd hotel-server
npm install
pm2 start index.js --name hotel-server
pm2 save
pm2 startup
```

### 4) Nginx 关键配置（示意）

两个 `server`（`admin.soyaha.site`、`soyaha.site`）都需要：

- `root` 指向对应前端 `dist`
- `try_files $uri $uri/ /index.html;`（SPA 必需）
- `/api/` 代理到后端

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3001/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## 业务演示流程

1. 商户登录管理端，录入酒店并提交，状态为 `pending`
2. 管理员登录管理端，在审核页进行通过/拒绝
3. 移动端进入列表页，可看到已 `approved` 的酒店

---

## 常见问题

### 1) 页面刷新 404

原因：Nginx 未配置 SPA 回退。  
处理：补 `try_files $uri $uri/ /index.html;`

### 2) 前端请求失败或跨域

原因：API 地址未统一或 `/api` 未代理。  
处理：确认 `VITE_API_BASE_URL=/api`，并检查 Nginx `/api` 反代。

### 3) 上传图片报 413

原因：请求体过大。  
处理：Nginx 增加 `client_max_body_size`，并控制上传图片体积。

---

## 说明

- 当前后端为 JSON 文件持久化，适合训练营项目与中小规模演示。
- 如需生产化扩展，建议迁移到 MySQL/Redis，并补充鉴权 Token、日志与监控体系。
