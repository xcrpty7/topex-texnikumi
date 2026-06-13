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
    const list = [
      { name: "G'AYRAT SHOUMAROV",               image: '/assets/Ustozlar/DSC01143.webp',      order: 1, active: true },
      { name: 'OLGERD FILLIPOV',                 image: '/assets/Ustozlar/DSC01155.webp',      order: 2, active: true },
      { name: 'RUSTAM KARIMOV',                  image: '/assets/Ustozlar/DSC01164.webp',      order: 3, active: true },
      { name: 'DILSHOD AZIZOV',                  image: '/assets/Ustozlar/DSC01187.webp',      order: 4, active: true },
      { name: 'AKMAL RAHIMOV',                   image: '/assets/Ustozlar/DSC01199.webp',      order: 5, active: true },
      { name: "NORBOYEV NE'MATBEK CHORIYEVICH",  image: '/assets/Ustozlar/teacher-new-1.webp', order: 6, active: true },
      { name: "KUBAYEV RO'ZIMUROD HIKMATILLAYEVICH", image: '/assets/Ustozlar/teacher-new-2.webp', order: 7, active: true },
      { name: 'BURTSEVA ALEKSANDRA VASILEVNA',   image: '/assets/Ustozlar/teacher-new-3.webp', order: 8, active: true },
      { name: 'ABDULLAYEV OYBEK ODILOVICH',      image: '/assets/Ustozlar/teacher-new-4.webp', order: 9, active: true },
      { name: 'ERKINOV JAVOHIRBEK JURABEKOVICH', image: '/assets/Ustozlar/teacher-new-5.webp', order: 10, active: true },
    ];
    for (const d of list) await Teacher.create(d);
    res.json({ success: true, message: `${list.length} ta o'qituvchi qo'shildi` });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Yo'nalishlar
router.get('/directions', ...adminOnly, getAdminDirections);
router.post('/directions', ...adminOnly, [
  body('name').notEmpty().withMessage('Yo\'nalish nomi kiritilishi shart'),
], validate, createDirection);
router.put('/directions/:id', ...adminOnly, updateDirection);
router.delete('/directions/:id', ...adminOnly, deleteDirection);

// Video galereya
router.get('/videos', ...adminOnly, getAdminVideos);
router.post('/videos', ...adminOnly, [
  body('title').notEmpty().withMessage('Video sarlavhasi kiritilishi shart'),
  body('url').notEmpty().withMessage('Video URL kiritilishi shart'),
], validate, createVideo);
router.put('/videos/:id', ...adminOnly, updateVideo);
router.delete('/videos/:id', ...adminOnly, deleteVideo);

module.exports = router;
