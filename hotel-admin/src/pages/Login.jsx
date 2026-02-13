import React from 'react';
import { Form, Input, Button, Radio, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
        // Change to Java Backend
        const response = await fetch('http://localhost:7529/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userAccount: values.username, userPassword: values.password }), // Map params
        });
        const res = await response.json();
        if (res.code === 0) {
            message.success('登录成功');
            // Mock role for admin/merchant based on userAccount since Java backend might not return 'role' string directly or structure differs
            // You might need to adjust this based on actual User entity from Java
            const userData = res.data;
            // Simple mapping for demo if roles are not exact strings
            if(!userData.userRole) userData.role = values.username === 'admin' ? 'admin' : 'merchant'; 
            else userData.role = userData.userRole;

            localStorage.setItem('user', JSON.stringify(userData));
            onLogin(userData);
            navigate('/');
        } else {
            message.error(res.message || '登录失败');
        }
    } catch (error) {
        message.error('网络错误');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card title="易宿酒店管理系统" style={{ width: 400 }}>
        <Form
          name="login"
          initialValues={{ role: 'merchant' }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名 (admin / merchant)" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码 (123)" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
          <div style={{textAlign: 'center', color: '#999'}}>
             默认测试账号: admin / merchant <br/> 密码: 123
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
