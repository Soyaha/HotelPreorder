const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Easy Stay Hotel Reservation API is running');
});

// Mock Users
const users = [
    { username: 'admin', password: '123', role: 'admin', name: '系统管理员' },
    { username: 'merchant', password: '123', role: 'merchant', name: '希尔顿酒店集团' },
    { username: 'merchant2', password: '123', role: 'merchant', name: '如家酒店连锁' }
];

// Mock Data for Hotels
// Status: pending (审核中), approved (已发布), rejected (不通过), offline (已下线)
let hotels = [
    { 
        id: 1, 
        name: "上海陆家嘴禧玥酒店", 
        address: "近外滩·东方明珠", 
        price: 936, 
        score: 4.8, 
        star: 5,
        status: 'approved',
        description: "BOSS:25楼是沪上知名米其林新荣记",
        facilities: ['免费停车', '健身房', 'WIFI'],
        owner: 'merchant'
    },
    { 
        id: 2, 
        name: "艺龙安悦酒店", 
        address: "近歇浦路地铁站", 
        price: 199, 
        score: 4.7, 
        star: 4,
        status: 'pending',
        description: "近歌浦路地铁站·LCM置汇旭辉广场",
        facilities: ['免费洗衣', '机器人服务'],
        owner: 'merchant2'
    }
];

// 1. User Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ success: true, user: { username: user.username, role: user.role, name: user.name } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// 2. Register (Mock)
app.post('/api/register', (req, res) => {
    const { username, password, role } = req.body;
    if(users.find(u => u.username === username)) {
         return res.json({ success: false, message: 'User already exists' });
    }
    users.push({ username, password, role: role || 'merchant', name: username });
    res.json({ success: true, message: 'Register success' });
});

// 3. Get Hotels (Filter by owner or return all for admin)
app.get('/api/hotels', (req, res) => {
    const { role, username } = req.query; // Simple auth simulation
    if (role === 'admin') {
        res.json(hotels);
    } else if (role === 'merchant') {
        res.json(hotels.filter(h => h.owner === username));
    } else {
        // Public / Mobile : Only approved
        res.json(hotels.filter(h => h.status === 'approved'));
    }
});

// 4. Create/Update Hotel (Merchant)
app.post('/api/hotels', (req, res) => {
    const hotelData = req.body;
    if (hotelData.id) {
        // Update
        const index = hotels.findIndex(h => h.id === hotelData.id);
        if (index !== -1) {
            hotels[index] = { ...hotels[index], ...hotelData, status: 'pending' }; // Edit triggers re-audit
            res.json({ success: true, hotel: hotels[index] });
        } else {
            res.status(404).json({ success: false });
        }
    } else {
        // Create
        const newHotel = { 
            id: Date.now(), 
            ...hotelData, 
            status: 'pending', 
            score: 0, 
            price: hotelData.price || 0 
        };
        hotels.push(newHotel);
        res.json({ success: true, hotel: newHotel });
    }
});

// 5. Admin Audit/Status Change
app.post('/api/hotels/status', (req, res) => {
    const { id, status, reason } = req.body;
    const index = hotels.findIndex(h => h.id === Number(id));
    if (index !== -1) {
        hotels[index].status = status;
        if (reason) hotels[index].rejectReason = reason;
        res.json({ success: true, hotel: hotels[index] });
    } else {
        res.status(404).json({ success: false });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
