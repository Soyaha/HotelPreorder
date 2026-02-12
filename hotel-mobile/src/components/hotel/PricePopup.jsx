import React from 'react'
import { Popup, Slider } from 'antd-mobile'

const PricePopup = ({
  visible,
  priceDraft,
  setPriceDraft,
  pricePresetOptions,
  starOptions,
  onPresetClick,
  onClear,
  onConfirm,
  onClose,
  topOffset = 98,
}) => {
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
        overflow: 'hidden',
      }}
    >
      <div className="filter-popup panel-popup with-footer" style={{ maxHeight: `calc(100vh - ${topOffset + 22}px)` }}>
        <div className="price-content">
          <div className="section-title">价格</div>
          <div className="price-range-values">
            <span>¥{priceDraft.priceRange[0]}</span>
            <span>¥{priceDraft.priceRange[1]}</span>
          </div>

          <Slider
            range
            min={0}
            max={750}
            step={50}
            value={priceDraft.priceRange}
            onChange={(range) => setPriceDraft(prev => ({ ...prev, priceRange: range, pricePreset: null }))}
          />

          <div className="chip-grid three-col">
            {pricePresetOptions.map(option => (
              <div
                key={option}
                className={`chip ${priceDraft.pricePreset === option ? 'selected' : ''}`}
                onClick={() => onPresetClick(option)}
              >
                {option}
              </div>
            ))}
          </div>

          <div className="section-title section-title-star">星级</div>
          <div className="chip-grid three-col">
            {starOptions.map(option => (
              <div
                key={option}
                className={`chip ${priceDraft.star === option ? 'selected' : ''}`}
                onClick={() => setPriceDraft(prev => ({ ...prev, star: prev.star === option ? null : option }))}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        <div className="popup-footer">
          <button className="footer-btn clear" onClick={onClear}>清空</button>
          <button className="footer-btn confirm" onClick={onConfirm}>完成</button>
        </div>
      </div>
    </Popup>
  )
}

export default PricePopup
    