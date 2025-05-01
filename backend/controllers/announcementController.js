// backend/controllers/announcementController.js

const Announcement = require('../models/Announcement');

// ➕ Yeni duyuru oluştur (sadece admin)
exports.createAnnouncement = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const newAnn = new Announcement({
      title,
      content,
      createdBy: req.user._id
    });

    const saved = await newAnn.save();
    res.status(201).json({ success: true, announcement: saved });
  } catch (err) {
    next(err);
  }
};

// 📥 Tüm duyuruları getir (herkes için)
exports.getAnnouncements = async (req, res, next) => {
  try {
    const list = await Announcement.find({ isDeleted: false }).sort({ createdAt: -1 }).populate('createdBy', 'username');
    res.json({ success: true, announcements: list });
  } catch (err) {
    next(err);
  }
};

// 📝 Duyuru güncelle (sadece admin)
exports.updateAnnouncement = async (req, res, next) => {
  try {
    const updated = await Announcement.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Duyuru bulunamadı' });

    res.json({ success: true, announcement: updated });
  } catch (err) {
    next(err);
  }
};

// ❌ Soft delete duyuru (sadece admin)
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const ann = await Announcement.findById(req.params.id);
    if (!ann) return res.status(404).json({ message: 'Duyuru bulunamadı' });

    ann.isDeleted = true;
    await ann.save();

    res.json({ success: true, message: 'Duyuru silindi' });
  } catch (err) {
    next(err);
  }
};
