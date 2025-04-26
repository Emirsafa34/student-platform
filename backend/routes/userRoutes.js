// backend/routes/userRoutes.js

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// JWT oluşturma fonksiyonu
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, 'jwt-secret', {
    expiresIn: '7d',
  });
};

// Test amaçlı GET / route
router.get('/', (req, res) => {
  res.send('✅ Kullanıcı API çalışıyor');
});

// Kullanıcı kaydı
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'Bu email zaten kayıtlı' });

    const user = await User.create({ username, email, password, role });
    const token = generateToken(user);
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Kullanıcı girişi
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Kullanıcı bulunamadı' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Şifre yanlış' });

    const token = generateToken(user);
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
