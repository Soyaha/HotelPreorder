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
            // Fetch hotels based on role from Java backend
            // For admin, it returns all. For merchant, logic is handled in backend using session or explicit param if we pass it.
            // Currently passing userId explicitly to match previous logic logic though backend can handle it via session ideally.
            let url = `http://localhost:7529/api/hotel/list?`;
            if (user.role === 'merchant') url += `userId=${user.id}`; // Assuming user object has id

            const res = await fetch(url);
            const data = await res.json();
            setHotels(Array.isArray(data.data) ? data.data : []);
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
            const res = await fetch('http://localhost:7529/api/hotel/audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status, reason })
            });
            const data = await res.json();
            if(data.code === 0) {
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
