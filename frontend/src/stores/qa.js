// src/stores/qa.js
import { defineStore } from 'pinia';
import api from '../services/api';

export const useQAStore = defineStore('qa', {
  state: () => ({
    qas: []
  }),
  actions: {
    async fetchQAs() {
      this.qas = await api.get('/qas').then(res => res.data);
    },
    async addQA(data) {
      const newQA = await api.post('/qas', data).then(res => res.data);
      this.qas.push(newQA);
    },
    async removeQA(id) {
      await api.delete(`/qas/${id}`);
      this.qas = this.qas.filter(q => q._id !== id);
    },
    async updateQA(id, data) {
      const updated = await api.put(`/qas/${id}`, data).then(res => res.data);
      const index = this.qas.findIndex(q => q._id === id);
      if (index !== -1) this.qas.splice(index, 1, updated);
    }
  }
});
