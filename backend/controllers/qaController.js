// backend/controllers/qaController.js

const QA = require('../models/QA');
const asyncHandler = require('express-async-handler');

// Create question
exports.createQA = asyncHandler(async (req, res) => {
  const { question } = req.body;
  const newQA = await QA.create({
    question,
    createdBy: req.user._id,
  });
  res.status(201).json({ success: true, qa: newQA });
});

// Get all QAs
exports.getAllQA = asyncHandler(async (req, res) => {
  const list = await QA.find({ isDeleted: false });
  res.status(200).json({ success: true, qas: list });
});

// Add answer
exports.addAnswer = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const qa = await QA.findById(req.params.id);
  if (!qa) {
    res.status(404);
    throw new Error('Soru bulunamadı');
  }
  qa.answers.push({ text, createdBy: req.user._id });
  await qa.save();
  res.status(200).json({ success: true, qa });
});

// Update question
exports.updateQA = asyncHandler(async (req, res) => {
  const qa = await QA.findById(req.params.id);
  if (!qa) {
    res.status(404);
    throw new Error('Soru bulunamadı');
  }
  if (
    qa.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Bu işlemi yapmaya yetkiniz yok');
  }
  qa.question = req.body.question || qa.question;
  await qa.save();
  res.status(200).json({ success: true, qa });
});

// Delete answer (admin only)
exports.deleteAnswer = asyncHandler(async (req, res) => {
  const qa = await QA.findById(req.params.qId);
  if (!qa) {
    res.status(404);
    throw new Error('Soru bulunamadı');
  }
  qa.answers = qa.answers.filter(
    (ans) => ans._id.toString() !== req.params.ansId
  );
  await qa.save();
  res.status(200).json({ success: true, qa });
});

// Soft delete question
exports.deleteQA = asyncHandler(async (req, res) => {
  const qa = await QA.findById(req.params.id);
  if (!qa) {
    res.status(404);
    throw new Error('Soru bulunamadı');
  }
  if (
    qa.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Bu işlemi yapmaya yetkiniz yok');
  }
  qa.isDeleted = true;
  await qa.save();
  res
    .status(200)
    .json({ success: true, message: 'Soru başarıyla silindi (soft delete).' });
});
