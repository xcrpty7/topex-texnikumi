const Faq = require('../models/Faq');
const { sendSuccess, sendError } = require('../utils/response');

const getFaqs = async (req, res) => {
  try {
    const items = await Faq.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    return sendSuccess(res, { data: items });
  } catch (e) {
    return sendError(res, e.message, 500);
    }
};

const getAdminFaqs = async (req, res) => {
  try {
    const items = await Faq.find().sort({ order: 1, createdAt: 1 });
    return sendSuccess(res, { data: items });
  } catch (e) {
    return sendError(res, e.message, 500);
    }
};

const createFaq = async (req, res) => {
  try {
    const { question, answer, order } = req.body;
    const item = await Faq.create({ question, answer, order: order || 0 });
    return sendSuccess(res, { data: item }, "FAQ qo'shildi", 201);
  } catch (e) {
    return sendError(res, e.message, 500);
    }
};

const updateFaq = async (req, res) => {
  try {
    const { question, answer, order, isActive } = req.body;
    const update = {};
    if (question !== undefined) update.question = question;
    if (answer !== undefined) update.answer = answer;
    if (order !== undefined) update.order = order;
    if (isActive !== undefined) update.isActive = isActive;
    const item = await Faq.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!item) return sendError(res, 'Topilmadi', 404);
    return sendSuccess(res, { data: item }, 'Yangilandi');
  } catch (e) {
    return sendError(res, e.message, 500);
    }
};

const deleteFaq = async (req, res) => {
  try {
    const item = await Faq.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 'Topilmadi', 404);
    return sendSuccess(res, { data: null }, "O'chirildi");
  } catch (e) {
    return sendError(res, e.message, 500);
    }
};

module.exports = { getFaqs, getAdminFaqs, createFaq, updateFaq, deleteFaq };
