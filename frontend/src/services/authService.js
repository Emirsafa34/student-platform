// src/services/authService.js
import api from './api';

// Kayıt olma
export function register(payload) {
  return api.post('/auth/register', payload).then(({ data }) => data);
}

// Giriş yapma
export function login(payload) {
  return api.post('/auth/login', payload).then(({ data }) => data);
}
