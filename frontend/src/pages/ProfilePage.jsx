import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Camera, BookOpen, CheckCircle } from 'lucide-react';
import { selectUser } from '../features/auth/authSlice';
import { setCredentials } from '../features/auth/authSlice';
import api from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const fileRef = useRef();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', form);
      dispatch(setCredentials({ user: data.data }));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('avatar', file);
    setUploading(true);
    try {
      const { data } = await api.post('/users/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      dispatch(setCredentials({ user: data.data }));
      toast.success('Avatar updated!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Helmet><title>Profile – TOPEX</title></Helmet>

      <div className="page-container py-12 max-w-4xl mx-auto">
        <h1 className="section-title mb-8">{t('profile.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="glass-card p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full bg-secondary mx-auto flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-24 h-24 object-cover rounded-full" />
                  ) : user?.name?.[0]}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-secondary hover:bg-secondary-light rounded-full flex items-center justify-center transition-colors"
                >
                  {uploading ? <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" /> : <Camera size={14} className="text-white" />}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
              </div>

              <h2 className="text-surface font-bold text-lg">{user?.name}</h2>
              <p className="text-accent text-sm mb-3">{user?.email}</p>
              <Badge variant={user?.role === 'SUPER_ADMIN' ? 'danger' : user?.role === 'ADMIN' ? 'warning' : 'primary'}>
                {user?.role}
              </Badge>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-surface font-bold text-lg mb-5">{t('profile.editProfile')}</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <Input
                  label={t('auth.name')}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  minLength={2}
                  required
                />
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-accent">{t('profile.bio')}</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    maxLength={500}
                    className="input-field resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <Button type="submit" loading={saving}>{t('profile.saveChanges')}</Button>
              </form>
            </div>

            {user?.enrolledCourses?.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-surface font-bold text-lg mb-5">{t('profile.enrolledCourses')}</h2>
                <div className="space-y-3">
                  {user.enrolledCourses.map((enrollment) => (
                    <div key={enrollment.course?._id || enrollment.course} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                        <BookOpen size={18} className="text-secondary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-surface text-sm font-medium">{enrollment.course?.title || 'Course'}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-secondary rounded-full transition-all" style={{ width: `${enrollment.progress}%` }} />
                          </div>
                          <span className="text-accent text-xs">{enrollment.progress}%</span>
                        </div>
                      </div>
                      {enrollment.progress === 100 && <CheckCircle size={18} className="text-green-400" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
