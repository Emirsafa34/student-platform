// backend/routes/courseRoutes.js

const express = require('express');
const router = express.Router();

const courseController = require('../controllers/courseController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Tüm dersleri getir
router.get('/', courseController.getCourses);

// Yeni ders ekle (admin)
router.post('/', protect, adminOnly, courseController.createCourse);

// Ders güncelle (admin)
router.put('/:id', protect, adminOnly, courseController.updateCourse);

// Ders sil (soft delete - admin)
router.delete('/:id', protect, adminOnly, courseController.deleteCourse);

module.exports = router; 