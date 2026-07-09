const HomeVideo = require('../models/HomeVideo');
const { sendSuccess, sendError } = require('../utils/response');
const fs = require('fs');
const path = require('path');

const deleteFile = (url) => {
  if (url && url.startsWith('/uploads/')) {
    const p = path.join(__dirname, '..', url);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
};

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
    const videoFile = req.files?.video?.[0];
    const photoFile = req.files?.photo?.[0];
    if (videoFile) data.url = `/uploads/videos/${videoFile.filename}`;
    if (photoFile) data.photo = `/uploads/video-photos/${photoFile.filename}`;
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
    const videoFile = req.files?.video?.[0];
    const photoFile = req.files?.photo?.[0];

    if (videoFile) {
      deleteFile(video.url);
      updates.url = `/uploads/videos/${videoFile.filename}`;
    }
    if (photoFile) {
      deleteFile(video.photo);
      updates.photo = `/uploads/video-photos/${photoFile.filename}`;
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

    deleteFile(video.url);
    deleteFile(video.photo);
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
