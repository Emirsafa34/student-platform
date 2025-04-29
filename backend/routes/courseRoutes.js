const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Herkes görebilir
router.get('/', courseController.getCourses);

// Sadece admin ekleyebilir, güncelleyebilir, silebilir
router.post('/', protect, adminOnly, courseController.createCourse);
router.put('/:id', protect, adminOnly, courseController.updateCourse);
router.delete('/:id', protect, adminOnly, courseController.deleteCourse);

module.exports = router;
