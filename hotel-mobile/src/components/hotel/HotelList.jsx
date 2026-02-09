import React, { useState } from 'react'
import HotelCard from "./HotelCard";
import HotelSearchHeader from "./HotelSearchHeader";
import HotelFilter from "./HotelFilter";
import { useNavigate } from "react-router-dom";

const HotelList = () => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');

    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh', paddingBottom: 60 }}>
            {/* Custom Header */}
            <div style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff' }}>
                 <HotelSearchHeader 
                    searchText={searchText}
                    onSearchChange={(e) => setSearchText(e.target.value)}
                    onSearchClear={() => setSearchText('')}
                 />

                <HotelFilter />
            </div>
            
            <div style={{ padding: 10 }}>
                {hotelData.map(hotel => (
                     <HotelCard 
                        key={hotel.id} 
                        hotel={hotel} 
                        onClick={() => navigate(`/detail/${hotel.id}`, { state: { hotel } })} 
                     />
                ))}
            </div>
        </div>
    )
}
export default HotelList
//测试用假数据
const hotelData = [
    {
        id: 1,
        name: '上海陆家嘴禧玥酒店',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80', 
        score: '4.8',
        scoreLabel: '超棒',
        reviews: '4695',
        distance: '距陆家嘴地铁站直线50米',
        area: '陆家嘴',
        price: '936',
        promotionTag: '提供早餐',
        tags: ['上海美景酒店榜 No.16'],
        details: [
            { label: '装修', value: '2020' },
            { label: '风格', value: '中式' },
            { label: '停车', value: '免费' },
            { label: '视野', value: '江景' },
        ],
        rooms: [
            { id: 101, name: '经典双床房', description: '2张1.2米单人床 | 40m²', price: 936 },
            { id: 102, name: '豪华大床房', description: '1张2米大床 | 50m²', price: 1200 },
        ]
    },
    {
        id: 2,
        name: '艺龙安悦酒店',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1625&q=80',
        score: '4.7',
        scoreLabel: '超棒',
        reviews: '6729',
        distance: '近歌浦路地铁站',
        area: '浦东新区',
        price: '199',
        promotionTag: '天天特价减36',
        tags: ['性价比之选'],
        details: [
            { label: '装修', value: '2019' },
            { label: '风格', value: '现代' },
            { label: '早餐', value: '包含' },
            { label: '交通', value: '便利' },
        ],
        rooms: [
            { id: 201, name: '标准单人间', description: '1张1.5米床 | 30m²', price: 199 },
            { id: 202, name: '商务双床房', description: '2张1.2米床 | 45m²', price: 280 },
        ]
    },
    {
        id: 3,
        name: '桔子酒店',
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        score: '4.7',
        scoreLabel: '超棒',
        reviews: '6729',
        distance: '近歌浦路地铁站',
        area: '浦东新区',
        price: '199',
        promotionTag: '天天特价减36',
        tags: ['连锁品牌'],
        details: [
            { label: '装修', value: '2018' },
            { label: '风格', value: '橙色' },
            { label: '服务', value: '优质' },
            { label: '位置', value: '核心' },
        ],
        rooms: [
            { id: 301, name: '高级大床房', description: '1张1.8米床 | 25m²', price: 260 },
            { id: 302, name: '家庭房', description: '1张大床+1张小床 | 35m²', price: 350 },
        ]
    }
]
