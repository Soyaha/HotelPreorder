import React, { Suspense, lazy, useState } from 'react';
import { Layout, Menu, theme, Button } from 'antd';
import { UserOutlined, VideoCameraOutlined, UploadOutlined, LogoutOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';

const Login = lazy(() => import('./pages/Login'));
const HotelEntry = lazy(() => import('./pages/HotelEntry'));
const HotelAudit = lazy(() => import('./pages/HotelAudit'));

const { Header, Sider, Content } = Layout;

const Dashboard = () => <div style={{padding: 24, background: '#fff'}}><h2>欢迎使用易宿酒店管理后台</h2><p>请在左侧菜单选择功能。</p></div>;
const RouteFallback = () => <div style={{ padding: 24 }}>页面加载中...</div>;

// Component to handle layout and protection
const MainLayout = ({ user, onLogout }) => {
    const { token: { colorBgContainer } } = theme.useToken();
    const location = useLocation();

    // Menu items based on role
    const items = [
        {
            key: '/',
            icon: <UserOutlined />,
            label: <Link to="/">首页</Link>,
        },
    ];

    if (user.role === 'merchant') {
        items.push({
            key: '/entry',
            icon: <VideoCameraOutlined />,
            label: <Link to="/entry">酒店信息录入</Link>,
        });
        items.push({
            key: '/my-hotels',
            icon: <UploadOutlined />,
            label: <Link to="/my-hotels">我的酒店列表</Link>,
        });
    }

    if (user.role === 'admin') {
        items.push({
            key: '/audit',
            icon: <UploadOutlined />,
            label: <Link to="/audit">酒店审核/管理</Link>,
        });
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider breakpoint="lg" collapsedWidth="0">
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', color: '#fff', textAlign: 'center', lineHeight: '32px' }}>
                    EasyStay Admin
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[location.pathname]}
                    items={items}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: '0 20px', background: colorBgContainer, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <span style={{ marginRight: 15 }}>你好, {user.name} ({user.role === 'admin' ? '管理员' : '商户'})</span>
                    <Button type="text" icon={<LogoutOutlined />} onClick={onLogout}>退出</Button>
                </Header>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ minHeight: 360 }}>
                        <Suspense fallback={<RouteFallback />}>
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/entry" element={user.role === 'merchant' ? <HotelEntry /> : <Navigate to="/" />} />
                                <Route path="/my-hotels" element={user.role === 'merchant' ? <HotelAudit /> : <Navigate to="/" />} />
                                <Route path="/audit" element={user.role === 'admin' ? <HotelAudit /> : <Navigate to="/" />} />
                            </Routes>
                        </Suspense>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  const handleLogin = (userInfo) => {
      setUser(userInfo);
  };

  const handleLogout = () => {
      localStorage.removeItem('user');
      setUser(null);
  };

  return (
    <Router>
        <Suspense fallback={<RouteFallback />}>
            {!user ? (
                <Login onLogin={handleLogin} />
            ) : (
                <MainLayout user={user} onLogout={handleLogout} />
            )}
        </Suspense>
    </Router>
  );
};

export default App;
