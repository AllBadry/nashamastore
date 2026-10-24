import axios from 'axios';
import { clearAuth } from '../lib/authState';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api',
  withCredentials: true, // السماح بإرسال واستقبال HTTP-Only Cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// اعتراض الطلبات لإضافة Access Token إذا كان موجوداً
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// اعتراض الاستجابات:
// 1) تحديث التوكن تلقائياً عند تجديده من السيرفر (جلسة منزلقة)
// 2) إنهاء الجلسة محلياً عند انتهاء صلاحيتها أو الخمول (401)
apiClient.interceptors.response.use(
  (response) => {
    const fresh = response.headers['x-access-token'];
    if (fresh) localStorage.setItem('accessToken', fresh);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthCall =
      url.includes('/auth/login') ||
      url.includes('/auth/signup') ||
      url.includes('/auth/refresh-token');
    if (status === 401 && !isAuthCall) {
      clearAuth();
    }
    return Promise.reject(error);
  }
);

export default apiClient;