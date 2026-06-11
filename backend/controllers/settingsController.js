const SiteSettings = require('../models/SiteSettings');
const { sendSuccess, sendError } = require('../utils/response');

const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    return sendSuccess(res, { data: settings });
  } catch (e) {
    return sendError(res, e.message);
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = new SiteSettings();
    Object.assign(settings, req.body);
    ['subjects', 'extras', 'features', 'coursesHighlights', 'scholarshipCards', 'employmentBullets'].forEach(f => {
      if (req.body[f] !== undefined) settings.markModified(f);
    });
    await settings.save();
    return sendSuccess(res, { data: settings }, 'Sayt sozlamalari saqlandi');
  } catch (e) {
    return sendError(res, e.message);
  }
};

const uploadSettingsImage = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 'Rasm yuklanmadi', 400);
    const url = `/uploads/gallery/${req.file.filename}`;
    return sendSuccess(res, { data: { url } }, 'Rasm yuklandi');
  } catch (e) {
    return sendError(res, e.message);
  }
};

module.exports = { getSettings, updateSettings, uploadSettingsImage };
