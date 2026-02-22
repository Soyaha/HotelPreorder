import React from 'react'
import { Tag } from 'antd-mobile'
import './HotelDetail.css'

const HotelBasicInfo = ({ name, englishName, score, scoreLabel, tags, details, area }) => {
  return (
    <div className="hotel-info-card">
        <div className="hotel-name-title">
            <div className="hotel-cn-name">{name}</div>
            {englishName && <div className="hotel-en-name" style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>{englishName}</div>}
            {/* Stars can be added here if needed */}
        </div>

        <div className="hotel-score-section">
            <div className="score-box">{score}</div>
            <div className="score-text">{scoreLabel}</div>
        </div>
        <div className="hotel-score-section">
            <div style={{ fontSize: 13, color: '#333'}}>近{area}</div>
        </div>
        {/* Details Grid corresponding to "2020年装修 | 中式风格..." */}
        <div className="details-grid">
            {details && details.map((item, index) => (
                <div key={index} className="detail-tag-item">
                    {item.value}{item.label} 
                    {/* Concatenating value+label (e.g. 2020 + 装修) to match design usually */}
                </div>
            ))}
        </div>
    </div>
  )
}

export default HotelBasicInfo
