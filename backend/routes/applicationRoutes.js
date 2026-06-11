const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { createApplication } = require('../controllers/applicationController');

router.post(
  '/',
  [
    body('fullName').trim().notEmpty().withMessage('To\'liq ism kiritilishi shart'),
    body('phone').trim().notEmpty().withMessage('Telefon raqami kiritilishi shart'),
    body('grade').isIn(['9', '11']).withMessage('Sinf 9 yoki 11 bo\'lishi kerak'),
  ],
  validate,
  createApplication
);

module.exports = router;
