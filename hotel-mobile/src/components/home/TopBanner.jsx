import React, { useEffect, useMemo, useState } from 'react';
import { Swiper, Image } from 'antd-mobile'
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const TopBanner = () => {
  const navigate = useNavigate()
  const [banners, setBanners] = useState([])

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/hotels/public`)
        const data = await response.json()
        if (!response.ok || !data?.success) {
          return
        }

        const hotels = Array.isArray(data.hotels) ? data.hotels : []
        const picked = hotels.filter(item => item.image).slice(0, 4)
        setBanners(picked)
      } catch (error) {
        setBanners([])
      }
    }

    fetchBanners()
  }, [])

  const items = useMemo(() => banners.map((hotel, index) => (
    <Swiper.Item key={index}>
      <div
        style={{ height: 200, width: '100%' }}
        onClick={() => {
          navigate(`/detail/${hotel.id}`, { state: { hotel } })
        }}
      >
        <Image
          src={hotel.image}
          width='100%'
          height='100%'
          fit='cover'
        />
      </div>
    </Swiper.Item>
  )), [banners, navigate])

  if (items.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 20,
          width: '100%',
          height: 200,
          position: 'relative',
          background: '#ace0ff'
        }}
      />
    )
  }


  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
        width: '100%',
        height: 200, // Placeholder for image
        position: 'relative'
      }}>
      <Swiper
        loop
        autoplay
        onIndexChange={i => {

        }}
      >
        {items}
      </Swiper>
    </div>
  );
};

export default TopBanner;
