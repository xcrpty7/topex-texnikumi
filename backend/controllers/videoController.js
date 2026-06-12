const Video = require('../models/Video');
const { sendSuccess, sendError } = require('../utils/response');

const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return sendSuccess(res, { data: videos }, 'Videolar ro\'yxati');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const getAdminVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ order: 1, createdAt: -1 });
    return sendSuccess(res, { data: videos }, 'Videolar ro\'yxati (Admin)');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const createVideo = async (req, res) => {
  try {
    const { title, description, url, thumbnail, duration, order, isActive } = req.body;
    if (!url) return sendError(res, 'Video URL kiritilishi shart', 400);

    const video = await Video.create({
      title, description, url, thumbnail,
      duration: duration || 0,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });
    return sendSuccess(res, { data: video }, 'Video muvaffaqiyatli qo\'shildi', 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return sendError(res, 'Video topilmadi', 404);

    const { title, description, url, thumbnail, duration, order, isActive } = req.body;
    if (title !== undefined) video.title = title;
    if (description !== undefined) video.description = description;
    if (url !== undefined) video.url = url;
    if (thumbnail !== undefined) video.thumbnail = thumbnail;
    if (duration !== undefined) video.duration = duration;
    if (order !== undefined) video.order = order;
    if (isActive !== undefined) video.isActive = isActive;

    await video.save();
    return sendSuccess(res, { data: video }, 'Video yangilandi');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return sendError(res, 'Video topilmadi', 404);

    return sendSuccess(res, { data: null }, 'Video o\'chirildi');
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getVideos,
  getAdminVideos,
  createVideo,
  updateVideo,
  deleteVideo
};
