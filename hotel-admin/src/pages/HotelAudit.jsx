import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Modal, Input, message } from 'antd';

const HotelAudit = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [currentHotelId, setCurrentHotelId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchHotels = async () => {
        setLoading(true);
        try {
            // Update to Node.js backend URL
            let url = `http://localhost:3001/api/hotels?`;
            if (user.role === 'merchant') url += `role=merchant&username=${user.username}`;
            else url += `role=${user.role}`;

            const res = await fetch(url);
            const data = await res.json();
            // Node server returns array directly or { success: false } ? 
            // Looking at index.js, it returns array directly for /api/hotels
            setHotels(Array.isArray(data) ? data : []);
        } catch (e) {
            message.error('获取列表失败');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    const handleStatus = async (id, status, reason = '') => {
        try {
            const res = await fetch('http://localhost:3001/api/hotels/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status, reason })
            });
            const data = await res.json();
            if(data.success) {
                message.success('操作成功');
                fetchHotels();
                setRejectModalOpen(false);
                setRejectReason('');
            }
        } catch (e) {
            message.error('操作失败');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', width: 60 },
        { title: '酒店名称', dataIndex: 'name' },
        { title: '提交商户', dataIndex: 'owner' },
        { title: '价格', dataIndex: 'price', render: p => `￥${p}` },
        { 
            title: '状态', 
            dataIndex: 'status',
            render: (status) => {
                const map = { 
                    pending: { color: 'orange', text: '审核中' },
                    approved: { color: 'green', text: '已发布' },
                    rejected: { color: 'red', text: '已拒绝' },
                    offline: { color: 'default', text: '已下线' }
                };
                return <Tag color={map[status]?.color}>{map[status]?.text}</Tag>;
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {user.role === 'admin' && record.status === 'pending' && (
                        <>
                            <Button type="link" onClick={() => handleStatus(record.id, 'approved')}>通过</Button>
                            <Button type="link" danger onClick={() => { setCurrentHotelId(record.id); setRejectModalOpen(true); }}>拒绝</Button>
                        </>
                    )}
                    {user.role === 'admin' && record.status === 'approved' && (
                         <Button type="link" danger onClick={() => handleStatus(record.id, 'offline')}>下线</Button>
                    )}
                     {user.role === 'admin' && record.status === 'offline' && (
                         <Button type="link" onClick={() => handleStatus(record.id, 'approved')}>重新上线</Button>
                    )}
                    {user.role === 'merchant' && (
                        <Button type="link" disabled>编辑(暂未实现)</Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h2>酒店审核管理</h2>
            <Table dataSource={hotels} columns={columns} rowKey="id" loading={loading} />

            <Modal
                title="拒绝原因"
                open={rejectModalOpen}
                onOk={() => handleStatus(currentHotelId, 'rejected', rejectReason)}
                onCancel={() => setRejectModalOpen(false)}
            >
                <Input.TextArea 
                    rows={4} 
                    value={rejectReason} 
                    onChange={e => setRejectReason(e.target.value)} 
                    placeholder="请输入拒绝原因"
                />
            </Modal>
        </div>
    );
};

export default HotelAudit;
