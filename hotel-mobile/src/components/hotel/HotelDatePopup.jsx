import React, { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Popup, Button } from 'antd-mobile'
import { LeftOutline, RightOutline } from 'antd-mobile-icons'

const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六']

const HotelDatePopup = ({ visible, onClose, onConfirm, defaultDateRange, topOffset = 98 }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs())
  const [selection, setSelection] = useState([null, null])

  useEffect(() => {
    if (!visible) return

    const start = defaultDateRange?.[0] ? dayjs(defaultDateRange[0]) : dayjs()
    const end = defaultDateRange?.[1] ? dayjs(defaultDateRange[1]) : dayjs().add(1, 'day')

    setSelection([start, end])
    setCurrentMonth(start)
  }, [visible, defaultDateRange])

  const canConfirm = useMemo(() => Boolean(selection[0] && selection[1]), [selection])

  const handleDateClick = (date) => {
    const [start, end] = selection

    if ((!start && !end) || (start && end)) {
      setSelection([date, null])
      return
    }

    if (start && !end) {
      if (date.isBefore(start, 'day')) {
        setSelection([date, null])
      } else {
        setSelection([start, date])
      }
    }
  }

  const isSelected = (date) => {
    const [start, end] = selection
    return (start && date.isSame(start, 'day')) || (end && date.isSame(end, 'day'))
  }

  const isInRange = (date) => {
    const [start, end] = selection
    if (start && end) {
      return date.isAfter(start, 'day') && date.isBefore(end, 'day')
    }
    return false
  }

  const renderDays = () => {
    const startOfMonth = currentMonth.startOf('month')
    const daysInMonth = currentMonth.daysInMonth()
    const startDayOfWeek = startOfMonth.day()
    const nodes = []

    for (let index = 0; index < startDayOfWeek; index += 1) {
      nodes.push(<div key={`empty-${index}`} style={{ width: '14.28%', height: 42 }} />)
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = startOfMonth.date(day)
      const selected = isSelected(date)
      const inRange = isInRange(date)

      nodes.push(
        <div
          key={day}
          style={{ width: '14.28%', height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => handleDateClick(date)}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              fontWeight: selected ? 700 : 500,
              color: selected ? '#fff' : inRange ? '#2577E3' : '#333',
              background: selected ? '#2577E3' : inRange ? '#EAF2FF' : 'transparent',
            }}
          >
            {day}
          </div>
        </div>
      )
    }

    return nodes
  }

  return (
    <Popup
      visible={visible}
      position="top"
      onMaskClick={onClose}
      maskStyle={{ top: topOffset }}
      bodyStyle={{
        marginTop: topOffset,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        overflow: 'hidden',
      }}
    >
      <div style={{ maxHeight: `calc(100vh - ${topOffset + 16}px)`, display: 'flex', flexDirection: 'column', background: '#fff' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', marginBottom: 10 }}>
          <LeftOutline onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))} />
            <div style={{ fontSize: 18, fontWeight: 'bold' }}>
                {currentMonth.format('YYYY')}
                <span>年 </span>
                {currentMonth.format('M')}
                <span>月</span>
            </div>
          <RightOutline onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))} />
        </div>       
        
        <div style={{ padding: '10px 12px 0', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'flex', marginBottom: 6 }}>
            {WEEK_DAYS.map((weekDay) => (
              <div key={weekDay} style={{ width: '14.28%', textAlign: 'center', fontSize: 13, color: '#999' }}>
                {weekDay}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>{renderDays()}</div>
        </div>

        <div style={{ padding: 12, borderTop: '1px solid #f0f0f0' }}>
          <Button block color="primary" disabled={!canConfirm} onClick={() => onConfirm(selection)}>
            完成
          </Button>
        </div>
      </div>
    </Popup>
  )
}

export default HotelDatePopup
