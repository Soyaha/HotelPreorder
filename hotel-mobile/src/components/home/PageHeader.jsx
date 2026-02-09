import React from 'react';
import { LeftOutline, MoreOutline } from 'antd-mobile-icons';

const PageHeader = () => {
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: 54,
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 2
      }}
    >
      {/* 左侧 Tab */}
      <div
        style={{
          width: 136,
          height: 54,
          background: '#FFFFFF',
          borderRadius: '10px 10px 0px 0px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <span
          style={{
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: 20,
            color: '#2577E3'
          }}
        >
          预订酒店
        </span>
      </div>

      {/* 右侧装饰盒，占满剩余空间 */}
      <div
        style={{
          flex: 1,
          height: 48,
          marginTop: 6,
          background: '#EEF1F6',
          borderRadius: '0px 10px 0 10px'
        }}
      />
    </div>
  );
};


export default PageHeader;
