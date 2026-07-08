const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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

const teacherSeedList = [
  { name: 'ABDURASULOV KOZIMJON',   image: '/assets/Ustozlar/DSC03820.jpg', role: "Kimyo o'qituvchisi",      order: 1, active: true },
  { name: "SHARIPOVA MA'MURA",      image: '/assets/Ustozlar/DSC03830.jpg', role: "Ona tili/adabiyot o'qituvchisi", order: 2, active: true },
  { name: 'SHOVQIYEVA LAYLO',       image: '/assets/Ustozlar/DSC03842.jpg', role: "Ingliz tili o'qituvchisi", order: 3, active: true },
  { name: 'DONIYOROVA SHAHNOZA',    image: '/assets/Ustozlar/DSC03856.jpg', role: "Ingliz tili o'qituvchisi", order: 4, active: true },
  { name: 'IBRAGIMOVA KAMILA',      image: '/assets/Ustozlar/DSC03861.jpg', role: "Matematika o'qituvchisi",  order: 5, active: true },
  { name: 'MUKIMBOEV FIRDAVS',      image: '/assets/Ustozlar/DSC03872.jpg', role: "Matematika o'qituvchisi",  order: 6, active: true },
  { name: 'AYTBAYEVA SARBINAZ',     image: '/assets/Ustozlar/DSC03883.jpg', role: "Biologiya o'qituvchisi",   order: 7, active: true },
  { name: 'SULTONALIYEV SHOXRUH',   image: '/assets/Ustozlar/DSC03894.jpg', role: "Biologiya o'qituvchisi",   order: 8, active: true },
  { name: 'VALIYEV JAMSHIDBEK',     image: '/assets/Ustozlar/DSC03901.jpg', role: "Ingliz tili o'qituvchisi", order: 9, active: true },
  { name: 'BEKOVA OYSARA',          image: '/assets/Ustozlar/DSC03904.jpg', role: 'Bosh direktor',            order: 10, active: true },
  { name: 'ESHONQULOVA MUNISA',     image: '/assets/Ustozlar/DSC03943.jpg', role: 'Administrator',           order: 11, active: true },
  { name: 'ABDUJALILOV BUNYODBEK',  image: '/assets/Ustozlar/DSC03944.jpg', role: "Moliyaviy tashkiliy",     order: 12, active: true },
  { name: 'KARIMOV ISLOM',          image: '/assets/Ustozlar/DSC03951.jpg', role: 'Administrator',           order: 13, active: true },
];

router.post('/seed-teachers', ...adminOnly, async (req, res) => {
  try {
    const count = await Teacher.countDocuments();
    if (count > 0) return res.json({ success: true, message: `O'qituvchilar allaqachon mavjud: ${count} ta` });
    for (const d of teacherSeedList) await Teacher.create(d);
    res.json({ success: true, message: `${teacherSeedList.length} ta o'qituvchi qo'shildi` });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/reset-teachers', ...adminOnly, async (req, res) => {
  try {
    await Teacher.deleteMany({});
    for (const d of teacherSeedList) await Teacher.create(d);
    res.json({ success: true, message: `${teacherSeedList.length} ta o'qituvchi qayta yozildi` });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Eski email_1 unique index-ni tashlash (regstratsiya ishlashi uchun)
router.post('/drop-email-index', ...adminOnly, async (req, res) => {
  try {
    await mongoose.connection.collection('users').dropIndex('email_1');
    res.json({ success: true, message: 'email_1 indeksi o\'chirildi' });
  } catch (e) {
    if (e.code === 27) return res.json({ success: true, message: 'email_1 indeksi mavjud emas' });
    res.status(500).json({ success: false, message: e.message });
  }
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
      { name: 'Dasturlash',                    desc: 'Kod yozishdan tortib, murakkab tizimlar yaratishgacha.',              img: '/assets/images/dir-1.jpg',    icon: 'Code',        duration: '3 yil', features: ['Frontend & Backend', 'Mobil ilovalar', 'Portfolio yaratish'],              order: 1, active: true },
      { name: 'Marketing va agrobiznes',       desc: "Raqamli marketing va qishloq xo'jaligi iqtisodiyoti.",                img: '/assets/images/dir-4.jpg',    icon: 'TrendingUp',  duration: '3 yil', features: ['SMM & Brending', 'Bozor tahlili', 'Eksport-import'],                order: 2, active: true },
      { name: 'Kompyuter grafikasi va dizayn', desc: '3D modellashtirish, brending va vizual kontent.',                      img: '/assets/images/dir-2.jpg',    icon: 'Palette',     duration: '3 yil', features: ['Adobe Photoshop/Illustrator', '3D Blender', 'Motion dizayn'],        order: 3, active: true },
      { name: 'Bank ishi',                     desc: 'Bank va moliya tizimi asoslari.',                                     img: '/assets/images/dir-9.jpg',    icon: 'ShieldCheck', duration: '3 yil', features: ['Kredit tahlili', 'Xavfsizlik tizimlari', 'Bank auditi'],           order: 4, active: true },
      { name: 'Mehmonxona boshqaruvi',         desc: "Mehmonxona va turizm menejmenti.",                                   img: '/assets/images/dir-10.jpg',   icon: 'Hotel',       duration: '3 yil', features: ['Service Management', 'Event planning', 'Xorijiy tillar'],            order: 5, active: true },
      { name: 'Raqamli axborotlar analitigi',  desc: 'Raqamli ma\'lumotlar tahlili va boshqaruvi.',                         img: '/assets/images/DSC03700.jpg', icon: 'BarChart3',   duration: '3 yil', features: ['Ma\'lumotlar tahlili', 'Axborot tizimlari', 'Raqamli texnologiyalar'], order: 6, active: true },
      { name: 'Laborant analitik',             desc: 'Laboratoriya tahlillari va ilmiy tadqiqotlar.',                        img: '/assets/images/dir-5.jpg',    icon: 'FlaskConical',duration: '3 yil', features: ['Kimyoviy tahlil', 'Sanoat laboratoriyasi', 'Sifat nazorati'],          order: 7, active: true },
      { name: "Dorivor o'simliklar laboranti", desc: "Dorivor o'simliklar yetishtirish va qayta ishlash.",                  img: '/assets/images/dir-6.jpg',    icon: 'Sprout',      duration: '3 yil', features: ['Botanika', 'Dori tayyorlash', 'Fitoterapiya'],                       order: 8, active: true },
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
