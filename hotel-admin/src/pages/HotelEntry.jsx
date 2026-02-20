import React, { useState } from 'react';
import { Form, Input, Button, InputNumber, Select, DatePicker, message, Card, Space, Upload, Image } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const HotelEntry = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleImageBeforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('只能上传图片文件');
            return Upload.LIST_IGNORE;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;
            form.setFieldValue('image', base64);
            setImagePreview(base64);
            message.success('图片已选择，可直接提交');
        };
        reader.onerror = () => {
            message.error('图片读取失败，请重试');
        };
        reader.readAsDataURL(file);
        return false;
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                owner: user.username,
                openDate: values.openDate ? values.openDate.format('YYYY-MM-DD') : undefined,
                image: values.image || '',
                area: values.area || '',
                tags: Array.isArray(values.tags) ? values.tags : [],
                facilities: Array.isArray(values.facilities) ? values.facilities : [],
                rooms: (values.rooms || []).filter((room) => room?.name && room?.price),
            };

            const res = await fetch(`${API_BASE_URL}/api/hotels`, {
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
                setImagePreview('');
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
                initialValues={{
                    facilities: ['WIFI'],
                    tags: ['新开业'],
                    rooms: [
                        { name: '标准大床房', description: '1张1.8米床 | 28m²', price: 299 },
                        { name: '标准双床房', description: '2张1.2米床 | 30m²', price: 359 },
                    ],
                }}
            >
                <Form.Item label="酒店名称" name="name" rules={[{ required: true }]}>
                    <Input placeholder="请输入酒店全称" />
                </Form.Item>

                <Form.Item label="酒店地址" name="address" rules={[{ required: true }]}>
                    <Input placeholder="地址详情" />
                </Form.Item>

                <div style={{ display: 'flex', gap: 20 }}>
                    <Form.Item label="所属区域" name="area" style={{ flex: 1 }}>
                        <Input placeholder="如：陆家嘴 / 浦东新区" />
                    </Form.Item>
                    <Form.Item label="酒店主图 URL" name="image" style={{ flex: 2 }}>
                        <Input placeholder="https://...（用于列表图和详情轮播图）" />
                    </Form.Item>
                </div>

                <Form.Item label="酒店主图上传（可直接上传）">
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Upload
                            accept="image/*"
                            maxCount={1}
                            showUploadList={false}
                            beforeUpload={handleImageBeforeUpload}
                        >
                            <Button icon={<PlusOutlined />}>选择本地图片</Button>
                        </Upload>
                        {(imagePreview || form.getFieldValue('image')) && (
                            <Image
                                src={imagePreview || form.getFieldValue('image')}
                                width={220}
                                height={120}
                                style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #f0f0f0' }}
                            />
                        )}
                    </Space>
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

                <Form.Item label="展示标签" name="tags">
                    <Select mode="tags" placeholder="如：性价比之选、地铁近、海景酒店" />
                </Form.Item>

                <Form.Item label="酒店简介" name="description">
                    <TextArea rows={4} />
                </Form.Item>

                <Card size="small" title="房型录入" style={{ marginBottom: 16 }}>
                    <Form.List name="rooms">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field) => (
                                    <Space key={field.key} align="start" style={{ display: 'flex', marginBottom: 12 }}>
                                        <Form.Item
                                            {...field}
                                            name={[field.name, 'name']}
                                            label="房型名"
                                            rules={[{ required: true, message: '请输入房型名' }]}
                                            style={{ minWidth: 180 }}
                                        >
                                            <Input placeholder="如：商务双床房" />
                                        </Form.Item>
                                        <Form.Item
                                            {...field}
                                            name={[field.name, 'description']}
                                            label="描述"
                                            style={{ minWidth: 260 }}
                                        >
                                            <Input placeholder="如：2张1.2米床 | 45m²" />
                                        </Form.Item>
                                        <Form.Item
                                            {...field}
                                            name={[field.name, 'price']}
                                            label="价格"
                                            rules={[{ required: true, message: '请输入价格' }]}
                                            style={{ minWidth: 140 }}
                                        >
                                            <InputNumber min={1} prefix="￥" style={{ width: '100%' }} />
                                        </Form.Item>
                                        <Button
                                            danger
                                            icon={<MinusCircleOutlined />}
                                            onClick={() => remove(field.name)}
                                            style={{ marginTop: 30 }}
                                        >
                                            删除
                                        </Button>
                                    </Space>
                                ))}

                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add({ name: '', description: '', price: undefined })}
                                        block
                                        icon={<PlusOutlined />}
                                    >
                                        新增房型
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Card>

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
