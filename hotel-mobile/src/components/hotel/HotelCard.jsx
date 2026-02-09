import React from 'react'
import { Image } from 'antd-mobile'
import './HotelList.css'

const HotelCard = ({ hotel, onClick }) => {
    const { 
        name, 
        image, 
        score, 
        scoreLabel,
        reviews, 
        distance, 
        area, 
        price, 
        promotionTag 
    } = hotel

    return (
        <div 
            onClick={onClick} 
            className="hotel-card"
        >
            {/* HotelImage */}
            <div className="hotel-image-container">
                <Image 
                    src={image || ''} 
                    width='100%' 
                    height='100%' 
                    fit='cover'
                />
            </div>

            {/* HotelInfo */}
            <div className="hotel-info-container">
                
                {/* HotelName */}
                <div className="hotel-name">
                    {name}
                </div>
                
                {/* starIcon */}
                <div className="hotel-stars">
                     <span className="star-placeholder">⭐⭐⭐⭐⭐</span>
                </div>

                {/* RatingTag - Trip Blue */}
                <div className="score-container">
                    <div className="score-badge">
                        {score}
                    </div>
                    <div className="score-label">
                        {scoreLabel}
                    </div>
                </div>

                {/* LocationInfo */}
                <div className="location-text">
                    {area ? `近${area}` : distance}
                </div>

                {/* Price */}
                <div className="price-container"> 
                    <div className="price-text">
                        ￥{price}<span className="price-unit">起</span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default HotelCard
