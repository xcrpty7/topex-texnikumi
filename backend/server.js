require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
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
const { getVideos } = require('./controllers/videoController');

const app = express();

// ─── Ma'lumotlar bazasiga ulanish ───────────────────────────────────────────
connectDB();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://topex-texnikumi.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
].filter(Boolean);

// ─── Xavfsizlik middleware'lari ──────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'", ...allowedOrigins.filter(Boolean)],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

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
app.use(hpp({ whitelist: [] }));

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

// Prototype pollution — maksimal nesting 10 daraja
const MAX_DEPTH = 10;
const checkDepth = (obj, depth = 0) => {
  if (depth > MAX_DEPTH) throw new Error('Object too nested');
  if (obj === null || typeof obj !== 'object') return;
  for (const v of Object.values(obj)) {
    if (typeof v === 'object') checkDepth(v, depth + 1);
  }
};
app.use((req, res, next) => {
  try {
    if (req.body && typeof req.body === 'object') checkDepth(req.body);
    next();
  } catch {
    return res.status(400).json({ success: false, message: 'Noto\'g\'ri ma\'lumot formati' });
  }
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Statik fayllar ───────────────────────────────────────────────────────────
const PLACEHOLDER_SVG = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">' +
  '<rect width="800" height="600" fill="#1e1e2e"/>' +
  '<text x="400" y="300" text-anchor="middle" fill="#6c7086" font-size="20">Rasm mavjud emas</text>' +
  '</svg>'
);
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')), (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Content-Length', PLACEHOLDER_SVG.length);
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).end(PLACEHOLDER_SVG);
});

// ─── Google OAuth (Passport) ──────────────────────────────────────────────────
const { passport, CLIENT_URL: GOOGLE_CLIENT_URL } = require('./config/passport');
app.use(passport.initialize());

const jwt = require('jsonwebtoken');
const signAccessToken = (user) =>
  jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' }
  );

app.get(
  '/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${GOOGLE_CLIENT_URL}/login?error=google_failed` }),
  (req, res) => {
    if (!req.user) return res.redirect(`${GOOGLE_CLIENT_URL}/login?error=no_user`);
    const token = signAccessToken(req.user);
    res.redirect(`${GOOGLE_CLIENT_URL}/login?google=${encodeURIComponent(token)}`);
  }
);

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
app.get('/api/videos', getVideos);

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

server.timeout = 30000; // 30 sek — slow-loris DoS dan himoya

// Auto-seed (faqat bo'sh DB ga yozadi)
require('./utils/seed')().catch(() => {});

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
