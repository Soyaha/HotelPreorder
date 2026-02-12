import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LeftOutline, SearchOutline, CloseCircleFill } from 'antd-mobile-icons'
import dayjs from 'dayjs'
import HotelDatePopup from './HotelDatePopup'
import './HotelList.css'

const HotelSearchHeader = ({
    searchText,
    onSearchChange,
    onSearchClear,
    initialDateRange,
    onDateChange,
    activePopup,
    setActivePopup,
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
                    <span className="city-text">北京市</span>
                </div>

                {/* Date */}
                <div 
                    onClick={() => setActivePopup(prev => (prev === 'date' ? null : 'date'))}
                    className="date-display"
                >
                    <span className="date-text">
                        {startDate.format('MM-DD')}
                    </span>
                    <span className="date-text">
                        {endDate.format('MM-DD')}
                    </span>
                </div>

                {/* Search Interaction */}
                <div className="search-area">
                    <input 
                        className="search-input"
                        placeholder="位置/品牌/酒店"
                        value={searchText}
                        onChange={onSearchChange}
                    />
                    <div className="search-icon-container">
                        {searchText ? (
                             <CloseCircleFill 
                                fontSize={16} 
                                color="#ccc" 
                                onClick={onSearchClear}
                             />
                        ) : (
                             <SearchOutline fontSize={22} color="#333" />
                        )}
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
        </>
    )
}

export default HotelSearchHeader