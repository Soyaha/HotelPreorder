import React, { useState } from 'react';
import dayjs from 'dayjs';
import CalendarPopup from './CalendarPopup';

const DateSection = ({ dateRange, setDateRange }) => {

  const [showCalendar, setShowCalendar] = useState(false);

  const onConfirm = (range) => {
    // Range is [dayjs, dayjs]
    if (range && range[0] && range[1]) {
      setDateRange(range);
    }
    setShowCalendar(false);
  }

  const startDate = dateRange[0];
  const endDate = dateRange[1];

  const nights = endDate.diff(startDate, 'day');

  // Weekday formatting
  const getWeekday = (d) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[d.day()];
  };

  return (
    <>
      <div
        onClick={() => setShowCalendar(true)}
        
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0 30px',
          gap: 19,
          width: '100%',
          marginBottom: 20,
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20 }}>{startDate.format('M月D日')}</span>
              <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14 }}>{getWeekday(startDate)}</span>
            </div>
            <div style={{ width: 15, height: 1, background: '#000' }}></div>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20 }}>{endDate.format('M月D日')}</span>
              <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14 }}>{getWeekday(endDate)}</span>
            </div>
          </div>
          <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14 }}>共{nights}晚</div>
        </div>
        <div style={{ width: '100%', height: 2, background: '#eee' }}></div>
      </div>

      <CalendarPopup
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        onConfirm={onConfirm}
        defaultDateRange={dateRange}
      />
    </>
  );
};

export default DateSection;
