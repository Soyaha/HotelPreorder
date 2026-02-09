import React from 'react'
import { Card, Image } from 'antd-mobile'

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
        <Card 
            onClick={onClick} 
            style={{ borderRadius: 8, marginBottom: 10, border: 'none' }} 
            bodyStyle={{ padding: 10 }}
        >
            <div style={{ display: 'flex', gap: 10 }}>
                <Image 
                    src={image || ''} 
                    width={100} 
                    height={110} 
                    fit='cover'
                    style={{ borderRadius: 4, background: '#f5f5f5', flexShrink: 0 }} 
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2px 0' }}>
                    
                    {/* Title */}
                    <div style={{ fontWeight: 'bold', fontSize: 16, color: '#333', lineHeight: 1.3 }}>{name}</div>
                    
                    {/* Score & Reviews */}
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                        <span style={{ color: '#0086F6', fontWeight: 'bold', fontSize: 16 }}>{score}分</span>
                        {scoreLabel && <span style={{ color: '#0086F6', fontSize: 13, marginLeft: 4, fontWeight: 500 }}>{scoreLabel}</span>}
                        {reviews && <span style={{ fontSize: 12, color: '#999', marginLeft: 6 }}>{reviews}条点评</span>}
                    </div>

                    {/* Distance / Area */}
                    <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                         {distance}
                         {area && <div style={{ marginTop: 1 }}>{area}</div>}
                    </div>

                     {/* Promotion Tag / Price */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 }}>
                         <div style={{ paddingBottom: 2 }}>
                            {promotionTag && (
                                <div style={{ 
                                    color: '#FF6600', 
                                    border: '1px solid #FF6600', 
                                    fontSize: 10, 
                                    padding: '1px 4px', 
                                    borderRadius: 3,
                                    display: 'inline-block' 
                                }}>
                                    {promotionTag}
                                </div>
                            )}
                         </div>
                         <div style={{ color: '#FF4D4F', fontWeight: 'bold', fontSize: 18, lineHeight: 1 }}>
                            <span style={{ fontSize: 12 }}>¥</span>{price}
                            <span style={{ fontSize: 12, color: '#999', fontWeight: 'normal', marginLeft: 2 }}>起</span>
                         </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default HotelCard
