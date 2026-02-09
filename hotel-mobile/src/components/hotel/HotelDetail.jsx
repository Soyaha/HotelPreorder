import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { NavBar } from 'antd-mobile'
import HotelBanner from './HotelBanner'
import HotelBasicInfo from './HotelBasicInfo'
import RoomList from './RoomList'

const HotelDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const hotel = location.state?.hotel;

    if (!hotel) {
        return (
            <div style={{ paddingBottom: 50 }}>
                 <NavBar onBack={() => navigate(-1)}>酒店详情</NavBar>
                 <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
                     未找到酒店信息，请从列表页进入
                 </div>
            </div>
        )
    }

    const { 
        name, 
        image, 
        tags,
        details,
        rooms
    } = hotel
    
    return (
        <div style={{ paddingBottom: 50 }}>
            <NavBar onBack={() => navigate(-1)}>酒店详情</NavBar>
            <HotelBanner image={image} />
            <HotelBasicInfo 
                name={name} 
                tags={tags} 
                details={details} 
            />
            <RoomList rooms={rooms} />
        </div>
    )
}

export default HotelDetail
