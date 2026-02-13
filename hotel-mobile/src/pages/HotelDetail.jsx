import React, { useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { NavBar } from 'antd-mobile'
import dayjs from 'dayjs'
import HotelBanner from '../components/hotel/HotelBanner'
import HotelBasicInfo from '../components/hotel/HotelBasicInfo'
import RoomList from '../components/hotel/RoomList'
import CalendarPopup from '../components/home/CalendarPopup'
import RoomGuestPopup from '../components/home/RoomGuestPopup'
import '../components/hotel/HotelDetail.css'
import FilterTagsSection from '../components/hotel/FilterTagsSection'
import { SearchContext } from '../App'

const HotelDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const hotel = location.state?.hotel;
    const { dateRange: sharedDateRange, setDateRange: setSharedDateRange, guest: sharedGuest, setGuest: setSharedGuest } = React.useContext(SearchContext);
    
    // Date Logic - Retrieve from mock navigation or default
    const today = dayjs();
    const tomorrow = dayjs().add(1, 'day');
    const initDateRange = location.state?.dateRange 
        ? [dayjs(location.state.dateRange[0]), dayjs(location.state.dateRange[1])]
        : (sharedDateRange || [today, tomorrow]);

    const [dateRange, setDateRange] = useState(initDateRange);
    const [showCalendar, setShowCalendar] = useState(false);

    // Guest Logic
    const initGuest = location.state?.guest || sharedGuest || { rooms: 1, adults: 1, children: 0 };
    const [rooms, setRooms] = useState(initGuest.rooms ?? 1);
    const [adults, setAdults] = useState(initGuest.adults ?? 1);
    const [children, setChildren] = useState(initGuest.children ?? 0);
    const [showGuestPopup, setShowGuestPopup] = useState(false);



    const startDate = dateRange[0];
    const endDate = dateRange[1];
    const nights = endDate.diff(startDate, 'day');

    const getWeekday = (d) => ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.day()];

    const onDateConfirm = (range) => {
        if (range && range[0] && range[1]) {
            setDateRange(range);
            setSharedDateRange(range);
        }
        setShowCalendar(false);
    };

    const onGuestConfirm = (data) => {
        setRooms(data.rooms);
        setAdults(data.adults);
        setChildren(data.children);
        setSharedGuest({ rooms: data.rooms, adults: data.adults, children: data.children });
        setShowGuestPopup(false);
    }

    // Use memo to ensure images are stable
    const images = useMemo(() => {
        if (!hotel?.image) return [];
        // Mocking multiple images for the carousel based on the single image
        return [
            hotel.image,
            hotel.image, // Duplicate for demo
            hotel.image  // Duplicate for demo
        ];
    }, [hotel]);

    if (!hotel) {
        return (
            <div className="hotel-detail-page">
                 <NavBar onBack={() => navigate(-1)} style={{ color: '#000' }}>酒店详情</NavBar>
                 <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
                     未找到酒店信息，请从列表页进入
                 </div>
            </div>
        )
    }

    const { 
        name, 
        score,
        scoreLabel,
        tags,
        details,
        rooms: hotelRooms, // rename to avoid conflict with state
        area
    } = hotel
    
    return (
        <div className="hotel-detail-page">
            <NavBar 
                onBack={() => navigate(-1)} 
                className="custom-navbar"
                style={{
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    zIndex: 10,
                    '--title-color': '#fff',
                    '--icon-color': '#fff',
                    background: 'transparent'
                }}
            >
                {/* Title hidden initially or shown? Design shows transparent header */}
            </NavBar>
            
            <HotelBanner images={images} />
            
            <HotelBasicInfo 
                name={name} 
                score={score}
                scoreLabel={scoreLabel}
                tags={tags} 
                details={details} 
                area={area}
            />

            <div className="filter-card">
                 {/* Date Selection Row */}
                 <div className="date-section-row" onClick={() => setShowCalendar(true)}>
                    <div className="date-block">
                        <span className="date-val">{startDate.format('M月D日')}</span>
                        <span className="week-val">{getWeekday(startDate)}</span>
                    </div>
                    <div className="night-count">共{nights}晚</div>
                    <div className="date-block">
                        <span className="date-val">{endDate.format('M月D日')}</span>
                        <span className="week-val">{getWeekday(endDate)}</span>
                    </div>
                    
                 </div>

                 {/* Guest Selector */}
                 <div className="guest-selector-row" onClick={() => setShowGuestPopup(true)}>
                     <div>{rooms}间房 {adults}成人 {children}儿童
                        <span style={{ fontSize: 18, color: '#000000',marginLeft: 16 }}> &gt; </span>
                     </div>
                     
                 </div>
                <FilterTagsSection/>
            </div>
           
            <RoomList hotel={hotel} />

            {/* Popups */}
            <CalendarPopup
                visible={showCalendar}
                onClose={() => setShowCalendar(false)}
                onConfirm={onDateConfirm}
                defaultDateRange={dateRange}
            />

            <RoomGuestPopup
                visible={showGuestPopup}
                onClose={() => setShowGuestPopup(false)}
                defaultValue={{ rooms, adults, children }}
                onConfirm={onGuestConfirm}
            />
        </div>
    )
}

export default HotelDetail
