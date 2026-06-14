const Testimonial = require('../models/Testimonial');
const { sendSuccess, sendError } = require('../utils/response');
const fs = require('fs');
const path = require('path');

const getTestimonials = async (req, res) => {
  try {
    const items = await Testimonial.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return sendSuccess(res, { data: items });
  } catch (e) {
    return sendError(res, e.message, 500);
    }
};

const getAdminTestimonials = async (req, res) => {
  try {
    const items = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    return sendSuccess(res, { data: items });
  } catch (e) {
    return sendError(res, e.message, 500);
    }
};

const createTestimonial = async (req, res) => {
  try {
    const { name, role, text, rating, order } = req.body;
    const avatar = req.file ? `/uploads/testimonials/${req.file.filename}` : '';
    const item = await Testimonial.create({ name, role, text, rating: rating ?? 5, avatar, order: order || 0 });
    return sendSuccess(res, { data: item }, "Sharh qo'shildi", 201);
  } catch (e) {
    return sendError(res, e.message, 500);
    }
};

const updateTestimonial = async (req, res) => {
  try {
    const { name, role, text, rating, order, isActive } = req.body;
    const item = await Testimonial.findById(req.params.id);
    if (!item) return sendError(res, 'Topilmadi', 404);

    if (req.file) {
      if (item.avatar) {
        const oldPath = path.join(__dirname, '..', item.avatar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      item.avatar = `/uploads/testimonials/${req.file.filename}`;
    }
    if (name !== undefined) item.name = name;
    if (role !== undefined) item.role = role;
    if (text !== undefined) item.text = text;
    if (rating !== undefined) item.rating = rating;
    if (order !== undefined) item.order = order;
    if (isActive !== undefined) item.isActive = isActive === 'true' || isActive === true;
    await item.save();
    return sendSuccess(res, { data: item }, 'Yangilandi');
  } catch (e) {
    return sendError(res, e.message, 500);
    }
};

const deleteTestimonial = async (req, res) => {
  try {
    const item = await Testimonial.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 'Topilmadi', 404);
    if (item.avatar) {
      const oldPath = path.join(__dirname, '..', item.avatar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    return sendSuccess(res, { data: null }, "O'chirildi");
  } catch (e) {
    return sendError(res, e.message, 500);
    }
};

module.exports = { getTestimonials, getAdminTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
