import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchMe, setCredentials, markInitialized } from './features/auth/authSlice';
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

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let saved = null;
    try {
      saved = localStorage.getItem('accessToken');
    } catch {}

    if (saved && !isTokenExpired(saved)) {
      dispatch(setCredentials({ accessToken: saved }));
      dispatch(fetchMe());
    } else {
      // Token yo'q yoki muddati o'tgan — saqlangani bo'lsa tozalash
      if (saved) {
        try { localStorage.removeItem('accessToken'); } catch {}
      }
      dispatch(markInitialized());
    }
  }, [dispatch]);

  return <AppRouter />;
};

export default App;
