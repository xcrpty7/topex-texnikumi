const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { uploadAvatar, handleMulterError } = require('../middleware/upload');

const isDev = process.env.NODE_ENV === 'development';
const loginLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skip: () => isDev,
  message: { success: false, message: 'Juda ko\'p kirish urinishi. 15 daqiqadan keyin qayta urinib ko\'ring' },
  standardHeaders: true,
  legacyHeaders: false,
});
const {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');

router.post(
  '/register',
  loginLimit,
  [
    body('name').trim().notEmpty().withMessage('Ism kiritilishi shart'),
    body('email').isEmail().withMessage('Email noto\'g\'ri formatda'),
    body('password').isLength({ min: 6 }).withMessage('Parol kamida 6 ta belgi bo\'lishi kerak'),
  ],
  validate,
  register
);

router.post(
  '/login',
  loginLimit,
  [
    body('email').isEmail().withMessage('Email noto\'g\'ri formatda'),
    body('password').notEmpty().withMessage('Parol kiritilishi shart'),
  ],
  validate,
  login
);

router.post('/logout', protect, logout);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);

router.put('/profile', protect, uploadAvatar.single('avatar'), handleMulterError, updateProfile);

router.put(
  '/change-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Joriy parol kiritilishi shart'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('Yangi parol kamida 6 ta belgi bo\'lishi kerak'),
  ],
  validate,
  changePassword
);

module.exports = router;
