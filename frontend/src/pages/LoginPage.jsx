import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, ArrowRight, GraduationCap, Mail, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { login, selectAuth, clearError } from '../features/auth/authSlice';

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

    // Just submitted the login form — route by role
    if (justSubmitted.current) {
      justSubmitted.current = false;
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
      return;
    }

    // Landed on /login while already logged in (e.g. F5) — send home, NOT admin
    navigate('/', { replace: true });
  }, [isAuthenticated, user, navigate, location]);

  useEffect(() => () => { dispatch(clearError()); }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    justSubmitted.current = true;
    dispatch(login(form));
  };

  return (
    <>
      <Helmet><title>Kirish – TOPEX Texnikumi</title></Helmet>

      <div className="min-h-screen bg-[#F8FAFF] flex overflow-hidden font-sans">
        
        {/* Left panel – Info Section */}
        <div className="hidden lg:flex lg:w-[45%] bg-navy items-center justify-center p-12 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue/20 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/4"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-coral/10 rounded-full blur-[100px] translate-y-1/2 translate-x-1/4"></div>
          
          <div className="relative z-10 text-center max-w-sm">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 bg-gradient-to-br from-blue to-blue-dark rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-blue/20"
            >
              <GraduationCap size={48} className="text-white" />
            </motion.div>

            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white font-black text-4xl mb-4 italic tracking-tight"
            >
              Xush kelibsiz!
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/60 text-lg leading-relaxed mb-12"
            >
              Sifatli ta'lim va zamonaviy ko'nikmalar dunyosiga qaytishingizdan xursandmiz.
            </motion.p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { v: '200+', l: 'Kurslar', i: Sparkles },
                { v: '12K+', l: 'Talabalar', i: CheckCircle2 },
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
                >
                  <p className="text-white font-black text-2xl mb-1">{item.v}</p>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{item.l}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form – Login Section */}
        <div className="flex-1 flex items-center justify-center p-6 relative">
          <div className="absolute top-10 left-10 md:left-auto md:right-10">
             <Link to="/" className="text-navy/40 hover:text-navy font-bold flex items-center gap-2 transition-all">
                <ArrowRight size={18} className="rotate-180" /> Asosiy sahifa
             </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[420px]"
          >
            <div className="mb-10 text-center lg:text-left">
              <Link to="/" className="inline-flex items-center gap-3 mb-8 lg:hidden">
                <div className="w-10 h-10 bg-navy rounded-2xl flex items-center justify-center shadow-lg shadow-navy/20">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <span className="text-navy font-black text-2xl tracking-tight">TOPEX</span>
              </Link>
              <h1 className="text-4xl font-black text-navy mb-3 italic tracking-tight uppercase">С возвращением</h1>
              <p className="text-gray-400 font-medium">Войдите, чтобы продолжить обучение</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-1">Электронная почта</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue transition-colors" size={18} />
                  <input
                    type="email"
                    className="w-full bg-white border border-gray-100 rounded-2xl py-4.5 pl-12 pr-4 text-navy text-[15px] focus:outline-none focus:ring-4 focus:ring-blue/5 focus:border-blue transition-all shadow-sm"
                    placeholder="siz@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-1">Пароль</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue transition-colors" size={18} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="w-full bg-white border border-gray-100 rounded-2xl py-4.5 pl-12 pr-12 text-navy text-[15px] focus:outline-none focus:ring-4 focus:ring-blue/5 focus:border-blue transition-all shadow-sm"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-navy transition-colors">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4 text-red-600 text-[13px] font-medium flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  {error}
                </motion.div>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-navy hover:bg-blue text-white font-black py-5 rounded-2xl shadow-xl shadow-navy/10 hover:shadow-blue/20 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 text-base mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Kirish...
                  </span>
                ) : (
                  <>Войти <ArrowRight size={20} /></>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400 font-medium text-sm">
                Нет аккаунта?{' '}
                <Link to="/register" className="text-blue font-black hover:underline transition-all">
                  Регистрация
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

