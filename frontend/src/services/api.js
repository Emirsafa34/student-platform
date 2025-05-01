// src/services/api.js
import axios from 'axios';

// Host’u ortam değişkeninden al, yoksa local’e düş
const host = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Tüm istekler artık otomatik "/api" ile başlayacak
const api = axios.create({
  baseURL: `${host}/api`,
  timeout: 10000,
});

// Request interceptor: token ekle
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

// Response interceptor: global hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;
