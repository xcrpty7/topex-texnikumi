import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Settings, Save, Phone, Mail, MapPin, Clock, Globe, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || '';
const imgSrc = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('/assets')) return url;
  return `${API_URL}${url}`;
};

const ImageUploadField = ({ label, value, onChange, hint }) => {
  const { t } = useTranslation();
  const ref = useRef();
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    try {
      setUploading(true);
      const res = await api.post('/admin/settings/upload-image', fd);
      onChange(res.data.data.url);
      toast.success(t('admin.imageUploaded'));
    } catch {
      toast.error(t('admin.imageUploadError'));
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = '';
    }
  };

  return (
    <div>
      <label className="block font-mono text-xs mb-2" style={{ color: '#61677A' }}>{label}</label>
      {hint && <p className="font-mono text-[10px] mb-2" style={{ color: '#9CA3AF' }}>{hint}</p>}
      <div className="flex items-center gap-3 flex-wrap">
        {value && (
          <img src={imgSrc(value)} alt="" className="w-20 h-20 object-cover rounded-xl"
            style={{ border: '1px solid #E5E7EA' }} />
        )}
        <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-60"
          style={{ border: '2px dashed #D8D9DA', color: '#2563EB', background: '#EFF6FF' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#2563EB'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#D8D9DA'}>
          {uploading ? t('admin.uploading') : `+ ${t('admin.uploadImage')}`}
        </button>
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, placeholder, type = 'text', icon: Icon }) => (
  <div>
    <label className="flex items-center gap-1.5 font-mono text-xs mb-1" style={{ color: '#61677A' }}>
      {Icon && <Icon size={11} />} {label}
    </label>
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg font-mono text-sm outline-none transition-colors"
      style={{ background: '#FFFFFF', border: '1px solid #D8D9DA', color: '#272829' }}
      onFocus={e => e.target.style.borderColor = '#2563EB'}
      onBlur={e => e.target.style.borderColor = '#D8D9DA'}
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div>
    <label className="block font-mono text-xs mb-1" style={{ color: '#61677A' }}>{label}</label>
    <textarea
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows}
      className="w-full px-3 py-2 rounded-lg font-mono text-sm outline-none resize-none transition-colors"
      style={{ background: '#FFFFFF', border: '1px solid #D8D9DA', color: '#272829' }}
      onFocus={e => e.target.style.borderColor = '#2563EB'}
      onBlur={e => e.target.style.borderColor = '#D8D9DA'}
    />
  </div>
);

const AdminSettings = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    phone: '', phone2: '', email: '', address: '', workingHours: '', mapLink: '',
    telegram: '', instagram: '', facebook: '', youtube: '',
    heroTitle: '', heroSubtitle: '', heroBtn: '',
    heroImage: '', heroBgImage: '', aboutImage: '',
    aboutTitle: '', aboutText: '',
    statsStudents: '', statsBranches: '', statsTeachers: '', statsGrades: '',
    footerDescription: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/settings');
      const d = res.data.data;
      setForm({
        phone: d.phone || '', phone2: d.phone2 || '', email: d.email || '',
        address: d.address || '', workingHours: d.workingHours || '', mapLink: d.mapLink || '',
        telegram: d.telegram || '', instagram: d.instagram || '',
        facebook: d.facebook || '', youtube: d.youtube || '',
        heroTitle: d.heroTitle || '', heroSubtitle: d.heroSubtitle || '', heroBtn: d.heroBtn || '',
        heroImage: d.heroImage || '', heroBgImage: d.heroBgImage || '', aboutImage: d.aboutImage || '',
        aboutTitle: d.aboutTitle || '', aboutText: d.aboutText || '',
        statsStudents: d.statsStudents || '', statsBranches: d.statsBranches || '',
        statsTeachers: d.statsTeachers || '', statsGrades: d.statsGrades || '',
        footerDescription: d.footerDescription || '',
      });
    } catch { toast.error(t('admin.loadError')); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const set = (key) => (val) => setForm(p => ({ ...p, [key]: val }));

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/admin/settings', form);
      toast.success(t('adminSettings.saved'));
    } catch { toast.error(t('admin.error')); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="text-center py-20 font-mono text-sm" style={{ color: '#61677A' }}>{t('admin.loading')}</div>
  );

  const Section = ({ title, children }) => (
    <div className="rounded-xl p-5 mb-4" style={{ background: '#FFFFFF', border: '1px solid #E5E7EA' }}>
      <h3 className="font-mono text-sm font-semibold mb-4 pb-3" style={{ color: '#2563EB', borderBottom: '1px solid #E5E7EA' }}>{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );

  return (
    <><Helmet><title>{t('adminSettings.pageTitle')}</title></Helmet>
    <div style={{ color: '#272829' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-mono font-bold flex items-center gap-2">
            <Settings size={20} style={{ color: '#2563EB' }} /> {t('adminSettings.header')}
          </h1>
          <p className="font-mono text-xs mt-1" style={{ color: '#61677A' }}>{t('adminSettings.subtitle')}</p>
        </div>
        <button onClick={() => load()} className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs transition-colors"
          style={{ background: '#E5E7EA', color: '#61677A' }}>
          <RefreshCw size={12} /> {t('admin.refresh')}
        </button>
      </div>

      <form onSubmit={handleSave}>
        <Section title={t('adminSettings.sectionImages')}>
          <div className="md:col-span-2">
            <ImageUploadField
              label={t('adminSettings.heroImage')}
              value={form.heroImage}
              onChange={val => setForm(p => ({ ...p, heroImage: val }))}
              hint={t('adminSettings.heroImageHint')}
            />
          </div>
          <div className="md:col-span-2">
            <ImageUploadField
              label={t('adminSettings.heroBgImage')}
              value={form.heroBgImage}
              onChange={val => setForm(p => ({ ...p, heroBgImage: val }))}
              hint={t('adminSettings.heroBgHint')}
            />
          </div>
          <div className="md:col-span-2">
            <ImageUploadField
              label={t('adminSettings.aboutImage')}
              value={form.aboutImage}
              onChange={val => setForm(p => ({ ...p, aboutImage: val }))}
              hint={t('adminSettings.aboutImageHint')}
            />
          </div>
        </Section>

        <Section title={t('adminSettings.sectionContact')}>
          <Field label={t('adminSettings.phone1')} value={form.phone} onChange={set('phone')} placeholder="+998 71 123 45 67" icon={Phone} />
          <Field label={t('adminSettings.phone2')} value={form.phone2} onChange={set('phone2')} placeholder="+998 90 123 45 67" icon={Phone} />
          <Field label={t('adminSettings.email')} value={form.email} onChange={set('email')} placeholder="info@topex.uz" icon={Mail} type="email" />
          <Field label={t('adminSettings.workingHours')} value={form.workingHours} onChange={set('workingHours')} placeholder="Du-Sha: 8:00 - 18:00" icon={Clock} />
          <div className="md:col-span-2">
            <Field label={t('adminSettings.address')} value={form.address} onChange={set('address')} placeholder="Toshkent shahri..." icon={MapPin} />
          </div>
          <div className="md:col-span-2">
            <Field label={t('adminSettings.mapLink')} value={form.mapLink} onChange={set('mapLink')} placeholder="https://maps.google.com/..." icon={Globe} />
          </div>
        </Section>

        <Section title={t('adminSettings.sectionSocial')}>
          <Field label="Telegram" value={form.telegram} onChange={set('telegram')} placeholder="https://t.me/topextexnikumi" />
          <Field label="Instagram" value={form.instagram} onChange={set('instagram')} placeholder="https://instagram.com/topex..." />
          <Field label="Facebook" value={form.facebook} onChange={set('facebook')} placeholder="https://facebook.com/topex..." />
          <Field label="YouTube" value={form.youtube} onChange={set('youtube')} placeholder="https://youtube.com/@topex..." />
        </Section>

        <Section title={t('adminSettings.sectionHero')}>
          <div className="md:col-span-2">
            <Field label={t('adminSettings.heroTitleField')} value={form.heroTitle} onChange={set('heroTitle')} placeholder="Kelajakni bugun shakllantir" />
          </div>
          <div className="md:col-span-2">
            <TextAreaField label={t('adminSettings.heroSubtitleField')} value={form.heroSubtitle} onChange={set('heroSubtitle')} placeholder="Topex texnikumida sifatli ta'lim oling..." rows={2} />
          </div>
          <Field label={t('adminSettings.heroBtnField')} value={form.heroBtn} onChange={set('heroBtn')} placeholder="Hozir ariza topshiring" />
        </Section>

        <Section title={t('adminSettings.sectionStats')}>
          <Field label={t('adminSettings.statsStudents')} value={form.statsStudents} onChange={set('statsStudents')} placeholder="600+" />
          <Field label={t('adminSettings.statsBranches')} value={form.statsBranches} onChange={set('statsBranches')} placeholder="3+" />
          <Field label={t('adminSettings.statsTeachers')} value={form.statsTeachers} onChange={set('statsTeachers')} placeholder="50+" />
          <Field label={t('adminSettings.statsGrades')} value={form.statsGrades} onChange={set('statsGrades')} placeholder="10-11" />
        </Section>

        <Section title={t('adminSettings.sectionAbout')}>
          <div className="md:col-span-2">
            <Field label={t('adminSettings.aboutTitleField')} value={form.aboutTitle} onChange={set('aboutTitle')} placeholder="Topex texnikumi haqida" />
          </div>
          <div className="md:col-span-2">
            <TextAreaField
              label={t('adminSettings.aboutTextField')}
              value={form.aboutText}
              onChange={set('aboutText')}
              placeholder={t('adminSettings.aboutTextPlaceholder')}
              rows={12}
            />
          </div>
        </Section>

        <Section title={t('adminSettings.sectionFooter')}>
          <div className="md:col-span-2">
            <TextAreaField label={t('adminSettings.footerDesc')} value={form.footerDescription} onChange={set('footerDescription')} placeholder="Toshkent, Chilonzor tumanidagi zamonaviy xususiy texnikum..." rows={2} />
          </div>
        </Section>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm font-semibold transition-all disabled:opacity-50"
            style={{ background: '#272829', color: '#fff' }}>
            <Save size={16} />
            {saving ? t('admin.saving') : t('adminSettings.saveAll')}
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default AdminSettings;
