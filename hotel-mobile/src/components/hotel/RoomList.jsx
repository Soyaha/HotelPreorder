import React from 'react'
import { Image } from 'antd-mobile'
import './HotelDetail.css'

const RoomItem = ({ name, description, price, roomid,hotel}) => {
    const handleBookingClick = () => {
        
        console.log('room booking info', { name, description, price, roomid,hotelid: hotel.id })
    }

    return (
        <div className="room-card">
            {/* Thumbnail - Placeholder color per design */}
            <div className="room-image"></div>
            
            <div className="room-info">
                <div className="room-name">{name}</div>
                <div className="room-desc">{description}</div>
                <div className="cancellation-policy">30分钟内免费取消</div>
            </div>

            <div className="room-price-action">
                <div className="room-price">
                    <span style={{ fontSize: 14 }}>￥</span>{price}
                </div>
                <button className="booking-btn" onClick={handleBookingClick}>
                    订
                </button>
            </div>
        </div>
    )
}

const RoomList = ({ hotel, rooms }) => {
    const roomItems = Array.isArray(rooms) ? rooms : (Array.isArray(hotel?.rooms) ? hotel.rooms : [])

    return (
        <div className="room-list-container">
            {roomItems.length > 0 ? roomItems.map(room => (
                <RoomItem 
                    key={room.id}
                    name={room.name}
                    description={room.description}
                    price={room.price}
                    roomid={room.id}
                    hotel={hotel}
                />
            )) : (
                <div style={{ padding: '28px 0', textAlign: 'center', color: '#999', fontSize: 14 }}>
                    当前酒店暂无可预订房型
                </div>
            )}
        </div>
    )
}

export default RoomList
