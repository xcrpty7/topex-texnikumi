import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchMe, setCredentials, markInitialized } from './features/auth/authSlice';
import { warmupBackend } from './services/api';
import AppRouter from './routes/AppRouter';

// JWT exp claim'ini lokal dekodlash — server'ga so'rovsiz muddati o'tganligini bilish
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    // 5 sekund zahira — server soati biroz farq qilsa ham xato bermasligi uchun
    return payload.exp * 1000 < Date.now() + 5000;
  } catch {
    return true;
  }
};

const PLACEHOLDER =
  'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
    '<rect width="400" height="300" fill="#2a2a3a"/>' +
    '<path d="M180 140h40v40h-40z" fill="#555"/>' +
    '<text x="200" y="200" text-anchor="middle" fill="#666" font-size="14">Rasm topilmadi</text>' +
    '</svg>'
  );

const App = () => {
  const dispatch = useDispatch();

  // Backendni darhol "uyg'otamiz" — ariza/login so'rovlari tez ishlashi uchun
  useEffect(() => {
    warmupBackend();
  }, []);

  useEffect(() => {
    document.addEventListener('error', (e) => {
      if (e.target?.tagName === 'IMG' && !e.target.dataset.fallback) {
        e.target.dataset.fallback = 'true';
        e.target.src = PLACEHOLDER;
      }
    }, true);
  }, []);

  useEffect(() => {
    let saved = null;
    try {
      saved = localStorage.getItem('accessToken');
    } catch {}

    if (saved && !isTokenExpired(saved)) {
      dispatch(setCredentials({ accessToken: saved }));
      dispatch(fetchMe());
    } else if (saved) {
      // Token expired — пробуем обновить через httpOnly refresh cookie
      (async () => {
        try {
          const BASE = `${import.meta.env.VITE_API_URL || ''}/api`;
          const { data } = await axios.post(`${BASE}/auth/refresh`, {}, { withCredentials: true });
          const newToken = data.accessToken || data.data?.accessToken;
          if (newToken) {
            dispatch(setCredentials({ accessToken: newToken }));
            dispatch(fetchMe());
            return;
          }
        } catch {}
        try { localStorage.removeItem('accessToken'); } catch {}
        dispatch(markInitialized());
      })();
    } else {
      dispatch(markInitialized());
    }
  }, [dispatch]);

  return <AppRouter />;
};

export default App;
