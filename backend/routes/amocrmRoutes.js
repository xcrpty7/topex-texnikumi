const express = require('express');
const router = express.Router();
const amocrm = require('../services/amocrm');

/**
 * GET /api/amocrm/status
 * Показать статус интеграции (настроен ли API, есть ли токены, тег)
 */
router.get('/status', (req, res) => {
  try {
    const status = amocrm.getStatus();
    res.json({ success: true, ...status });
  } catch (err) {
    res.json({
      success: true,
      configured: amocrm.isConfigured(),
      apiConfigured: false,
      error: err.message,
    });
  }
});

/**
 * GET /api/amocrm/auth
 * Редирект на AmoCRM для авторизации.
 * После авторизации AmoCRM редиректит на AMOCRM_REDIRECT_URI с ?code=...
 */
router.get('/auth', (req, res) => {
  try {
    const url = amocrm.getAuthUrl();
    // amoCRM authorize endpoint accepts ONLY POST — redirect (GET) gives 405.
    // Send auto-submitting HTML form instead of 302 redirect.
    res.send(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>AmoCRM Auth</title></head>
<body>
<p>Redirecting to AmoCRM...</p>
<form id="f" method="POST" action="${url}">
  <input type="submit" value="Continue to AmoCRM" />
</form>
<script>document.getElementById('f').submit();</script>
</body></html>`);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'AmoCRM API не настроен. Установите AMOCRM_CLIENT_ID, AMOCRM_SUBDOMAIN и AMOCRM_REDIRECT_URI.',
      error: err.message,
    });
  }
});

/**
 * GET|POST /api/amocrm/callback
 * Callback от AmoCRM после авторизации.
 * mode=post → code в POST body; mode=get → code в query string.
 */
const handleCallback = async (req, res) => {
  // amoCRM mode=post sends code in POST body; mode=get sends in query string
  const code = req.query.code || req.body?.code;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Отсутствует параметр code',
    });
  }

  try {
    await amocrm.handleOAuthCallback(code);
    res.json({
      success: true,
      message: 'AmoCRM авторизация прошла успешно! Токены сохранены. Теперь теги будут добавляться к каждому лиду.',
    });
  } catch (err) {
    console.error('[AmoCRM] OAuth callback error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Ошибка авторизации AmoCRM',
      error: err.message,
    });
  }
};
router.get('/callback', handleCallback);
router.post('/callback', handleCallback);

/**
 * POST /api/amocrm/test
 * Отправить тестовый лид с тегом (для проверки интеграции)
 */
router.post('/test', async (req, res) => {
  if (!amocrm.isApiConfigured()) {
    return res.status(400).json({
      success: false,
      message: 'AmoCRM API не настроен. Сначала выполните авторизацию через /api/amocrm/auth',
    });
  }

  try {
    const result = await amocrm.sendLead({
      fullName: 'TEST Lead — saytdantushganlidlar',
      phone: '+998901234567',
      grade: '9',
      message: 'Тестовая заявка для проверки тега',
    });

    if (result) {
      res.json({
        success: true,
        message: `Тестовый лид создан с тегом "${amocrm.TAG_NAME}". Проверьте в AmoCRM.`,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Не удалось создать тестовый лид',
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании тестового лида',
      error: err.message,
    });
  }
});

/**
 * DELETE /api/amocrm/tokens
 * Удалить сохранённые токены (для переавторизации)
 */
router.delete('/tokens', (req, res) => {
  amocrm.clearTokens();
  res.json({ success: true, message: 'Токены удалены. Выполните повторную авторизацию через /api/amocrm/auth' });
});

module.exports = router;
