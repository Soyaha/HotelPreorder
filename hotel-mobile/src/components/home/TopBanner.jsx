import React, { useRef } from 'react';
import { Swiper, Toast } from 'antd-mobile'


const TopBanner = () => {

  const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac']


  const items = colors.map((color, index) => (
    <Swiper.Item key={index}>
      <div
        style={{ background: color, height: 200 }}
        onClick={() => {
          Toast.show(`你点击了卡片 ${index + 1}`)
        }}
      >
        {index + 1}
      </div>
    </Swiper.Item>
  ))


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
