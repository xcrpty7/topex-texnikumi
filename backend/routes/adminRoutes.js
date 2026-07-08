const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, restrictTo } = require('../middleware/auth');
const { uploadGallery, uploadTestimonial, uploadVideo, uploadTeacher, handleMulterError } = require('../middleware/upload');

const {
  getDashboardStats, getUsers, getUserById, updateUser, deleteUser, toggleUserBlock,
  getApplications, updateApplicationStatus, deleteApplication,
  getAdminCourses, getAdminArticles,
} = require('../controllers/adminController');

const { getAdminGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { getAdminTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { getAdminFaqs, createFaq, updateFaq, deleteFaq } = require('../controllers/faqController');
const { getAdminScholarships, createScholarship, updateScholarship, deleteScholarship } = require('../controllers/scholarshipController');
const { getSettings, updateSettings, uploadSettingsImage } = require('../controllers/settingsController');
const { getAdminHomeVideos, createHomeVideo, updateHomeVideo, deleteHomeVideo } = require('../controllers/homeVideoController');
const { getAdminTeachers, createTeacher, updateTeacher, deleteTeacher } = require('../controllers/teacherController');
const Teacher = require('../models/Teacher');
const Direction = require('../models/Direction');
const { getAdminDirections, createDirection, updateDirection, deleteDirection } = require('../controllers/directionController');
const { getAdminVideos, createVideo, updateVideo, deleteVideo } = require('../controllers/videoController');

const adminOnly = [protect, restrictTo('ADMIN', 'SUPER_ADMIN')];

// Dashboard
router.get('/stats', ...adminOnly, getDashboardStats);

// Foydalanuvchilar
router.get('/users', ...adminOnly, getUsers);
router.get('/users/:id', ...adminOnly, getUserById);
router.put('/users/:id', ...adminOnly, updateUser);
router.delete('/users/:id', ...adminOnly, deleteUser);
router.patch('/users/:id/toggle-block', ...adminOnly, toggleUserBlock);

// Arizalar
router.get('/applications', ...adminOnly, getApplications);
router.put('/applications/:id', ...adminOnly, updateApplicationStatus);
router.delete('/applications/:id', ...adminOnly, deleteApplication);

// Kurslar (admin ko'rinishi)
router.get('/courses', ...adminOnly, getAdminCourses);

// Maqolalar (admin ko'rinishi)
router.get('/articles', ...adminOnly, getAdminArticles);

// Galereya
router.get('/gallery', ...adminOnly, getAdminGallery);
router.post('/gallery', ...adminOnly, uploadGallery.single('image'), handleMulterError, createGalleryItem);
router.put('/gallery/:id', ...adminOnly, uploadGallery.single('image'), handleMulterError, updateGalleryItem);
router.delete('/gallery/:id', ...adminOnly, deleteGalleryItem);

// Sharhlar (Testimonials)
router.get('/testimonials', ...adminOnly, getAdminTestimonials);
router.post('/testimonials', ...adminOnly, uploadTestimonial.single('avatar'), handleMulterError, [
  body('name').notEmpty().withMessage('Ism kiritilishi shart'),
], validate, createTestimonial);
router.put('/testimonials/:id', ...adminOnly, uploadTestimonial.single('avatar'), handleMulterError, updateTestimonial);
router.delete('/testimonials/:id', ...adminOnly, deleteTestimonial);

// FAQ
router.get('/faq', ...adminOnly, getAdminFaqs);
router.post('/faq', ...adminOnly, [
  body('question').notEmpty().withMessage('Savol kiritilishi shart'),
  body('answer').notEmpty().withMessage('Javob kiritilishi shart'),
], validate, createFaq);
router.put('/faq/:id', ...adminOnly, updateFaq);
router.delete('/faq/:id', ...adminOnly, deleteFaq);

// Grantlar
router.get('/scholarships', ...adminOnly, getAdminScholarships);
router.post('/scholarships', ...adminOnly, [
  body('title').notEmpty().withMessage('Grant nomi kiritilishi shart'),
], validate, createScholarship);
router.put('/scholarships/:id', ...adminOnly, updateScholarship);
router.delete('/scholarships/:id', ...adminOnly, deleteScholarship);

// Sayt sozlamalari
router.get('/settings', ...adminOnly, getSettings);
router.put('/settings', ...adminOnly, updateSettings);
router.post('/settings/upload-image', ...adminOnly, uploadGallery.single('image'), handleMulterError, uploadSettingsImage);

// Bosh sahifa videolari
router.get('/home-videos', ...adminOnly, getAdminHomeVideos);
router.post('/home-videos', ...adminOnly, uploadVideo.single('video'), handleMulterError, [
  body('title').notEmpty().withMessage('Video sarlavhasi kiritilishi shart'),
], validate, createHomeVideo);
router.put('/home-videos/:id', ...adminOnly, uploadVideo.single('video'), handleMulterError, updateHomeVideo);
router.delete('/home-videos/:id', ...adminOnly, deleteHomeVideo);

// O'qituvchilar
router.get('/teachers', ...adminOnly, getAdminTeachers);
router.post('/teachers', ...adminOnly, uploadTeacher.single('image'), handleMulterError, [
  body('name').notEmpty().withMessage('O\'qituvchi ismi kiritilishi shart'),
], validate, createTeacher);
router.put('/teachers/:id', ...adminOnly, uploadTeacher.single('image'), handleMulterError, updateTeacher);
router.delete('/teachers/:id', ...adminOnly, deleteTeacher);

// Bir martalik seed: admin panel uchun o'qituvchilarni bazaga yozish
router.post('/seed-teachers', ...adminOnly, async (req, res) => {
  try {
    const count = await Teacher.countDocuments();
    if (count > 0) return res.json({ success: true, message: `O'qituvchilar allaqachon mavjud: ${count} ta` });
    for (const d of teacherSeedList) await Teacher.create(d);
    res.json({ success: true, message: `${teacherSeedList.length} ta o'qituvchi qo'shildi` });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Reset teachers: delete all and re-seed
const teacherSeedList = [
  { name: "G'AYRAT SHOUMAROV",               image: '/assets/Ustozlar/DSC01143.webp',      role: 'Direktor', order: 1, active: true },
  { name: 'OLGERD FILLIPOV',                 image: '/assets/Ustozlar/DSC01155.webp',      role: "Dasturlash o'qituvchisi", order: 2, active: true },
  { name: 'RUSTAM KARIMOV',                  image: '/assets/Ustozlar/DSC01164.webp',      role: "Marketing o'qituvchisi", order: 3, active: true },
  { name: 'DILSHOD AZIZOV',                  image: '/assets/Ustozlar/DSC01187.webp',      role: "Grafik dizayn o'qituvchisi", order: 4, active: true },
  { name: 'AKMAL RAHIMOV',                   image: '/assets/Ustozlar/DSC01199.webp',      role: "Bank ishi o'qituvchisi", order: 5, active: true },
  { name: "NORBOYEV NE'MATBEK CHORIYEVICH",  image: '/assets/Ustozlar/teacher-new-1.webp', role: "Dasturlash o'qituvchisi", order: 6, active: true },
  { name: "KUBAYEV RO'ZIMUROD HIKMATILLAYEVICH", image: '/assets/Ustozlar/teacher-new-2.webp', role: "Marketing o'qituvchisi", order: 7, active: true },
  { name: 'BURTSEVA ALEKSANDRA VASILEVNA',   image: '/assets/Ustozlar/teacher-new-3.webp', role: "Chet tili o'qituvchisi", order: 8, active: true },
  { name: 'ABDULLAYEV OYBEK ODILOVICH',      image: '/assets/Ustozlar/teacher-new-4.webp', role: "Grafik dizayn o'qituvchisi", order: 9, active: true },
  { name: 'ERKINOV JAVOHIRBEK JURABEKOVICH', image: '/assets/Ustozlar/teacher-new-5.webp', role: "Bank ishi o'qituvchisi", order: 10, active: true },
];

router.post('/reset-teachers', ...adminOnly, async (req, res) => {
  try {
    await Teacher.deleteMany({});
    for (const d of teacherSeedList) await Teacher.create(d);
    res.json({ success: true, message: `${teacherSeedList.length} ta o'qituvchi qayta yozildi` });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Yo'nalishlar
router.get('/directions', ...adminOnly, getAdminDirections);
router.post('/directions', ...adminOnly, [
  body('name').notEmpty().withMessage('Yo\'nalish nomi kiritilishi shart'),
], validate, createDirection);
router.put('/directions/:id', ...adminOnly, updateDirection);
router.delete('/directions/:id', ...adminOnly, deleteDirection);

router.post('/seed-directions', ...adminOnly, async (req, res) => {
  try {
    const force = req.query.force === 'true' || req.body?.force === true;
    const count = await Direction.countDocuments();
    if (!force && count > 0) return res.json({ success: true, message: `Yo'nalishlar allaqachon mavjud: ${count} ta` });
    if (force && count > 0) await Direction.deleteMany({});
    const list = [
      { name: 'Dasturlash', desc: 'Zamonaviy dasturlash tillari va texnologiyalari', img: '/assets/images/DSC00827.webp', icon: 'Code', duration: '3 yil', features: ['Python, JavaScript, PHP', 'Web va mobil ilovalar', 'Real loyihalar bilan ishlash', 'Sertifikat olish imkoniyati'], order: 1, active: true },
      { name: 'Marketing va agrobiznes', desc: 'Raqamli marketing va qishloq xo\'jaligi iqtisodiyoti', img: '/assets/images/DSC00912.webp', icon: 'TrendingUp', duration: '3 yil', features: ['SMM, SEO, Google Ads', 'Agrobiznes strategiyalari', 'Analitika va hisobot', 'Amaliy loyihalar'], order: 2, active: true },
      { name: 'Kompyuter grafikasi va dizayn', desc: 'Vizual dizayn va kompyuter grafikasi', img: '/assets/images/DSC01093.webp', icon: 'Palette', duration: '3 yil', features: ['Photoshop, Illustrator, Figma', 'Logo va brending dizayn', 'UI/UX asoslari', 'Portfolio tayyorlash'], order: 3, active: true },
      { name: 'Bank ishi', desc: 'Bank va moliya tizimi asoslari', img: '/assets/famali-photo/DSC00875.webp', icon: 'ShieldCheck', duration: '3 yil', features: ['Bank operatsiyalari', 'Moliyaviy tahlil', 'Kredit va depozit turlari', 'Amaliy mashg\'ulotlar'], order: 4, active: true },
      { name: 'Mehmonxona boshqaruvi', desc: 'Mehmonxona va turizm menejmenti', img: '/assets/famali-photo/DSC00954.webp', icon: 'Hotel', duration: '3 yil', features: ['Mehmonxona boshqaruvi', 'Turizm marketingi', 'Mijozlar bilan ishlash', 'Amaliy mashg\'ulotlar'], order: 5, active: true },
      { name: 'Raqamli axborotlar analitigi', desc: 'Raqamli ma\'lumotlar tahlili va boshqaruvi', img: '/assets/famali-photo/DSC00955.webp', icon: 'BarChart3', duration: '3 yil', features: ['Ma\'lumotlar tahlili', 'Axborot tizimlari', 'Raqamli texnologiyalar', 'Amaliy loyihalar'], order: 6, active: true },
      { name: 'Laborant analitik', desc: 'Laboratoriya tahlillari va ilmiy tadqiqotlar', img: '/assets/famali-photo/DSC00964.webp', icon: 'FlaskConical', duration: '3 yil', features: ['Laboratoriya tahlillari', 'Ilmiy tadqiqotlar', 'Analitik usullar', 'Amaliy mashg\'ulotlar'], order: 7, active: true },
      { name: 'Dorivor o\'simliklar laboranti', desc: 'Dorivor o\'simliklar yetishtirish va qayta ishlash', img: '/assets/famali-photo/DSC00980.webp', icon: 'Sprout', duration: '3 yil', features: ['Dorivor o\'simliklar', 'Fitokimyo asoslari', 'Laboratoriya ishlari', 'Amaliy mashg\'ulotlar'], order: 8, active: true },
    ];
    for (const d of list) await Direction.create(d);
    res.json({ success: true, message: `${list.length} ta yo'nalish qo'shildi` });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Video galereya
router.get('/videos', ...adminOnly, getAdminVideos);
router.post('/videos', ...adminOnly, [
  body('title').notEmpty().withMessage('Video sarlavhasi kiritilishi shart'),
  body('url').notEmpty().withMessage('Video URL kiritilishi shart'),
], validate, createVideo);
router.put('/videos/:id', ...adminOnly, updateVideo);
router.delete('/videos/:id', ...adminOnly, deleteVideo);

// Vakansiyalar
const { getVacancies, createVacancy, updateVacancy, deleteVacancy } = require('../controllers/vacancyController');

router.get('/vacancies', ...adminOnly, getVacancies);
router.post('/vacancies', ...adminOnly, createVacancy);
router.put('/vacancies/:id', ...adminOnly, updateVacancy);
router.delete('/vacancies/:id', ...adminOnly, deleteVacancy);

module.exports = router;
