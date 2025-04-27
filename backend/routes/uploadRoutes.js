// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');

// Çoklu dosya için: upload.array('files', 5)
router.post('/upload', uploadFile);

module.exports = router;

// server.js (güncelleme)
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/files', uploadRoutes);

// uploads/ dizinini servis et
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/*
--- S3 ENTEGRASYONU (Opsiyonel) ---
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

const s3Storage = multerS3({
  s3,
  bucket: process.env.S3_BUCKET_NAME,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  acl: 'public-read',
  key: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `uploads/${base}-${Date.now()}${ext}`);
  }
});

const uploadS3 = multer({ storage: s3Storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });
exports.uploadToS3 = (req, res, next) => {
  uploadS3.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    res.status(201).json({ fileUrl: req.file.location });
  });
};
*/
