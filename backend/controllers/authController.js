// backend/controllers/authController.js

const User = require('../models/user');
const jwt = require('jsonwebtoken');

// JWT Token üreten fonksiyon
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Kullanıcı Kayıt
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = new User({ username, email, password });
    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Kullanıcı başarıyla kaydedildi.',
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Kullanıcı Giris
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isDeleted: false });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Geçersiz şifre.' });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Giriş başarılı.',
      token,
    });
  } catch (error) {
    next(error);
  }
};
