const express = require('express');
const router = express.Router();
const amocrm = require('../services/amocrm');
const rateLimit = require('express-rate-limit');

const callbackLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: 'Juda ko\'p so\'rov' },
});

router.get('/auth', (req, res) => {
  if (!amocrm.isConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'AmoCRM не настроен. Добавьте AMOCRM_CLIENT_ID, AMOCRM_CLIENT_SECRET, AMOCRM_SUBDOMAIN в .env',
    });
  }
  res.redirect(amocrm.getAuthUrl());
});

router.get('/callback', callbackLimiter, async (req, res) => {
  const { code, error: oauthError } = req.query;

  if (oauthError) {
    console.error('[AmoCRM] OAuth error:', oauthError);
    const baseUrl = process.env.CLIENT_URL || 'https://topex-texnikumi.vercel.app';
    return res.redirect(`${baseUrl}/admin/amocrm?status=error&message=${encodeURIComponent(oauthError)}`);
  }

  if (!code) {
    return res.status(400).json({ success: false, message: 'Missing authorization code' });
  }

  try {
    await amocrm.exchangeCode(code);
    const baseUrl = process.env.CLIENT_URL || 'https://topex-texnikumi.vercel.app';
    res.redirect(`${baseUrl}/admin/amocrm?status=success`);
  } catch (err) {
    console.error('[AmoCRM] Callback error:', err?.message);
    const baseUrl = process.env.CLIENT_URL || 'https://topex-texnikumi.vercel.app';
    res.redirect(`${baseUrl}/admin/amocrm?status=error&message=${encodeURIComponent('AmoCRM авторизация не удалась. Попробуйте снова.')}`);
  }
});

router.get('/status', (req, res) => {
  res.json({
    success: true,
    configured: amocrm.isConfigured(),
    authUrl: amocrm.isConfigured() ? amocrm.getAuthUrl() : null,
  });
});

module.exports = router;
