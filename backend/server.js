// backend/server.js

const express  = require('express');
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const cors     = require('cors');
const path     = require('path');
const helmet   = require('helmet');
const morgan   = require('morgan');

dotenv.config();

const app = express();

// Güvenlik başlıkları
app.use(helmet());

// İstek loglama (development modu için 'dev', prod’da daha ayrıntılı ya da farklı format kullanabilirsiniz)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('common'));
}

// CORS configuration using environment variable
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Controller / route files
const userRoutes         = require('./routes/userRoutes');
const authRoutes         = require('./routes/authRoutes');
const courseRoutes       = require('./routes/courseRoutes');
const qaRoutes           = require('./routes/qaRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

const { errorHandler } = require('./middleware/errorMiddleware');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB bağlantısı başarılı'))
  .catch((err) => {
    console.error('❌ MongoDB bağlantı hatası:', err.message);
    process.exit(1);
  });

// Mount routes
app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/courses',       courseRoutes);
app.use('/api/qas',           qaRoutes);
app.use('/api/announcements', announcementRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('🎯 API çalışıyor');
});

// Error handler (last middleware)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`));
