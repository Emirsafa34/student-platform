// backend/routes/qaRoutes.js

const express = require('express');
const router = express.Router();

const qaController = require('../controllers/qaController');
const { protect } = require('../middleware/authMiddleware');

// Tüm QA listesi (cevaplar dahil)
router.get('/', qaController.getAllQA);

// Yeni soru ekle (user & admin)
router.post('/', protect, qaController.createQA);

// Belirli bir soruya cevap ekle (user & admin)
router.post('/:id/answers', protect, qaController.addAnswer);

// QA güncelle (sadece oluşturan veya admin)
router.put('/:id', protect, qaController.updateQA);

// QA sil (soft delete) (sadece oluşturan veya admin)
router.delete('/:id', protect, qaController.deleteQA);

module.exports = router;