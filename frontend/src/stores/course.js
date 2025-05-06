// FRONTEND: src/stores/course.js
import { defineStore } from 'pinia';
import api from '../services/api';

export const useCourseStore = defineStore('course', {
  state: () => ({
    courses: [],
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
    search: '',
  }),
  actions: {
    // Kursları sayfalı ve filtreli şekilde çek
    async fetchCourses({
      page = this.page,
      limit = this.limit,
      search = this.search,
    } = {}) {
      const { data } = await api.get('/courses', {
        params: { page, limit, search },
      });
      this.courses = data.courses;
      this.page = data.page;
      this.pages = data.pages;
      this.total = data.total;
    },
    // Yeni kurs ekle ve listeyi güncelle
    async addCourse(payload) {
      const { course } = await api
        .post('/courses', payload)
        .then((res) => res.data);
      // Sayfalı yapıda ekleme sonrası yeniden fetch yapmak daha sağlıklı olabilir
      await this.fetchCourses();
    },
    // Kurs sil ve listeyi yeniden çek
    async removeCourse(id) {
      await api.delete(`/courses/${id}`);
      await this.fetchCourses();
    },
    // Arama terimi ayarla
    setSearch(term) {
      this.search = term;
      this.page = 1;
      this.fetchCourses();
    },
    // Sayfa ayarla
    setPage(page) {
      if (page >= 1 && page <= this.pages) {
        this.page = page;
        this.fetchCourses();
      }
    },
  },
});
