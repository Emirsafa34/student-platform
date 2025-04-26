// server.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import qaRoutes from './routes/qaRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB bağlantısı başarılı'))
.catch((err) => {
  console.error('❌ MongoDB bağlantı hatası:', err.message);
  process.exit(1);
});

// API rotaları
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/qas', qaRoutes);

// Temel route
app.get('/', (req, res) => {
  res.send('🎯 API çalışıyor');
});

// Sunucu başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`));
