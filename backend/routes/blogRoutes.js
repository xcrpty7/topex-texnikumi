const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, restrictTo } = require('../middleware/auth');
const { uploadPost, handleMulterError } = require('../middleware/upload');
const {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleArticlePublish,
} = require('../controllers/blogController');

router.get('/', getArticles);
router.get('/:slug', getArticleBySlug);

router.post(
  '/',
  protect,
  restrictTo('ADMIN', 'SUPER_ADMIN'),
  uploadPost.single('image'),
  handleMulterError,
  [body('title').notEmpty().withMessage('Maqola sarlavhasi kiritilishi shart')],
  validate,
  createArticle
);

router.put(
  '/:id',
  protect,
  restrictTo('ADMIN', 'SUPER_ADMIN'),
  uploadPost.single('image'),
  handleMulterError,
  [body('title').optional().notEmpty().withMessage('Maqola sarlavhasi bo\'sh bo\'lishi mumkin emas')],
  validate,
  updateArticle
);

router.delete('/:id', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), deleteArticle);
router.patch('/:id/publish', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), toggleArticlePublish);

module.exports = router;
