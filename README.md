# 易宿酒店预订平台 (Easy Stay Hotel Reservation Platform)

本项目包含了易宿酒店预订平台的完整源代码，分为三个独立的部分：

## 项目结构 (Structure)

1.  **hotel-admin** (PC 端商家/后台管理系统)
    *   **技术栈**: React + Vite + Ant Design
    *   **功能**: 酒店信息录入、审核、仪表盘。
    *   **账号说明**:
        *   管理员: `admin` / `123`
        *   商户: `merchant` / `123`

2.  **hotel-mobile** (移动端用户 App/H5)
    *   **技术栈**: React + Vite + Ant Design Mobile
    *   **功能**: 酒店查询、列表展示、详情页、预订流程。

3.  **hotel-server** (后端 API 服务)
    *   **技术栈**: Node.js + Express
    *   **功能**: 提供酒店数据查询、登录验证、数据存储（目前为内存模拟数据）等 API 接口。

## 启动指南 (Setup Instructions)

请在 VS Code 中打开**三个独立的终端窗口**，分别运行以下命令以启动各部分服务。

### 1. 启动后端服务 (Backend Server)
后端服务是基础，请最先启动。
```bash
cd hotel-server
npm install
npm run dev
```
启动成功后，服务通常运行在 `http://localhost:3001`。

### 2. 启动管理后台 (PC Admin Portal)
供商家和管理员使用。
```bash
cd hotel-admin
npm install
npm run dev
```
启动成功后，通常运行在 `http://localhost:5173`。

### 3. 启动移动端应用 (Mobile App)
供最终用户预订使用。
```bash
cd hotel-mobile
npm install
npm run dev
```
启动成功后，通常运行在 `http://localhost:5174`。

## 开发注意事项 (Development Notes)

- **移动端调试**: "hotel-mobile" 是为手机屏幕设计的。在浏览器打开后，请按 `F12` 打开开发者工具，并点击左上角的“手机图标”切换到**移动设备模拟模式**，以获得正确的显示效果。
- **数据持久化**: 当前所有数据（酒店信息、用户）均存储在服务端的**内存**中 (`index.js` 数组)。这意味着**重启后端服务 (hotel-server) 后，新增的数据会重置**。
- **UI 库**: 管理后台使用 Ant Design (适合桌面端)，移动端使用 Ant Design Mobile (适合触摸操作)。
