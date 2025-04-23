// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// KAYIT
router.post('/register', authController.register);

// GIRIŞ
router.post('/login', authController.login);

module.exports = router;
