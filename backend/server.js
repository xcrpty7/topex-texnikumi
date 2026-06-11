require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const blogRoutes = require('./routes/blogRoutes');
const adminRoutes = require('./routes/adminRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const { getGallery } = require('./controllers/galleryController');
const { getTestimonials } = require('./controllers/testimonialController');
const { getFaqs } = require('./controllers/faqController');
const { getScholarships } = require('./controllers/scholarshipController');
const { getSettings } = require('./controllers/settingsController');
const { getHomeVideos } = require('./controllers/homeVideoController');
const { getTeachers } = require('./controllers/teacherController');
const { getDirections } = require('./controllers/directionController');

const app = express();

// ─── Ma'lumotlar bazasiga ulanish ───────────────────────────────────────────
connectDB();

// ─── Xavfsizlik middleware'lari ──────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(mongoSanitize());

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const isDev = process.env.NODE_ENV === 'development';

const globalLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  skip: () => isDev,
  message: { success: false, message: 'Juda ko\'p so\'rov. 15 daqiqadan keyin qayta urinib ko\'ring' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skip: () => isDev,
  message: { success: false, message: 'Juda ko\'p kirish urinishi. 15 daqiqadan keyin qayta urinib ko\'ring' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimit);

// ─── Umumiy middleware'lar ────────────────────────────────────────────────────
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Statik fayllar ───────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API yo'llari ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/applications', applicationRoutes);

// Public ma'lumot yo'llari
app.get('/api/gallery', getGallery);
app.get('/api/testimonials', getTestimonials);
app.get('/api/faq', getFaqs);
app.get('/api/scholarships', getScholarships);
app.get('/api/settings', getSettings);
app.get('/api/home-videos', getHomeVideos);
app.get('/api/teachers', getTeachers);
app.get('/api/directions', getDirections);

// ─── Sog'lik tekshiruvi ───────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'TOPEX Backend API ishlayapti',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ─── Xatolik boshqaruvchilari ─────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Serverni ishga tushirish ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log('');
  console.log('═'.repeat(50));
  console.log('  TOPEX Backend API');
  console.log('═'.repeat(50));
  console.log(`  Muhit:   ${process.env.NODE_ENV}`);
  console.log(`  Port:    ${PORT}`);
  console.log(`  URL:     http://localhost:${PORT}`);
  console.log(`  API:     http://localhost:${PORT}/api`);
  console.log('═'.repeat(50));
  console.log('');
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Boshqarilmagan xato:', err.message);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server yopildi');
    process.exit(0);
  });
});
