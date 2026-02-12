import React from 'react'
import { Popup } from 'antd-mobile'

const LocationPopup = ({
  visible,
  locationDraft,
  setLocationDraft,
  locationGroups,
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
        <div className="panel-content">
          <div className="panel-left-tabs">
            {Object.keys(locationGroups).map(group => (
              <div
                key={group}
                className={`left-tab ${locationDraft.group === group ? 'active' : ''}`}
                onClick={() => setLocationDraft(prev => ({ ...prev, group }))}
              >
                {group}
              </div>
            ))}
          </div>

          <div className="panel-right-list">
            {locationGroups[locationDraft.group].map(option => (
              <div
                key={option}
                className={`list-row ${locationDraft.option === option ? 'selected' : ''}`}
                onClick={() => setLocationDraft(prev => ({ ...prev, option }))}
              >
                <span>{option}</span>
                {locationDraft.option === option && <span className="selected-check">√</span>}
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
export default LocationPopup
