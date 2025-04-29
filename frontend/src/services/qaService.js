// src/services/qaService.js
import api from './api';

/**
 * QA (Soru & Cevap) ile ilgili tüm API çağrıları
 */

// Tüm soru-cevapları getir (cevaplar dahil)
export function fetchQAs() {
  return api.get('/qas')
    .then(res => res.data.qaList || res.data);
}

// Yeni soru ekle
export function addQuestion(payload) {
  // payload: { question: string }
  return api.post('/qas', payload)
    .then(res => res.data.qa);
}

// Belirli bir soruya cevap ekle
export function addAnswer(questionId, payload) {
  // payload: { text: string }
  return api.post(`/qas/${questionId}/answers`, payload)
    .then(res => res.data.qa);
}

// Soru güncelle
export function updateQA(questionId, payload) {
  // payload: { question?: string, isDeleted?: boolean }
  return api.put(`/qas/${questionId}`, payload)
    .then(res => res.data.qa);
}

// Soru sil (soft delete)
export function deleteQA(questionId) {
  return api.delete(`/qas/${questionId}`)
    .then(res => res.data.message);
}
export { deleteQA as deleteQuestion };

// Cevap silme
export function deleteAnswer(questionId, answerId) {
  return api.delete(`/qas/${questionId}/answers/${answerId}`)
    .then(res => res.data.qa);
}
