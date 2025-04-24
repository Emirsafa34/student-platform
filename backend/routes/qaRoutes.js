// backend/routes/qaRoutes.js

const express = require('express');
const router = express.Router();

const qaController = require('../controllers/qaController');
const { protect } = require('../middleware/authMiddleware');

// Tüm QA listesi
router.get('/', qaController.getAllQA);

// Yeni QA ekle (user & admin)
router.post('/', protect, qaController.createQA);

// QA güncelle
router.put('/:id', protect, qaController.updateQA);

// QA sil (soft delete)
router.delete('/:id', protect, qaController.deleteQA);

module.exports = router;
