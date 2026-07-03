import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Camera, BookOpen, CheckCircle, TrendingUp, Phone, AtSign, KeyRound, Eye, EyeOff,
} from 'lucide-react';
import { selectUser } from '../features/auth/authSlice';
import { setCredentials } from '../features/auth/authSlice';
import PhoneInput from '../components/ui/PhoneInput';
import api from '../services/api';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const fileRef = useRef();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Kirish ma'lumotlari (login + telefon)
  const [cred, setCred] = useState({ login: user?.login || '', phone: user?.phone || '' });
  const [savingCred, setSavingCred] = useState(false);
  // Parolni o'zgartirish
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', { name: form.name });
      dispatch(setCredentials({ user: data.user }));
      toast.success(t('profileCred.profileUpdated'));
    } catch (err) {
      toast.error(err.response?.data?.message || t('profileCred.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCred = async (e) => {
    e.preventDefault();
    if (cred.login && cred.login.trim().length < 3) {
      toast.error(t('profileCred.errLogin'));
      return;
    }
    setSavingCred(true);
    try {
      const { data } = await api.put('/auth/profile', { login: cred.login, phone: cred.phone });
      dispatch(setCredentials({ user: data.user }));
      toast.success(t('profileCred.credUpdated'));
    } catch (err) {
      toast.error(err.response?.data?.message || t('profileCred.saveError'));
    } finally {
      setSavingCred(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if ((pwd.newPassword || '').length < 4) {
      toast.error(t('profileCred.errNewPassword'));
      return;
    }
    setSavingPwd(true);
    try {
      await api.put('/auth/change-password', pwd);
      toast.success(t('profileCred.passwordUpdated'));
      setPwd({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || t('profileCred.passwordError'));
    } finally {
      setSavingPwd(false);
    }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('avatar', file);
    setUploading(true);
    try {
      const { data } = await api.put('/auth/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      dispatch(setCredentials({ user: data.user }));
      toast.success(t('profileCred.avatarUpdated'));
    } catch {
      toast.error(t('profileCred.avatarError'));
    } finally {
      setUploading(false);
    }
  };

  const enrolled = user?.enrolledCourses || [];
  const completed = enrolled.filter(e => e.progress === 100).length;
  const totalProgress = enrolled.length
    ? Math.round(enrolled.reduce((s, e) => s + e.progress, 0) / enrolled.length)
    : 0;

  return (
    <>
      <Helmet>
        <title>Profile – TOPEX</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="py-10 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Profile Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-br from-brand to-brand-dark rounded-3xl overflow-hidden mb-8"
          >
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: '24px 24px',
              }}
            />
            <div className="relative p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-4 border-white/20 overflow-hidden shadow-xl">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-orange flex items-center justify-center text-white text-4xl font-black">
                      {user?.name?.[0] || '?'}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-9 h-9 bg-orange hover:bg-orange-dark rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                >
                  {uploading
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Camera size={15} className="text-white" />
                  }
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-white text-3xl sm:text-4xl font-black mb-1">{user?.name}</h1>
                <p className="text-white/70 text-sm mb-3">{user?.email}</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  user?.role === 'SUPER_ADMIN' ? 'bg-coral/20 text-coral' :
                  user?.role === 'ADMIN' ? 'bg-orange/20 text-orange' :
                  'bg-white/10 text-white/80'
                }`}>
                  {user?.role}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Left Column: Stats ── */}
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-gray-100 rounded-2xl shadow-card p-6"
              >
                <h3 className="text-navy font-bold text-sm uppercase tracking-wider mb-5">{t('profile.stats') || 'Статистика'}</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center">
                      <BookOpen size={20} className="text-blue" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-navy">{enrolled.length}</p>
                      <p className="text-gray-500 text-xs">{t('profile.enrolledCourses')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center">
                      <CheckCircle size={20} className="text-teal-dark" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-navy">{completed}</p>
                      <p className="text-gray-500 text-xs">{t('profile.completed') || 'Завершено'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
                      <TrendingUp size={20} className="text-coral-dark" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-navy">{totalProgress}%</p>
                      <p className="text-gray-500 text-xs">{t('profile.avgProgress') || 'Общий прогресс'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ── Right Column: Edit + Courses ── */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white border border-gray-100 rounded-2xl shadow-card p-6 sm:p-8"
              >
                <h2 className="text-navy font-black text-xl mb-6">{t('profile.editProfile')}</h2>
                <form onSubmit={handleSave} className="space-y-5">
                  <div>
                    <label className="block text-navy font-semibold text-sm mb-2">{t('auth.name')}</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      minLength={2}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-navy text-sm
                                 placeholder-gray-400 focus:outline-none focus:border-orange/50 focus:ring-2 focus:ring-orange/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-navy font-semibold text-sm mb-2">{t('profile.bio')}</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      rows={3}
                      maxLength={500}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-navy text-sm
                                 placeholder-gray-400 focus:outline-none focus:border-orange/50 focus:ring-2 focus:ring-orange/10 transition-all resize-none"
                      placeholder="Расскажите о себе..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 bg-orange hover:brightness-110
                               text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-orange/20
                               hover:-translate-y-0.5 transition-all duration-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Сохранение...</>
                    ) : t('profile.saveChanges')}
                  </button>
                </form>
              </motion.div>

              {/* ── Kirish ma'lumotlari (login / telefon / parol) ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="bg-white border border-gray-100 rounded-2xl shadow-card p-6 sm:p-8"
              >
                <h2 className="text-navy font-black text-xl mb-1">{t('profileCred.title')}</h2>
                <p className="text-gray-500 text-sm mb-6">{t('profileCred.subtitle')}</p>

                <form onSubmit={handleSaveCred} className="space-y-5">
                  <div>
                    <label className="block text-navy font-semibold text-sm mb-2 flex items-center gap-1.5">
                      <AtSign size={15} className="text-orange" /> {t('profileCred.loginLabel')}
                    </label>
                    <input
                      type="text"
                      value={cred.login}
                      onChange={(e) => setCred({ ...cred, login: e.target.value })}
                      placeholder={t('profileCred.loginPlaceholder')}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-navy text-sm
                                 placeholder-gray-400 focus:outline-none focus:border-orange/50 focus:ring-2 focus:ring-orange/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-navy font-semibold text-sm mb-2 flex items-center gap-1.5">
                      <Phone size={15} className="text-orange" /> {t('profileCred.phoneLabel')}
                    </label>
                    <PhoneInput
                      value={cred.phone}
                      onChange={(v) => setCred({ ...cred, phone: v })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pr-4 text-navy text-sm
                                 placeholder-gray-400 focus:outline-none focus:border-orange/50 focus:ring-2 focus:ring-orange/10 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={savingCred}
                    className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark
                               text-white font-bold px-8 py-3.5 rounded-xl shadow-lg
                               hover:-translate-y-0.5 transition-all duration-200 text-sm disabled:opacity-60"
                  >
                    {savingCred ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('profileCred.saving')}</> : t('profileCred.save')}
                  </button>
                </form>

                <div className="border-t border-gray-100 my-7" />

                <h3 className="text-navy font-bold text-base mb-5 flex items-center gap-1.5">
                  <KeyRound size={17} className="text-orange" /> {t('profileCred.passwordTitle')}
                </h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={pwd.currentPassword}
                      onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
                      placeholder={t('profileCred.currentPassword')}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-navy text-sm
                                 placeholder-gray-400 focus:outline-none focus:border-orange/50 focus:ring-2 focus:ring-orange/10 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={pwd.newPassword}
                      onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
                      placeholder={t('profileCred.newPassword')}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 pr-12 text-navy text-sm
                                 placeholder-gray-400 focus:outline-none focus:border-orange/50 focus:ring-2 focus:ring-orange/10 transition-all"
                    />
                    <button type="button" onClick={() => setShowPwd(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange transition-colors">
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={savingPwd}
                    className="inline-flex items-center justify-center gap-2 bg-orange hover:brightness-110
                               text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-orange/20
                               hover:-translate-y-0.5 transition-all duration-200 text-sm disabled:opacity-60"
                  >
                    {savingPwd ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('profileCred.saving')}</> : t('profileCred.updatePassword')}
                  </button>
                </form>
              </motion.div>

              {enrolled.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white border border-gray-100 rounded-2xl shadow-card p-6 sm:p-8"
                >
                  <h2 className="text-navy font-black text-xl mb-6">{t('profile.enrolledCourses')}</h2>
                  <div className="space-y-3">
                    {enrolled.map((enrollment) => (
                      <div
                        key={enrollment.course?._id || enrollment.course}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-faint transition-colors"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue to-blue-dark flex items-center justify-center shadow-md flex-shrink-0">
                          <BookOpen size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-navy font-bold text-sm truncate">{enrollment.course?.title || 'Course'}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-orange to-orange-dark rounded-full transition-all duration-500"
                                style={{ width: `${enrollment.progress}%` }}
                              />
                            </div>
                            <span className="text-gray-500 text-xs font-semibold min-w-[3rem] text-right">{enrollment.progress}%</span>
                          </div>
                        </div>
                        {enrollment.progress === 100 && (
                          <div className="w-9 h-9 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0">
                            <CheckCircle size={18} className="text-teal-dark" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}


            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;