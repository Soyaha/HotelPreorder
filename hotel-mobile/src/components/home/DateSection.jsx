import React from 'react';

const DateSection = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '0 30px',
      gap: 19,
      width: '100%',
      marginBottom: 20,
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 16 }}>2月8日</span>
            <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14 }}>周日</span>
          </div>
          <div style={{ width: 15, height: 1, background: '#000' }}></div>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 16 }}>2月9日</span>
            <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14 }}>周一</span>
          </div>
        </div>
        <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14 }}>共1晚</div>
      </div>
      <div style={{ width: '100%', height: 2, background: '#eee' }}></div>
    </div>
  );
};

export default DateSection;
