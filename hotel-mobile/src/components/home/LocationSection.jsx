import React from 'react';
import { EnvironmentOutline, SearchOutline, RightOutline } from 'antd-mobile-icons';

const LocationSection = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 15,
      width: '100%',
      marginBottom: 20,
      padding: '0 10px'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '0 23px',
        gap: 4,
        width: '100%',
      }}>
        <div style={{
          fontFamily: 'Inter',
          fontWeight: 500,
          fontSize: 14,
          color: '#CFCFCF'
        }}>北京市</div>

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 28,
          width: '100%',
          paddingTop: 5
        }}>
          {/* District Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 16 }}>朝阳区</span>
            <RightOutline fontSize={12} style={{ transform: 'translateY(1px)' }} />
          </div>

          <div style={{ position: 'relative' }}>
            <EnvironmentOutline color='#2577E3' fontSize={24} />
          </div>

          <div style={{ width: 1, height: 26, background: '#CFCFCF' }}></div>

          {/* Search Input Mock */}
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: '#CFCFCF' }}>位置/品牌/酒店</span>
            <SearchOutline color='#2577E3' fontSize={24} />
          </div>
        </div>
      </div>
      <div style={{ width: '90%', height: 2, background: '#eee', margin: '0 auto' }}></div>
    </div>
  );
};

export default LocationSection;
