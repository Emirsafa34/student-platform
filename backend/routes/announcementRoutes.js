// backend/routes/announcementRoutes.js

const express = require('express');
const router = express.Router();

const {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');

const { protect } = require('../middleware/authMiddleware'); // Giriş kontrolü
const { adminOnly } = require('../middleware/roleMiddleware'); // Admin kontrolü

// 📥 Herkes görebilir
router.get('/', getAnnouncements);

// ➕ Sadece admin oluşturabilir
router.post('/', protect, adminOnly, createAnnouncement);

// 📝 Duyuru güncelle (admin)
router.put('/:id', protect, adminOnly, updateAnnouncement);

// ❌ Soft delete (admin)
router.delete('/:id', protect, adminOnly, deleteAnnouncement);

module.exports = router;
