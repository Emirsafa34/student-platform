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
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');
app.use(cors({ origin: allowedOrigins, credentials: true }));

// JSON parsing
app.use(express.json());

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route tanımları
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/qas', require('./routes/qaRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));

app.get('/healthz', (req, res) => res.status(200).json({ status: 'ok' }));
app.get('/',       (req, res) => res.send('🎯 API çalışıyor'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint bulunamadı' });
});

// Error handling middleware
app.use(require('./middleware/errorMiddleware').errorHandler);

// MongoDB bağlantısı ve sunucuyu başlatma
if (require.main === module) {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('⚠️ MONGO_URI tanımlı değil!');
    process.exit(1);
  }

  // Debug log: URI’nin ne geldiğini göreceğiz
  console.log('🔍 DEBUG MONGO_URI:', uri.slice(0, 50));

  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('✅ MongoDB bağlantısı başarılı');
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () =>
        console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`)
      );
    })
    .catch(err => {
      console.error('❌ MongoDB bağlantı hatası:', err.message);
      process.exit(1);
    });
}

module.exports = app;
