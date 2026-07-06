const AmoCrmToken = require('../models/AmoCrmToken');
const crypto = require('crypto');

const SUBDOMAIN = process.env.AMOCRM_SUBDOMAIN;
const CLIENT_ID = process.env.AMOCRM_CLIENT_ID;
const CLIENT_SECRET = process.env.AMOCRM_CLIENT_SECRET;
const REDIRECT_URI = process.env.AMOCRM_REDIRECT_URI || 'http://localhost:10000/api/amocrm/callback';
const BASE_URL = SUBDOMAIN ? `https://${SUBDOMAIN}` : null;
const ENC_KEY = crypto.createHash('sha256').update(process.env.JWT_ACCESS_SECRET || 'topex-amocrm-fallback-key').digest();
const FETCH_TIMEOUT = 10000;

let cachedToken = null;
let refreshPromise = null;

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  const [ivHex, encHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, iv);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}

function isConfigured() {
  return !!(SUBDOMAIN && CLIENT_ID && CLIENT_SECRET);
}

async function fetchWithTimeout(url, options, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function loadTokenIntoCache() {
  if (cachedToken) return;
  const stored = await AmoCrmToken.findOne().sort({ createdAt: -1 }).lean();
  if (stored) {
    cachedToken = {
      accessToken: decrypt(stored.accessToken),
      refreshToken: decrypt(stored.refreshToken),
      expiresAt: stored.expiresAt,
    };
  }
}

function isTokenExpired() {
  if (!cachedToken) return true;
  return Date.now() >= new Date(cachedToken.expiresAt).getTime() - 60000;
}

async function persistToken(accessToken, refreshToken, expiresIn) {
  const encrypted = {
    accessToken: encrypt(accessToken),
    refreshToken: encrypt(refreshToken),
    expiresAt: new Date(Date.now() + expiresIn * 1000),
  };

  cachedToken = {
    accessToken,
    refreshToken,
    expiresAt: encrypted.expiresAt,
  };

  await AmoCrmToken.deleteMany({});
  await AmoCrmToken.create(encrypted);
}

async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      if (!cachedToken) throw new Error('No cached token to refresh');

      const res = await fetchWithTimeout(`${BASE_URL}/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: 'refresh_token',
          refresh_token: cachedToken.refreshToken,
          redirect_uri: REDIRECT_URI,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        cachedToken = null;
        throw new Error(`AmoCRM refresh failed (${res.status}): ${err.slice(0, 200)}`);
      }

      const data = await res.json();
      await persistToken(data.access_token, data.refresh_token, data.expires_in);
      return cachedToken.accessToken;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function ensureValidToken() {
  await loadTokenIntoCache();
  if (!cachedToken) throw new Error('AmoCRM not authorized. Visit /api/amocrm/auth');
  if (isTokenExpired()) return refreshAccessToken();
  return cachedToken.accessToken;
}

async function exchangeCode(code) {
  const res = await fetchWithTimeout(`${BASE_URL}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AmoCRM code exchange failed (${res.status}): ${err.slice(0, 300)}`);
  }

  const data = await res.json();
  await persistToken(data.access_token, data.refresh_token, data.expires_in);
  return data;
}

async function sendLead({ fullName, phone, grade, message }) {
  if (!isConfigured()) return null;

  try {
    const token = await ensureValidToken();

    const body = [{
      name: `${fullName} — ${grade || '?'}-sinf`,
      _embedded: {
        contacts: [{
          name: fullName,
          custom_fields_values: [
            {
              field_code: 'PHONE',
              values: [{ value: phone }],
            },
            ...(grade
              ? [{
                  field_code: 'EDUCATION',
                  values: [{ value: `${grade}-sinf` }],
                }]
              : []),
          ],
        }],
      },
    }];

    const res = await fetchWithTimeout(`${BASE_URL}/api/v4/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();

      if (res.status === 401) {
        const refreshed = await refreshAccessToken();
        const retryRes = await fetchWithTimeout(`${BASE_URL}/api/v4/leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshed}`,
          },
          body: JSON.stringify(body),
        });
        if (!retryRes.ok) {
          const retryErr = await retryRes.text();
          throw new Error(`AmoCRM lead failed after refresh (${retryRes.status}): ${retryErr.slice(0, 200)}`);
        }
        return retryRes.json();
      }

      throw new Error(`AmoCRM lead failed (${res.status}): ${errText.slice(0, 200)}`);
    }

    return res.json();
  } catch (err) {
    console.error(`[AmoCRM] sendLead error:`, err?.message);
    return null;
  }
}

function getAuthUrl() {
  if (!BASE_URL) return null;
  return `${BASE_URL}/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;
}

module.exports = {
  getAuthUrl,
  exchangeCode,
  sendLead,
  isConfigured,
};
