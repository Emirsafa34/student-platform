// backend/controllers/uploadController.js
const multer = require('multer');
const path = require('path');
const sanitize = require('sanitize-filename');
const { v4: uuidv4 } = require('uuid');

// --- LOCAL STORAGE SETUP ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Mutlak yol kullanarak path traversal önlenir
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // Orijinal isim sanitize edilir
    const base = sanitize(path.basename(file.originalname, ext));
    // UUID ile çakışma önlenir
    const filename = `${base}-${uuidv4()}${ext}`;
    cb(null, filename);
  }
});

// İzin verilen MIME tipleri
const allowedMimeTypes = [
  'image/png',
  'image/jpeg',
  'application/pdf'
];

// Dosya filtresi: extension ve MIME ikili kontrol
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedMimeTypes.includes(file.mimetype) && ['.png', '.jpg', '.jpeg', '.pdf'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only images (png/jpg/jpeg) and PDFs are allowed'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

// Single file upload handler
exports.uploadFile = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (err) {
      return res.status(400).json({ success: false, message: 'Dosya yükleme hatası' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Dosya bulunamadı' });
    }
    // Başarılı yükleme
    res.status(201).json({ success: true, fileUrl: `/uploads/${req.file.filename}` });
  });
};
