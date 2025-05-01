// backend/models/Announcement.js

const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Duyuru başlığı zorunludur'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Duyuru içeriği zorunludur'],
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
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model('Announcement', AnnouncementSchema);
