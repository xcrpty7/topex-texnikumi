/**
 * AmoCRM Integration — API v4 (с тегами) + Web Form fallback
 *
 * Теги работают ТОЛЬКО через API v4. Если API не настроен —
 * используется web form (теги не добавляются).
 *
 * Настройка:
 *   1. В AmoCRM → Настройки → API → создайте интеграцию
 *   2. Укажите redirect_uri (см. AMOCRM_REDIRECT_URI в .env)
 *   3. Откройте /api/amocrm/auth — вас перенаправит на AmoCRM
 *   4. После авторизации токены сохранятся автоматически
 */

const fs = require('fs');
const path = require('path');

// ─── Constants ──────────────────────────────────────────────────────────────
const TOKEN_FILE = path.join(__dirname, '..', '.amocrm-tokens.json');
const FETCH_TIMEOUT = 15000;
const TAG_NAME = 'saytdantushganlidlar'; // Тег для лидов с сайта

// Web form fallback (оставляем как есть)
const FORM_ID = '1413418';
const FORM_HASH = '41a013ea71535924bc5915544b69e6af';
const FORM_URL = 'https://forms.amocrm.ru/queue/add';

// ─── Config ─────────────────────────────────────────────────────────────────
function getConfig() {
  return {
    subdomain: process.env.AMOCRM_SUBDOMAIN || '',       // "mycompany"
    clientId: process.env.AMOCRM_CLIENT_ID || '',
    clientSecret: process.env.AMOCRM_CLIENT_SECRET || '',
    redirectUri: process.env.AMOCRM_REDIRECT_URI || '',
  };
}

/**
 * isConfigured() — true если web form работает (всегда true для совместимости)
 */
function isConfigured() {
  return true;
}

/**
 * isApiConfigured() — true если API v4 настроен (есть subdomain + токен)
 */
function isApiConfigured() {
  const cfg = getConfig();
  const tokens = loadTokens();
  return !!(cfg.subdomain && cfg.clientId && tokens.accessToken);
}

// ─── Token Management ───────────────────────────────────────────────────────
function loadTokens() {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
    }
  } catch { /* ignore */ }
  return { accessToken: null, refreshToken: null, expiresAt: 0 };
}

function saveTokens(tokens) {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
}

function clearTokens() {
  try { fs.unlinkSync(TOKEN_FILE); } catch { /* ok */ }
}

/**
 * Обновить access_token через refresh_token
 */
async function refreshAccessToken() {
  const cfg = getConfig();
  const tokens = loadTokens();
  if (!tokens.refreshToken) {
    throw new Error('No refresh token — run /api/amocrm/auth first');
  }

  const res = await fetchWithTimeout(
    `https://${cfg.subdomain}.amocrm.ru/api/v4/oauth2/access_token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: tokens.refreshToken,
        redirect_uri: cfg.redirectUri,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Token refresh failed (${res.status}): ${err.slice(0, 300)}`);
  }

  const data = await res.json();
  const newTokens = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + (data.expires_in - 120) * 1000, // 2min buffer
  };
  saveTokens(newTokens);
  console.log('[AmoCRM] Tokens refreshed successfully');
  return newTokens.accessToken;
}

/**
 * Получить валидный access_token (с auto-refresh)
 */
async function getAccessToken() {
  const tokens = loadTokens();
  if (tokens.accessToken && Date.now() < tokens.expiresAt) {
    return tokens.accessToken;
  }
  return await refreshAccessToken();
}

// ─── Fetch Helper ───────────────────────────────────────────────────────────
async function fetchWithTimeout(url, options, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ─── API v4: Create Lead with Tags ──────────────────────────────────────────
async function sendLeadViaAPI({ fullName, phone, grade, message }) {
  const cfg = getConfig();
  const accessToken = await getAccessToken();

  // Формируем имя лида с инфо о классе
  const leadName = grade ? `${fullName} (sinf: ${grade})` : fullName;

  // Custom fields —PHONE и NAME
  const customFieldsValues = [
    {
      field_code: 'NAME',
      values: [{ value: fullName }],
    },
    {
      field_code: 'PHONE',
      values: [{ value: phone, enum_code: 'WORK' }],
    },
  ];

  // Тело запроса — с тегом
  const body = {
    name: leadName,
    custom_fields_values: customFieldsValues,
    _embedded: {
      tags: [
        { name: TAG_NAME },
      ],
    },
  };

  const res = await fetchWithTimeout(
    `https://${cfg.subdomain}.amocrm.ru/api/v4/leads`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error(`[AmoCRM] API lead error (${res.status}): ${err.slice(0, 300)}`);
    return null;
  }

  const data = await res.json();
  const leadId = data._embedded?.leads?.[0]?.id || 'unknown';
  console.log(`[AmoCRM] Lead #${leadId} created via API with tag "${TAG_NAME}"`);
  return true;
}

// ─── Web Form Fallback (без тегов) ──────────────────────────────────────────
async function sendLeadViaWebForm({ fullName, phone, grade, message }) {
  const body = new URLSearchParams({
    form_id: FORM_ID,
    hash: FORM_HASH,
    'fields[name_1]': fullName,
    'fields[203889_1][113325]': phone,
    user_origin: JSON.stringify({
      datetime: new Date().toString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referer: '',
    }),
  });

  const res = await fetchWithTimeout(FORM_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`[AmoCRM] webform error (${res.status}): ${err.slice(0, 300)}`);
    return null;
  }

  console.log('[AmoCRM] Lead sent via web form (no tags — API not configured)');
  return true;
}

// ─── Main: sendLead() ───────────────────────────────────────────────────────
/**
 * Отправить лид в AmoCRM.
 * Приоритет: API v4 (с тегами) → Web Form (без тегов).
 * При ошибке API — автоматический fallback на web form.
 */
async function sendLead({ fullName, phone, grade, message }) {
  try {
    // Попытка 1: API v4 (с тегом)
    if (isApiConfigured()) {
      return await sendLeadViaAPI({ fullName, phone, grade, message });
    }

    // Fallback: web form (без тегов)
    console.warn('[AmoCRM] API not configured — using web form (tags disabled)');
    return await sendLeadViaWebForm({ fullName, phone, grade, message });
  } catch (err) {
    console.error(`[AmoCRM] sendLead error:`, err?.message);

    // Если API упал — пробуем web form
    if (isApiConfigured()) {
      try {
        console.warn('[AmoCRM] API failed, falling back to web form');
        return await sendLeadViaWebForm({ fullName, phone, grade, message });
      } catch (fbErr) {
        console.error(`[AmoCRM] Web form fallback also failed:`, fbErr?.message);
      }
    }

    return null;
  }
}

// ─── OAuth: Auth URL ────────────────────────────────────────────────────────
/**
 * Получить URL для авторизации в AmoCRM.
 * Редиректит на AmoCRM → пользователь даёт доступ →
 * редиректит обратно на AMOCRM_REDIRECT_URI с code.
 */
function getAuthUrl() {
  const cfg = getConfig();
  if (!cfg.clientId || !cfg.redirectUri) {
    throw new Error('AMOCRM_CLIENT_ID and AMOCRM_REDIRECT_URI required');
  }
  return `https://${cfg.subdomain}.amocrm.ru/oauth2/authorize?` +
    `client_id=${cfg.clientId}&` +
    `redirect_uri=${encodeURIComponent(cfg.redirectUri)}&` +
    `mode=post_message`;
}

// ─── OAuth: Callback Handler ────────────────────────────────────────────────
/**
 * Обработать callback после авторизации AmoCRM.
 * Меняет authorization code на access_token + refresh_token.
 */
async function handleOAuthCallback(code) {
  const cfg = getConfig();

  const res = await fetchWithTimeout(
    `https://${cfg.subdomain}.amocrm.ru/api/v4/oauth2/access_token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: cfg.clientId,
        client_secret: cfg.clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: cfg.redirectUri,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OAuth failed (${res.status}): ${err.slice(0, 300)}`);
  }

  const data = await res.json();
  const tokens = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + (data.expires_in - 120) * 1000,
  };
  saveTokens(tokens);
  console.log('[AmoCRM] OAuth tokens saved successfully');
  return tokens;
}

// ─── Status ─────────────────────────────────────────────────────────────────
function getStatus() {
  const cfg = getConfig();
  const tokens = loadTokens();
  return {
    configured: isConfigured(),
    apiConfigured: isApiConfigured(),
    subdomain: cfg.subdomain || null,
    hasClientId: !!cfg.clientId,
    hasTokens: !!tokens.accessToken,
    tokenExpiresAt: tokens.expiresAt ? new Date(tokens.expiresAt).toISOString() : null,
    tag: TAG_NAME,
  };
}

module.exports = {
  sendLead,
  isConfigured,
  isApiConfigured,
  getAuthUrl,
  handleOAuthCallback,
  getAccessToken,
  clearTokens,
  getStatus,
  TAG_NAME,
};
