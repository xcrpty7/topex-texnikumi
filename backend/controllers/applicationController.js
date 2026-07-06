const Application = require('../models/Application');
const { sendSuccess, sendError } = require('../utils/response');

const createApplication = async (req, res) => {
  try {
    const { fullName, phone, grade, course, message } = req.body;

    const application = await Application.create({ fullName, phone, grade, course, message });

    try {
      const amocrm = require('../services/amocrm');
      await amocrm.sendLead({ fullName, phone, grade, message });
    } catch (amocrmErr) {
      console.error('AmoCRM sendLead error:', amocrmErr?.message);
    }

    return sendSuccess(res, { application }, 'Arizangiz muvaffaqiyatli yuborildi', 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = { createApplication };
