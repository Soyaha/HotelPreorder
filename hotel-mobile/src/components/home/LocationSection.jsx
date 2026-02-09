import React, { useMemo, useState } from 'react';
import { EnvironmentOutline, SearchOutline, RightOutline } from 'antd-mobile-icons';
import { Toast } from 'antd-mobile';
import CityPickerPopup from './CityPickerPopup';
import { buildPcaOptions } from '../../utils/pca-options';

const LocationSection = () => {
  const options = useMemo(() => buildPcaOptions(), []);

  const [popupVisible, setPopupVisible] = useState(false);
  // valuePath: [provinceName, cityName, districtName]
  const [valuePath, setValuePath] = useState(['北京市', '市辖区', '朝阳区']);

  // 显示值（允许被“定位”覆盖）
  const [display, setDisplay] = useState({
    province: '北京市',
    city: '市辖区',
    district: '朝阳区',
  });

  const onLocate = async (e) => {
    e.stopPropagation();

    if (!('geolocation' in navigator)) {
      Toast.show({ content: '当前浏览器不支持定位' });
      return;
    }

    Toast.show({ icon: 'loading', content: '定位中…', duration: 0 });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          // Reverse geocoding via Nominatim (best effort)
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=zh-CN`;
          const resp = await fetch(url, { headers: { Accept: 'application/json' } });
          const data = await resp.json();
          const addr = data?.address || {};

          const province = addr.state || addr.province;
          const city = addr.city || addr.town || addr.municipality;
          const district = addr.county || addr.district || addr.suburb;

          Toast.clear();

          if (!province && !city && !district) {
            Toast.show({ content: '定位成功，但解析地址失败' });
            return;
          }

          // 这里不强行回填到 valuePath（因为定位结果不一定与 pca.json 文案 100% 一致）
          // 仅更新展示文案。
          setDisplay({
            province: province || display.province,
            city: city || display.city,
            district: district || display.district,
          });
        } catch {
          Toast.clear();
          Toast.show({ content: '定位失败，请稍后重试' });
        }
      },
      () => {
        Toast.clear();
        Toast.show({ content: '定位失败，请检查权限设置' });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <>
      <div
        onClick={() => setPopupVisible(true)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 15,
          width: '100%',
          marginBottom: 20,
          padding: '0 10px',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0 23px',
            gap: 4,
            width: '100%',
          }}
        >
          <div
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 14,
              color: '#CFCFCF',
            }}
          >
            {display.province}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 28,
              width: '100%',
              paddingTop: 5,
            }}
          >
            {/* District Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20 }}>{display.district}</span>
              <RightOutline fontSize={12} style={{ transform: 'translateY(1px)' }} />
            </div>

            <div style={{ position: 'relative' }} onClick={onLocate}>
              <EnvironmentOutline color='#2577E3' fontSize={24} />
            </div>

            <div style={{ width: 1, height: 26, background: '#CFCFCF' }} />

            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'space-between' }}>
              <input
                type="text"
                placeholder="关键字"
                onClick={(e) => e.stopPropagation()}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontFamily: 'Inter',
                  fontWeight: 500,
                  fontSize: 20,
                  color: '#000',
                }}
              />
              <SearchOutline color='#2577E3' fontSize={24} />
            </div>
          </div>
        </div>
        <div style={{ width: '90%', height: 2, background: '#eee', margin: '0 auto' }} />
      </div>

      <CityPickerPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        options={options}
        defaultValue={valuePath}
        onConfirm={({ value, labels }) => {
          setValuePath(value);
          // labels: [province, city, district]
          const [province, city, district] = labels;
          setDisplay({ province: province || '', city: city || '', district: district || '' });
          setPopupVisible(false);
        }}
      />
    </>
  );
};

export default LocationSection;
