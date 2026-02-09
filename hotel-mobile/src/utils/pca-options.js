import pca from '../data/pca.json';

// 将 pca.json 转换为 antd-mobile Cascader 需要的 options 结构
// pca: { [provinceName]: { [cityName]: string[] /* districts */ } }
export function buildPcaOptions() {
  return Object.entries(pca).map(([provinceName, cities]) => {
    const cityOptions = Object.entries(cities).map(([cityName, districts]) => {
      const districtOptions = (districts || []).map((d) => ({
        label: d,
        value: d,
      }));
      return {
        label: cityName,
        value: cityName,
        children: districtOptions,
      };
    });

    return {
      label: provinceName,
      value: provinceName,
      children: cityOptions,
    };
  });
}
