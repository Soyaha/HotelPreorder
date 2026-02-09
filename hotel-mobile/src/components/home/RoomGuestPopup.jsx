import React, { useEffect, useMemo, useState } from 'react';
import { Popup, Button } from 'antd-mobile';
import { CloseOutline, MinusOutline, AddOutline } from 'antd-mobile-icons';

const clampMin = (value, min) => (value < min ? min : value);

const CounterRow = ({ label, value, min = 0, onChange }) => {
  const canMinus = value > min;

  const commonBtnStyle = {
    width: 32,
    height: 32,
    border: 'none',
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#111',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0' }}>
      <div style={{ fontSize: 18, fontWeight: 600, color: '#111' }}>{label}</div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: '#EEF1F6',
        borderRadius: 999,
        padding: '6px 10px',
        minWidth: 108,
        justifyContent: 'space-between'
      }}>
        <button
          type='button'
          aria-label='minus'
          disabled={!canMinus}
          onClick={() => onChange(clampMin(value - 1, min))}
          style={{
            ...commonBtnStyle,
            opacity: canMinus ? 1 : 0.35,
            cursor: canMinus ? 'pointer' : 'not-allowed'
          }}
        >
          <MinusOutline fontSize={18} />
        </button>

        <div style={{ width: 24, textAlign: 'center', fontSize: 18, fontWeight: 700 }}>{value}</div>

        <button
          type='button'
          aria-label='add'
          onClick={() => onChange(value + 1)}
          style={commonBtnStyle}
        >
          <AddOutline fontSize={18} />
        </button>
      </div>
    </div>
  );
};

/**
 * 可复用 Bottom Sheet：选择客房和入住人数
 * props:
 * - visible: boolean
 * - onClose: () => void
 * - onConfirm: ({ rooms, adults, children }) => void
 * - defaultValue?: { rooms?: number, adults?: number, children?: number }
 */
const RoomGuestPopup = ({ visible, onClose, onConfirm, defaultValue }) => {
  const init = useMemo(() => {
    return {
      rooms: Math.max(1, Number(defaultValue?.rooms ?? 1)),
      adults: Math.max(1, Number(defaultValue?.adults ?? 1)),
      children: Math.max(0, Number(defaultValue?.children ?? 0)),
    };
  }, [defaultValue?.rooms, defaultValue?.adults, defaultValue?.children]);

  const [rooms, setRooms] = useState(init.rooms);
  const [adults, setAdults] = useState(init.adults);
  const [children, setChildren] = useState(init.children);

  useEffect(() => {
    if (!visible) return;
    setRooms(init.rooms);
    setAdults(init.adults);
    setChildren(init.children);
  }, [visible, init.rooms, init.adults, init.children]);

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{
        height: '45vh',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{ padding: '14px 18px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 18, top: 14 }}>
          <CloseOutline fontSize={22} onClick={onClose} />
        </div>
        <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 700 }}>选择客房和入住人数</div>
      </div>

      <div style={{ padding: '0 22px' }}>
        <CounterRow label='间数' value={rooms} min={1} onChange={setRooms} />
        <div style={{ height: 1, background: '#E9E9E9' }} />
        <CounterRow label='成人数' value={adults} min={1} onChange={setAdults} />
        <div style={{ height: 1, background: '#E9E9E9' }} />
        <CounterRow label='儿童数' value={children} min={0} onChange={setChildren} />
        <div style={{ height: 1, background: '#E9E9E9' }} />
      </div>

      <div style={{ marginTop: '11px', padding: 18 }}>
        <Button
          block
          color='primary'
          size='large'
          onClick={() => onConfirm({ rooms, adults, children })}
          style={{ borderRadius: 8, fontWeight: 700, fontSize: 16 }}
        >
          完成
        </Button>
      </div>
    </Popup>
  );
};

export default RoomGuestPopup;
