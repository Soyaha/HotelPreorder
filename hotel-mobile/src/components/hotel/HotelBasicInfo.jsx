import React from 'react'
import { Tag } from 'antd-mobile'

const HotelBasicInfo = ({ name, tags, details }) => {
  return (
    <div style={{ padding: 15, background: '#fff' }}>
        <h2>{name}</h2>
        <div>
            {tags && tags.map((tag, index) => (
                 <Tag color='gold' key={index} style={{ marginRight: 5 }}>{tag}</Tag>
            ))}
        </div>
        <div style={{ display: 'flex', margin: '15px 0', justifyContent: 'space-between', textAlign: 'center' }}>
            {details && details.map((item, index) => (
                <div key={index}>
                    <div style={{ fontSize: 20 }}>{item.value}</div>
                    <div style={{ fontSize: 12, color: '#999' }}>{item.label}</div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default HotelBasicInfo
