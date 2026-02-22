import React from 'react'
import { Image } from 'antd-mobile'
import './HotelList.css'

const HotelCard = ({ hotel, onClick }) => {
    const { 
        name, 
        englishName,
        image, 
        score, 
        scoreLabel,
        reviews, 
        distance, 
        area, 
        price, 
        promotionTag 
    } = hotel

    const starCount = Math.max(0, Math.min(5, Number(hotel?.star || 0)))
    const filledStars = '⭐'.repeat(starCount)
    const emptyStars = '☆'.repeat(5 - starCount)
    const hasValidScore = Number(score) > 0
    const displayScore = hasValidScore ? Number(score).toFixed(1) : '新'
    const displayScoreLabel = hasValidScore ? (scoreLabel || '不错') : (scoreLabel || '新开业')

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
                {englishName && (
                    <div className="hotel-english-name" style={{ fontSize: '12px', color: '#666', marginTop: '-4px', marginBottom: '4px' }}>
                        {englishName}
                    </div>
                )}
                
                {/* starIcon */}
                <div className="hotel-stars">
                     <span className="star-placeholder">
                        {filledStars}
                        <span style={{ color: '#D9D9D9' }}>{emptyStars}</span>
                     </span>
                </div>

                {/* RatingTag - Trip Blue */}
                <div className="score-container">
                    <div className="score-badge">
                        {displayScore}
                    </div>
                    <div className="score-label">
                        {displayScoreLabel}
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
