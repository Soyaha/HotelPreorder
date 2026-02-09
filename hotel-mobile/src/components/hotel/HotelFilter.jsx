import React from 'react'
import { DownOutline } from 'antd-mobile-icons'

const filterItems = [
  { key: 'sort', label: '欢迎度排序' },
  { key: 'location', label: '位置距离' },
  { key: 'price', label: '价格/星级' },
  { key: 'filter', label: '筛选' },
]

export default function HotelFilter() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      background: '#FFFFFF',
      borderBottom: '1px solid #F0F0F0',
      fontSize: 13,
      color: '#333',
      position: 'sticky',
      top: 45, // navigation bar height adjustment if needed
      zIndex: 100
    }}>
      {filterItems.map(item => (
        <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ fontWeight: 500 }}>{item.label}</span>
          <DownOutline fontSize={10} color='#666' />
        </div>
      ))}
    </div>
  )
}
