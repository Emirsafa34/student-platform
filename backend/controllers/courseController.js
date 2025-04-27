// backend/controllers/courseController.js

const Course = require('../models/Course');

// Yeni ders ekle (sadece admin)
exports.createCourse = async (req, res, next) => {
  try {
    const newCourse = new Course({
      ...req.body,
      createdBy: req.user._id,
    });

    const savedCourse = await newCourse.save();
    res.status(201).json({ success: true, course: savedCourse });
  } catch (err) {
    next(err);
  }
};

// Tüm dersleri getir (aktif olanlar)
exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ isDeleted: false });
    res.status(200).json({ success: true, courses });
  } catch (err) {
    next(err);
  }
};

// Ders güncelle (sadece admin)
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Ders bulunamadı.' });
    }

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({ success: true, course: updated });
  } catch (err) {
    next(err);
  }
};

// Ders sil (soft delete - sadece admin)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Ders bulunamadı.' });
    }

    await Course.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.status(200).json({ success: true, message: 'Ders başarıyla silindi (soft delete).' });
  } catch (err) {
    next(err);
  }
};
