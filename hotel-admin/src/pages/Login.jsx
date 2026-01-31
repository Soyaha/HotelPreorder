import React from 'react';
import { Form, Input, Button, Radio, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });
        const data = await response.json();
        if (data.success) {
            message.success('登录成功');
            localStorage.setItem('user', JSON.stringify(data.user));
            onLogin(data.user);
            navigate('/');
        } else {
            message.error(data.message || '登录失败');
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
