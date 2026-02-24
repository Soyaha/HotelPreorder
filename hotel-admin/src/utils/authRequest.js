const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const textEncoder = new TextEncoder();

const toHex = (buffer) => Array.from(new Uint8Array(buffer)).map((item) => item.toString(16).padStart(2, '0')).join('');

const sha256 = async (content) => {
    const data = textEncoder.encode(content);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return toHex(digest);
};

const genSign = async (body, secretKey) => sha256(`${body}.${secretKey}`);

const readUser = () => {
    try {
        return JSON.parse(localStorage.getItem('user') || 'null');
    } catch (error) {
        return null;
    }
};

export const buildSignedHeaders = async (payload = {}) => {
    const user = readUser();
    const secretKey = user?.secretKey || user?.secrectKey;
    if (!user?.accessKey || !secretKey) {
        throw new Error('缺少 accessKey/secretKey，请重新登录');
    }

    const body = JSON.stringify(payload || {});
    const nonce = `${Math.floor(Math.random() * 100000)}`;
    const timestamp = `${Date.now()}`;
    const sign = await genSign(body, secretKey);

    return {
        'Content-Type': 'application/json',
        accessKey: user.accessKey,
        nonce,
        timestamp,
        body: encodeURIComponent(body),
        sign,
    };
};

export const signedRequest = async (endpoint, options = {}) => {
    const method = (options.method || 'GET').toUpperCase();
    const payload = options.payload || (method === 'GET' ? {} : undefined);
    const headers = await buildSignedHeaders(payload || {});
    const requestOptions = {
        method,
        ...options,
        headers: {
            ...(options.headers || {}),
            ...headers,
        },
    };

    if (method !== 'GET') {
        requestOptions.body = JSON.stringify(payload || {});
    }

    delete requestOptions.payload;

    const normalizedEndpoint = endpoint.startsWith('/api/')
        ? endpoint.slice(4)
        : endpoint;
    return fetch(`${API_BASE_URL}${normalizedEndpoint}`, requestOptions);
};
