import React from 'react';
import { RightOutline } from 'antd-mobile-icons';

const RoomSection = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '0 30px',
      gap: 21,
      width: '100%',
      marginBottom: 15
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 16 }}>1间房</span>
          <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 16 }}>1成人</span>
          <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 16 }}>0儿童</span>
          <RightOutline fontSize={12} style={{ transform: 'translateY(1px)' }} />
        </div>

        <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: '#CFCFCF' }}>价格/星级</div>
      </div>
      <div style={{ width: '100%', height: 2, background: '#eee' }}></div>
    </div>
  );
};

export default RoomSection;
