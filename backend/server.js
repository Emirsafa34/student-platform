// backend/server.js

const express  = require('express');
const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const cors     = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Controller / route dosyalarını yükle
 const userRoutes   = require('./routes/userRoutes');
 const authRoutes   = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const qaRoutes     = require('./routes/qaRoutes');

const { errorHandler } = require('./middleware/errorMiddleware');

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB bağlantısı başarılı'))
  .catch((err) => {
    console.error('❌ MongoDB bağlantı hatası:', err.message);
    process.exit(1);
  });

// 🚀 4. Adım: Route’ları mount et
app.use('/api/auth',  authRoutes);    // register & login
app.use('/api/users', userRoutes);    // profile ve user-CRUD
app.use('/api/courses', courseRoutes);
app.use('/api/qas',     qaRoutes);

// Temel route
app.get('/', (req, res) => {
  res.send('🎯 API çalışıyor');
});

// Hata yakalama middleware’i (EN SONA)
app.use(errorHandler);

// Sunucu başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`));
