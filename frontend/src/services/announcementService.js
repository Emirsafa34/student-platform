// frontend/src/services/announcementService.js
import api from './api';

export async function fetchAnnouncements(limit = null) {
  const res = await api.get('/announcements');
  const list = res.data.announcements || [];
  return limit != null ? list.slice(0, limit) : list;
}

export async function createAnnouncement(payload) {
  const res = await api.post('/announcements', payload);
  return res.data.announcement;
}

export async function removeAnnouncement(id) {
  const res = await api.delete(`/announcements/${id}`);
  return res.data.message;
}
