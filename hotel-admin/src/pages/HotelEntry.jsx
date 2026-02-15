import React, { useEffect, useState } from 'react';
import { Form, Input, Button, InputNumber, Select, Switch, DatePicker, Upload, message, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const HotelEntry = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const payload = { ...values, owner: user.username }; 
            // Simplified for Node server
            const res = await fetch('http://localhost:3001/api/hotels', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if(data.success) {
                message.success('提交成功，等待管理员审核');
                form.resetFields();
            } else {
                message.error('提交失败: ' + (data.message || '未知错误'));
            }
        } catch (e) {
            message.error('网络错误');
        }
        setLoading(false);
    };

    return (
        <Card title="酒店信息录入 (商户端)">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ facilities: ['WIFI'] }}
            >
                <Form.Item label="酒店名称" name="name" rules={[{ required: true }]}>
                    <Input placeholder="请输入酒店全称" />
                </Form.Item>

                <Form.Item label="酒店地址" name="address" rules={[{ required: true }]}>
                    <Input placeholder="地址详情" />
                </Form.Item>

                <div style={{ display: 'flex', gap: 20 }}>
                     <Form.Item label="星级" name="star" style={{flex: 1}}>
                        <Select>
                            <Option value={3}>3星及以下</Option>
                            <Option value={4}>4星</Option>
                            <Option value={5}>5星</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="基础价格 (起)" name="price" style={{flex: 1}}>
                        <InputNumber prefix="￥" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="开业时间" name="openDate" style={{flex: 1}}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </div>

                <Form.Item label="设施/标签" name="facilities">
                    <Select mode="multiple" placeholder="请选择酒店设施">
                        <Option value="WIFI">免费WIFI</Option>
                        <Option value="免费停车">免费停车</Option>
                        <Option value="健身房">健身房</Option>
                        <Option value="游泳池">游泳池</Option>
                        <Option value="亲子">亲子酒店</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="酒店简介" name="description">
                    <TextArea rows={4} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        保存并提交审核
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default HotelEntry;
