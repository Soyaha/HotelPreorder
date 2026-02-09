import React, { useMemo, useState } from 'react';
import { RightOutline } from 'antd-mobile-icons';
import RoomGuestPopup from './RoomGuestPopup';
import PriceStarPopup, { DEFAULT_PRICE_RANGE } from './PriceStarPopup';

const formatPriceStar = ({ priceRange, star }) => {
  const isDefaultRange = !priceRange || (priceRange[0] === DEFAULT_PRICE_RANGE[0] && priceRange[1] === DEFAULT_PRICE_RANGE[1]);
  const hasStar = !!star;

  if (!isDefaultRange && hasStar) return `¥${priceRange[0]}-${priceRange[1]} · ${star}${star === '2-' ? '' : '星'}`;
  if (!isDefaultRange) return `¥${priceRange[0]}-${priceRange[1]}`;
  if (hasStar) return star === '2-' ? '2星及以下' : `${star}星`;
  return '价格/星级';
};

const RoomSection = () => {
  const [guestVisible, setGuestVisible] = useState(false);
  const [priceVisible, setPriceVisible] = useState(false);

  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const [priceRange, setPriceRange] = useState(DEFAULT_PRICE_RANGE);
  const [pricePreset, setPricePreset] = useState(null);
  const [star, setStar] = useState(null);

  const priceStarText = useMemo(() => formatPriceStar({ priceRange, star }), [priceRange, star]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '0 30px',
          gap: 21,
          width: '100%',
          marginBottom: 15,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Left: Room/Adults/Children */}
          <div
            onClick={() => setGuestVisible(true)}
            style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}
          >
            <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20 }}>{rooms}间房</span>
            <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20 }}>{adults}成人</span>
            <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20 }}>{children}儿童</span>
            <RightOutline fontSize={12} style={{ transform: 'translateY(1px)' }} />
          </div>

          {/* Right: Price/Star */}
          <div
            onClick={() => setPriceVisible(true)}
            style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: priceStarText === '价格/星级' ? '#CFCFCF' : '#111', cursor: 'pointer' }}
          >
            {priceStarText}
          </div>
        </div>
        <div style={{ width: '100%', height: 2, background: '#eee' }}></div>
      </div>

      <RoomGuestPopup
        visible={guestVisible}
        onClose={() => setGuestVisible(false)}
        defaultValue={{ rooms, adults, children }}
        onConfirm={({ rooms: r, adults: a, children: c }) => {
          setRooms(r);
          setAdults(a);
          setChildren(c);
          setGuestVisible(false);
        }}
      />

      <PriceStarPopup
        visible={priceVisible}
        onClose={() => setPriceVisible(false)}
        defaultValue={{ priceRange, pricePreset, star }}
        onConfirm={({ priceRange: pr, pricePreset: pp, star: s }) => {
          setPriceRange(pr);
          setPricePreset(pp);
          setStar(s);
          setPriceVisible(false);
        }}
      />
    </>
  );
};

export default RoomSection;
