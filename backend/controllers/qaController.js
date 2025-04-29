// backend/controllers/qaController.js

const QA = require('../models/QA.js');
const asyncHandler = require('express-async-handler');

// Yeni soru oluştur (user & admin)
exports.createQA = asyncHandler(async (req, res) => {
  const { question } = req.body;
  if (!question) {
    res.status(400);
    throw new Error('Soru metni boş olamaz');
  }
  const newQA = await QA.create({
    question,
    createdBy: req.user._id
  });
  res.status(201).json({ success: true, qa: newQA });
});

// Tüm aktif soru-cevapları getir (cevaplarla birlikte)
exports.getAllQA = asyncHandler(async (req, res) => {
  const qaList = await QA.find({ isDeleted: false })
    .populate({ path: 'createdBy', select: 'username role', strictPopulate: false })
    .populate({ path: 'answers.createdBy', select: 'username', strictPopulate: false });
  res.status(200).json({ success: true, qaList });
});

// Bir soruya cevap ekle (user & admin)
exports.addAnswer = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400);
    throw new Error('Cevap metni gerekli');
  }
  const qa = await QA.findById(req.params.id);
  if (!qa || qa.isDeleted) {
    res.status(404);
    throw new Error('Soru bulunamadı');
  }
  qa.answers.push({
    text,
    createdBy: req.user._id
  });
  const updated = await qa.save();
  res.status(201).json({ success: true, qa: updated });
});

// Güncelleme (sadece admin ya da oluşturan user)
exports.updateQA = asyncHandler(async (req, res) => {
  const qa = await QA.findById(req.params.id);
  if (!qa || qa.isDeleted) {
    return res.status(404).json({ success: false, message: 'Bulunamadı' });
  }
  if (req.user.role !== 'admin' && qa.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Yetkiniz yok' });
  }
  const { question, isDeleted } = req.body;
  const updated = await QA.findByIdAndUpdate(
    req.params.id,
    { question, isDeleted },
    { new: true }
  );
  res.status(200).json({ success: true, qa: updated });
});

// Soft delete (sadece admin veya soruyu oluşturan user)
exports.deleteQA = asyncHandler(async (req, res) => {
  const qa = await QA.findById(req.params.id);
  if (!qa) {
    return res.status(404).json({ success: false, message: 'Soru bulunamadı.' });
  }
  if (qa.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Bu işlemi yapmaya yetkiniz yok.' });
  }
  qa.isDeleted = true;
  await qa.save();
  res.status(200).json({ success: true, message: 'Soru başarıyla silindi (soft delete).' });
});
