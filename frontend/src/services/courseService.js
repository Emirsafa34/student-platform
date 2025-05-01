import api from './api';

// Kursları getir – opsiyonel parametre destekler (örneğin { limit: 3 })
export const fetchCourses = (params = {}) =>
  api.get('/courses', { params })
     .then(res => res.data.courses || res.data);

// Yeni kurs oluştur
export const createCourse = (data) =>
  api.post('/courses', data)
     .then(res => res.data.course || res.data);

// Kurs güncelle
export const updateCourse = (id, data) =>
  api.put(`/courses/${id}`, data)
     .then(res => res.data.course || res.data);

// Kurs sil
export const removeCourse = (id) =>
  api.delete(`/courses/${id}`)
     .then(res => res.data.message);
