const HomeVideo = require('../models/HomeVideo');
const { sendSuccess, sendError } = require('../utils/response');
const fs = require('fs');
const path = require('path');

const getHomeVideos = async (req, res) => {
  try {
    const videos = await HomeVideo.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return sendSuccess(res, { data: videos }, 'Videolar ro\'yxati');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getAdminHomeVideos = async (req, res) => {
  try {
    const videos = await HomeVideo.find().sort({ order: 1, createdAt: -1 });
    return sendSuccess(res, { data: videos }, 'Videolar ro\'yxati (Admin)');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const createHomeVideo = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.url = `/uploads/videos/${req.file.filename}`;
    if (!data.url) return sendError(res, 'Video fayl yoki URL kiritilishi shart', 400);

    const video = await HomeVideo.create(data);
    return sendSuccess(res, { data: video }, 'Video muvaffaqiyatli qo\'shildi', 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const updateHomeVideo = async (req, res) => {
  try {
    const video = await HomeVideo.findById(req.params.id);
    if (!video) return sendError(res, 'Video topilmadi', 404);

    const updates = { ...req.body };
    if (req.file) {
      if (video.url && video.url.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', video.url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updates.url = `/uploads/videos/${req.file.filename}`;
    }
    if (updates.isActive !== undefined) {
      updates.isActive = updates.isActive === 'true' || updates.isActive === true;
    }

    Object.assign(video, updates);
    await video.save();
    return sendSuccess(res, { data: video }, 'Video yangilandi');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const deleteHomeVideo = async (req, res) => {
  try {
    const video = await HomeVideo.findByIdAndDelete(req.params.id);
    if (!video) return sendError(res, 'Video topilmadi', 404);

    if (video.url && video.url.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '..', video.url);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    return sendSuccess(res, { data: null }, 'Video o\'chirildi');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getHomeVideos,
  getAdminHomeVideos,
  createHomeVideo,
  updateHomeVideo,
  deleteHomeVideo
};
