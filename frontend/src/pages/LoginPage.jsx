import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, ArrowRight, Mail, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { login, selectAuth, clearError, setCredentials, fetchMe } from '../features/auth/authSlice';

const API_URL = import.meta.env.VITE_API_URL || '';

const LoginPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector(selectAuth);
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const justSubmitted = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (justSubmitted.current) {
      justSubmitted.current = false;
      const from = location.state?.from?.pathname;
      if (from) navigate(from, { replace: true });
      else if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') navigate('/admin', { replace: true });
      else navigate('/', { replace: true });
      return;
    }
    navigate('/', { replace: true });
  }, [isAuthenticated, user, navigate, location]);

  useEffect(() => () => { dispatch(clearError()); }, [dispatch]);

  // Google OAuth callback — URL'da ?google=TOKEN bo'lsa, kirish
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const googleToken = params.get('google');
    const errParam = params.get('error');
    if (errParam) {
      toast.error('Google bilan kirishda xatolik. Qayta urinib ko\'ring.');
      window.history.replaceState({}, '', '/login');
      return;
    }
    if (googleToken) {
      localStorage.setItem('accessToken', googleToken);
      dispatch(setCredentials({ accessToken: googleToken }));
      justSubmitted.current = true;
      dispatch(fetchMe());
      window.history.replaceState({}, '', '/login');
    }
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    justSubmitted.current = true;
    dispatch(login(form));
  };

  const handleGoogle = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <>
      <Helmet>
        <title>{t('auth.signIn')} — Topex Texnikumi</title>
      </Helmet>

      <div className="min-h-screen flex bg-white">
        {/* ════ LEFT — visual ════ */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-deep">
          <div className="absolute inset-0 bg-cover bg-center opacity-30"
               style={{ backgroundImage: "url('/assets/images/DSC00827.jpg')" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-deep/95 via-brand/85 to-brand-deep/95" />

          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-[0.06]"
               style={{
                 backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                 backgroundSize: '24px 24px',
               }} />

          {/* Wavy lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox="0 0 800 800" preserveAspectRatio="none" fill="none">
            {[...Array(12)].map((_, i) => (
              <path key={i}
                d={`M -100 ${80 + i * 50} Q 300 ${10 + i * 50}, 600 ${100 + i * 50} T 1200 ${60 + i * 50}`}
                stroke="white" strokeWidth="1.2" fill="none" />
            ))}
          </svg>

          <div className="relative z-10 flex flex-col justify-between p-16 text-white">
            <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-orange text-sm font-medium w-fit">
              <ArrowLeft size={16} /> Bosh sahifa
            </Link>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <span className="inline-block text-orange font-bold text-[13px] uppercase tracking-[0.18em] mb-5">
                  Topex Texnikumi
                </span>
                <h1 className="text-[44px] lg:text-[56px] font-black leading-[1.05] mb-6 uppercase">
                  Xush kelibsiz<br/>orqaga!
                </h1>
                <p className="text-white/75 text-base leading-relaxed max-w-md">
                  Kelajak kasbingiz bizning texnikumdan boshlangan. Davom eting va o'qishingizdagi yutuqlarni kuzating.
                </p>
              </motion.div>

              <div className="mt-12 grid grid-cols-3 gap-4 max-w-md">
                {[
                  { num: '600+', lbl: "O'quvchi" },
                  { num: '50+',  lbl: "O'qituvchi" },
                  { num: '3+',   lbl: 'Filial' },
                ].map((s, i) => (
                  <motion.div key={s.lbl}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4">
                    <p className="text-orange font-black text-2xl">{s.num}</p>
                    <p className="text-white/70 text-xs mt-1">{s.lbl}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <p className="text-white/40 text-xs">© {new Date().getFullYear()} Topex Texnikumi</p>
          </div>
        </div>

        {/* ════ RIGHT — form ════ */}
        <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="w-full max-w-md">

            <div className="lg:hidden mb-8">
              <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand text-sm font-medium">
                <ArrowLeft size={16} /> Bosh sahifa
              </Link>
            </div>

            <span className="inline-block text-orange font-bold text-[13px] uppercase tracking-[0.18em] mb-4">
              Kirish
            </span>
            <h2 className="text-[34px] md:text-[42px] font-black text-brand leading-[1.1] mb-3">
              Akkauntingizga<br/>kiring
            </h2>
            <p className="text-gray-500 mb-8">Hisobingiz yo'qmi?{' '}
              <Link to="/register" className="text-orange font-bold hover:underline">Ro'yxatdan o'ting</Link>
            </p>

            {/* Google login */}
            <button
              type="button"
              onClick={handleGoogle}
              className="w-full mb-5 flex items-center justify-center gap-3 bg-white border-2 border-gray-200
                         text-brand font-semibold py-3.5 rounded-xl hover:border-orange hover:shadow-md
                         transition-all duration-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google bilan kirish
            </button>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-xs uppercase tracking-widest font-semibold">yoki</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-brand font-semibold text-[14px] mb-2">Email manzil</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="siz@example.com"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    required
                    className="w-full bg-white border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3.5
                               text-brand text-[15px] placeholder:text-gray-400
                               focus:outline-none focus:border-orange transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-brand font-semibold text-[14px]">Parol</label>
                  <a href="#" className="text-orange text-[13px] font-semibold hover:underline">
                    Unutdingizmi?
                  </a>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    required
                    className="w-full bg-white border-2 border-gray-200 rounded-xl pl-12 pr-12 py-3.5
                               text-brand text-[15px] placeholder:text-gray-400
                               focus:outline-none focus:border-orange transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange transition-colors">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-orange-grad
                           hover:brightness-110 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange/30
                           hover:-translate-y-0.5 transition-all duration-200 text-[15px]
                           disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Kiritilmoqda...
                  </>
                ) : (
                  <>Kirish <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
