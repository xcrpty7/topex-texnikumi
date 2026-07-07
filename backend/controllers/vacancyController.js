const Vacancy = require('../models/Vacancy');
const { sendSuccess, sendError } = require('../utils/response');
const paginate = require('../utils/paginate');

exports.getVacancies = async (req, res) => {
  try {
    const { page, limit, search, isActive } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    const result = await paginate(Vacancy, filter, { page, limit, sort: { order: 1, createdAt: -1 } });
    return sendSuccess(res, result.data, 'OK', 200, { page: result.page, pages: result.pages, total: result.total });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

exports.getActive = async (req, res) => {
  try {
    const items = await Vacancy.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return sendSuccess(res, items);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

exports.getVacancy = async (req, res) => {
  try {
    const item = await Vacancy.findById(req.params.id);
    if (!item) return sendError(res, 'Vakansiya topilmadi', 404);
    return sendSuccess(res, item);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

exports.createVacancy = async (req, res) => {
  try {
    const item = await Vacancy.create(req.body);
    return sendSuccess(res, item, 'Vakansiya yaratildi', 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

exports.updateVacancy = async (req, res) => {
  try {
    const item = await Vacancy.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return sendError(res, 'Vakansiya topilmadi', 404);
    return sendSuccess(res, item, 'Vakansiya yangilandi');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

exports.deleteVacancy = async (req, res) => {
  try {
    const item = await Vacancy.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 'Vakansiya topilmadi', 404);
    return sendSuccess(res, null, 'Vakansiya o\'chirildi');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
