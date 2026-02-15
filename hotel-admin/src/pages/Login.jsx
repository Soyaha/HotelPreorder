import React, { useState } from 'react';
import { Form, Input, Button, Radio, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3001'; // Update to your backend URL

const Login = ({ onLogin }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const onFinish = async (values) => {
    try {
        const endpoint = isLogin ? '/api/login' : '/api/register';
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: values.username, 
                password: values.password,
                role: values.role // Only used for register
            }), 
        });
        const res = await response.json();
        
        if (isLogin) {
            // Login Logic
            if (res.success) {
                message.success('登录成功');
                const userData = res.user;
                localStorage.setItem('user', JSON.stringify(userData));
                onLogin(userData);
                navigate('/');
            } else {
                message.error(res.message || '登录失败');
            }
        } else {
            // Register Logic
            if (res.success) {
                message.success('注册成功，请登录');
                setIsLogin(true); // Switch to login
                form.resetFields();
            } else {
                message.error(res.message || '注册失败');
            }
        }
    } catch (error) {
        message.error('网络错误');
    }
  };

  const toggleMode = () => {
      setIsLogin(!isLogin);
      form.resetFields();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card title={isLogin ? "易宿酒店管理系统 - 登录" : "易宿酒店管理系统 - 注册"} style={{ width: 400 }}>
        <Form
          form={form}
          name="login"
          initialValues={{ role: 'merchant' }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          {!isLogin && (
            <Form.Item name="role" label="角色">
              <Radio.Group>
                <Radio value="merchant">商户</Radio>
                <Radio value="admin">管理员</Radio>
              </Radio.Group>
            </Form.Item>
          )}
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isLogin ? '登录' : '注册'}
            </Button>
          </Form.Item>
          <div style={{textAlign: 'center'}}>
             <a onClick={toggleMode}>{isLogin ? '没有账号？立即注册' : '已有账号？去登录'}</a>
          </div>
          {isLogin && (
            <div style={{textAlign: 'center', color: '#999', marginTop: 10}}>
                默认测试账号: admin / merchant <br/> 密码: 123
            </div>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default Login;
