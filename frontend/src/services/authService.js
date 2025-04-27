// src/services/authService.js
import api from './api';

// backend’de /api/auth/register ve /api/auth/login oldu
export const register = (payload) =>
  api.post('/auth/register', payload).then(res => res.data);

export const login = (payload) =>
  api.post('/auth/login',    payload).then(res => res.data);
