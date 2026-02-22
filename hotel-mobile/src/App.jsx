import React, { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { TabBar, NavBar, Button, Input, Card, Image, Tag } from 'antd-mobile'
import {
    AppOutline,
    UnorderedListOutline,
    UserOutline,
    SearchOutline,
    EnvironmentOutline
} from 'antd-mobile-icons'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import TopBanner from './components/home/TopBanner'
import PageHeader from './components/home/PageHeader'
import LocationSection from './components/home/LocationSection'
import DateSection from './components/home/DateSection'
import RoomSection from './components/home/RoomSection'
import FilterTagsSection from './components/home/FilterTagsSection'
import SearchButton from './components/home/SearchButton'
import HotelList from './pages/HotelList'
import HotelDetail from './pages/HotelDetail'
import HotelMap from './components/hotel/HotelMap'

export const SearchContext = React.createContext(null)

const Home = () => {
    const navigate = useNavigate();
    const {
        dateRange,
        setDateRange,
        guest,
        setGuest,
        location,
        setLocation,
        homeQuickTags,
        setHomeQuickTags,
    } = React.useContext(SearchContext);

    return (
        <div style={{ paddingBottom: 50, position: 'relative', background: '#EBEEF5', minHeight: '100vh', overflow: 'hidden' }}>
            <TopBanner />

            {/* Search Area Container */}
            <div style={{
                position: 'absolute',
                width: 'calc(100% - 40px)', // Adjusted for padding
                left: 20,
                top: 221,
                filter: 'drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.25))',
                zIndex: 10
            }}>
                <PageHeader />

                {/* White Background Card */}
                <div style={{
                    background: '#FFFFFF',
                    borderRadius: 10,
                    marginTop: 6, // Offset to create the tab effect with PageHeader
                    paddingTop: 60, // Space for PageHeader title
                    paddingBottom: 20,
                    position: 'relative',

                }}>
                    <LocationSection selectedLocation={location} onChange={setLocation} />
                    <DateSection dateRange={dateRange} setDateRange={setDateRange} />
                    <RoomSection
                        rooms={guest.rooms}
                        adults={guest.adults}
                        children={guest.children}
                        onGuestChange={setGuest}
                    />
                    <FilterTagsSection value={homeQuickTags} onChange={setHomeQuickTags} />
                    <div onClick={() => {
                        navigate('/list')
                    }}>
                        <SearchButton 
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        guest={guest}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}



const Me = () => <div style={{ padding: 20 }}>
    <h2>我的账户</h2>
    <p style={{fontSize: 15}}>页面建设中....</p>
</div>

function Layout() {
    const navigate = useNavigate()
    const location = useLocation()
    const { pathname } = location

    // Only show TabBar on main pages
    const showTabBar = ['/', '/list', '/me'].includes(pathname);

    const tabs = [
        {
            key: '/',
            title: '首页',
            icon: <AppOutline />,
        },
        {
            key: '/list',
            title: '酒店',
            icon: <UnorderedListOutline />,
        },
        {
            key: '/me',
            title: '我的',
            icon: <UserOutline />,
        },
    ]

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f5f5' }}>
            <div style={{ flex: 1, overflow: 'auto' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/list" element={<HotelList />} />
                    <Route path="/detail/:id" element={<HotelDetail />} />
                    <Route path="/map" element={<HotelMap />} />
                    <Route path="/me" element={<Me />} />
                </Routes>
            </div>
            {showTabBar && (
                <TabBar activeKey={pathname} onChange={value => navigate(value)} style={{ background: '#fff', borderTop: '1px solid #eee' }}>
                    {tabs.map(item => (
                        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
                    ))}
                </TabBar>
            )}
        </div>
    )
}

export default function App() {
    const [dateRange, setDateRange] = useState([dayjs(), dayjs().add(1, 'day')]);
    const [guest, setGuest] = useState({ rooms: 1, adults: 1, children: 0 });
    const [homeQuickTags, setHomeQuickTags] = useState([]);
    const [location, setLocation] = useState({
        province: '北京市',
        city: '市辖区',
        district: '朝阳区',
        valuePath: ['北京市', '市辖区', '朝阳区'],
    });

    const searchContextValue = useMemo(() => ({
        dateRange,
        setDateRange,
        guest,
        setGuest,
        homeQuickTags,
        setHomeQuickTags,
        location,
        setLocation,
    }), [dateRange, guest, homeQuickTags, location]);

    return (
        <Router>
            <SearchContext.Provider value={searchContextValue}>
                <Layout />
            </SearchContext.Provider>
        </Router>
    )
}
