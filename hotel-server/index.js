const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'data', 'db.json');
const DEFAULT_HOTEL_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1740&q=80';
const DEFAULT_HOTEL_DETAILS = [
    { label: '装修', value: '2024' },
    { label: '风格', value: '现代' },
    { label: '服务', value: '优质' },
];

const NONCE_MAX = 100000;
const REQUEST_EXPIRE_MS = 5 * 60 * 1000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

const ensureDir = (targetPath) => {
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
};

const defaultState = () => ({
    users: [
        {
            username: 'admin',
            password: '123',
            role: 'admin',
            name: '系统管理员',
            accessKey: 'ak_admin_001',
            secretKey: 'sk_admin_001',
        },
        {
            username: 'merchant',
            password: '123',
            role: 'merchant',
            name: '希尔顿酒店集团',
            accessKey: 'ak_merchant_001',
            secretKey: 'sk_merchant_001',
        },
        {
            username: 'merchant2',
            password: '123',
            role: 'merchant',
            name: '如家酒店连锁',
            accessKey: 'ak_merchant_002',
            secretKey: 'sk_merchant_002',
        },
    ],
    hotels: [
        {
            id: 1,
            name: '上海陆家嘴禧玥酒店',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1740&q=80',
            address: '近外滩·东方明珠',
            area: '陆家嘴',
            price: 936,
            score: 4.8,
            scoreLabel: '超棒',
            star: 5,
            status: 'approved',
            description: 'BOSS:25楼是沪上知名米其林新荣记',
            tags: ['上海美景酒店榜 No.16'],
            details: [
                { label: '装修', value: '2020' },
                { label: '风格', value: '中式' },
                { label: '停车', value: '免费' },
            ],
            facilities: ['免费停车', '健身房', 'WIFI'],
            owner: 'merchant',
            rooms: [
                { id: 101, name: '经典双床房', description: '2张1.2米单人床 | 40m²', price: 936 },
                { id: 102, name: '豪华大床房', description: '1张2米大床 | 50m²', price: 1200 },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: 2,
            name: '艺龙安悦酒店',
            image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1625&q=80',
            address: '近歇浦路地铁站',
            area: '浦东新区',
            price: 199,
            score: 4.7,
            scoreLabel: '超棒',
            star: 4,
            status: 'pending',
            description: '近歌浦路地铁站·LCM置汇旭辉广场',
            tags: ['性价比之选'],
            details: [
                { label: '装修', value: '2019' },
                { label: '风格', value: '现代' },
            ],
            facilities: ['免费洗衣', '机器人服务'],
            owner: 'merchant2',
            rooms: [
                { id: 201, name: '标准单人间', description: '1张1.5米床 | 30m²', price: 199 },
                { id: 202, name: '商务双床房', description: '2张1.2米床 | 45m²', price: 280 },
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ],
    nextHotelId: 3,
    nextRoomId: 1000,
});

const ensureHotelDefaults = (hotel, mutableState) => {
    let changed = false;
    const nextHotel = { ...hotel };

    if (!Array.isArray(nextHotel.images)) {
        nextHotel.images = nextHotel.image ? [nextHotel.image] : [];
        changed = true;
    }

    if (Array.isArray(nextHotel.images) && nextHotel.images.length === 0 && nextHotel.image) {
        nextHotel.images = [nextHotel.image];
        changed = true;
    }

    if (!nextHotel.image && Array.isArray(nextHotel.images) && nextHotel.images.length > 0) {
        nextHotel.image = nextHotel.images[0];
        changed = true;
    }

    if (!nextHotel.image) {
        nextHotel.image = DEFAULT_HOTEL_IMAGE;
        changed = true;
    }

    if (Array.isArray(nextHotel.images) && nextHotel.images.length === 0) {
        nextHotel.images = [nextHotel.image];
        changed = true;
    }

    if (!Array.isArray(nextHotel.tags)) {
        nextHotel.tags = [];
        changed = true;
    }

    if (!Array.isArray(nextHotel.facilities)) {
        nextHotel.facilities = [];
        changed = true;
    }

    if (!Array.isArray(nextHotel.details) || nextHotel.details.length === 0) {
        nextHotel.details = [...DEFAULT_HOTEL_DETAILS];
        changed = true;
    }

    if (!Array.isArray(nextHotel.rooms) || nextHotel.rooms.length === 0) {
        const basePrice = Number(nextHotel.price) > 0 ? Number(nextHotel.price) : 199;
        const roomIdStart = Number(mutableState.nextRoomId) || 1000;
        nextHotel.rooms = [
            {
                id: roomIdStart,
                name: '标准大床房',
                description: '1张1.8米床 | 28m²',
                price: basePrice,
            },
            {
                id: roomIdStart + 1,
                name: '标准双床房',
                description: '2张1.2米床 | 30m²',
                price: basePrice + 60,
            },
        ];
        mutableState.nextRoomId = roomIdStart + 2;
        changed = true;
    }

    if (!nextHotel.scoreLabel) {
        nextHotel.scoreLabel = Number(nextHotel.score || 0) > 0 ? '超棒' : '新开业';
        changed = true;
    }

    return { hotel: nextHotel, changed };
};

const normalizeState = (inputState) => {
    const mutableState = {
        ...inputState,
        hotels: Array.isArray(inputState.hotels) ? [...inputState.hotels] : [],
        nextRoomId: Number(inputState.nextRoomId) || 1000,
    };

    let changed = false;
    mutableState.hotels = mutableState.hotels.map((hotel) => {
        const normalized = ensureHotelDefaults(hotel, mutableState);
        if (normalized.changed) changed = true;
        return normalized.hotel;
    });

    return { state: mutableState, changed };
};

const loadState = () => {
    ensureDir(DB_PATH);
    if (!fs.existsSync(DB_PATH)) {
        const seed = defaultState();
        fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf-8');
        return seed;
    }
    try {
        const content = fs.readFileSync(DB_PATH, 'utf-8');
        const parsed = JSON.parse(content);
        return {
            users: Array.isArray(parsed.users) ? parsed.users : [],
            hotels: Array.isArray(parsed.hotels) ? parsed.hotels : [],
            nextHotelId: Number(parsed.nextHotelId) || 1,
            nextRoomId: Number(parsed.nextRoomId) || 1000,
        };
    } catch (error) {
        const seed = defaultState();
        fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf-8');
        return seed;
    }
};

let state = loadState();

const normalizedBootState = normalizeState(state);
state = normalizedBootState.state;
if (normalizedBootState.changed) {
    fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2), 'utf-8');
}

const persistState = () => {
    fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2), 'utf-8');
};

const randomKey = (prefix) => `${prefix}_${crypto.randomBytes(12).toString('hex')}`;

const ensureUserSecurityFields = () => {
    let changed = false;
    const users = Array.isArray(state.users) ? state.users : [];
    const accessKeySet = new Set();
    const nextUsers = users.map((user, index) => {
        const nextUser = { ...user };
        if (!nextUser.accessKey || accessKeySet.has(nextUser.accessKey)) {
            nextUser.accessKey = randomKey(`ak_${nextUser.username || `user${index + 1}`}`);
            changed = true;
        }
        accessKeySet.add(nextUser.accessKey);
        if (!nextUser.secretKey) {
            nextUser.secretKey = randomKey(`sk_${nextUser.username || `user${index + 1}`}`);
            changed = true;
        }
        if (nextUser.secrectKey !== nextUser.secretKey) {
            nextUser.secrectKey = nextUser.secretKey;
            changed = true;
        }
        return nextUser;
    });

    if (changed) {
        state.users = nextUsers;
        persistState();
    }
};

ensureUserSecurityFields();

const genSign = (body, secretKey) => crypto.createHash('sha256').update(`${body}.${secretKey}`).digest('hex');

const getSignedBody = (req) => {
    const bodyHeader = req.headers.body;
    if (typeof bodyHeader !== 'string') return '';
    try {
        return decodeURIComponent(bodyHeader);
    } catch (error) {
        return '';
    }
};

const authMiddleware = (req, res, next) => {
    const accessKey = req.headers.accesskey;
    const sign = req.headers.sign;
    const nonce = req.headers.nonce;
    const timestamp = req.headers.timestamp;
    const body = getSignedBody(req);

    if (!accessKey || !sign || !nonce || !timestamp) {
        return res.status(403).json({ success: false, message: '缺少鉴权请求头' });
    }

    const nonceNum = Number(nonce);
    if (!Number.isFinite(nonceNum) || nonceNum > NONCE_MAX || nonceNum < 0) {
        return res.status(403).json({ success: false, message: '无效 nonce' });
    }

    const timestampNum = Number(timestamp);
    if (!Number.isFinite(timestampNum) || Math.abs(Date.now() - timestampNum) > REQUEST_EXPIRE_MS) {
        return res.status(403).json({ success: false, message: '请求已过期' });
    }

    const authUser = state.users.find((item) => item.accessKey === accessKey);
    if (!authUser || !authUser.secretKey) {
        return res.status(403).json({ success: false, message: 'accessKey 无效' });
    }

    const expectedSign = genSign(body, authUser.secretKey);
    if (expectedSign !== sign) {
        return res.status(403).json({ success: false, message: '签名校验失败' });
    }

    req.authUser = authUser;
    next();
};

const requireRole = (roles) => (req, res, next) => {
    const authUser = req.authUser;
    if (!authUser) {
        return res.status(403).json({ success: false, message: '请先登录' });
    }
    if (!roles.includes(authUser.role)) {
        return res.status(403).json({ success: false, message: '无权限访问' });
    }
    next();
};

const isValidRole = (role) => ['admin', 'merchant'].includes(role);
const isValidStatus = (status) => ['pending', 'approved', 'rejected', 'offline'].includes(status);

app.get('/', (req, res) => {
    res.send('Easy Stay Hotel Reservation API is running');
});

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'ok', time: new Date().toISOString() });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    }
    const user = state.users.find((u) => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    return res.json({
        success: true,
        user: {
            username: user.username,
            role: user.role,
            name: user.name,
            accessKey: user.accessKey,
            secretKey: user.secretKey,
            secrectKey: user.secretKey,
        },
    });
});

app.post('/api/register', (req, res) => {
    const { username, password, role } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    }
    if (state.users.some((u) => u.username === username)) {
        return res.json({ success: false, message: 'User already exists' });
    }
    const finalRole = isValidRole(role) ? role : 'merchant';
    state.users.push({
        username,
        password,
        role: finalRole,
        name: username,
        accessKey: randomKey(`ak_${username}`),
        secretKey: randomKey(`sk_${username}`),
        secrectKey: '',
    });
    state.users[state.users.length - 1].secrectKey = state.users[state.users.length - 1].secretKey;
    persistState();
    return res.json({ success: true, message: 'Register success' });
});

app.get('/api/hotels', authMiddleware, requireRole(['admin', 'merchant']), (req, res) => {
    const { status, q } = req.query;
    const { role, username } = req.authUser;
    let result = [...state.hotels];

    if (role === 'merchant') {
        result = result.filter((hotel) => hotel.owner === username);
    } else if (role !== 'admin') {
        result = result.filter((hotel) => hotel.status === 'approved');
    }

    if (status) {
        result = result.filter((hotel) => hotel.status === status);
    }
    if (q) {
        const keyword = String(q).toLowerCase();
        result = result.filter((hotel) => {
            const baseText = `${hotel.name || ''} ${hotel.englishName || ''} ${hotel.address || ''} ${hotel.area || ''} ${hotel.description || ''}`.toLowerCase();
            return baseText.includes(keyword);
        });
    }

    const statusOrder = { pending: 0, rejected: 1, approved: 2, offline: 3 };
    result.sort((a, b) => {
        const byStatus = (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
        if (byStatus !== 0) return byStatus;
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    });

    return res.json(result);
});

app.get('/api/hotels/public', (req, res) => {
    const approvedHotels = state.hotels.filter((hotel) => hotel.status === 'approved');
    return res.json({ success: true, hotels: approvedHotels });
});

app.get('/api/hotels/:id', (req, res) => {
    const id = Number(req.params.id);
    const accessKey = req.headers.accesskey;
    const authUser = accessKey ? state.users.find((item) => item.accessKey === accessKey) : null;
    const role = authUser?.role;
    const username = authUser?.username;
    const hotel = state.hotels.find((item) => item.id === id);
    if (!hotel) {
        return res.status(404).json({ success: false, message: '酒店不存在' });
    }

    if (role === 'admin') {
        return res.json({ success: true, hotel });
    }
    if (role === 'merchant') {
        if (hotel.owner !== username) {
            return res.status(403).json({ success: false, message: '无权限查看该酒店' });
        }
        return res.json({ success: true, hotel });
    }
    if (hotel.status !== 'approved') {
        return res.status(404).json({ success: false, message: '酒店不存在或不可见' });
    }
    return res.json({ success: true, hotel });
});

app.post('/api/hotels', authMiddleware, requireRole(['merchant']), (req, res) => {
    const payload = req.body || {};
    const now = new Date().toISOString();
    const authUser = req.authUser;

    if (!payload.name || !payload.address) {
        return res.status(400).json({ success: false, message: 'name 和 address 为必填项' });
    }
    const parsedPrice = Number(payload.price || 0);
    const normalizedPayload = {
        ...payload,
        owner: authUser.username,
        price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
        images: Array.isArray(payload.images) ? payload.images.filter(Boolean) : [],
        facilities: Array.isArray(payload.facilities) ? payload.facilities : [],
        tags: Array.isArray(payload.tags) ? payload.tags : [],
        details: Array.isArray(payload.details) ? payload.details : [],
        rooms: Array.isArray(payload.rooms) ? payload.rooms : [],
    };

    if (normalizedPayload.id) {
        const hotelId = Number(normalizedPayload.id);
        const index = state.hotels.findIndex((hotel) => hotel.id === hotelId);
        if (index === -1) {
            return res.status(404).json({ success: false, message: '酒店不存在' });
        }
        const oldHotel = state.hotels[index];
        if (oldHotel.owner !== authUser.username) {
            return res.status(403).json({ success: false, message: '只能修改自己录入的酒店' });
        }

        state.hotels[index] = {
            ...oldHotel,
            ...normalizedPayload,
            id: oldHotel.id,
            status: 'pending',
            updatedAt: now,
        };
        state.hotels[index] = ensureHotelDefaults(state.hotels[index], state).hotel;
        persistState();
        return res.json({ success: true, hotel: state.hotels[index] });
    }

    const newHotel = {
        id: state.nextHotelId,
        name: normalizedPayload.name,
        englishName: normalizedPayload.englishName || '',
        address: normalizedPayload.address,
        area: normalizedPayload.area || '',
        image: normalizedPayload.image || '',
        images: normalizedPayload.images,
        price: normalizedPayload.price,
        score: 0,
        scoreLabel: '新开业',
        star: Number(normalizedPayload.star || 3),
        status: 'pending',
        description: normalizedPayload.description || '',
        tags: normalizedPayload.tags,
        details: normalizedPayload.details,
        facilities: normalizedPayload.facilities,
        owner: normalizedPayload.owner,
        rooms: normalizedPayload.rooms,
        createdAt: now,
        updatedAt: now,
    };

    const normalizedNewHotel = ensureHotelDefaults(newHotel, state).hotel;

    state.hotels.push(normalizedNewHotel);
    state.nextHotelId += 1;
    persistState();
    return res.json({ success: true, hotel: normalizedNewHotel });
});

app.post('/api/hotels/status', authMiddleware, requireRole(['admin']), (req, res) => {
    const { id, status, reason } = req.body || {};
    const hotelId = Number(id);
    if (!hotelId || !isValidStatus(status)) {
        return res.status(400).json({ success: false, message: '参数不合法' });
    }

    const index = state.hotels.findIndex((hotel) => hotel.id === hotelId);
    if (index === -1) {
        return res.status(404).json({ success: false, message: '酒店不存在' });
    }

    const nextHotel = {
        ...state.hotels[index],
        status,
        updatedAt: new Date().toISOString(),
    };
    if (status === 'rejected') {
        nextHotel.rejectReason = reason || '';
    } else {
        delete nextHotel.rejectReason;
    }

    state.hotels[index] = nextHotel;
    persistState();
    return res.json({ success: true, hotel: nextHotel });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Data file: ${DB_PATH}`);
});
