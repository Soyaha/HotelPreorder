import React from 'react'
import { TabBar, NavBar, Button, Input, Card, Image, Tag } from 'antd-mobile'
import {
  AppOutline,
  UnorderedListOutline,
  UserOutline,
  SearchOutline,
  EnvironmentOutline
} from 'antd-mobile-icons'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();
  return (
    <div style={{ paddingBottom: 50 }}>
        {/* Top Banner */}
        <div style={{ height: 150, background: '#1677ff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h3>酒店7折起!</h3>
        </div>

        {/* Search Area */}
        <div style={{ padding: 15, background: '#fff', marginTop: -20, borderRadius: '15px 15px 0 0', position: 'relative' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                <span style={{ fontWeight: 'bold', color: '#1677ff' }}>国内</span>
                <span>海外</span>
                <span>钟点房</span>
                <span>民宿</span>
             </div>

             <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: 10, marginBottom: 15 }}>
                 <div style={{ fontWeight: 'bold', fontSize: 18, marginRight: 10 }}>上海</div>
                 <div style={{ color: '#999', flex: 1 }}>位置/品牌/酒店</div>
                 <EnvironmentOutline color='#1677ff' />
             </div>

             <div style={{ marginBottom: 15 }}>
                 <div style={{ display: 'flex', gap: 10 }}>
                     <div>
                        <div style={{ fontSize: 12, color: '#999' }}>入住</div>
                        <div style={{ fontWeight: 'bold' }}>01-09 <span style={{fontSize: 12, fontWeight: 'normal'}}>今天</span></div>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center' }}>-</div>
                     <div>
                        <div style={{ fontSize: 12, color: '#999' }}>离店</div>
                        <div style={{ fontWeight: 'bold' }}>01-10 <span style={{fontSize: 12, fontWeight: 'normal'}}>明天</span></div>
                     </div>
                     <div style={{ marginLeft: 'auto', alignSelf: 'center' }}>共1晚</div>
                 </div>
             </div>

             <Button block color='primary' size='large' onClick={() => navigate('/list')}>
                查询
             </Button>
        </div>
    </div>
  )
}

const HotelList = () => {
    const navigate = useNavigate();
    return (
        <div style={{ padding: 10, paddingBottom: 60 }}>
            <NavBar onBack={() => navigate(-1)}>酒店列表</NavBar>
            {/* Filter Bar Mock */}
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0', background: '#fff' }}>
                <span>欢迎度排序</span>
                <span>位置距离</span>
                <span>价格/星级</span>
                <span>筛选</span>
            </div>

            {/* Hotel Item */}
            <Card onClick={() => navigate('/detail/1')}>
                 <div style={{ display: 'flex', gap: 10 }}>
                     <Image src='' width={100} height={120} style={{ borderRadius: 4, background: '#eee' }} />
                     <div style={{ flex: 1 }}>
                         <div style={{ fontWeight: 'bold', fontSize: 16 }}>上海陆家嘴禧玥酒店</div>
                         <div style={{ marginTop: 5 }}>
                            <Tag color='primary'>4.8 超棒</Tag>
                            <span style={{ fontSize: 12, color: '#999', marginLeft: 5 }}>4695 点评</span>
                         </div>
                         <div style={{ margin: '5px 0', fontSize: 12, color: '#666' }}>近外滩·东方明珠</div>
                         <div style={{ marginTop: 10, color: '#ff4d4f', fontSize: 18, fontWeight: 'bold' }}>
                            ¥936 <span style={{ fontSize: 12, color: '#999', fontWeight: 'normal' }}>起</span>
                         </div>
                     </div>
                 </div>
            </Card>
            <div style={{ height: 10 }}></div>
            <Card onClick={() => navigate('/detail/2')}>
                 <div style={{ display: 'flex', gap: 10 }}>
                     <Image src='' width={100} height={120} style={{ borderRadius: 4, background: '#eee' }} />
                     <div style={{ flex: 1 }}>
                         <div style={{ fontWeight: 'bold', fontSize: 16 }}>艺龙安悦酒店</div>
                         <div style={{ marginTop: 5 }}>
                            <Tag color='primary'>4.7 超棒</Tag>
                             <span style={{ fontSize: 12, color: '#999', marginLeft: 5 }}>6729 点评</span>
                         </div>
                          <div style={{ margin: '5px 0', fontSize: 12, color: '#666' }}>近歌浦路地铁站</div>
                         <div style={{ marginTop: 10, color: '#ff4d4f', fontSize: 18, fontWeight: 'bold' }}>
                            ¥199 <span style={{ fontSize: 12, color: '#999', fontWeight: 'normal' }}>起</span>
                         </div>
                     </div>
                 </div>
            </Card>
        </div>
    )
}

const HotelDetail = () => {
    const navigate = useNavigate();
    return (
        <div style={{ paddingBottom: 50 }}>
            <NavBar onBack={() => navigate(-1)}>酒店详情</NavBar>
            <div style={{ height: 200, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Big Banner Image
            </div>
            <div style={{ padding: 15, background: '#fff' }}>
                <h2>上海陆家嘴禧玥酒店</h2>
                <div>
                     <Tag color='gold'>上海美景酒店榜 No.16</Tag>
                </div>
                <div style={{ display: 'flex', margin: '15px 0', justifyContent: 'space-between', textAlign: 'center' }}>
                    <div>
                        <div style={{ fontSize: 20 }}>2020</div>
                        <div style={{ fontSize: 12, color: '#999' }}>装修</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 20 }}>中式</div>
                        <div style={{ fontSize: 12, color: '#999' }}>风格</div>
                    </div>
                     <div>
                        <div style={{ fontSize: 20 }}>免费</div>
                        <div style={{ fontSize: 12, color: '#999' }}>停车</div>
                    </div>
                     <div>
                        <div style={{ fontSize: 20 }}>江景</div>
                        <div style={{ fontSize: 12, color: '#999' }}>视野</div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 10, background: '#fff', padding: 15 }}>
                <h3>房型列表</h3>
                <div style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>经典双床房</div>
                            <div style={{ fontSize: 12, color: '#999' }}>2张1.2米单人床 | 40m²</div>
                        </div>
                        <div style={{ color: '#ff4d4f', fontWeight: 'bold' }}>¥936</div>
                    </div>
                     <Button size='small' color='primary' style={{ float: 'right', marginTop: 5 }}>预订</Button>
                     <div style={{ clear: 'both' }}></div>
                </div>
            </div>
        </div>
    )
}

const Me = () => <div style={{padding: 20}}><h2>我的账户</h2></div>

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
  return (
    <Router>
        <Layout />
    </Router>
  )
}
