// backend/controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Register user
exports.registerUser = asyncHandler(async (req, res) => {
  // Mevcut kayıt mantığınız buraya gelecek
  res.send('Register user');
});

// Login user
exports.loginUser = asyncHandler(async (req, res) => {
  // Mevcut login mantığınız buraya gelecek
  res.send('Login user');
});

// Get own profile
exports.getProfile = asyncHandler(async (req, res) => {
  // Mevcut profil çekme mantığınız buraya gelecek
  res.send('Get user profile');
});

// Get all users (admin only)
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json({ success: true, users });
});

// Get user by ID (any authenticated user)
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: 'Kullanıcı bulunamadı.' });
  }
  res.json({ success: true, user });
});

// Update user profile (any authenticated user)
exports.updateUser = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: 'Kullanıcı bulunamadı.' });
  }
  if (username) user.username = username;
  if (email) user.email = email;
  await user.save();
  res.json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

// Delete user (admin only)
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: 'Kullanıcı bulunamadı.' });
  }
  await user.remove();
  res.json({ success: true, message: 'Kullanıcı başarıyla silindi.' });
});

// Update user role (user ↔ admin) (admin only)
exports.updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body; // 'user' veya 'admin'
  const user = await User.findById(req.params.id);
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: 'Kullanıcı bulunamadı.' });
  }
  user.role = role;
  await user.save();
  res.json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});
