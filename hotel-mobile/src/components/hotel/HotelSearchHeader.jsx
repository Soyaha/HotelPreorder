import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LeftOutline, CloseCircleFill, EnvironmentOutline, MoreOutline } from 'antd-mobile-icons'

const HotelSearchHeader = ({ searchText, onSearchChange, onSearchClear }) => {
    const navigate = useNavigate();

    return (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '8px 12px', 
            gap: 10 
        }}>
            <LeftOutline fontSize={24} onClick={() => navigate(-1)} />
            
            {/* Search Bar */}
            <div style={{ 
                flex: 1, 
                background: '#F5F6FA', 
                borderRadius: 20, 
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, borderRight: '1px solid #ddd', paddingRight: 8 }}>
                    <div style={{ color: '#0086F6', fontWeight: 500 }}>
                        <span style={{ marginRight: 4 }}>住 04-18</span>
                    </div>
                     <div style={{ color: '#0086F6', fontWeight: 500 }}>
                        <span>离 04-21</span>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, color: '#666', fontSize: 10, minWidth: 32 }}>
                    <span>成人 2</span>
                    <span>儿童 0</span>
                </div>
                 
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                     <input 
                        value={searchText}
                        onChange={onSearchChange}
                        style={{ 
                            border: 'none', 
                            background: 'transparent', 
                            width: '100%', 
                            outline: 'none',
                            fontWeight: 'bold',
                            color: '#333',
                            fontSize: 14
                        }}
                     />
                </div>
                 {searchText && (
                     <CloseCircleFill 
                        fontSize={14} 
                        color='#ccc' 
                        onClick={onSearchClear}
                     />
                 )}
            </div>

            {/* Right Icons */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }} onClick={() => navigate('/map')}>
                <EnvironmentOutline fontSize={20} />
                <span style={{ fontSize: 10, lineHeight: 1 }}>地图</span>
            </div>
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <MoreOutline fontSize={20} />
                <span style={{ fontSize: 10, lineHeight: 1 }}>更多</span>
            </div>
        </div>
    )
}

export default HotelSearchHeader