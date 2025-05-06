// backend/controllers/announcementController.js

const Announcement = require('../models/Announcement');

// 📥 Herkes görebilsin
exports.getAnnouncements = async (req, res, next) => {
  try {
    const list = await Announcement.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username');
    res.json({ success: true, announcements: list });
  } catch (err) {
    next(err);
  }
};

// ➕ Sadece admin oluşturabilsin
exports.createAnnouncement = async (req, res, next) => {
  try {
    const newAnn = new Announcement({
      title: req.body.title,
      content: req.body.content,
      createdBy: req.user._id,
    });
    const saved = await newAnn.save();
    res.status(201).json({ success: true, announcement: saved });
  } catch (err) {
    next(err);
  }
};

// 📝 Sadece admin güncelleyebilsin
exports.updateAnnouncement = async (req, res, next) => {
  try {
    const updated = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, content: req.body.content },
      { new: true }
    );
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: 'Duyuru bulunamadı' });
    res.json({ success: true, announcement: updated });
  } catch (err) {
    next(err);
  }
};

// ❌ Sadece admin soft-delete
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const ann = await Announcement.findById(req.params.id);
    if (!ann)
      return res
        .status(404)
        .json({ success: false, message: 'Duyuru bulunamadı' });
    ann.isDeleted = true;
    await ann.save();
    res.json({ success: true, message: 'Duyuru silindi' });
  } catch (err) {
    next(err);
  }
};
