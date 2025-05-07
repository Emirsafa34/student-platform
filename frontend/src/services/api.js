// src/services/api.js

import axios from 'axios';

// Çevresel değişkenden backend URL’ini al
const host = import.meta.env.VITE_API_URL;
const isProd = import.meta.env.MODE === 'production';

if (!host && isProd) {
  // Prod ortamında host tanımsızsa hata fırlat
  throw new Error(
    'VITE_API_URL environment variable is not defined. Please set it to your backend URL.'
  );
}

// Geliştirme modunda fallback olarak localhost kullan
const baseURL = host || 'http://localhost:5000';

// Axios örneğini oluştur
const api = axios.create({
  baseURL: `${baseURL}/api`,
  timeout: 10000,
  withCredentials: true,  // gerekliyse çerez gönderimi için
});

// Request interceptor: her isteğe Authorization header’ı ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: hata yönetimi ve 401 yönlendirmesi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Yetkilendirme hatasıysa kullanıcıyı login sayfasına at
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
        return;
      }

      // Diğer hata durumlarında API error objesini fırlat
      return Promise.reject(data);
    }

    // Network veya CORS vb. hatalar
    return Promise.reject(error);
  }
);

export default api;