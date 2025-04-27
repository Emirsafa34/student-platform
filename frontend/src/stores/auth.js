// src/stores/auth.js
import { defineStore } from 'pinia';
import * as authService from '../services/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || ''
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    async register(payload) {
      const { token, user } = await authService.register(payload);
      this.user = user;
      this.token = token;
      localStorage.setItem('token', token);
    },
    async login(payload) {
      const { token, user } = await authService.login(payload);
      this.user = user;
      this.token = token;
      localStorage.setItem('token', token);
    },
    logout() {
      this.user = null;
      this.token = '';
      localStorage.removeItem('token');
    }
  }
});
