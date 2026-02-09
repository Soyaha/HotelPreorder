import React from 'react';
import { Selector, Space } from 'antd-mobile'

const TagItem = ({ text, selected }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4px 8px',
    background: selected ? '#BACDED' : '#EEF1F6',
    borderRadius: 5,
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: 14,
    color: '#000000',
    whiteSpace: 'nowrap'
  }}>
    {text}
  </div>
)

const options = [
  { label: '宠物友好', value: '1' },
  { label: '免费停车场', value: '2' },
  { label: '亲子', value: '3' },
  { label: '豪华', value: '4' },
  { label: '大床房', value: '5' },
  { label: '4.5分以上', value: '6' },
]

const FilterTagsSection = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '9px 30px 15px ',
      gap: 10,
      width: '100%',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13,
        width: '100%',
        overflowX: 'auto'
      }}>

        <Selector
          options={options}
          multiple
          onChange={(arr, extend) => console.log(arr, extend.items)}
          showCheckMark={true}
          style={{
            '--border-radius': '7px'
          }}
        />
      </div>
    </div>
  );
};

export default FilterTagsSection;
