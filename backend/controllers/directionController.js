const Direction = require('../models/Direction');
const { sendSuccess, sendError } = require('../utils/response');

const getDirections = async (req, res) => {
  try {
    const list = await Direction.find({ active: true }).sort({ order: 1, createdAt: -1 });
    return sendSuccess(res, { data: list }, "Yo'nalishlar");
  } catch (e) { return sendError(res, e.message, 500); }
};

const getAdminDirections = async (req, res) => {
  try {
    const list = await Direction.find().sort({ order: 1, createdAt: -1 });
    return sendSuccess(res, { data: list }, "Yo'nalishlar (Admin)");
  } catch (e) { return sendError(res, e.message, 500); }
};

const createDirection = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.active !== undefined) data.active = data.active === 'true' || data.active === true;
    const d = await Direction.create(data);
    return sendSuccess(res, { data: d }, "Yo'nalish qo'shildi", 201);
  } catch (e) { return sendError(res, e.message, 500); }
};

const updateDirection = async (req, res) => {
  try {
    const d = await Direction.findById(req.params.id);
    if (!d) return sendError(res, 'Topilmadi', 404);
    const updates = { ...req.body };
    if (updates.active !== undefined) updates.active = updates.active === 'true' || updates.active === true;
    Object.assign(d, updates);
    await d.save();
    return sendSuccess(res, { data: d }, 'Yangilandi');
  } catch (e) { return sendError(res, e.message, 500); }
};

const deleteDirection = async (req, res) => {
  try {
    const d = await Direction.findByIdAndDelete(req.params.id);
    if (!d) return sendError(res, 'Topilmadi', 404);
    return sendSuccess(res, { data: null }, "O'chirildi");
  } catch (e) { return sendError(res, e.message, 500); }
};

module.exports = { getDirections, getAdminDirections, createDirection, updateDirection, deleteDirection };
