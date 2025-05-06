// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();

const app = express();

// Güvenlik başlıkları
app.use(helmet());

// İstek loglama
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('common'));
}

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// JSON parsing
app.use(express.json());

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Controller / route dosyaları
const userRoutes         = require('./routes/userRoutes');
const authRoutes         = require('./routes/authRoutes');
const courseRoutes       = require('./routes/courseRoutes');
const qaRoutes           = require('./routes/qaRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const { errorHandler }   = require('./middleware/errorMiddleware');

// MongoDB bağlantısı (ve log yalnızca ana modülde)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    if (require.main === module) {
      console.log('✅ MongoDB bağlantısı başarılı');
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB bağlantı hatası:', err.message);
    process.exit(1);
  });

// Route’ların mount edilmesi
app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/courses',       courseRoutes);
app.use('/api/qas',           qaRoutes);
app.use('/api/announcements', announcementRoutes);

// Health-check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Base route
app.get('/', (req, res) => {
  res.send('🎯 API çalışıyor');
});

// Hata yakalama middleware’i
app.use(errorHandler);

// Yalnızca doğrudan bu dosya çalıştırıldığında sunucuyu başlat
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
  });
}

module.exports = app;
