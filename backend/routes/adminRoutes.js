const express = require('express');
const router = express.Router();
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
const { getAdminDirections, createDirection, updateDirection, deleteDirection } = require('../controllers/directionController');

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
router.post('/testimonials', ...adminOnly, uploadTestimonial.single('avatar'), handleMulterError, createTestimonial);
router.put('/testimonials/:id', ...adminOnly, uploadTestimonial.single('avatar'), handleMulterError, updateTestimonial);
router.delete('/testimonials/:id', ...adminOnly, deleteTestimonial);

// FAQ
router.get('/faq', ...adminOnly, getAdminFaqs);
router.post('/faq', ...adminOnly, createFaq);
router.put('/faq/:id', ...adminOnly, updateFaq);
router.delete('/faq/:id', ...adminOnly, deleteFaq);

// Grantlar
router.get('/scholarships', ...adminOnly, getAdminScholarships);
router.post('/scholarships', ...adminOnly, createScholarship);
router.put('/scholarships/:id', ...adminOnly, updateScholarship);
router.delete('/scholarships/:id', ...adminOnly, deleteScholarship);

// Sayt sozlamalari
router.get('/settings', ...adminOnly, getSettings);
router.put('/settings', ...adminOnly, updateSettings);
router.post('/settings/upload-image', ...adminOnly, uploadGallery.single('image'), handleMulterError, uploadSettingsImage);

// Bosh sahifa videolari
router.get('/home-videos', ...adminOnly, getAdminHomeVideos);
router.post('/home-videos', ...adminOnly, uploadVideo.single('video'), handleMulterError, createHomeVideo);
router.put('/home-videos/:id', ...adminOnly, uploadVideo.single('video'), handleMulterError, updateHomeVideo);
router.delete('/home-videos/:id', ...adminOnly, deleteHomeVideo);

// O'qituvchilar
router.get('/teachers', ...adminOnly, getAdminTeachers);
router.post('/teachers', ...adminOnly, uploadTeacher.single('image'), handleMulterError, createTeacher);
router.put('/teachers/:id', ...adminOnly, uploadTeacher.single('image'), handleMulterError, updateTeacher);
router.delete('/teachers/:id', ...adminOnly, deleteTeacher);

// Yo'nalishlar
router.get('/directions', ...adminOnly, getAdminDirections);
router.post('/directions', ...adminOnly, createDirection);
router.put('/directions/:id', ...adminOnly, updateDirection);
router.delete('/directions/:id', ...adminOnly, deleteDirection);

module.exports = router;
