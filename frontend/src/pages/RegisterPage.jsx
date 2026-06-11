import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, ArrowRight, CheckCircle2, BookOpen, User, Mail, Lock, Sparkles, GraduationCap } from 'lucide-react';
import { register, selectAuth, clearError } from '../features/auth/authSlice';

const checks = (pw) => [
  { label: '8+ belgi', valid: pw.length >= 8 },
  { label: 'Katta harf', valid: /[A-Z]/.test(pw) },
  { label: 'Raqam', valid: /\d/.test(pw) },
];

const RegisterPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector(selectAuth);
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const justSubmitted = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;

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

    navigate('/', { replace: true });
  }, [isAuthenticated, user, navigate, location]);

  useEffect(() => () => { dispatch(clearError()); }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    justSubmitted.current = true;
    dispatch(register(form));
  };

  return (
    <>
      <Helmet><title>Ro'yxatdan o'tish – TOPEX Texnikumi</title></Helmet>

      <div className="min-h-screen bg-[#F8FAFF] flex overflow-hidden font-sans">
        
        {/* Left panel – Info Section */}
        <div className="hidden lg:flex lg:w-[45%] bg-navy items-center justify-center p-12 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-coral/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative z-10 max-w-md">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-gradient-to-br from-blue to-blue-dark rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl shadow-blue/20"
            >
              <GraduationCap size={40} className="text-white" />
            </motion.div>

            <motion.h2 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white font-black text-5xl leading-tight mb-6"
            >
              Kelajakni <br/> <span className="text-blue">biz bilan</span> <br/> quring!
            </motion.h2>

            <motion.p 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/60 text-lg leading-relaxed mb-12"
            >
              TOPEX Texnikumi – zamonaviy ta'lim va amaliy ko'nikmalar markazi. Biz bilan birga o'z potensialingizni oching.
            </motion.p>

            <div className="space-y-6">
              {[
                { text: "Zamonaviy 10–11 sinf dasturi", icon: CheckCircle2 },
                { text: "Oylik 2 000 000 so'mgacha stipendiya", icon: Sparkles },
                { text: "Xalqaro darajadagi sertifikatlar", icon: BookOpen },
              ].map((item, i) => (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  key={i} 
                  className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue/20 flex items-center justify-center text-blue">
                    <item.icon size={18} />
                  </div>
                  <span className="text-white/80 font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form – Register Section */}
        <div className="flex-1 flex items-center justify-center p-6 relative">
          <div className="absolute top-10 right-10 hidden md:block">
             <Link to="/" className="text-navy/40 hover:text-navy font-bold flex items-center gap-2 transition-all">
                Asosiy sahifa <ArrowRight size={18} />
             </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-[460px]"
          >
            <div className="mb-10 text-center lg:text-left">
              <Link to="/" className="inline-flex items-center gap-3 mb-8 lg:hidden">
                <div className="w-10 h-10 bg-navy rounded-2xl flex items-center justify-center shadow-lg shadow-navy/20">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <span className="text-navy font-black text-2xl tracking-tight">TOPEX</span>
              </Link>
              <h1 className="text-4xl font-black text-navy mb-3 italic tracking-tight uppercase">Присоединиться к TOPEX</h1>
              <p className="text-gray-400 font-medium">Начните своё обучение сегодня!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-1">Полное имя</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue transition-colors" size={18} />
                  <input
                    type="text"
                    className="w-full bg-white border border-gray-100 rounded-2xl py-4.5 pl-12 pr-4 text-navy text-[15px] focus:outline-none focus:ring-4 focus:ring-blue/5 focus:border-blue transition-all shadow-sm"
                    placeholder="Ism Familiya"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              </div>

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
                    placeholder="Kuchli parol yarating"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-navy transition-colors">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Password Checks */}
                <AnimatePresence>
                  {form.password.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-3 gap-2 pt-1"
                    >
                      {checks(form.password).map(({ label, valid }) => (
                        <div key={label} className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${valid ? 'bg-blue' : 'bg-gray-200'}`} />
                          <span className={`text-[10px] font-bold uppercase tracking-tight ${valid ? 'text-blue' : 'text-gray-300'}`}>
                            {label}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
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
                    Загрузка...
                  </span>
                ) : (
                  <>Создать аккаунт <ArrowRight size={20} /></>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400 font-medium text-sm">
                Уже есть аккаунт?{' '}
                <Link to="/login" className="text-blue font-black hover:underline transition-all">
                  Войти
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
