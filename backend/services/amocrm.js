const FORM_ID = '1413418';
const FORM_HASH = '41a013ea71535924bc5915544b69e6af';
const FORM_URL = 'https://forms.amocrm.ru/queue/add';
const FETCH_TIMEOUT = 10000;

function isConfigured() {
  return true;
}

async function fetchWithTimeout(url, options, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function sendLead({ fullName, phone, grade, message }) {
  try {
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

    return true;
  } catch (err) {
    console.error(`[AmoCRM] sendLead error:`, err?.message);
    return null;
  }
}

module.exports = {
  sendLead,
  isConfigured,
};
