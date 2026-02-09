import React from 'react'
import { Image } from 'antd-mobile'
import './HotelDetail.css'

const RoomItem = ({ name, description, price }) => {
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
                <button className="booking-btn">
                    订
                </button>
            </div>
        </div>
    )
}

const RoomList = ({ rooms }) => {
    return (
        <div className="room-list-container">
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
