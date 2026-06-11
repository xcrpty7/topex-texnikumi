const Article = require('../models/Article');
const paginate = require('../utils/paginate');
const { sendSuccess, sendError, sendPaginated } = require('../utils/response');

const getArticles = async (req, res) => {
  try {
    const { page = 1, limit = 9, category, search } = req.query;

    const query = { isPublished: true };
    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const { data, meta } = await paginate(Article, query, {
      page,
      limit,
      sort: { publishedAt: -1 },
      populate: { path: 'author', select: 'name avatar' },
    });

    return sendPaginated(res, data, meta, 'Maqolalar ro\'yxati');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug, isPublished: true }).populate(
      'author',
      'name avatar'
    );

    if (!article) return sendError(res, 'Maqola topilmadi', 404);

    await Article.findByIdAndUpdate(article._id, { $inc: { views: 1 } });

    return sendSuccess(res, { article }, 'Maqola ma\'lumotlari');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const normalizeArticleData = (body) => {
  const data = { ...body };
  if (typeof data.tags === 'string') {
    data.tags = data.tags.split(',').map((t) => t.trim()).filter(Boolean);
  }
  if (data.isPublished !== undefined) {
    data.isPublished = data.isPublished === 'true' || data.isPublished === true;
  }
  return data;
};

const createArticle = async (req, res) => {
  try {
    const data = { ...normalizeArticleData(req.body), author: req.user._id };
    if (req.file) data.image = `/uploads/posts/${req.file.filename}`;
    if (data.isPublished) data.publishedAt = new Date();

    const article = await Article.create(data);
    await article.populate('author', 'name avatar');

    return sendSuccess(res, { article }, 'Maqola yaratildi', 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const updateArticle = async (req, res) => {
  try {
    const updates = normalizeArticleData(req.body);
    if (req.file) updates.image = `/uploads/posts/${req.file.filename}`;

    const article = await Article.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('author', 'name avatar');

    if (!article) return sendError(res, 'Maqola topilmadi', 404);

    return sendSuccess(res, { article }, 'Maqola yangilandi');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return sendError(res, 'Maqola topilmadi', 404);

    return sendSuccess(res, {}, 'Maqola o\'chirildi');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const toggleArticlePublish = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return sendError(res, 'Maqola topilmadi', 404);

    article.isPublished = !article.isPublished;
    if (article.isPublished && !article.publishedAt) {
      article.publishedAt = new Date();
    }
    await article.save();

    const status = article.isPublished ? 'chop etildi' : 'qoralama holatiga o\'tkazildi';
    return sendSuccess(res, { article }, `Maqola ${status}`);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleArticlePublish,
};
