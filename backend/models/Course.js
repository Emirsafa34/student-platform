// backend/models/Course.js
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Ders başlığı zorunlu'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Ders açıklaması zorunlu'],
      trim: true,
    },
    grade: {
      type: Number,
      required: [true, 'Sınıf bilgisi zorunlu'],
      enum: [1, 2, 3, 4]
    },
    
    // ✅ Yeni alan: Güz / Bahar dönemi
    term: {
      type: String,
      required: [true, 'Dönem bilgisi zorunlu'],
      enum: ['güz', 'bahar'],
      lowercase: true,
      trim: true
    },

    thumbnailUrl: {
      type: String,
      trim: true,
    },
    pdfUrl: {
      type: String,
      trim: true,
    },
    youtubePlaylist: {
      type: String,
      trim: true,
    },
    gradingPolicy: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

module.exports = mongoose.model('Course', CourseSchema);
