// backend/routes/qaRoutes.js

const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const qaController = require('../controllers/qaController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// List all QAs
router.get('/', qaController.getAllQA);

// Create a new question
router.post(
  '/',
  protect,
  [ body('question').notEmpty().withMessage('Soru metni boş bırakılamaz') ],
  validate,
  qaController.createQA
);

// Add an answer to a question
router.post(
  '/:id/answers',
  protect,
  [ body('text').notEmpty().withMessage('Cevap metni boş bırakılamaz') ],
  validate,
  qaController.addAnswer
);

// Delete an answer (admin only)
router.delete('/:qId/answers/:ansId', protect, adminOnly, qaController.deleteAnswer);

// Update a question
router.put(
  '/:id',
  protect,
  [ body('question').optional().notEmpty().withMessage('Soru metni boş bırakılamaz') ],
  validate,
  qaController.updateQA
);

// Delete a question (soft delete)
router.delete('/:id', protect, adminOnly, qaController.deleteQA);

module.exports = router;
