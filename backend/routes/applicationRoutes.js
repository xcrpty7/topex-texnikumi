const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const validate = require('../middleware/validate');
const { createApplication } = require('../controllers/applicationController');

const applicationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Ko\'p so\'rov yubordingiz. 15 daqiqadan so\'ng qayta urinib ko\'ring.' },
});

router.post(
  '/',
  applicationLimiter,
  [
    body('fullName').trim().notEmpty().withMessage('To\'liq ism kiritilishi shart'),
    body('phone').trim().notEmpty().withMessage('Telefon raqami kiritilishi shart'),
    body('grade').isIn(['9', '11']).withMessage('Sinf 9 yoki 11 bo\'lishi kerak'),
  ],
  validate,
  createApplication
);

module.exports = router;
