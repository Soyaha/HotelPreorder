import React, { useState } from 'react'
import { Swiper, Image } from 'antd-mobile'
import './HotelDetail.css'

const HotelBanner = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="hotel-banner-container">
        <Swiper 
            loop 
            autoplay 
            onIndexChange={index => setCurrentIndex(index)}
            indicator={() => null}
        >
            {images.map((img, index) => (
                <Swiper.Item key={index}>
                    <BannerImageBox src={img} />
                </Swiper.Item>
            ))}
        </Swiper>
        <div className="banner-count-badge">
            {currentIndex + 1}/{images.length} 轮播图
        </div>
    </div>
  )
}

/**
 * 封装的图片盒子组件
 */
const BannerImageBox = ({ src }) => (
    <div className="hotel-banner-box">
        <Image 
            src={src} 
            fit='cover' 
            className="hotel-banner-image"
            placeholder={<div className='image-placeholder'>Loading...</div>}
        />
    </div>
)

export default HotelBanner
