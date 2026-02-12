import React, { useRef } from 'react'
import { Popup } from 'antd-mobile'

const LocationPopup = ({
  visible,
  locationDraft,
  setLocationDraft,
  locationGroups,
  onClear,
  onConfirm,
  onClose,
  topOffset,
}) => {
  const panelRightRef = useRef(null)
  const sectionRefs = useRef({})
  const locationTabs = Object.keys(locationGroups)

  const handleSideTabClick = (group) => {
    setLocationDraft(prev => ({ ...prev, group }))

    const targetNode = sectionRefs.current[group]
    if (targetNode) {
      targetNode.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    panelRightRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
            {locationTabs.map(group => (
              <div
                key={group}
                className={`left-tab ${locationDraft.group === group ? 'active' : ''}`}
                onClick={() => handleSideTabClick(group)}
              >
                {group}
              </div>
            ))}
          </div>

          <div className="panel-right-list" ref={panelRightRef}>
            {locationTabs.map(group => (
              <div
                key={group}
                className="filter-section"
                ref={(node) => {
                  if (node) {
                    sectionRefs.current[group] = node
                  }
                }}
              >
                <div className="section-title-row">
                  <span className="section-title-text">{group}</span>
                </div>

                {locationGroups[group].map(option => (
                  <div
                    key={`${group}-${option}`}
                    className={`list-row ${locationDraft.option === option ? 'selected' : ''}`}
                    onClick={() => setLocationDraft({ group, option })}
                  >
                    <span>{option}</span>
                    {locationDraft.option === option && <span className="selected-check">√</span>}
                  </div>
                ))}
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
