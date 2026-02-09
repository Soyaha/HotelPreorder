import React from 'react'
import { Button } from 'antd-mobile'

const RoomItem = ({ name, description, price }) => {
    return (
        <div style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ fontWeight: 'bold' }}>{name}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>{description}</div>
                </div>
                <div style={{ color: '#ff4d4f', fontWeight: 'bold' }}>¥{price}</div>
            </div>
            <Button size='small' color='primary' style={{ float: 'right', marginTop: 5 }}>预订</Button>
            <div style={{ clear: 'both' }}></div>
        </div>
    )
}

const RoomList = ({ rooms }) => {
    return (
        <div style={{ marginTop: 10, background: '#fff', padding: 15 }}>
            <h3>房型列表</h3>
            {rooms && rooms.map(room => (
                <RoomItem 
                    key={room.id}
                    name={room.name}
                    description={room.description}
                    price={room.price}
                />
            ))}
        </div>
    )
}

export default RoomList
