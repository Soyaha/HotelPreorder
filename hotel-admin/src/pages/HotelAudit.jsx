import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Modal, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const HotelAudit = () => {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [currentHotelId, setCurrentHotelId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [detailHotel, setDetailHotel] = useState(null);
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
            const list = Array.isArray(data) ? data : [];
            const statusOrder = { pending: 0, rejected: 1, approved: 2, offline: 3 };
            list.sort((a, b) => {
                const byStatus = (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
                if (byStatus !== 0) return byStatus;
                return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
            });
            setHotels(list);
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

    const openDetailModal = (hotel) => {
        setDetailHotel(hotel);
        setDetailModalOpen(true);
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
            title: '驳回原因',
            dataIndex: 'rejectReason',
            render: (_, record) => {
                if (record.status !== 'rejected') return '-';
                return record.rejectReason || '-';
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {user.role === 'admin' && (
                        <Button type="link" onClick={() => openDetailModal(record)}>查看详情</Button>
                    )}
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
                        <Button type="link" onClick={() => navigate('/entry', { state: { hotel: record } })}>编辑</Button>
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
                title="商户提交详情"
                open={detailModalOpen}
                onCancel={() => setDetailModalOpen(false)}
                footer={null}
                width={900}
            >
                {detailHotel && (
                    <div style={{ maxHeight: 620, overflow: 'auto' }}>
                        <div style={{ marginBottom: 12, fontWeight: 600 }}>基础信息</div>
                        <div style={{ lineHeight: '28px', marginBottom: 12 }}>
                            <div><b>酒店名：</b>{detailHotel.name || '-'}</div>
                            <div><b>地址：</b>{detailHotel.address || '-'}</div>
                            <div><b>区域：</b>{detailHotel.area || '-'}</div>
                            <div><b>提交商户：</b>{detailHotel.owner || '-'}</div>
                            <div><b>状态：</b>{detailHotel.status || '-'}</div>
                            <div><b>星级：</b>{detailHotel.star || '-'} 星</div>
                            <div><b>价格：</b>￥{detailHotel.price || 0}</div>
                            <div><b>简介：</b>{detailHotel.description || '-'}</div>
                            {detailHotel.status === 'rejected' && (
                                <div><b>驳回原因：</b>{detailHotel.rejectReason || '-'}</div>
                            )}
                        </div>

                        <div style={{ marginBottom: 12, fontWeight: 600 }}>酒店图片</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                            {(Array.isArray(detailHotel.images) && detailHotel.images.length > 0
                                ? detailHotel.images
                                : (detailHotel.image ? [detailHotel.image] : [])
                            ).map((img, idx) => (
                                <img
                                    key={`${idx}-${img?.slice?.(0, 16) || 'img'}`}
                                    src={img}
                                    alt={`hotel-${idx}`}
                                    style={{ width: 160, height: 100, objectFit: 'cover', borderRadius: 6, border: '1px solid #f0f0f0' }}
                                />
                            ))}
                        </div>

                        <div style={{ marginBottom: 8, fontWeight: 600 }}>设施</div>
                        <div style={{ marginBottom: 12 }}>
                            {(detailHotel.facilities || []).length > 0
                                ? detailHotel.facilities.map((item) => (
                                    <Tag key={item} style={{ marginBottom: 6 }}>{item}</Tag>
                                ))
                                : '-'}
                        </div>

                        <div style={{ marginBottom: 8, fontWeight: 600 }}>标签</div>
                        <div style={{ marginBottom: 12 }}>
                            {(detailHotel.tags || []).length > 0
                                ? detailHotel.tags.map((item) => (
                                    <Tag key={item} color="blue" style={{ marginBottom: 6 }}>{item}</Tag>
                                ))
                                : '-'}
                        </div>

                        <div style={{ marginBottom: 8, fontWeight: 600 }}>酒店详情字段</div>
                        <div style={{ marginBottom: 12 }}>
                            {(detailHotel.details || []).length > 0
                                ? detailHotel.details.map((item, idx) => (
                                    <Tag key={`${item.label}-${idx}`} color="geekblue" style={{ marginBottom: 6 }}>
                                        {item.label}：{item.value}
                                    </Tag>
                                ))
                                : '-'}
                        </div>

                        <div style={{ marginBottom: 8, fontWeight: 600 }}>房型信息</div>
                        <Table
                            size="small"
                            pagination={false}
                            rowKey={(row, idx) => `${row.name || 'room'}-${idx}`}
                            dataSource={Array.isArray(detailHotel.rooms) ? detailHotel.rooms : []}
                            columns={[
                                { title: '房型', dataIndex: 'name', width: 180 },
                                { title: '描述', dataIndex: 'description' },
                                { title: '价格', dataIndex: 'price', width: 120, render: (p) => `￥${p}` },
                            ]}
                        />
                    </div>
                )}
            </Modal>

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
