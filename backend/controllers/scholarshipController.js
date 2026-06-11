const Scholarship = require('../models/Scholarship');
const { sendSuccess, sendError } = require('../utils/response');

const getScholarships = async (req, res) => {
  try {
    const items = await Scholarship.find({ isActive: true }).sort({ order: 1 });
    return sendSuccess(res, { data: items });
  } catch (e) {
    return sendError(res, e.message);
  }
};

const getAdminScholarships = async (req, res) => {
  try {
    const items = await Scholarship.find().sort({ order: 1 });
    return sendSuccess(res, { data: items });
  } catch (e) {
    return sendError(res, e.message);
  }
};

const createScholarship = async (req, res) => {
  try {
    const { title, description, requirement, icon, color, order } = req.body;
    const item = await Scholarship.create({ title, description, requirement, icon, color, order: order || 0 });
    return sendSuccess(res, { data: item }, "Grant qo'shildi", 201);
  } catch (e) {
    return sendError(res, e.message);
  }
};

const updateScholarship = async (req, res) => {
  try {
    const { title, description, requirement, icon, color, order, isActive } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (requirement !== undefined) update.requirement = requirement;
    if (icon !== undefined) update.icon = icon;
    if (color !== undefined) update.color = color;
    if (order !== undefined) update.order = order;
    if (isActive !== undefined) update.isActive = isActive;
    const item = await Scholarship.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!item) return sendError(res, 'Topilmadi', 404);
    return sendSuccess(res, { data: item }, 'Yangilandi');
  } catch (e) {
    return sendError(res, e.message);
  }
};

const deleteScholarship = async (req, res) => {
  try {
    const item = await Scholarship.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 'Topilmadi', 404);
    return sendSuccess(res, { data: null }, "O'chirildi");
  } catch (e) {
    return sendError(res, e.message);
  }
};

module.exports = { getScholarships, getAdminScholarships, createScholarship, updateScholarship, deleteScholarship };
