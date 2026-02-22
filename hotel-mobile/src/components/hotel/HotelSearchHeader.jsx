import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LeftOutline, SearchOutline, CloseCircleFill, EnvironmentOutline, MoreOutline } from 'antd-mobile-icons'
import dayjs from 'dayjs'
import HotelDatePopup from './HotelDatePopup'
import RoomGuestPopup from '../home/RoomGuestPopup'
import './HotelList.css'

const HotelSearchHeader = ({
    searchText,
    onSearchChange,
    onSearchClear,
    initialDateRange,
    onDateChange,
    activePopup,
    setActivePopup,
    cityText,
    guest,
    onGuestChange,
}) => {
    const navigate = useNavigate();

    // Date Logic
    const today = dayjs();
    const tomorrow = dayjs().add(1, 'day');
    
    // Parse initialDateRange 
    const initRange = initialDateRange 
        ? [dayjs(initialDateRange[0]), dayjs(initialDateRange[1])]
        : [today, tomorrow];

    const [popupTopOffset, setPopupTopOffset] = useState(98);
    const headerRef = useRef(null);
    
    // Use prop controlled date if onDateChange is present, otherwise local
    const [localDateRange, setLocalDateRange] = useState(initRange);
    
    const dateRange = (onDateChange && initialDateRange) 
        ? [dayjs(initialDateRange[0]), dayjs(initialDateRange[1])] 
        : localDateRange;
        
    const onDateConfirm = (range) => {
        if (range && range[0] && range[1]) {
            if (onDateChange) {
                onDateChange([range[0], range[1]]);
            } else {
                setLocalDateRange(range);
            }
        }
        setActivePopup(null);
    }
    
    const startDate = dateRange[0];
    const endDate = dateRange[1];
    const nights = Math.max(1, endDate.diff(startDate, 'day'));

    const onGuestConfirm = (nextGuest) => {
        onGuestChange?.(nextGuest)
        setActivePopup(null)
    }

    useEffect(() => {
        const updateOffset = () => {
            if (!headerRef.current) return;
            const next = Math.max(0, Math.round(headerRef.current.getBoundingClientRect().bottom));
            setPopupTopOffset(prev => (prev === next ? prev : next));
        };

        updateOffset();

        let resizeObserver = null;
        if (headerRef.current && 'ResizeObserver' in window) {
            resizeObserver = new ResizeObserver(updateOffset);
            resizeObserver.observe(headerRef.current);
        }

        window.addEventListener('resize', updateOffset);
        window.addEventListener('scroll', updateOffset, { passive: true });

        return () => {
            window.removeEventListener('resize', updateOffset);
            window.removeEventListener('scroll', updateOffset);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, []);

    return (
        <>
            <div className="hotel-search-header" ref={headerRef}>
                {/* Back Button */}
                <div 
                    onClick={() => navigate(-1)}
                    className="back-btn"
                >
                    <LeftOutline fontSize={24} color="#000" />
                </div>

                {/* City */}
                <div className="city-display">
                    <span className="city-text">{cityText || '上海市'}</span>
                </div>

                {/* Date & Guest */}
                <div className="date-guest-display">
                    <div 
                        className="date-guest-row"
                        onClick={() => setActivePopup(prev => (prev === 'date' ? null : 'date'))}
                    >
                        <span className="date-text">{startDate.format('MM-DD')}</span>
                        <span className="guest-text">{(guest?.rooms || 1)}间</span>
                    </div>
                    <div 
                        className="date-guest-row"
                        onClick={() => setActivePopup(prev => (prev === 'guest' ? null : 'guest'))}
                    >
                        <span className="date-text">{endDate.format('MM-DD')}</span>
                        <span className="guest-text">{(guest?.adults || 1)}人</span>
                    </div>
                </div>

                {/* Search Interaction */}
                <div className="search-area">
                    <SearchOutline fontSize={16} color="#999" className="search-icon-left" />
                    <input 
                        className="search-input"
                        placeholder="位置/品牌/酒店"
                        value={searchText}
                        onChange={onSearchChange}
                    />
                    {searchText && (
                        <div className="search-icon-container">
                            <CloseCircleFill 
                                fontSize={16} 
                                color="#ccc" 
                                onClick={onSearchClear}
                            />
                        </div>
                    )}
                </div>

                {/* Right Icons */}
                <div className="header-right-icons">
                    <div className="icon-item">
                        <EnvironmentOutline fontSize={20} color="#333" />
                        <span className="icon-text">地图</span>
                    </div>
                    <div className="icon-item">
                        <MoreOutline fontSize={20} color="#333" />
                        <span className="icon-text">更多</span>
                    </div>
                </div>
            </div>

            <HotelDatePopup
                visible={activePopup === 'date'}
                onClose={() => setActivePopup(null)}
                onConfirm={onDateConfirm}
                defaultDateRange={dateRange}
                topOffset={popupTopOffset}
            />

            <RoomGuestPopup
                visible={activePopup === 'guest'}
                onClose={() => setActivePopup(null)}
                onConfirm={onGuestConfirm}
                defaultValue={guest || { rooms: 1, adults: 1, children: 0 }}
            />
        </>
    )
}

export default HotelSearchHeader