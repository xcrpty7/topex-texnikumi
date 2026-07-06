const express = require('express');
const router = express.Router();
const amocrm = require('../services/amocrm');

router.get('/auth', (req, res) => {
  if (!process.env.AMOCRM_CLIENT_ID) {
    return res.json({ success: false, message: 'AmoCRM не настроен. Добавьте AMOCRM_CLIENT_ID в .env' });
  }
  res.redirect(amocrm.getAuthUrl());
});

router.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ success: false, message: 'Missing authorization code' });

  try {
    await amocrm.exchangeCode(code);
    const baseUrl = process.env.CLIENT_URL || 'https://topex-texnikumi.vercel.app';
    res.redirect(`${baseUrl}/admin/amocrm?status=success`);
  } catch (err) {
    console.error('AmoCRM callback error:', err?.message);
    const baseUrl = process.env.CLIENT_URL || 'https://topex-texnikumi.vercel.app';
    res.redirect(`${baseUrl}/admin/amocrm?status=error&message=${encodeURIComponent(err.message)}`);
  }
});

router.get('/status', async (req, res) => {
  try {
    const amocrmService = require('../services/amocrm');
    res.json({
      success: true,
      configured: !!process.env.AMOCRM_CLIENT_ID,
      authUrl: process.env.AMOCRM_CLIENT_ID ? amocrmService.getAuthUrl() : null,
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;
