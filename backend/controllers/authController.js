// controllers/authController.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

// Helper: JWT üretir
const generateToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

exports.register = async (req, res, next) => {
  // 1) validationResult
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    // 2) body’den sadece username/email/password al
    const { username, email, password } = req.body;

    // 3) kullanıcı zaten var mı?
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Bu e-posta zaten kayıtlı.' });
    }

    // 4) Şifre hash işlemi User schema’daki pre hook ile yapılacak

    // 5) Kullanıcı oluştur, role sabit 'user'
    const user = new User({
      username,
      email,
      password,
      role: 'user',
    });
    await user.save();

    // 6) token üret
    const token = generateToken(user._id);

    // 7) yanıt: token + user objesi
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  // 1) validationResult
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    // 2) body’den email/password al
    const { email, password } = req.body;

    // 3) kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Geçersiz kimlik bilgisi.' });
    }

    // 4) şifre kontrolü
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Geçersiz kimlik bilgisi.' });
    }

    // 5) token üret
    const token = generateToken(user._id);

    // 6) yanıt
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};
