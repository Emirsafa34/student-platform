// src/services/courseService.js
import api from './api';

// Kursları getir – opsiyonel parametre destekler (örneğin { limit: 3 })
export const fetchCourses = (params = {}) =>
  api
    .get('/courses', { params })
    .then(({ data }) => data.courses || data);

// Yeni kurs oluştur
export const createCourse = (payload) =>
  api
    .post('/courses', payload)
    .then(({ data }) => data.course || data);

// Kurs güncelle
export const updateCourse = (id, payload) =>
  api
    .put(`/courses/${id}`, payload)
    .then(({ data }) => data.course || data);

// Kurs sil
export const removeCourse = (id) =>
  api
    .delete(`/courses/${id}`)
    .then(({ data }) => data.message);
