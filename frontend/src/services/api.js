import axios from 'axios';
import { store } from '../app/store';
import { clearAuth, setCredentials } from '../features/auth/authSlice';

const BASE_URL = `${import.meta.env.VITE_API_URL || ''}/api`;
const MAX_CONCURRENT = 5;

// ── Concurrency limiter ──────────────────────────────────────────────────────
let activeCount = 0;
const waitQueue = [];

const acquireSlot = () =>
  new Promise((resolve) => {
    if (activeCount < MAX_CONCURRENT) {
      activeCount++;
      resolve();
    } else {
      waitQueue.push(resolve);
    }
  });

const releaseSlot = () => {
  if (waitQueue.length > 0) {
    const next = waitQueue.shift();
    next();
  } else {
    activeCount--;
  }
};
// ─────────────────────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  await acquireSlot();
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

let isRefreshing = false;
let refreshQueue = [];

api.interceptors.response.use(
  (response) => {
    releaseSlot();
    return response;
  },
  async (error) => {
    releaseSlot();
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        const newToken = data.accessToken || data.data?.accessToken;
        store.dispatch(setCredentials({ accessToken: newToken }));
        refreshQueue.forEach(({ resolve }) => resolve(newToken));
        refreshQueue = [];
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        refreshQueue.forEach(({ reject }) => reject(error));
        refreshQueue = [];
        store.dispatch(clearAuth());
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
