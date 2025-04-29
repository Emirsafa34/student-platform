import api from './api';

export const fetchCourses = () =>
  api.get('/courses')
     .then(res => res.data.courses || res.data);

export const createCourse = (data) =>
  api.post('/courses', data)
     .then(res => res.data.course || res.data);

export const updateCourse = (id, data) =>
  api.put(`/courses/${id}`, data)
     .then(res => res.data.course || res.data);

export const removeCourse = (id) =>
  api.delete(`/courses/${id}`)
     .then(res => res.data.message);
