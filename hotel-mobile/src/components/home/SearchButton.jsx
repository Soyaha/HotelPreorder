import React from 'react';

const SearchButton = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '10px 23px',
      gap: 10,
      width: '100%',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px 0',
        width: '100%',
        background: '#2577E3',
        borderRadius: '15px 15px 15px 15px',
        color: '#FFFFFF',
        fontFamily: 'Inter',
        fontWeight: 700,
        fontSize: 16,
        cursor: 'pointer'
      }}>
        查询
      </div>
    </div>
  );
};

export default SearchButton;
