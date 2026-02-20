import React, { useEffect, useMemo, useState } from 'react'
import HotelCard from "../components/hotel/HotelCard";
import HotelSearchHeader from "../components/hotel/HotelSearchHeader";
import HotelFilter from "../components/hotel/HotelFilter";
import { useNavigate } from "react-router-dom";
import { SearchContext } from '../App'
import { Toast } from 'antd-mobile'
import '../components/hotel/HotelList.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

const HotelList = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [activePopup, setActivePopup] = useState(null);
    const [hotelData, setHotelData] = useState([])
    const [loading, setLoading] = useState(true)
    const [fetchError, setFetchError] = useState('')
    const { dateRange, setDateRange, guest, location } = React.useContext(SearchContext);

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

        return hotelData.filter((hotel) => {
            const text = `${hotel.name || ''} ${hotel.address || ''} ${hotel.area || ''}`.toLowerCase()
            const matchKeyword = !keyword || text.includes(keyword)
            const matchLocation = !locationText || text.includes(locationText) || text.includes((location?.district || '').toLowerCase()) || text.includes((location?.city || '').toLowerCase())
            return matchKeyword && matchLocation
        })
    }, [hotelData, searchText, location])

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
                     />

                    <HotelFilter
                        activePopup={activePopup}
                        setActivePopup={setActivePopup}
                    />
                </div>
            </div>
            
            <div className="hotel-list-content">
                {loading && <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>酒店加载中...</div>}
                {!loading && fetchError && <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>{fetchError}</div>}
                {!loading && !fetchError && filteredHotels.length === 0 && (
                    <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>暂无符合条件的酒店</div>
                )}
                {!loading && !fetchError && filteredHotels.map(hotel => (
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
            </div>
        </div>
    )
}
export default HotelList
