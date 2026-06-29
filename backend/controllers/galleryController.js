const Gallery = require('../models/Gallery');
const { sendSuccess, sendError } = require('../utils/response');
const fs = require('fs');
const path = require('path');

const safeDeleteFile = (imagePath) => {
  if (!imagePath || !imagePath.startsWith('/uploads/')) return;
  const fullPath = path.join(__dirname, '..', imagePath);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
};

const getGallery = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'all') filter.category = category;
    const items = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });
    return sendSuccess(res, { data: items });
  } catch (e) {
    return sendError(res, e.message, 500);
    }
};

const getAdminGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ order: 1, createdAt: -1 });
    return sendSuccess(res, { data: items });
  } catch (e) {
    return sendError(res, e.message, 500);
    }
};

const createGalleryItem = async (req, res) => {
  try {
    const { title, category, order, image: bodyImage } = req.body;
    const image = req.file ? `/uploads/gallery/${req.file.filename}` : bodyImage;
    if (!image) return sendError(res, 'Rasm yuklanmadi', 400);
    const item = await Gallery.create({ title, category, order: order || 0, image });
    return sendSuccess(res, { data: item }, "Rasm qo'shildi", 201);
  } catch (e) {
    return sendError(res, e.message, 500);
    }
};

const updateGalleryItem = async (req, res) => {
  try {
    const { title, category, order, isActive } = req.body;
    const item = await Gallery.findById(req.params.id);
    if (!item) return sendError(res, 'Topilmadi', 404);

    if (req.file) {
      safeDeleteFile(item.image);
      item.image = `/uploads/gallery/${req.file.filename}`;
    }
    if (title !== undefined) item.title = title;
    if (category !== undefined) item.category = category;
    if (order !== undefined) item.order = order;
    if (isActive !== undefined) item.isActive = isActive === 'true' || isActive === true;
    await item.save();
    return sendSuccess(res, { data: item }, 'Yangilandi');
  } catch (e) {
    return sendError(res, e.message, 500);
    }
};

const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 'Topilmadi', 404);
    safeDeleteFile(item.image);
    return sendSuccess(res, { data: null }, "O'chirildi");
  } catch (e) {
    return sendError(res, e.message, 500);
    }
};

module.exports = { getGallery, getAdminGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem };
