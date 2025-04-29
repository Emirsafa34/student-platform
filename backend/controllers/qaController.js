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
  qa.answers.push({ text, createdBy: req.user._id });
  const updated = await qa.save();
  res.status(201).json({ success: true, qa: updated });
});

// Soru güncelle (sadece oluşturan veya admin)
exports.updateQA = asyncHandler(async (req, res) => {
  const qa = await QA.findById(req.params.id);
  if (!qa || qa.isDeleted) {
    res.status(404);
    throw new Error('Soru bulunamadı');
  }
  if (req.user.role !== 'admin' && qa.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Yetkiniz yok');
  }
  const { question } = req.body;
  if (question) qa.question = question;
  const updated = await qa.save();
  res.status(200).json({ success: true, qa: updated });
});

// Cevap silme (sadece admin)
exports.deleteAnswer = asyncHandler(async (req, res) => {
  const { qId, ansId } = req.params;
  const qa = await QA.findById(qId);
  if (!qa || qa.isDeleted) {
    res.status(404);
    throw new Error('Soru bulunamadı');
  }
  qa.answers = qa.answers.filter(ans => ans._id.toString() !== ansId);
  const updated = await qa.save();
  res.status(200).json({ success: true, qa: updated });
});

// Soft delete soru (sadece admin veya oluşturan user)
exports.deleteQA = asyncHandler(async (req, res) => {
  const qa = await QA.findById(req.params.id);
  if (!qa) {
    res.status(404);
    throw new Error('Soru bulunamadı');
  }
  if (qa.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Bu işlemi yapmaya yetkiniz yok');
  }
  qa.isDeleted = true;
  await qa.save();
  res.status(200).json({ success: true, message: 'Soru başarıyla silindi (soft delete).' });
});
