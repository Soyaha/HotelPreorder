import React, { useEffect, useMemo, useState } from 'react';
import { Popup, CascaderView, Button } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';

const findPathLabels = (options, valuePath) => {
  const labels = [];
  let cur = options;
  for (const v of valuePath) {
    const hit = cur?.find(o => o.value === v);
    if (!hit) break;
    labels.push(hit.label);
    cur = hit.children || [];
  }
  return labels;
};

/**
 * 可复用 Bottom Sheet：省/市/区级联选择
 * props:
 * - visible: boolean
 * - onClose: () => void
 * - options: CascaderOption[]
 * - defaultValue?: string[]
 * - onConfirm: ({ value, labels }) => void
 */
const CityPickerPopup = ({ visible, onClose, options, defaultValue, onConfirm }) => {
  const [value, setValue] = useState(defaultValue ?? []);

  useEffect(() => {
    if (!visible) return;
    setValue(defaultValue ?? []);
  }, [visible, defaultValue]);

  const labels = useMemo(() => findPathLabels(options, value), [options, value]);

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{
        height: '70vh',
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
        <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 700 }}>选择省市区</div>
      </div>

      <div style={{ padding: '0 12px', flex: 1, overflow: 'auto' }}>
        <CascaderView options={options} value={value} onChange={setValue} />
      </div>

      <div style={{ padding: 18, borderTop: '1px solid #eee', display: 'flex', gap: 12 }}>
        <Button
          block
          style={{ flex: 1, background: '#EEF1F6', border: 'none', color: '#333', borderRadius: 8, fontWeight: 700 }}
          onClick={() => setValue([])}
        >
          清空
        </Button>
        <Button
          block
          color='primary'
          style={{ flex: 1, borderRadius: 8, fontWeight: 700 }}
          disabled={value.length < 2}
          onClick={() => onConfirm({ value, labels })}
        >
          完成
        </Button>
      </div>
    </Popup>
  );
};

export default CityPickerPopup;
