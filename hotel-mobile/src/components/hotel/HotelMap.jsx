import React from 'react'
import { NavBar } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'

const HotelMap = () => {
    const navigate = useNavigate()
    return (
        <div>
            <NavBar onBack={() => navigate(-1)}>地图模式</NavBar>
            <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
                地图功能开发中...
            </div>
        </div>
    )
}

export default HotelMap