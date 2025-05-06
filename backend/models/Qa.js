// backend/models/Qa.js

const mongoose = require('mongoose');

// Her bir cevabı temsil edecek alt şema
const answerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Cevap metni gerekli'],
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Cevap ekleyen kullanıcı gerekli']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const QASchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Soru metni gerekli'],
      trim: true,
    },
    // Tekil 'answer' alanı yerine cevap dizisi
    answers: {
      type: [answerSchema],
      default: []
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Soru ekleyen kullanıcı gerekli'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Qa', QASchema);
