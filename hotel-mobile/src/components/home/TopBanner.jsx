import React from 'react';

const TopBanner = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: 20,
      width: '100%',
      height: 200,
      background: '#454545', // Placeholder for image
      position: 'relative'
    }}>
      {/* BannerChange / banner-dot */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: 7,
      }}>
        <div style={{ width: 16, height: 8, background: '#FFFFFF', borderRadius: 999 }}></div>
        <div style={{ width: 8, height: 8, background: 'rgba(255, 255, 255, 0.5)', borderRadius: 999 }}></div>
        <div style={{ width: 8, height: 8, background: 'rgba(255, 255, 255, 0.5)', borderRadius: 999 }}></div>
        <div style={{ width: 8, height: 8, background: 'rgba(255, 255, 255, 0.5)', borderRadius: 999 }}></div>
        <div style={{ width: 8, height: 8, background: 'rgba(255, 255, 255, 0.5)', borderRadius: 999 }}></div>
      </div>
    </div>
  );
};

export default TopBanner;
