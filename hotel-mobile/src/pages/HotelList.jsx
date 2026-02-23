import React, { useEffect, useMemo, useState } from 'react'
import HotelCard from "../components/hotel/HotelCard";
import HotelSearchHeader from "../components/hotel/HotelSearchHeader";
import HotelFilter from "../components/hotel/HotelFilter";
import { useNavigate } from "react-router-dom";
import { SearchContext } from '../App'
import { InfiniteScroll, Toast } from 'antd-mobile'
import '../components/hotel/HotelList.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const PAGE_SIZE = 4

const HotelList = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [activePopup, setActivePopup] = useState(null);
    const [hotelData, setHotelData] = useState([])
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
    const [loading, setLoading] = useState(true)
    const [fetchError, setFetchError] = useState('')
    const [activeFilters, setActiveFilters] = useState({
        sort: 'score',
        location: { group: '直线距离', option: null },
        price: { priceRange: [0, 750], pricePreset: null, star: null },
        filter: { leftTab: '品牌', selected: {} },
    })
    const { dateRange, setDateRange, guest, setGuest, location, homeQuickTags } = React.useContext(SearchContext);

    useEffect(() => {
        const fetchHotels = async () => {
            setLoading(true)
            setFetchError('')
            try {
                const response = await fetch(`${API_BASE_URL}/api/hotels/public`)
                const data = await response.json()
                if (!response.ok || !data?.success) {
                    throw new Error(data?.message || '获取酒店列表失败')
                }
                setHotelData(Array.isArray(data.hotels) ? data.hotels : [])
            } catch (error) {
                setFetchError(error.message || '网络异常，请稍后再试')
                Toast.show({ icon: 'fail', content: '酒店列表加载失败' })
            } finally {
                setLoading(false)
            }
        }

        fetchHotels()
    }, [])

    const filteredHotels = useMemo(() => {
        const keyword = searchText.trim().toLowerCase()
        const locationText = `${location?.province || ''} ${location?.city || ''} ${location?.district || ''}`.toLowerCase().trim()
        const list = hotelData.filter((hotel) => {
            const text = `${hotel.name || ''} ${hotel.address || ''} ${hotel.area || ''}`.toLowerCase()
            const matchKeyword = !keyword || text.includes(keyword)
            const matchLocation = !locationText || text.includes(locationText) || text.includes((location?.district || '').toLowerCase()) || text.includes((location?.city || '').toLowerCase())
            if (!matchKeyword || !matchLocation) return false

            const selectedLocationOptionRaw = activeFilters.location?.option || ''
            const selectedLocationOption = selectedLocationOptionRaw.toLowerCase?.() || ''
            if (selectedLocationOption) {
                const distanceMatch = String(selectedLocationOptionRaw).match(/(\d+)\s*米内/)
                if (distanceMatch) {
                    const limitMeters = Number(distanceMatch[1])
                    const distanceMeters = Number(hotel.distanceMeters)
                    if (Number.isFinite(distanceMeters)) {
                        if (distanceMeters > limitMeters) {
                            return false
                        }
                    }
                } else if (!text.includes(selectedLocationOption)) {
                    return false
                }
            }

            const [minPrice, maxPrice] = activeFilters.price?.priceRange || [0, 999999]
            const hotelPrice = Number(hotel.price || 0)
            if (hotelPrice < minPrice || hotelPrice > maxPrice) {
                return false
            }

            const starFilter = activeFilters.price?.star
            const starMap = { '2星及以下': 2, '3星': 3, '4星': 4, '5星': 5 }
            if (starFilter && Number(hotel.star || 0) !== starMap[starFilter]) {
                return false
            }

            const selected = activeFilters.filter?.selected || {}

            const ratingRule = (selected['点评'] || [])[0]
            if (ratingRule) {
                const threshold = Number(String(ratingRule).replace('分以上', ''))
                if (!Number.isNaN(threshold) && Number(hotel.score || 0) < threshold) {
                    return false
                }
            }

            const brandRule = (selected['品牌'] || [])[0]
            if (brandRule && !(hotel.name || '').includes(brandRule)) {
                return false
            }

            const facilityRules = selected['设施服务'] || []
            if (facilityRules.length > 0) {
                const facilitiesText = `${(hotel.facilities || []).join(' ')} ${(hotel.description || '')}`
                const passFacility = facilityRules.some((rule) => facilitiesText.includes(rule))
                if (!passFacility) {
                    return false
                }
            }

            const bedRule = (selected['床型'] || [])[0]
            if (bedRule) {
                const roomText = (hotel.rooms || []).map((room) => `${room.name || ''} ${room.description || ''}`).join(' ')
                if (!roomText.includes(bedRule)) {
                    return false
                }
            }

            if (Array.isArray(homeQuickTags) && homeQuickTags.length > 0) {
                const textAll = `${hotel.name || ''} ${hotel.description || ''} ${(hotel.facilities || []).join(' ')}`.toLowerCase()
                const roomTextAll = (hotel.rooms || []).map((room) => `${room.name || ''} ${room.description || ''}`).join(' ').toLowerCase()

                const passQuickTags = homeQuickTags.every((tag) => {
                    if (tag === 'pet_friendly') return textAll.includes('宠物')
                    if (tag === 'free_parking') return textAll.includes('免费停车') || textAll.includes('停车场')
                    if (tag === 'family') return textAll.includes('亲子') || roomTextAll.includes('家庭')
                    if (tag === 'luxury') return Number(hotel.star || 0) >= 5 || textAll.includes('豪华')
                    if (tag === 'king_bed') return roomTextAll.includes('大床') || roomTextAll.includes('king')
                    if (tag === 'score_45') return Number(hotel.score || 0) >= 4.5
                    return true
                })

                if (!passQuickTags) {
                    return false
                }
            }

            return true
        })

        const sorted = [...list]
        const sorter = activeFilters.sort
        if (sorter === 'score') {
            sorted.sort((a, b) => Number(b.score || 0) - Number(a.score || 0))
        } else if (sorter === 'star') {
            sorted.sort((a, b) => Number(b.star || 0) - Number(a.star || 0))
        } else if (sorter === 'price_asc') {
            sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
        } else if (sorter === 'price_desc') {
            sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
        }

        return sorted
    }, [hotelData, searchText, location, activeFilters, homeQuickTags])

    useEffect(() => {
        setVisibleCount(PAGE_SIZE)
    }, [searchText, activeFilters, location, homeQuickTags, hotelData])

    const visibleHotels = useMemo(() => {
        return filteredHotels.slice(0, visibleCount)
    }, [filteredHotels, visibleCount])

    const hasMore = visibleCount < filteredHotels.length

    const loadMore = async () => {
        setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filteredHotels.length))
    }

    return (
        <div className="hotel-list-page">
            {/* Custom Header Floating Card */}
            <div className="hotel-list-header-container">
                <div className="hotel-list-header-card">
                            <HotelSearchHeader 
                        searchText={searchText}
                        onSearchChange={(e) => setSearchText(e.target.value)}
                        onSearchClear={() => setSearchText('')}
                        initialDateRange={dateRange}
                        onDateChange={setDateRange}
                        activePopup={activePopup}
                        setActivePopup={setActivePopup}
                                cityText={location?.district || location?.city || location?.province || '北京市'}
                                guest={guest}
                                onGuestChange={setGuest}
                     />

                    <HotelFilter
                        activePopup={activePopup}
                        setActivePopup={setActivePopup}
                        onFilterChange={setActiveFilters}
                    />
                </div>
            </div>
            
            <div className="hotel-list-content">
                {loading && <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>酒店加载中...</div>}
                {!loading && fetchError && <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>{fetchError}</div>}
                {!loading && !fetchError && filteredHotels.length === 0 && (
                    <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>暂无符合条件的酒店</div>
                )}
                     {!loading && !fetchError && visibleHotels.map(hotel => (
                     <HotelCard 
                        key={hotel.id} 
                        hotel={hotel} 
                        onClick={() => navigate(`/detail/${hotel.id}`, { 
                            state: { 
                                hotel, 
                                dateRange: dateRange.map(d => d.toISOString()),
                                guest
                            } 
                        })} 
                     />
                ))}
                {!loading && !fetchError && filteredHotels.length > 0 && (
                    <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
                        {hasMore ? '正在加载更多酒店...' : '没有更多酒店了'}
                    </InfiniteScroll>
                )}
            </div>
        </div>
    )
}
export default HotelList
