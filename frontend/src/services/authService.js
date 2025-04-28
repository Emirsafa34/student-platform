// src/services/authService.js
import api from './api';

// Kayıt olma
export function register(payload) {
  // backend artık /api/auth/register
  return api.post('/auth/register', payload).then(res => res.data);
}

// Giriş yapma
export function login(payload) {
  // backend artık /api/auth/login
  return api.post('/auth/login', payload).then(res => res.data);
}
