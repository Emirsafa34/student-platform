// backend/routes/userRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin-only: tüm kullanıcıları listele
router.get('/', protect, adminOnly, getAllUsers);

// Her authenticated user için: tek bir kullanıcıyı getir
router.get('/:id', protect, getUserById);

// Her authenticated user için: kendi profilini güncelle
router.put(
  '/:id',
  protect,
  [
    body('username').optional().isString().withMessage('Geçersiz kullanıcı adı'),
    body('email').optional().isEmail().withMessage('Geçersiz email adresi')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    next();
  },
  updateUser
);

// Admin-only: kullanıcı sil
router.delete('/:id', protect, adminOnly, deleteUser);

// Admin-only: kullanıcı rolünü güncelle (user ↔ admin)
router.put(
  '/:id/role',
  protect,
  adminOnly,
  body('role')
    .isIn(['user','admin'])
    .withMessage('Role sadece "user" veya "admin" olabilir'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    next();
  },
  updateUserRole
);

module.exports = router;
