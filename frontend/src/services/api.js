// src/services/api.js
import axios from 'axios';

// API temel axios instance'ı
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Request interceptor: token ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
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
      // Token süresi dolduysa login sayfasına yönlendir
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      // Diğer genel hataları yakala
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;

// örnek: src/services/authService.js
// import api from './api';
// export const register = (payload) => api.post('/auth/register', payload);
// export const login = (payload) => api.post('/auth/login', payload);
