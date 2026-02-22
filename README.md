# 易宿酒店预订平台 (Easy Stay Hotel Reservation Platform)

这是一个完整的酒店预订系统全栈项目，包含了**用户手机端预订**、**商户电脑端录入**、**管理员电脑端审核**以及**Node.js后端服务**。

项目分为三个独立的文件夹，需要分别启动。

## 📂 项目结构与功能

### 1. `hotel-mobile` (移动端 - 给普通用户用)
*   **技术栈**: React + Vite + Ant Design Mobile
*   **功能**: 
    *   首页：城市定位、日期选择、人数房间选择、快捷筛选。
    *   列表页：支持无限滚动加载、距离/价格/星级/品牌等多维度筛选。
    *   详情页：展示酒店多图轮播、中英文双语名称、设施详情、房型列表。
*   **体验方式**: 浏览器打开后按 `F12`，点击左上角切换到**手机模拟模式**体验最佳。

### 2. `hotel-admin` (PC管理端 - 给商户和管理员用)
*   **技术栈**: React + Vite + Ant Design
*   **功能**: 
    *   **商户角色**: 录入酒店信息（支持最多9张图片上传、中英文双语）、查看自己录入的酒店状态。
    *   **管理员角色**: 审核商户提交的酒店（通过/拒绝/下线），查看酒店完整详情。
*   **测试账号**:
    *   管理员: 账号 `admin` / 密码 `123`
    *   商户: 账号 `merchant` / 密码 `123`

### 3. `hotel-server` (后端 API 服务)
*   **技术栈**: Node.js + Express
*   **功能**: 处理登录验证、图片上传（Base64）、酒店数据的增删改查与状态流转。
*   **数据存储**: 数据保存在本地的 `data/db.json` 文件中，重启服务器数据**不会**丢失。

---

## 🚀 快速启动指南

请在 VS Code 中打开**三个独立的终端窗口**，分别执行以下命令：

### 第一步：启动后端服务 (必须最先启动)
```bash
cd hotel-server
npm install
npm run dev
```
*(后端服务默认运行在 `http://localhost:3001`)*

### 第二步：启动 PC 管理端
```bash
cd hotel-admin
npm install
npm run dev
```
*(管理端默认运行在 `http://localhost:5173`)*

### 第三步：启动移动端用户 App
```bash
cd hotel-mobile
npm install
npm run dev
```
*(移动端默认运行在 `http://localhost:5174`)*

---

## 💡 核心业务流程演示

1. **商户录入**: 登录 `hotel-admin` (账号 merchant)，点击“录入酒店”，上传图片并填写信息后提交。此时酒店状态为“审核中”。
2. **管理员审核**: 退出商户账号，登录 `hotel-admin` (账号 admin)，进入“酒店审核”页面，可以看到刚才提交的酒店，点击“通过”。
3. **用户查看**: 打开 `hotel-mobile` 手机端，搜索对应的城市或酒店名，即可在列表中看到刚刚审核通过的酒店。

## 🛠️ 部署说明 (上线必看)

如果需要将项目部署到云服务器（如阿里云、腾讯云）：
1. 在 `hotel-admin` 和 `hotel-mobile` 根目录下新建 `.env.production` 文件，写入：`VITE_API_BASE_URL=http://你的服务器公网IP:3001`
2. 分别在两个前端目录下运行 `npm run build`，将生成的 `dist` 文件夹通过 Nginx 部署。
3. 将 `hotel-server` 放到服务器上，使用 `pm2 start index.js` 在后台运行后端服务。
