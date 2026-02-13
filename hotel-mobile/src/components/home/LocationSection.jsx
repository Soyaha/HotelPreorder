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
          
          // Controller for fetch timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout for API

          // Reverse geocoding via Nominatim (best effort)
          // 注意：Nominatim 在国内访问通常较慢或不稳定
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=zh-CN`;
          
          const resp = await fetch(url, { 
            headers: { Accept: 'application/json' },
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          const data = await resp.json();
          const addr = data?.address || {};

          const province = addr.state || addr.province;
          const city = addr.city || addr.town || addr.municipality;
          const district = addr.county || addr.district || addr.suburb;

          Toast.clear();

          if (!province && !city && !district) {
            throw new Error('Address parts missing');
          }

          // 这里不强行回填到 valuePath（因为定位结果不一定与 pca.json 文案 100% 一致）
          // 仅更新展示文案。
          setDisplay({
            province: province || display.province,
            city: city || display.city,
            district: district || display.district,
          });
        } catch (error) {
          Toast.clear();
          console.warn('Location API failed or timed out:', error);
          // Fallback mechanism for demo environment or network issues
          Toast.show({ content: '网络较慢，已切换至演示定位', icon: 'success' });
          setDisplay({
              province: '上海市',
              city: '市辖区',
              district: '浦东新区',
          });
        }
      },
      (err) => {
        Toast.clear();
        console.error('Geo Error:', err);
        // Fallback for secure origin restriction or denied permission in demo
        Toast.show({ content: '无法获取精准定位，已切换至默认位置', icon: 'success' });
        setDisplay({
            province: '上海市',
            city: '市辖区',
            district: '浦东新区',
        });
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } // Reduced timeout for better UX
    );
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 15,
          width: '100%',
          marginBottom: 20,
          padding: '0 10px',
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
            onClick={() => setPopupVisible(true)}
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: 14,
              color: '#CFCFCF',
              cursor: 'pointer',
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
            <div 
              onClick={() => setPopupVisible(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}
            >
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
