import React, { useEffect, useMemo, useState } from 'react';
import { Popup, Button, Selector, Slider } from 'antd-mobile';
import { CloseOutline } from 'antd-mobile-icons';

const DEFAULT_PRICE_RANGE = [0, 750];

// 价格分段（示例，可按需调整文案/区间）
const PRICE_PRESETS = [
  { label: '¥100以下', value: '0-100' },
  { label: '¥100-150', value: '100-150' },
  { label: '¥150-200', value: '150-200' },
  { label: '¥200-250', value: '200-250' },
  { label: '¥250-300', value: '250-300' },
  { label: '¥300-500', value: '300-500' },
  { label: '¥500-750', value: '500-750' },
  { label: '¥750以上', value: '750+' },
];

const STAR_OPTIONS = [
  { label: '2星及以下', value: '2-' },
  { label: '3星', value: '3' },
  { label: '4星', value: '4' },
  { label: '5星', value: '5' },
];

/**
 * 可复用 Bottom Sheet：选择价格和星级
 * props:
 * - visible: boolean
 * - onClose: () => void
 * - onConfirm: ({ priceRange, pricePreset, star }) => void
 * - defaultValue?: { priceRange?: [number, number], pricePreset?: string|null, star?: string|null }
 */
const PriceStarPopup = ({ visible, onClose, onConfirm, defaultValue }) => {
  const init = useMemo(() => {
    return {
      priceRange: defaultValue?.priceRange ?? DEFAULT_PRICE_RANGE,
      pricePreset: defaultValue?.pricePreset ?? null,
      star: defaultValue?.star ?? null,
    };
  }, [defaultValue?.priceRange, defaultValue?.pricePreset, defaultValue?.star]);

  const [priceRange, setPriceRange] = useState(init.priceRange);
  const [pricePreset, setPricePreset] = useState(init.pricePreset);
  const [star, setStar] = useState(init.star);

  useEffect(() => {
    if (!visible) return;
    setPriceRange(init.priceRange);
    setPricePreset(init.pricePreset);
    setStar(init.star);
  }, [visible, init.priceRange, init.pricePreset, init.star]);

  const clearAll = () => {
    setPriceRange(DEFAULT_PRICE_RANGE);
    setPricePreset(null);
    setStar(null);
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      bodyStyle={{
        height: '62vh',
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
        <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 700 }}>选择价格和星级</div>
      </div>

      {/* Content */}
      <div style={{ padding: '6px 22px 0', overflow: 'auto', flex: 1 }}>
        {/* Price */}
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>价格</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, marginBottom: 8 }}>
          <div>¥{priceRange[0]}</div>
          <div>¥{priceRange[1]}</div>
        </div>

        <Slider
          range
          min={0}
          max={750}
          step={50}
          value={priceRange}
          onChange={(val) => {
            setPriceRange(val);
            // 用户手动拖动时，取消 preset
            setPricePreset(null);
          }}
        />

        <div style={{ marginTop: 14 }}>
          <Selector
            columns={3}
            options={PRICE_PRESETS}
            value={pricePreset ? [pricePreset] : []}
            onChange={(arr) => {
              const v = arr?.[0] ?? null;
              setPricePreset(v);
              // 选 preset 同步 slider（尽量贴齐）
              if (!v) return;
              if (v === '750+') {
                setPriceRange([750, 750]);
                return;
              }
              const [a, b] = v.split('-').map(n => Number(n));
              if (!Number.isNaN(a) && !Number.isNaN(b)) setPriceRange([a, b]);
            }}
          />
        </div>

        {/* Star */}
        <div style={{ fontSize: 18, fontWeight: 700, margin: '18px 0 12px' }}>星级</div>
        <Selector
          columns={3}
          options={STAR_OPTIONS}
          value={star ? [star] : []}
          onChange={(arr) => setStar(arr?.[0] ?? null)}
        />
      </div>

      {/* Footer */}
      <div style={{ padding: 18, display: 'flex', gap: 12, borderTop: '1px solid #eee' }}>
        <Button
          block
          style={{ flex: 1, background: '#EEF1F6', border: 'none', color: '#333', borderRadius: 8, fontWeight: 700 }}
          onClick={clearAll}
        >
          清空条件
        </Button>
        <Button
          block
          color='primary'
          style={{ flex: 1, borderRadius: 8, fontWeight: 700 }}
          onClick={() => onConfirm({ priceRange, pricePreset, star })}
        >
          完成
        </Button>
      </div>
    </Popup>
  );
};

export default PriceStarPopup;
export { DEFAULT_PRICE_RANGE };
