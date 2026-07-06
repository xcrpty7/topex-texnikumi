const AmoCrmToken = require('../models/AmoCrmToken');

const SUBDOMAIN = process.env.AMOCRM_SUBDOMAIN;
const CLIENT_ID = process.env.AMOCRM_CLIENT_ID;
const CLIENT_SECRET = process.env.AMOCRM_CLIENT_SECRET;
const REDIRECT_URI = process.env.AMOCRM_REDIRECT_URI || 'http://localhost:10000/api/amocrm/callback';

const BASE_URL = `https://${SUBDOMAIN}`;

function isTokenExpired(expiresAt) {
  return Date.now() >= new Date(expiresAt).getTime() - 60000;
}

async function getStoredToken() {
  return AmoCrmToken.findOne().sort({ createdAt: -1 });
}

async function saveToken(accessToken, refreshToken, expiresIn) {
  await AmoCrmToken.deleteMany({});
  return AmoCrmToken.create({
    accessToken,
    refreshToken,
    expiresAt: new Date(Date.now() + expiresIn * 1000),
  });
}

async function refreshAccessToken() {
  const stored = await getStoredToken();
  if (!stored) throw new Error('No stored AmoCRM token to refresh');

  const res = await fetch(`${BASE_URL}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: stored.refreshToken,
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AmoCRM refresh failed: ${res.status} ${err}`);
  }

  const data = await res.json();
  await saveToken(data.access_token, data.refresh_token, data.expires_in);
  return data.access_token;
}

async function ensureValidToken() {
  const stored = await getStoredToken();
  if (!stored) throw new Error('AmoCRM not authorized. Visit /api/amocrm/auth');
  if (isTokenExpired(stored.expiresAt)) return refreshAccessToken();
  return stored.accessToken;
}

async function exchangeCode(code) {
  const res = await fetch(`${BASE_URL}/oauth2/token`, {
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
    throw new Error(`AmoCRM code exchange failed: ${res.status} ${err}`);
  }

  const data = await res.json();
  await saveToken(data.access_token, data.refresh_token, data.expires_in);
  return data;
}

async function sendLead({ fullName, phone, grade, message }) {
  if (!SUBDOMAIN || !CLIENT_ID || !CLIENT_SECRET) {
    console.log('AmoCRM not configured, skipping lead');
    return null;
  }

  const token = await ensureValidToken();

  const res = await fetch(`${BASE_URL}/api/v4/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify([{
      name: `${fullName} — ${grade}-sinf`,
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
    }]),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AmoCRM lead failed: ${res.status} ${err}`);
  }

  return res.json();
}

function getAuthUrl() {
  return `${BASE_URL}/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;
}

module.exports = {
  getAuthUrl,
  exchangeCode,
  sendLead,
};
