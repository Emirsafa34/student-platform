// backend/controllers/qaController.js

const QA = require('../models/QA');

// Yeni soru-cevap ekle (user & admin)
exports.createQA = async (req, res, next) => {
  try {
    const newQA = new QA({
      ...req.body,
      createdBy: req.user._id,
    });
    const savedQA = await newQA.save();
    res.status(201).json({ success: true, qa: savedQA });
  } catch (err) {
    next(err);
  }
};

// Tüm aktif soru-cevaplar
exports.getAllQA = async (req, res, next) => {
  try {
    const qaList = await QA.find({ isDeleted: false }).populate('course', 'title');
    res.status(200).json({ success: true, qaList });
  } catch (err) {
    next(err);
  }
};

// Güncelleme (sadece admin ya da oluşturan user)
exports.updateQA = async (req, res, next) => {
  try {
    const qa = await QA.findById(req.params.id);
    if (!qa) return res.status(404).json({ success: false, message: 'Bulunamadı' });

    if (req.user.role !== 'admin' && qa.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Yetkiniz yok' });
    }

    const updated = await QA.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, qa: updated });
  } catch (err) {
    next(err);
  }
};

// Soft delete (sadece admin veya soruyu oluşturan user)
exports.deleteQA = async (req, res, next) => {
  try {
    const qa = await QA.findById(req.params.id);
    if (!qa) {
      return res.status(404).json({ success: false, message: 'Soru bulunamadı.' });
    }

    // Sadece soruyu oluşturan veya admin silebilir
    if (qa.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Bu işlemi yapmaya yetkiniz yok.' });
    }

    qa.isDeleted = true;
    await qa.save();

    res.status(200).json({ success: true, message: 'Soru başarıyla silindi (soft delete).' });
  } catch (err) {
    next(err);
  }
};
