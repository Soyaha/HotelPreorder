import React, { useState, useEffect } from 'react';
import { Popup, Button } from 'antd-mobile';
import { CloseOutline, LeftOutline, RightOutline } from 'antd-mobile-icons';
import dayjs from 'dayjs';

const CalendarPopup = ({ visible, onClose, onConfirm, defaultDateRange }) => {

  const [currentMonth, setCurrentMonth] = useState(dayjs());
  // selection: [start, end] | [start, null] | null
  const [selection, setSelection] = useState(defaultDateRange || [null, null]);

  useEffect(() => {
    if (visible) {
      // Create new instances to avoid reference issues
      const start = defaultDateRange?.[0] ? dayjs(defaultDateRange[0]) : null;
      const end = defaultDateRange?.[1] ? dayjs(defaultDateRange[1]) : null;
      setSelection([start, end]);
      if (start) setCurrentMonth(start);
      else setCurrentMonth(dayjs());
    }
  }, [visible, defaultDateRange]);

  const handleDateClick = (date) => {
    const [start, end] = selection;

    // Logic for range selection
    // 1. If empty or full range selected, start new range
    if ((!start && !end) || (start && end)) {
      setSelection([date, null]);
      return;
    }

    // 2. If only start exists
    if (start && !end) {
      if (date.isBefore(start, 'day')) {
        // Picked date before start, reset start
        setSelection([date, null]);
      } else {
        // Picked date after start, complete range
        setSelection([start, date]);
      }
    }
  };

  const isInRange = (date) => {
    const [start, end] = selection;
    if (start && end) {
      return date.isAfter(start, 'day') && date.isBefore(end, 'day');
    }
    return false;
  };

  const isSelected = (date) => {
    const [start, end] = selection;
    return (start && date.isSame(start, 'day')) || (end && date.isSame(end, 'day'));
  };

  const renderDays = () => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const daysInMonth = currentMonth.daysInMonth();
    const startDayOfWeek = startOfMonth.day(); // 0 (Sunday) to 6 (Saturday)

    const days = [];

    // Empty slots for previous month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} style={{ width: '14.28%', height: 40 }}></div>);
    }

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = startOfMonth.date(i);
      const selected = isSelected(date);
      const inRange = isInRange(date);
      const isToday = date.isSame(dayjs(), 'day');

      let bg = 'transparent';
      let color = '#333';
      let borderRadius = 0;

      if (selected) {
        bg = '#2577E3';
        color = '#fff';
        borderRadius = 4; // Start/End Rounded
      } else if (inRange) {
        bg = '#E6F0FF'; // Light blue for range
        color = '#2577E3';
      }

      days.push(
        <div
          key={i}
          onClick={() => handleDateClick(date)}
          style={{
            width: '14.28%',
            height: 40,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <div style={{
            width: '80%',
            height: '80%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: bg,
            borderRadius: borderRadius,
            color: color,
            fontWeight: isToday || selected ? 'bold' : 'normal',
            fontSize: 16
          }}>
            {i}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{
        height: '60vh',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header: Cancel (X) */}
      <div style={{ padding: 15, display: 'flex', alignItems: 'center' }}>
        <CloseOutline fontSize={24} onClick={onClose} />
      </div>

      {/* Calendar Component (Scrollable Area) */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px' }}>

        {/* Month Navigator */}
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

        {/* Weekday Headers */}
        <div style={{ display: 'flex', marginBottom: 10 }}>
          {['日', '一', '二', '三', '四', '五', '六'].map(d => (
            <div key={d} style={{ width: '14.28%', textAlign: 'center', color: '#999', fontSize: 14 }}>{d}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {renderDays()}
        </div>
      </div>

      {/* Footer: Confirm Button */}
      <div style={{ padding: 20, borderTop: '1px solid #eee' }}>
        <Button
          block
          color='primary'
          size='large'
          disabled={!selection[0] || !selection[1]}
          onClick={() => onConfirm(selection)}
          style={{ borderRadius: 8, fontWeight: 'bold', fontSize: 16 }}
        >
          完成
        </Button>
      </div>
    </Popup>
  );
};

export default CalendarPopup;
