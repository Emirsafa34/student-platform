import api from './api';

// 📥 Tüm duyuruları getir
export const fetchAnnouncements = () =>
  api.get('/announcements')
     .then(res => res.data);

// ➕ Yeni duyuru ekle (admin)
export const createAnnouncement = (data) =>
  api.post('/announcements', data)
     .then(res => res.data.announcement);

// ❌ Duyuru sil (admin)
export const removeAnnouncement = (id) =>
  api.delete(`/announcements/${id}`)
     .then(res => res.data.message);
