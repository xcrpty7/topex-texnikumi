const Teacher = require('../models/Teacher');
const { sendSuccess, sendError } = require('../utils/response');
const fs = require('fs');
const path = require('path');

const getTeachers = async (req, res) => {
  try {
    const list = await Teacher.find({ active: true }).sort({ order: 1, createdAt: -1 });
    return sendSuccess(res, { data: list }, "O'qituvchilar");
  } catch (e) { return sendError(res, e.message, 500); }
};

const getAdminTeachers = async (req, res) => {
  try {
    const list = await Teacher.find().sort({ order: 1, createdAt: -1 });
    return sendSuccess(res, { data: list }, "O'qituvchilar (Admin)");
  } catch (e) { return sendError(res, e.message, 500); }
};

const createTeacher = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/teachers/${req.file.filename}`;
    if (data.active !== undefined) data.active = data.active === 'true' || data.active === true;
    const t = await Teacher.create(data);
    return sendSuccess(res, { data: t }, "O'qituvchi qo'shildi", 201);
  } catch (e) { return sendError(res, e.message, 500); }
};

const updateTeacher = async (req, res) => {
  try {
    const t = await Teacher.findById(req.params.id);
    if (!t) return sendError(res, 'Topilmadi', 404);
    const updates = { ...req.body };
    if (req.file) {
      if (t.image && t.image.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', t.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updates.image = `/uploads/teachers/${req.file.filename}`;
    }
    if (updates.active !== undefined) updates.active = updates.active === 'true' || updates.active === true;
    Object.assign(t, updates);
    await t.save();
    return sendSuccess(res, { data: t }, 'Yangilandi');
  } catch (e) { return sendError(res, e.message, 500); }
};

const deleteTeacher = async (req, res) => {
  try {
    const t = await Teacher.findByIdAndDelete(req.params.id);
    if (!t) return sendError(res, 'Topilmadi', 404);
    if (t.image && t.image.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '..', t.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    return sendSuccess(res, { data: null }, "O'chirildi");
  } catch (e) { return sendError(res, e.message, 500); }
};

module.exports = { getTeachers, getAdminTeachers, createTeacher, updateTeacher, deleteTeacher };
