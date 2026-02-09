import React, { useState } from 'react'
import { DownOutline } from 'antd-mobile-icons'
import PriceStarPopup from '../home/PriceStarPopup'
import './HotelList.css'

const filterItems = [
  { key: 'sort', label: '排序' },
  { key: 'location', label: '位置距离' },
  { key: 'price', label: '价格星级' },
  { key: 'filter', label: '筛选' },
]

export default function HotelFilter() {
  const [activeFilter, setActiveFilter] = useState(null)
  const [filterValues, setFilterValues] = useState({
    price: null // { priceRange: [...], pricePreset: '...', star: '...' }
  })

  // ... rest logic ...

  const handleFilterClick = (key) => {
    if (activeFilter === key) {
      setActiveFilter(null)
    } else {
      setActiveFilter(key)
    }
  }

  const handlePriceConfirm = (value) => {
    setFilterValues(prev => ({ ...prev, price: value }))
    setActiveFilter(null)
  }

  return (
    <>
      <div className="hotel-filter">
        {filterItems.map(item => (
          <div 
            key={item.key} 
            className="filter-item"
             onClick={() => handleFilterClick(item.key)}
          >
            <span>{item.label}</span>
            <span className="filter-item-arrow">▼</span>
          </div>
        ))}
      </div>

      <PriceStarPopup
        visible={activeFilter === 'price'}
        onClose={() => setActiveFilter(null)}
        onConfirm={handlePriceConfirm}
        defaultValue={filterValues.price}
      />
    </>
  )
}

