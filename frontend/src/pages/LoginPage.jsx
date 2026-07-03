import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, ArrowRight, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { login, selectAuth, clearError } from '../features/auth/authSlice';
import PhoneInput from '../components/ui/PhoneInput';

const LoginPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector(selectAuth);
  const location = useLocation();
  const [form, setForm] = useState({ phone: '', login: '', password: '' });
  const [mode, setMode] = useState('phone'); // 'phone' | 'login'
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'phone') {
      if (!form.phone || form.phone.replace(/\D/g, '').length < 12) {
        toast.error(t('loginPage.errPhone'));
        return;
      }
    } else {
      if (!form.login || form.login.trim().length < 3) {
        toast.error(t('loginPage.errLogin'));
        return;
      }
    }
    const identifier = mode === 'phone' ? form.phone : form.login.trim();
    justSubmitted.current = true;
    dispatch(login({ identifier, password: form.password }));
  };

  return (
    <>
      <Helmet>
        <title>{t('auth.signIn')} — Topex Texnikumi</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex bg-white">
        {/* ════ LEFT — visual ════ */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-deep">
          <div className="absolute inset-0 bg-cover bg-center opacity-30"
               style={{ backgroundImage: "url('/assets/images/DSC00827.webp')" }} />
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
              <ArrowLeft size={16} /> {t('loginPage.backHome')}
            </Link>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <span className="inline-block text-orange font-bold text-[13px] uppercase tracking-[0.18em] mb-5">
                  {t('loginPage.brand')}
                </span>
                <h1 className="text-white text-[44px] lg:text-[56px] font-black leading-[1.05] mb-6 uppercase whitespace-pre-line">
                  {t('loginPage.heroTitle')}
                </h1>
                <p className="text-white/75 text-base leading-relaxed max-w-md">
                  {t('loginPage.heroParagraph')}
                </p>
              </motion.div>

              <div className="mt-12 grid grid-cols-3 gap-4 max-w-md">
                {[
                  { num: '600+', lbl: t('loginPage.statStudents') },
                  { num: '50+',  lbl: t('loginPage.statTeachers') },
                  { num: '3+',   lbl: t('loginPage.statBranches') },
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
                <ArrowLeft size={16} /> {t('loginPage.backHome')}
              </Link>
            </div>

            <span className="inline-block text-orange font-bold text-[13px] uppercase tracking-[0.18em] mb-4">
              {t('loginPage.sectionLabel')}
            </span>
            <h2 className="text-[34px] md:text-[42px] font-black text-brand leading-[1.1] mb-3 whitespace-pre-line">
              {t('loginPage.formTitle')}
            </h2>
            <p className="text-gray-500 mb-8">{t('loginPage.noAccount')}{' '}
              <Link to="/register" className="text-orange font-bold hover:underline">{t('loginPage.signUp')}</Link>
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Telefon / Login toggle */}
              <div className="flex gap-1.5 p-1 bg-gray-100 rounded-xl">
                <button type="button" onClick={() => setMode('phone')}
                  className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all ${mode === 'phone' ? 'bg-white text-brand shadow-sm' : 'text-gray-500 hover:text-brand'}`}>
                  {t('loginPage.tabPhone')}
                </button>
                <button type="button" onClick={() => setMode('login')}
                  className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all ${mode === 'login' ? 'bg-white text-brand shadow-sm' : 'text-gray-500 hover:text-brand'}`}>
                  {t('loginPage.tabLogin')}
                </button>
              </div>

              <div>
                {mode === 'phone' ? (
                  <>
                    <label className="block text-brand font-semibold text-[14px] mb-2">{t('loginPage.tabPhone')}</label>
                    <PhoneInput
                      value={form.phone}
                      onChange={(v) => setForm(p => ({ ...p, phone: v }))}
                      className="w-full bg-white border-2 border-gray-200 rounded-xl pr-4 py-3.5
                                 text-brand text-[15px] placeholder:text-gray-400
                                 focus:outline-none focus:border-orange transition-all"
                    />
                  </>
                ) : (
                  <>
                    <label className="block text-brand font-semibold text-[14px] mb-2">{t('loginPage.loginLabel')}</label>
                    <input
                      type="text"
                      placeholder={t('loginPage.loginPlaceholder')}
                      value={form.login}
                      onChange={e => setForm(p => ({ ...p, login: e.target.value }))}
                      className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5
                                 text-brand text-[15px] placeholder:text-gray-400
                                 focus:outline-none focus:border-orange transition-all"
                    />
                  </>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-brand font-semibold text-[14px]">{t('loginPage.passwordLabel')}</label>
                  <a href="#" className="text-orange text-[13px] font-semibold hover:underline">
                    {t('loginPage.forgot')}
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
                    {t('loginPage.submitting')}
                  </>
                ) : (
                  <>{t('loginPage.submit')} <ArrowRight size={18} /></>
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
