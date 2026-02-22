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
  直线距离: ['500米内', '1000米内', '2000米内', '5000米内'],
  热门: ['天安门广场', '王府井', '朝阳区', '北京环球度假区', '三里屯', '故宫博物院', '天坛公园', '什刹海风景区'],
  机场车站: ['北京大兴国际机场','北京首都国际机场','北京南站','北京朝阳站','北京西站','北京丰台站','北京站','清河站'],
  演出场馆: ['鸟巢', '国家会议中心', '北京工人体育场', '北京天桥艺术中心', '国家大剧院', '北京国际会议中心', '北京展览馆', '天桥剧场'],
}

const pricePresetOptions = ['¥100以下', '¥100-150', '¥150-200', '¥200-250', '¥250-300', '¥300-500', '¥500-750', '¥750以上']
const starOptions = ['2星及以下', '3星', '4星', '5星']

const filterLeftTabs = ['住宿类型', '品牌', '床型', '餐食', '点评', '设施服务']

const filterSections = [
  {
    section: '住宿类型',
    type: 'multi',
    options: ['酒店', '民宿', '酒店公寓', '青年旅馆', '钟点房'],
  },
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
    options: ['可带宠物', '禁止吸烟', '机场接送', '游泳池', '家庭友好', '吸烟区'],
  },
]

const quickLocateMap = {
  住宿类型: '住宿类型',
  品牌: '品牌',
  床型: '床型',
  餐食: '餐食',
  点评: '点评',
  设施服务: '设施服务',
}

export default function HotelFilter({ activePopup, setActivePopup, onFilterChange }) {
  const [popupTopOffset, setPopupTopOffset] = useState(98)
  const [filterValues, setFilterValues] = useState({
    sort: 'score',
    location: { group: '直线距离', option: null },
    price: {
      priceRange: [0, 750],
      pricePreset: '¥0-750',
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

  const activeFilter = ['sort', 'location', 'price', 'filter'].includes(activePopup) ? activePopup : null

  const handleFilterClick = (key) => {
    if (activeFilter === key) {
      setActivePopup(null)
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

    setActivePopup(key)
  }

  const handleSortSelect = (value) => {
    const next = { ...filterValues, sort: value }
    setFilterValues(next)
    onFilterChange?.(next)
    setActivePopup(null)
  }

  const handleLocationClear = () => {
    setLocationDraft({ group: '直线距离', option: null })
  }

  const handleLocationConfirm = () => {
    const next = { ...filterValues, location: locationDraft }
    setFilterValues(next)
    onFilterChange?.(next)
    setActivePopup(null)
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
    const next = { ...filterValues, price: priceDraft }
    setFilterValues(next)
    onFilterChange?.(next)
    setActivePopup(null)
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
    const next = { ...filterValues, filter: filterDraft }
    setFilterValues(next)
    onFilterChange?.(next)
    setActivePopup(null)
  }

  const selectedSortLabel = useMemo(
    () => sortOptions.find(option => option.value === filterValues.sort)?.label,
    [filterValues.sort],
  )

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
            <span className={`filter-item-arrow ${activeFilter === item.key ? 'active' : ''}`}>{'▶'}</span>
          </div>
        ))}
      </div>

      <SortPopup
        visible={activeFilter === 'sort'}
        sortValue={filterValues.sort}
        sortOptions={sortOptions}
        selectedSortLabel={selectedSortLabel}
        onSelect={handleSortSelect}
        onClose={() => setActivePopup(null)}
        topOffset={popupTopOffset}
      />

      <LocationPopup
        visible={activeFilter === 'location'}
        locationDraft={locationDraft}
        setLocationDraft={setLocationDraft}
        locationGroups={locationGroups}
        onClear={handleLocationClear}
        onConfirm={handleLocationConfirm}
        onClose={() => setActivePopup(null)}
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
        onClose={() => setActivePopup(null)}
        topOffset={popupTopOffset}
      />

      <AdvancedFilterPopup
        visible={activeFilter === 'filter'}
        filterDraft={filterDraft}
        setFilterDraft={setFilterDraft}
        filterLeftTabs={filterLeftTabs}
        filterSections={filterSections}
        quickLocateMap={quickLocateMap}
        onSelectOption={updateFilterDraft}
        onClear={handleFilterClear}
        onConfirm={handleFilterConfirm}
        onClose={() => setActivePopup(null)}
        topOffset={popupTopOffset}
      />
    </>
  )
}

