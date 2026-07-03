import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, ArrowRight, Check, User, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { register, selectAuth, clearError } from '../features/auth/authSlice';
import PhoneInput from '../components/ui/PhoneInput';

// Parol talabi: kamida 4 ta belgi
const passwordChecks = (pw, t) => [
  { label: t('registerPage.passwordCheck.minChars'),  valid: pw.length >= 4 },
];

const RegisterPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector(selectAuth);
  const location = useLocation();
  const [form, setForm] = useState({ name: '', phone: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
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
    if (!agreed) return;
    if (!form.phone || form.phone.replace(/\D/g, '').length < 12) {
      toast.error(t('loginPage.errPhone'));
      return;
    }
    if ((form.password || '').length < 4) {
      toast.error(t('profileCred.errNewPassword'));
      return;
    }
    justSubmitted.current = true;
    dispatch(register({ name: form.name, phone: form.phone, password: form.password }));
  };

  const pwChecks = passwordChecks(form.password, t);
  const pwStrong = pwChecks.every(c => c.valid);

  return (
    <>
      <Helmet>
        <title>{t('auth.signUp')} — Topex Texnikumi</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex bg-white">
        {/* ════ LEFT — visual ════ */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-deep">
          <div className="absolute inset-0 bg-cover bg-center opacity-25"
               style={{ backgroundImage: "url('/assets/images/DSC01036.jpg')" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-deep/95 via-brand/85 to-brand-deep/95" />

          <div className="absolute inset-0 opacity-[0.06]"
               style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

          <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox="0 0 800 800" preserveAspectRatio="none" fill="none">
            {[...Array(12)].map((_, i) => (
              <path key={i}
                d={`M -100 ${80 + i * 50} Q 300 ${10 + i * 50}, 600 ${100 + i * 50} T 1200 ${60 + i * 50}`}
                stroke="white" strokeWidth="1.2" fill="none" />
            ))}
          </svg>

          <div className="relative z-10 flex flex-col justify-between p-16 text-white">
            <Link to="/" className="inline-flex items-center gap-2 text-white/70 hover:text-orange text-sm font-medium w-fit">
              <ArrowLeft size={16} /> {t('registerPage.backHome')}
            </Link>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <span className="inline-block text-orange font-bold text-[13px] uppercase tracking-[0.18em] mb-5">
                  {t('registerPage.heroBadge')}
                </span>
                <h1 className="text-white text-[44px] lg:text-[56px] font-black leading-[1.05] mb-6 uppercase">
                  {t('registerPage.heroTitle')}
                </h1>
                <p className="text-white/75 text-base leading-relaxed max-w-md mb-8">
                  {t('registerPage.heroParagraph')}
                </p>

                <ul className="space-y-3 max-w-md">
                  {[
                    t('registerPage.feature1'),
                    t('registerPage.feature2'),
                    t('registerPage.feature3'),
                    t('registerPage.feature4'),
                  ].map((txt, i) => (
                    <motion.li key={i}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                      className="flex items-center gap-3 text-white/85 text-[15px]">
                      <div className="w-6 h-6 rounded-full bg-orange flex items-center justify-center flex-shrink-0">
                        <Check size={14} className="text-white" strokeWidth={3} />
                      </div>
                      {txt}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <p className="text-white/40 text-xs">© {new Date().getFullYear()} Topex Texnikumi</p>
          </div>
        </div>

        {/* ════ RIGHT — form ════ */}
        <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="w-full max-w-md py-8">

            <div className="lg:hidden mb-8">
              <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand text-sm font-medium">
                <ArrowLeft size={16} /> {t('registerPage.backHome')}
              </Link>
            </div>

            <span className="inline-block text-orange font-bold text-[13px] uppercase tracking-[0.18em] mb-4">
              {t('registerPage.sectionLabel')}
            </span>
            <h2 className="text-[34px] md:text-[42px] font-black text-brand leading-[1.1] mb-3">
              {t('registerPage.formTitle')}
            </h2>
            <p className="text-gray-500 mb-8">{t('registerPage.hasAccount')}{' '}
              <Link to="/login" className="text-orange font-bold hover:underline">{t('registerPage.signIn')}</Link>
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-brand font-semibold text-[14px] mb-2">{t('registerPage.nameLabel')}</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('registerPage.namePlaceholder')}
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    required
                    className="w-full bg-white border-2 border-gray-200 rounded-xl pl-12 pr-4 py-3.5
                               text-brand text-[15px] placeholder:text-gray-400
                               focus:outline-none focus:border-orange transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-brand font-semibold text-[14px] mb-2">
                  {t('registerPage.phoneLabel')}
                </label>
                <PhoneInput
                  value={form.phone}
                  onChange={(v) => setForm(p => ({ ...p, phone: v }))}
                  required
                  className="w-full bg-white border-2 border-gray-200 rounded-xl pr-4 py-3.5
                             text-brand text-[15px] placeholder:text-gray-400
                             focus:outline-none focus:border-orange transition-all"
                />
              </div>

              <div>
                <label className="block text-brand font-semibold text-[14px] mb-2">{t('registerPage.passwordLabel')}</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder={t('registerPage.passwordPlaceholder')}
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

                {form.password && (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {pwChecks.map(c => (
                      <span key={c.label}
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors
                                       ${c.valid ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {c.valid && <Check size={12} strokeWidth={3} />} {c.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <label className="flex items-start gap-3 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-2 border-gray-300 text-orange focus:ring-orange focus:ring-2"
                />
                <span className="text-gray-500 text-[13px] leading-relaxed">
                  {t('registerPage.agreement.prefix')} <a href="#" className="text-orange font-semibold hover:underline">{t('registerPage.agreement.terms')}</a> {t('registerPage.agreement.and')}{' '}
                  <a href="#" className="text-orange font-semibold hover:underline">{t('registerPage.agreement.privacy')}</a>{t('registerPage.agreement.suffix')}
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || !agreed || !pwStrong}
                className="w-full inline-flex items-center justify-center gap-2 bg-orange-grad
                           hover:brightness-110 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange/30
                           hover:-translate-y-0.5 transition-all duration-200 text-[15px]
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('registerPage.submitting')}
                  </>
                ) : (
                  <>{t('registerPage.submit')} <ArrowRight size={18} /></>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
