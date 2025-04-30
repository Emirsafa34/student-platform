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
    // Buraya grade alanını ekliyoruz:
    grade: {
      type: Number,
      required: [true, 'Sınıf bilgisi zorunlu'],
      enum: [1, 2, 3, 4]
    },
    thumbnailUrl: {
      type: String,
      trim: true,   // opsiyonel
    },
    pdfUrl: {
      type: String,
      trim: true,   // opsiyonel
    },
    youtubePlaylist: {
      type: String,
      trim: true,   // opsiyonel
    },
    gradingPolicy: {
      type: String,
      trim: true,   // opsiyonel
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
