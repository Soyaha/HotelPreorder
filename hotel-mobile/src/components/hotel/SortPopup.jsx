import React from 'react'
import { Popup } from 'antd-mobile'

const SortPopup = ({ visible, sortValue, sortOptions, selectedSortLabel, onSelect, onClose, topOffset = 98 }) => {
  return (
    <Popup
      visible={visible}
      position="top"
      onMaskClick={onClose}
      maskStyle={{ top: topOffset }}
      bodyStyle={{
        marginTop: topOffset,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      }}
    >
      <div className="filter-popup sort-popup">
        {sortOptions.map((option) => (
          <div
            key={option.value}
            className={`sort-item ${sortValue === option.value ? 'selected' : ''}`}
            onClick={() => onSelect(option.value)}
          >
            <span>{option.label}</span>
            {sortValue === option.value && <span className="selected-check">√</span>}
          </div>
        ))}
        <div className="current-sort-tip">当前：{selectedSortLabel}</div>
      </div>
    </Popup>
  )
}

export default SortPopup
