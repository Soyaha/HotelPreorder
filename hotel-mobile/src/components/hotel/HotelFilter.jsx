import React, { useEffect, useMemo, useState } from 'react'
import SortPopup from './SortPopup'
import LocationPopup from './LocationPopup'
import PricePopup from './PricePopup'
import AdvancedFilterPopup from './AdvancedFilterPopup'
import './HotelFilter.css'

const filterItems = [
  { key: 'sort', label: '排序' },
  { key: 'location', label: '位置距离' },
  { key: 'price', label: '价格星级' },
  { key: 'filter', label: '筛选' },
]

const sortOptions = [
  { label: '评分优先', value: 'score' },
  { label: '星级优先', value: 'star' },
  { label: '低价优先', value: 'price_asc' },
  { label: '高价优先', value: 'price_desc' },
]

const locationGroups = {
  直线距离: ['天安门广场', '王府井', '景点3', '景点4', '景点5', '景点6', '景点7'],
  景点: ['故宫博物院', '王府井', '南锣鼓巷', '天坛公园', '颐和园'],
  地铁线: ['1号线', '2号线', '4号线', '10号线', '14号线'],
  演出场馆: ['国家大剧院', '保利剧院', '梅兰芳大剧院', '北京展览馆剧场'],
}

const pricePresetOptions = ['¥100以下', '¥100-150', '¥150-200', '¥200-250', '¥250-300', '¥300-500', '¥500-750', '¥750以上']
const starOptions = ['2星及以下', '3星', '4星', '5星']

const filterLeftTabs = ['热门筛选', '住宿类型', '品牌', '床型餐食', '点评', '设施服务']

const filterRightSections = [
  {
    section: '品牌',
    type: 'single',
    options: ['全季', '汉庭', '如家', '亚朵', '维也纳', '锦江之星'],
  },
  {
    section: '床型',
    type: 'single',
    options: ['大床', '双床', '家庭房'],
  },
  {
    section: '餐食',
    type: 'multi',
    options: ['含早餐', '含晚餐', '自助餐'],
  },
  {
    section: '点评',
    type: 'single',
    options: ['4.7分以上', '4.5分以上', '4.0分以上'],
  },
  {
    section: '设施服务',
    type: 'multi',
    options: ['可带宠物', '机场接送', '家庭友好', '禁止吸烟', '游泳池', '吸烟区'],
  },
]

const filterSectionsByTab = {
  热门筛选: filterRightSections,
  住宿类型: [
    {
      section: '住宿类型',
      type: 'multi',
      options: ['酒店', '民宿', '公寓', '青年旅舍', '度假村', '客栈'],
    },
  ],
  品牌: filterRightSections,
  床型餐食: filterRightSections.filter(item => item.section === '床型' || item.section === '餐食'),
  点评: filterRightSections.filter(item => item.section === '点评'),
  设施服务: filterRightSections.filter(item => item.section === '设施服务'),
}

export default function HotelFilter() {
  const [activeFilter, setActiveFilter] = useState(null)
  const [popupTopOffset, setPopupTopOffset] = useState(98)
  const [filterValues, setFilterValues] = useState({
    sort: 'score',
    location: { group: '直线距离', option: '天安门广场' },
    price: {
      priceRange: [100, 200],
      pricePreset: '¥100-150',
      star: null,
    },
    filter: {
      leftTab: '品牌',
      selected: {},
    },
  })

  const [locationDraft, setLocationDraft] = useState(filterValues.location)
  const [priceDraft, setPriceDraft] = useState(filterValues.price)
  const [filterDraft, setFilterDraft] = useState(filterValues.filter)

  useEffect(() => {
    const headerCard = document.querySelector('.hotel-list-header-card')

    const updateOffset = () => {
      if (!headerCard) return
      const next = Math.max(0, Math.round(headerCard.getBoundingClientRect().bottom))
      setPopupTopOffset(prev => (prev === next ? prev : next))
    }

    updateOffset()

    let resizeObserver = null
    if (headerCard && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(updateOffset)
      resizeObserver.observe(headerCard)
    }

    window.addEventListener('resize', updateOffset)
    window.addEventListener('scroll', updateOffset, { passive: true })

    return () => {
      window.removeEventListener('resize', updateOffset)
      window.removeEventListener('scroll', updateOffset)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [])

  const handleFilterClick = (key) => {
    if (activeFilter === key) {
      setActiveFilter(null)
      return
    }

    if (key === 'location') {
      setLocationDraft(filterValues.location)
    }
    if (key === 'price') {
      setPriceDraft(filterValues.price)
    }
    if (key === 'filter') {
      setFilterDraft(filterValues.filter)
    }

    setActiveFilter(key)
  }

  const handleSortSelect = (value) => {
    setFilterValues(prev => ({ ...prev, sort: value }))
    console.log('酒店筛选-排序', { sort: value })
    setActiveFilter(null)
  }

  const handleLocationClear = () => {
    setLocationDraft({ group: '直线距离', option: null })
  }

  const handleLocationConfirm = () => {
    setFilterValues(prev => ({ ...prev, location: locationDraft }))
    console.log('酒店筛选-位置距离', locationDraft)
    setActiveFilter(null)
  }

  const handlePricePresetClick = (preset) => {
    let nextRange = [...priceDraft.priceRange]

    if (preset === '¥750以上') {
      nextRange = [750, 750]
    } else {
      const normalized = preset.replace('¥', '')
      const [min, max] = normalized.split('-').map(v => Number(v))
      if (!Number.isNaN(min) && !Number.isNaN(max)) {
        nextRange = [min, max]
      }
    }

    setPriceDraft(prev => ({
      ...prev,
      pricePreset: preset,
      priceRange: nextRange,
    }))
  }

  const handlePriceClear = () => {
    setPriceDraft({ priceRange: [0, 750], pricePreset: null, star: null })
  }

  const handlePriceConfirm = () => {
    setFilterValues(prev => ({ ...prev, price: priceDraft }))
    console.log('酒店筛选-价格星级', priceDraft)
    setActiveFilter(null)
  }

  const updateFilterDraft = (section, value, type) => {
    setFilterDraft((prev) => {
      const old = prev.selected[section] || []
      let nextSectionValues = []

      if (type === 'single') {
        nextSectionValues = old[0] === value ? [] : [value]
      } else {
        nextSectionValues = old.includes(value)
          ? old.filter(item => item !== value)
          : [...old, value]
      }

      return {
        ...prev,
        selected: {
          ...prev.selected,
          [section]: nextSectionValues,
        },
      }
    })
  }

  const handleFilterClear = () => {
    setFilterDraft({ leftTab: '品牌', selected: {} })
  }

  const handleFilterConfirm = () => {
    setFilterValues(prev => ({ ...prev, filter: filterDraft }))
    console.log('酒店筛选-筛选', filterDraft)
    setActiveFilter(null)
  }

  const selectedSortLabel = useMemo(
    () => sortOptions.find(option => option.value === filterValues.sort)?.label,
    [filterValues.sort],
  )

  const visibleFilterSections = filterSectionsByTab[filterDraft.leftTab] || filterRightSections

  return (
    <>
      <div className="hotel-filter">
        {filterItems.map(item => (
          <div
            key={item.key}
            className={`filter-item ${activeFilter === item.key ? 'active' : ''}`}
            onClick={() => handleFilterClick(item.key)}
          >
            <span>{item.label}</span>
            <span className="filter-item-arrow">{activeFilter === item.key ? '▼' : '▶'}</span>
          </div>
        ))}
      </div>

      <SortPopup
        visible={activeFilter === 'sort'}
        sortValue={filterValues.sort}
        sortOptions={sortOptions}
        selectedSortLabel={selectedSortLabel}
        onSelect={handleSortSelect}
        onClose={() => setActiveFilter(null)}
        topOffset={popupTopOffset}
      />

      <LocationPopup
        visible={activeFilter === 'location'}
        locationDraft={locationDraft}
        setLocationDraft={setLocationDraft}
        locationGroups={locationGroups}
        onClear={handleLocationClear}
        onConfirm={handleLocationConfirm}
        onClose={() => setActiveFilter(null)}
        topOffset={popupTopOffset}
      />

      <PricePopup
        visible={activeFilter === 'price'}
        priceDraft={priceDraft}
        setPriceDraft={setPriceDraft}
        pricePresetOptions={pricePresetOptions}
        starOptions={starOptions}
        onPresetClick={handlePricePresetClick}
        onClear={handlePriceClear}
        onConfirm={handlePriceConfirm}
        onClose={() => setActiveFilter(null)}
        topOffset={popupTopOffset}
      />

      <AdvancedFilterPopup
        visible={activeFilter === 'filter'}
        filterDraft={filterDraft}
        setFilterDraft={setFilterDraft}
        filterLeftTabs={filterLeftTabs}
        visibleFilterSections={visibleFilterSections}
        onSelectOption={updateFilterDraft}
        onClear={handleFilterClear}
        onConfirm={handleFilterConfirm}
        onClose={() => setActiveFilter(null)}
        topOffset={popupTopOffset}
      />
    </>
  )
}

