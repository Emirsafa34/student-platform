const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');
const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Kullanıcı adı 3–30 karakter olmalı'),
    body('email')
      .isEmail()
      .withMessage('Geçerli bir email adresi giriniz')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Parola en az 6 karakter olmalı'),
  ],
  register
);

// Login
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Geçerli bir email adresi giriniz')
      .normalizeEmail(),
    body('password').notEmpty().withMessage('Parola alanı boş bırakılamaz'),
  ],
  login
);

module.exports = router;
