import React, { useRef } from 'react'
import { Popup } from 'antd-mobile'

const AdvancedFilterPopup = ({
  visible,
  filterDraft,
  setFilterDraft,
  filterLeftTabs,
  filterSections,
  quickLocateMap,
  onSelectOption,
  onClear,
  onConfirm,
  onClose,
  topOffset,
}) =>{
  const panelRightRef = useRef(null)
  const sectionRefs = useRef({})

  const handleSideTabClick = (tab) => {
    setFilterDraft(prev => ({ ...prev, leftTab: tab }))

    const target = quickLocateMap?.[tab]
    if (!target) return

    if (target === '__TOP__') {
      panelRightRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const sectionNode = sectionRefs.current[target]
    if (sectionNode) {
      sectionNode.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
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
            {filterLeftTabs.map(tab => (
              <div
                key={tab}
                className={`left-tab ${filterDraft.leftTab === tab ? 'active' : ''}`}
                onClick={() => handleSideTabClick(tab)}
              >
                {tab}
              </div>
            ))}
          </div>

          <div className="panel-right-filter" ref={panelRightRef}>
            {filterSections.map(section => (
              <div
                key={section.section}
                className="filter-section"
                ref={(node) => {
                  if (node) {
                    sectionRefs.current[section.section] = node
                  }
                }}
              >
                <div className="section-title-row">
                  <span className="section-title-text">{section.section}</span>
                </div>

                <div className="chip-grid three-col">
                  {section.options.map(option => {
                    const selectedValues = filterDraft.selected[section.section] || []
                    const selected = selectedValues.includes(option)

                    return (
                      <div
                        key={option}
                        className={`chip ${selected ? 'selected' : ''}`}
                        onClick={() => onSelectOption(section.section, option, section.type)}
                      >
                        {option}
                      </div>
                    )
                  })}
                </div>
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
export default AdvancedFilterPopup
