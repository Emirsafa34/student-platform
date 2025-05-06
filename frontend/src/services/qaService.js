// src/services/qaService.js
import api from './api';

/**
 * QA (Soru & Cevap) ile ilgili tüm API çağrıları
 */

// Tüm QA'ları getir – son X tanesini alabilir
export function fetchQAs(limit = null) {
  return api.get('/qas').then(({ data }) => {
    const all = data.qas || [];
    return limit ? all.slice(-limit).reverse() : all;
  });
}

// Yeni soru ekle
export function addQuestion(payload) {
  return api.post('/qas', payload).then(({ data }) => data.qa);
}

// Cevap ekle
export function addAnswer(questionId, payload) {
  return api
    .post(`/qas/${questionId}/answers`, payload)
    .then(({ data }) => data.qa);
}

// QA güncelle
export function updateQA(questionId, payload) {
  return api.put(`/qas/${questionId}`, payload).then(({ data }) => data.qa);
}

// QA sil (soft delete)
export function deleteQuestion(questionId) {
  return api.delete(`/qas/${questionId}`).then(({ data }) => data.message);
}

// Cevap sil
export function deleteAnswer(questionId, answerId) {
  return api
    .delete(`/qas/${questionId}/answers/${answerId}`)
    .then(({ data }) => data.qa);
}
