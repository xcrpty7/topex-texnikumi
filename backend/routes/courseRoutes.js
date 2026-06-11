const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, restrictTo, optionalAuth } = require('../middleware/auth');
const { uploadImage, handleMulterError } = require('../middleware/upload');
const {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  toggleCourseStatus,
} = require('../controllers/courseController');

router.get('/', getCourses);
router.get('/:slug', optionalAuth, getCourseBySlug);

router.post(
  '/',
  protect,
  restrictTo('ADMIN', 'SUPER_ADMIN'),
  uploadImage.single('image'),
  handleMulterError,
  [body('title').notEmpty().withMessage('Kurs nomi kiritilishi shart')],
  validate,
  createCourse
);

router.put(
  '/:id',
  protect,
  restrictTo('ADMIN', 'SUPER_ADMIN'),
  uploadImage.single('image'),
  handleMulterError,
  updateCourse
);

router.delete('/:id', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), deleteCourse);
router.patch('/:id/publish', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), toggleCourseStatus);
router.post('/:id/enroll', protect, enrollCourse);

module.exports = router;
