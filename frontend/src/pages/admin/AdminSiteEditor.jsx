import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home, BarChart3, Info, BookOpen, List, CheckSquare,
  Video, HelpCircle, MessageSquare, GraduationCap, FileText,
  Image, Award, Phone,
  Save, Plus, Trash2, Upload,
  ExternalLink, Loader2, Edit2, X, Eye, Camera,
  Search, AlertCircle, RotateCcw,
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import ConfirmModal from '../../components/ui/ConfirmModal';

const API_URL = import.meta.env.VITE_API_URL || '';

const imgSrc = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('/assets')) return url;
  return `${API_URL}${url}`;
};

const ICON_OPTIONS = ['Code','TrendingUp','Palette','ShieldCheck','Hotel','BarChart3','FlaskConical','Sprout','BookOpen','Star','Award','Users','Globe','Cpu','Music','Camera'];

/* ─── Small reusable components ─────────────────────────── */

const Field = ({ label, value, onChange, type = 'text', placeholder }) => {
  const { t } = useTranslation();
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      <input
        type={type} value={value ?? ''} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none border border-gray-200 focus:border-blue-500 transition-colors"
      />
    </div>
  );
};

const TextArea = ({ label, value, onChange, rows = 4, placeholder }) => {
  const { t } = useTranslation();
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      <textarea
        value={value ?? ''} onChange={e => onChange(e.target.value)}
        rows={rows} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none border border-gray-200 focus:border-blue-500 transition-colors resize-none"
      />
    </div>
  );
};

const ImageUpload = ({ value, onChange, label }) => {
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
      toast.success(t('adminSiteEditor.imageUpload.success'));
    } catch {
      toast.error(t('adminSiteEditor.imageUpload.error'));
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-2">{label || t('adminSiteEditor.imageUpload.label')}</label>
      <div className="flex items-center gap-3 flex-wrap">
        {value && (
          <img src={imgSrc(value)} alt="" className="w-20 h-20 object-cover rounded-xl border border-gray-200" />
        )}
        <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border-2 border-dashed border-gray-300 hover:border-blue-400 text-blue-600 transition-colors disabled:opacity-60">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? t('adminSiteEditor.imageUpload.uploading') : t('adminSiteEditor.imageUpload.uploadBtn')}
        </button>
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
};

const SaveBtn = ({ onClick, saving, saved }) => {
  const { t } = useTranslation();
  return (
    <button onClick={onClick} disabled={saving}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 hover:-translate-y-0.5"
      style={{ background: saved ? '#16A34A' : '#272829', color: '#fff', transition: 'background 0.3s' }}>
      {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
      {saving ? t('adminSiteEditor.saveBtn.saving') : saved ? t('adminSiteEditor.saveBtn.saved') : t('adminSiteEditor.saveBtn.save')}
    </button>
  );
};

/* ─── Section Editors ───────────────────────────────────── */

const HeroEditor = ({ s, onChange, onSave, saving, saved }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label={t('adminSiteEditor.hero.label')} value={s.heroLabel} onChange={v => onChange('heroLabel', v)} placeholder={t('adminSiteEditor.hero.phLabel')} />
        <Field label={t('adminSiteEditor.hero.btn1')} value={s.heroBtn} onChange={v => onChange('heroBtn', v)} placeholder={t('adminSiteEditor.hero.phBtn1')} />
        <div className="md:col-span-2">
          <TextArea label={t('adminSiteEditor.hero.title')} value={s.heroTitle} onChange={v => onChange('heroTitle', v)} rows={3}
            placeholder={t('adminSiteEditor.hero.phTitle')} />
        </div>
        <div className="md:col-span-2">
          <TextArea label={t('adminSiteEditor.hero.subtitle')} value={s.heroSubtitle} onChange={v => onChange('heroSubtitle', v)} rows={2}
            placeholder={t('adminSiteEditor.hero.phSubtitle')} />
        </div>
        <Field label={t('adminSiteEditor.hero.btn2')} value={s.heroBtn2} onChange={v => onChange('heroBtn2', v)} placeholder={t('adminSiteEditor.hero.phBtn2')} />
        <div className="md:col-span-2">
          <TextArea
            label={t('adminSiteEditor.hero.note')}
            value={s.heroNote}
            onChange={v => onChange('heroNote', v)}
            rows={2}
            placeholder={t('adminSiteEditor.hero.phNote')}
          />
        </div>
      </div>
      <ImageUpload label={t('adminSiteEditor.hero.image')} value={s.heroImage} onChange={v => onChange('heroImage', v)} />
      <div className="p-4 rounded-xl border border-blue-100 bg-blue-50">
        <p className="text-xs font-semibold text-blue-700 mb-3">{t('adminSiteEditor.hero.bgLabel')}</p>
        <ImageUpload label={t('adminSiteEditor.hero.bgImage')} value={s.heroBgImage} onChange={v => onChange('heroBgImage', v)} />
      </div>
      <div className="flex justify-end pt-2">
        <SaveBtn onClick={onSave} saving={saving} saved={saved} />
      </div>
    </div>
  );
};

const StatsEditor = ({ s, onChange, onSave, saving, saved }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label={t('adminSiteEditor.stats.students')} value={s.statsStudents} onChange={v => onChange('statsStudents', v)} placeholder={t('adminSiteEditor.stats.phStudents')} />
        <Field label={t('adminSiteEditor.stats.branches')}   value={s.statsBranches} onChange={v => onChange('statsBranches', v)} placeholder={t('adminSiteEditor.stats.phBranches')} />
        <Field label={t('adminSiteEditor.stats.teachers')}    value={s.statsTeachers} onChange={v => onChange('statsTeachers', v)} placeholder={t('adminSiteEditor.stats.phTeachers')} />
        <Field label={t('adminSiteEditor.stats.grades')}          value={s.statsGrades}   onChange={v => onChange('statsGrades', v)}   placeholder={t('adminSiteEditor.stats.phGrades')} />
      </div>
      <div className="flex justify-end">
        <SaveBtn onClick={onSave} saving={saving} saved={saved} />
      </div>
    </div>
  );
};

const AboutEditor = ({ s, onChange, onSave, saving, saved }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <Field label={t('adminSiteEditor.about.label')} value={s.aboutLabel} onChange={v => onChange('aboutLabel', v)} placeholder={t('adminSiteEditor.about.phLabel')} />
      <Field label={t('adminSiteEditor.about.title')} value={s.aboutTitle} onChange={v => onChange('aboutTitle', v)} placeholder={t('adminSiteEditor.about.phTitle')} />
      <TextArea
        label={t('adminSiteEditor.about.text')}
        value={s.aboutText}
        onChange={v => onChange('aboutText', v)}
        rows={14}
        placeholder={t('adminSiteEditor.about.phText')}
      />
      <p className="text-xs text-gray-500 -mt-2">
        {t('adminSiteEditor.about.textHint1')} <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border">Enter</kbd> {t('adminSiteEditor.about.textHint2')}
      </p>
      <ImageUpload label={t('adminSiteEditor.about.image')} value={s.aboutImage} onChange={v => onChange('aboutImage', v)} />
      <div className="flex justify-end">
        <SaveBtn onClick={onSave} saving={saving} saved={saved} />
      </div>
    </div>
  );
};

const SubjectsEditor = ({ subjects, onChange, onSave, saving, saved }) => {
  const { t } = useTranslation();
  const [editing, setEditing] = useState(null);
  const [pendingRemove, setPendingRemove] = useState(null);

  const update = (idx, key, val) => {
    const arr = [...subjects];
    arr[idx] = { ...arr[idx], [key]: val };
    onChange(arr);
  };

  const addNew = () => {
    const newItem = { id: Date.now(), name: t('adminSiteEditor.subjects.defaultName'), desc: t('adminSiteEditor.subjects.defaultDesc'), duration: t('adminSiteEditor.subjects.defaultDuration'), features: t('adminSiteEditor.subjects.defaultFeatures'), imgUrl: '', iconName: 'BookOpen' };
    onChange([...subjects, newItem]);
    setEditing(subjects.length);
  };

  const remove = (idx) => { setPendingRemove(idx); };
  const confirmRemove = () => {
    const arr = subjects.filter((_, i) => i !== pendingRemove);
    onChange(arr);
    if (editing === pendingRemove) setEditing(null);
    setPendingRemove(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{t('adminSiteEditor.subjects.total')} <strong>{subjects.length}</strong> {t('adminSiteEditor.subjects.totalSuffix')}</p>
        <button onClick={addNew}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Plus size={14} /> {t('adminSiteEditor.subjects.addNew')}
        </button>
      </div>

      {subjects.map((sub, idx) => (
        <div key={sub.id || idx} className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
            <div className="flex items-center gap-3">
              {sub.imgUrl && <img src={imgSrc(sub.imgUrl)} alt="" className="w-10 h-10 object-cover rounded-lg" />}
              <div>
                <p className="font-semibold text-sm text-gray-800">{sub.name}</p>
                <p className="text-xs text-gray-400">{sub.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(editing === idx ? null : idx)}
                className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                <Edit2 size={14} />
              </button>
              <button onClick={() => remove(idx)}
                className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {editing === idx && (
            <div className="p-4 space-y-3 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label={t('adminSiteEditor.subjects.name')} value={sub.name} onChange={v => update(idx, 'name', v)} />
                <Field label={t('adminSiteEditor.subjects.duration')} value={sub.duration} onChange={v => update(idx, 'duration', v)} placeholder={t('adminSiteEditor.subjects.phDuration')} />
                <div className="md:col-span-2">
                  <TextArea label={t('adminSiteEditor.subjects.description')} value={sub.desc} onChange={v => update(idx, 'desc', v)} rows={2} />
                </div>
                <div className="md:col-span-2">
                  <Field label={t('adminSiteEditor.subjects.features')} value={sub.features} onChange={v => update(idx, 'features', v)}
                    placeholder={t('adminSiteEditor.subjects.phFeatures')} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">{t('adminSiteEditor.subjects.icon')}</label>
                  <select value={sub.iconName || 'BookOpen'} onChange={e => update(idx, 'iconName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 outline-none">
                    {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
              </div>
              <ImageUpload label={t('adminSiteEditor.subjects.image')} value={sub.imgUrl} onChange={v => update(idx, 'imgUrl', v)} />
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-end pt-2">
        <SaveBtn onClick={onSave} saving={saving} saved={saved} />
      </div>

      <ConfirmModal
        isOpen={pendingRemove !== null}
        onClose={() => setPendingRemove(null)}
        onConfirm={confirmRemove}
        title={t('adminSiteEditor.subjects.deleteTitle')}
        message={t('adminSiteEditor.subjects.deleteMessage')}
        confirmLabel={t('adminSiteEditor.subjects.deleteConfirm')}
      />
    </div>
  );
};

const ExtrasEditor = ({ extras, onChange, onSave, saving, saved }) => {
  const { t } = useTranslation();
  const addItem = () => onChange([...extras, t('adminSiteEditor.extras.defaultItem')]);
  const removeItem = (i) => onChange(extras.filter((_, idx) => idx !== i));
  const updateItem = (i, val) => { const a = [...extras]; a[i] = val; onChange(a); };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{t('adminSiteEditor.extras.title')}</p>
        <button onClick={addItem}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Plus size={14} /> {t('adminSiteEditor.extras.add')}
        </button>
      </div>
      {extras.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <input value={item} onChange={e => updateItem(i, e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg text-sm border border-gray-200 outline-none focus:border-blue-500 transition-colors" />
          <button onClick={() => removeItem(i)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <div className="flex justify-end pt-2">
        <SaveBtn onClick={onSave} saving={saving} saved={saved} />
      </div>
    </div>
  );
};

const FeaturesEditor = ({ s, features, onChange, onChangeKey, onSave, saving, saved }) => {
  const { t } = useTranslation();
  const updateItem = (i, key, val) => {
    const arr = [...features];
    arr[i] = { ...arr[i], [key]: val };
    onChange(arr);
  };
  const addItem = () => onChange([...features, { title: t('adminSiteEditor.features.defaultTitle'), desc: t('adminSiteEditor.features.defaultDesc') }]);
  const removeItem = (i) => onChange(features.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-4 space-y-3">
        <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">{t('adminSiteEditor.features.sectionHeaders')}</p>
        <Field label={t('adminSiteEditor.features.label')} value={s.featuresLabel} onChange={v => onChangeKey('featuresLabel', v)} placeholder={t('adminSiteEditor.features.phLabel')} />
        <Field label={t('adminSiteEditor.features.title')} value={s.featuresTitle} onChange={v => onChangeKey('featuresTitle', v)} placeholder={t('adminSiteEditor.features.phTitle')} />
        <Field label={t('adminSiteEditor.features.subtitle')} value={s.featuresSubtitle} onChange={v => onChangeKey('featuresSubtitle', v)} placeholder={t('adminSiteEditor.features.phSubtitle')} />
      </div>
      <div className="flex justify-between items-center pt-2">
        <p className="text-sm text-gray-500">{t('adminSiteEditor.features.cards')}</p>
        <button onClick={addItem}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Plus size={14} /> {t('adminSiteEditor.features.add')}
        </button>
      </div>
      {features.map((feat, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">{feat.title}</p>
            <button onClick={() => removeItem(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
              <Trash2 size={13} />
            </button>
          </div>
          <Field label={t('adminSiteEditor.features.cardTitle')} value={feat.title} onChange={v => updateItem(i, 'title', v)} />
          <TextArea label={t('adminSiteEditor.features.cardDesc')} value={feat.desc} onChange={v => updateItem(i, 'desc', v)} rows={2} />
        </div>
      ))}
      <div className="flex justify-end pt-2">
        <SaveBtn onClick={onSave} saving={saving} saved={saved} />
      </div>
    </div>
  );
};

/* ─── Grant Kartalari Editor ─────────────────────────────── */

const ScholarshipCardsEditor = ({ s, cards, onChange, onChangeKey, onSave, saving, saved }) => {
  const { t } = useTranslation();
  const COLOR_OPTIONS = ['blue', 'teal', 'blue2', 'coral'];
  const update = (i, key, val) => {
    const arr = [...cards];
    arr[i] = { ...arr[i], [key]: val };
    onChange(arr);
  };

  return (
    <div className="space-y-4">
      <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-4 space-y-3">
        <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">{t('adminSiteEditor.grants.sectionHeaders')}</p>
        <Field label={t('adminSiteEditor.grants.label')} value={s.grantsLabel} onChange={v => onChangeKey('grantsLabel', v)} placeholder={t('adminSiteEditor.grants.phLabel')} />
        <Field label={t('adminSiteEditor.grants.title')} value={s.grantsTitle} onChange={v => onChangeKey('grantsTitle', v)} placeholder={t('adminSiteEditor.grants.phTitle')} />
        <TextArea label={t('adminSiteEditor.grants.subtitle')} value={s.grantsSubtitle} onChange={v => onChangeKey('grantsSubtitle', v)} rows={3} placeholder={t('adminSiteEditor.grants.phSubtitle')} />
      </div>
      <p className="text-xs text-gray-500">{t('adminSiteEditor.grants.hint')}</p>
      {cards.map((card, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('adminSiteEditor.grants.card')} {i + 1}</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t('adminSiteEditor.grants.cardTitle')} value={card.title} onChange={v => update(i, 'title', v)} placeholder={t('adminSiteEditor.grants.phCardTitle')} />
            <Field label={t('adminSiteEditor.grants.cardSubtitle')} value={card.subtitle} onChange={v => update(i, 'subtitle', v)} placeholder={t('adminSiteEditor.grants.phCardSubtitle')} />
            <Field label={t('adminSiteEditor.grants.amount')} value={card.amount} onChange={v => update(i, 'amount', v)} placeholder={t('adminSiteEditor.grants.phAmount')} />
            <Field label={t('adminSiteEditor.grants.currency')} value={card.amountUnit} onChange={v => update(i, 'amountUnit', v)} placeholder={t('adminSiteEditor.grants.phCurrency')} />
            <Field label={t('adminSiteEditor.grants.badge')} value={card.badge} onChange={v => update(i, 'badge', v)} placeholder={t('adminSiteEditor.grants.phBadge')} />
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">{t('adminSiteEditor.grants.colorType')}</label>
              <select value={card.colorType || 'blue'} onChange={e => update(i, 'colorType', e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 outline-none">
                {COLOR_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-end pt-2">
        <SaveBtn onClick={onSave} saving={saving} saved={saved} />
      </div>
    </div>
  );
};

/* ─── Courses Page Editor ────────────────────────────────── */

const CoursesHighlightsEditor = ({ highlights, onChange }) => {
  const { t } = useTranslation();
  const update = (i, key, val) => {
    const arr = [...highlights];
    arr[i] = { ...arr[i], [key]: val };
    onChange(arr);
  };
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 font-semibold">{t('adminSiteEditor.coursesHighlights.hint')}</p>
      {highlights.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('adminSiteEditor.coursesHighlights.card')} {i + 1}</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label={t('adminSiteEditor.coursesHighlights.cardTitle')} value={item.title} onChange={v => update(i, 'title', v)} />
            <Field label={t('adminSiteEditor.coursesHighlights.students')} value={item.students} onChange={v => update(i, 'students', v)} placeholder={t('adminSiteEditor.coursesHighlights.phStudents')} />
          </div>
          <ImageUpload label={t('adminSiteEditor.coursesHighlights.image')} value={item.img} onChange={v => update(i, 'img', v)} />
        </div>
      ))}
    </div>
  );
};

const CoursesPageEditor = ({ s, onChange, onSave, saving, saved }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">{t('adminSiteEditor.coursesPage.heroSection')}</h3>
        <div className="space-y-4">
          <Field label={t('adminSiteEditor.coursesPage.badge')} value={s.coursesHeroBadge} onChange={v => onChange('coursesHeroBadge', v)} placeholder={t('adminSiteEditor.coursesPage.phBadge')} />
          <Field label={t('adminSiteEditor.coursesPage.title')} value={s.coursesHeroTitle} onChange={v => onChange('coursesHeroTitle', v)} placeholder={t('adminSiteEditor.coursesPage.phTitle')} />
          <TextArea label={t('adminSiteEditor.coursesPage.subtitle')} value={s.coursesHeroSubtitle} onChange={v => onChange('coursesHeroSubtitle', v)} rows={2} />
          <ImageUpload label={t('adminSiteEditor.coursesPage.heroImage')} value={s.coursesHeroImage} onChange={v => onChange('coursesHeroImage', v)} />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">{t('adminSiteEditor.coursesPage.facultySection')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t('adminSiteEditor.coursesPage.facultyLabel')} value={s.coursesFacultyLabel} onChange={v => onChange('coursesFacultyLabel', v)} placeholder={t('adminSiteEditor.coursesPage.phFacultyLabel')} />
          <Field label={t('adminSiteEditor.coursesPage.facultyTitle')} value={s.coursesFacultyTitle} onChange={v => onChange('coursesFacultyTitle', v)} placeholder={t('adminSiteEditor.coursesPage.phFacultyTitle')} />
          <div className="md:col-span-2">
            <TextArea label={t('adminSiteEditor.coursesPage.facultySubtitle')} value={s.coursesFacultySubtitle} onChange={v => onChange('coursesFacultySubtitle', v)} rows={2} />
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">{t('adminSiteEditor.coursesPage.cardsSection')}</h3>
        <CoursesHighlightsEditor
          highlights={s.coursesHighlights || []}
          onChange={v => onChange('coursesHighlights', v)}
        />
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">{t('adminSiteEditor.coursesPage.ctaSection')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label={t('adminSiteEditor.coursesPage.ctaLabel')} value={s.coursesCtaLabel} onChange={v => onChange('coursesCtaLabel', v)} placeholder={t('adminSiteEditor.coursesPage.phCtaLabel')} />
          <Field label={t('adminSiteEditor.coursesPage.ctaPhone')} value={s.coursesCtaPhone} onChange={v => onChange('coursesCtaPhone', v)} placeholder={t('adminSiteEditor.coursesPage.phCtaPhone')} />
          <div className="md:col-span-2">
            <TextArea label={t('adminSiteEditor.coursesPage.ctaTitle')} value={s.coursesCtaTitle} onChange={v => onChange('coursesCtaTitle', v)} rows={2} placeholder={t('adminSiteEditor.coursesPage.phCtaTitle')} />
          </div>
          <div className="md:col-span-2">
            <Field label={t('adminSiteEditor.coursesPage.ctaSubtitle')} value={s.coursesCtaSubtitle} onChange={v => onChange('coursesCtaSubtitle', v)} placeholder={t('adminSiteEditor.coursesPage.phCtaSubtitle')} />
          </div>
          <Field label={t('adminSiteEditor.coursesPage.btn1')} value={s.coursesCtaPhoneBtn} onChange={v => onChange('coursesCtaPhoneBtn', v)} placeholder={t('adminSiteEditor.coursesPage.phBtn1')} />
          <Field label={t('adminSiteEditor.coursesPage.btn2')} value={s.coursesCtaHomeBtn} onChange={v => onChange('coursesCtaHomeBtn', v)} placeholder={t('adminSiteEditor.coursesPage.phBtn2')} />
        </div>
      </div>
      <div className="flex justify-end">
        <SaveBtn onClick={onSave} saving={saving} saved={saved} />
      </div>
    </div>
  );
};

/* ─── Diplom Bo'limi Editor ─────────────────────────────── */

const DiplomaEditor = ({ s, onChange, onSave, saving, saved }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">{t('adminSiteEditor.diploma.mainText')}</h3>
        <div className="space-y-4">
          <Field label={t('adminSiteEditor.diploma.title')} value={s.diplomaTitle} onChange={v => onChange('diplomaTitle', v)} placeholder={t('adminSiteEditor.diploma.phTitle')} />
          <TextArea label={t('adminSiteEditor.diploma.text')} value={s.diplomaText} onChange={v => onChange('diplomaText', v)} rows={8}
            placeholder={t('adminSiteEditor.diploma.phText')} />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">{t('adminSiteEditor.diploma.imagesSection')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUpload label={t('adminSiteEditor.diploma.image1')} value={s.diplomaImage1} onChange={v => onChange('diplomaImage1', v)} />
          <ImageUpload label={t('adminSiteEditor.diploma.image2')} value={s.diplomaImage2} onChange={v => onChange('diplomaImage2', v)} />
        </div>
        <p className="text-xs text-gray-400 mt-2">{t('adminSiteEditor.diploma.imagesHint')}</p>
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">{t('adminSiteEditor.diploma.cardsSection')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('adminSiteEditor.diploma.card1')}</p>
            <Field label={t('adminSiteEditor.diploma.cardTitle')} value={s.diplomaCard1Title} onChange={v => onChange('diplomaCard1Title', v)} placeholder={t('adminSiteEditor.diploma.phCard1Title')} />
            <Field label={t('adminSiteEditor.diploma.cardDesc')} value={s.diplomaCard1Desc} onChange={v => onChange('diplomaCard1Desc', v)} placeholder={t('adminSiteEditor.diploma.phCard1Desc')} />
          </div>
          <div className="border border-gray-200 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('adminSiteEditor.diploma.card2')}</p>
            <Field label={t('adminSiteEditor.diploma.cardTitle')} value={s.diplomaCard2Title} onChange={v => onChange('diplomaCard2Title', v)} placeholder={t('adminSiteEditor.diploma.phCard2Title')} />
            <Field label={t('adminSiteEditor.diploma.cardDesc')} value={s.diplomaCard2Desc} onChange={v => onChange('diplomaCard2Desc', v)} placeholder={t('adminSiteEditor.diploma.phCard2Desc')} />
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <SaveBtn onClick={onSave} saving={saving} saved={saved} />
      </div>
    </div>
  );
};

/* ─── Ish bilan ta'minlash Editor ────────────────────────── */

const EmploymentEditor = ({ s, onChange, onSave, saving, saved }) => {
  const { t } = useTranslation();
  const bullets = s.employmentBullets || [];
  const updateBullet = (i, val) => {
    const a = [...bullets]; a[i] = val;
    onChange('employmentBullets', a);
  };
  const addBullet = () => onChange('employmentBullets', [...bullets, t('adminSiteEditor.employment.defaultBullet')]);
  const removeBullet = (i) => onChange('employmentBullets', bullets.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">{t('adminSiteEditor.employment.mainText')}</h3>
        <div className="space-y-4">
          <Field label={t('adminSiteEditor.employment.title')} value={s.employmentTitle} onChange={v => onChange('employmentTitle', v)} placeholder={t('adminSiteEditor.employment.phTitle')} />
          <TextArea label={t('adminSiteEditor.employment.text')} value={s.employmentText} onChange={v => onChange('employmentText', v)} rows={6}
            placeholder={t('adminSiteEditor.employment.phText')} />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">{t('adminSiteEditor.employment.bullets')}</h3>
          <button onClick={addBullet}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <Plus size={12} /> {t('adminSiteEditor.employment.add')}
          </button>
        </div>
        <div className="space-y-2">
          {bullets.map((b, i) => (
            <div key={i} className="flex items-start gap-2">
              <textarea
                value={b}
                onChange={e => updateBullet(i, e.target.value)}
                rows={2}
                className="flex-1 px-3 py-2 rounded-lg text-sm border border-gray-200 outline-none focus:border-blue-500 transition-colors resize-none"
              />
              <button onClick={() => removeBullet(i)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">{t('adminSiteEditor.employment.footerSection')}</h3>
        <TextArea label={t('adminSiteEditor.employment.footerText')} value={s.employmentFooter} onChange={v => onChange('employmentFooter', v)} rows={2}
          placeholder={t('adminSiteEditor.employment.phFooterText')} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">{t('adminSiteEditor.employment.imageSection')}</h3>
        <ImageUpload label={t('adminSiteEditor.employment.image')} value={s.employmentImage} onChange={v => onChange('employmentImage', v)} />
      </div>
      <div className="flex justify-end pt-2">
        <SaveBtn onClick={onSave} saving={saving} saved={saved} />
      </div>
    </div>
  );
};

/* ─── Gallery / Blog Hero Editors ───────────────────────── */

const GalleryHeroEditor = ({ s, onChange, onSave, saving, saved }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-4 space-y-3">
        <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">{t('adminSiteEditor.galleryHero.hero')}</p>
        <Field label={t('adminSiteEditor.galleryHero.badge')} value={s.galleryHeroBadge} onChange={v => onChange('galleryHeroBadge', v)} placeholder={t('adminSiteEditor.galleryHero.phBadge')} />
        <Field label={t('adminSiteEditor.galleryHero.title')} value={s.galleryHeroTitle} onChange={v => onChange('galleryHeroTitle', v)} placeholder={t('adminSiteEditor.galleryHero.phTitle')} />
        <TextArea label={t('adminSiteEditor.galleryHero.subtitle')} value={s.galleryHeroSubtitle} onChange={v => onChange('galleryHeroSubtitle', v)} rows={2} />
        <ImageUpload label={t('adminSiteEditor.galleryHero.image')} value={s.galleryHeroImage} onChange={v => onChange('galleryHeroImage', v)} />
      </div>
      <div className="border border-gray-100 rounded-xl p-4 space-y-3">
        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">{t('adminSiteEditor.galleryHero.photosSection')}</p>
        <Field label={t('adminSiteEditor.galleryHero.photosLabel')} value={s.galleryPhotosLabel} onChange={v => onChange('galleryPhotosLabel', v)} placeholder={t('adminSiteEditor.galleryHero.phPhotosLabel')} />
        <Field label={t('adminSiteEditor.galleryHero.photosTitle')} value={s.galleryPhotosTitle} onChange={v => onChange('galleryPhotosTitle', v)} placeholder={t('adminSiteEditor.galleryHero.phPhotosTitle')} />
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('adminSiteEditor.galleryHero.tab1')} value={s.galleryStudentsTab} onChange={v => onChange('galleryStudentsTab', v)} placeholder={t('adminSiteEditor.galleryHero.phTab1')} />
          <Field label={t('adminSiteEditor.galleryHero.tab2')} value={s.galleryTeachersTab} onChange={v => onChange('galleryTeachersTab', v)} placeholder={t('adminSiteEditor.galleryHero.phTab2')} />
        </div>
      </div>
      <div className="flex justify-end">
        <SaveBtn onClick={onSave} saving={saving} saved={saved} />
      </div>
    </div>
  );
};

const BlogHeroEditor = ({ s, onChange, onSave, saving, saved }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <Field label={t('adminSiteEditor.blogHero.badge')} value={s.blogHeroBadge} onChange={v => onChange('blogHeroBadge', v)} placeholder={t('adminSiteEditor.blogHero.phBadge')} />
      <Field label={t('adminSiteEditor.blogHero.title')} value={s.blogHeroTitle} onChange={v => onChange('blogHeroTitle', v)} placeholder={t('adminSiteEditor.blogHero.phTitle')} />
      <TextArea label={t('adminSiteEditor.blogHero.subtitle')} value={s.blogHeroSubtitle} onChange={v => onChange('blogHeroSubtitle', v)} rows={2} />
      <ImageUpload label={t('adminSiteEditor.blogHero.image')} value={s.blogHeroImage} onChange={v => onChange('blogHeroImage', v)} />
      <div className="flex justify-end">
        <SaveBtn onClick={onSave} saving={saving} saved={saved} />
      </div>
    </div>
  );
};

/* ─── Contact Editor ─────────────────────────────────────── */

const ContactEditor = ({ s, onChange, onSave, saving, saved }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">{t('adminSiteEditor.contact.phoneSection')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t('adminSiteEditor.contact.mainPhone')} value={s.phone} onChange={v => onChange('phone', v)} placeholder={t('adminSiteEditor.contact.phMainPhone')} />
          <Field label={t('adminSiteEditor.contact.secondaryPhone')} value={s.phone2} onChange={v => onChange('phone2', v)} placeholder={t('adminSiteEditor.contact.phSecondaryPhone')} />
          <Field label={t('adminSiteEditor.contact.email')} value={s.email} onChange={v => onChange('email', v)} placeholder={t('adminSiteEditor.contact.phEmail')} />
          <Field label={t('adminSiteEditor.contact.workingHours')} value={s.workingHours} onChange={v => onChange('workingHours', v)} placeholder={t('adminSiteEditor.contact.phWorkingHours')} />
          <div className="md:col-span-2">
            <Field label={t('adminSiteEditor.contact.address')} value={s.address} onChange={v => onChange('address', v)} placeholder={t('adminSiteEditor.contact.phAddress')} />
          </div>
          <div className="md:col-span-2">
            <Field label={t('adminSiteEditor.contact.mapLink')} value={s.mapLink} onChange={v => onChange('mapLink', v)} placeholder={t('adminSiteEditor.contact.phMapLink')} />
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">{t('adminSiteEditor.contact.socialSection')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t('adminSiteEditor.contact.telegram')} value={s.telegram} onChange={v => onChange('telegram', v)} placeholder={t('adminSiteEditor.contact.phTelegram')} />
          <Field label={t('adminSiteEditor.contact.instagram')} value={s.instagram} onChange={v => onChange('instagram', v)} placeholder={t('adminSiteEditor.contact.phInstagram')} />
          <Field label={t('adminSiteEditor.contact.facebook')} value={s.facebook} onChange={v => onChange('facebook', v)} placeholder={t('adminSiteEditor.contact.phFacebook')} />
          <Field label={t('adminSiteEditor.contact.youtube')} value={s.youtube} onChange={v => onChange('youtube', v)} placeholder={t('adminSiteEditor.contact.phYoutube')} />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">{t('adminSiteEditor.contact.footerSection')}</h3>
        <div className="space-y-4">
          <TextArea
            label={t('adminSiteEditor.contact.footerDesc')}
            value={s.footerDescription}
            onChange={v => onChange('footerDescription', v)}
            rows={3}
            placeholder={t('adminSiteEditor.contact.phFooterDesc')}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Field label={t('adminSiteEditor.contact.footerCol1')} value={s.footerPagesTitle} onChange={v => onChange('footerPagesTitle', v)} placeholder={t('adminSiteEditor.contact.phFooterCol1')} />
            <Field label={t('adminSiteEditor.contact.footerCol2')} value={s.footerHoursTitle} onChange={v => onChange('footerHoursTitle', v)} placeholder={t('adminSiteEditor.contact.phFooterCol2')} />
            <Field label={t('adminSiteEditor.contact.footerCol3')} value={s.footerLegalTitle} onChange={v => onChange('footerLegalTitle', v)} placeholder={t('adminSiteEditor.contact.phFooterCol3')} />
            <Field label={t('adminSiteEditor.contact.footerCol4')} value={s.footerContactsTitle} onChange={v => onChange('footerContactsTitle', v)} placeholder={t('adminSiteEditor.contact.phFooterCol4')} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
            <Field label={t('adminSiteEditor.contact.legal1Label')} value={s.footerLegal1Label} onChange={v => onChange('footerLegal1Label', v)} placeholder={t('adminSiteEditor.contact.phLegal1Label')} />
            <Field label={t('adminSiteEditor.contact.legal1Url')} value={s.footerLegal1Url} onChange={v => onChange('footerLegal1Url', v)} placeholder={t('adminSiteEditor.contact.phLegal1Url')} />
            <Field label={t('adminSiteEditor.contact.legal2Label')} value={s.footerLegal2Label} onChange={v => onChange('footerLegal2Label', v)} placeholder={t('adminSiteEditor.contact.phLegal2Label')} />
            <Field label={t('adminSiteEditor.contact.legal2Url')} value={s.footerLegal2Url} onChange={v => onChange('footerLegal2Url', v)} placeholder={t('adminSiteEditor.contact.phLegal2Url')} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
            <Field label={t('adminSiteEditor.contact.copyright')} value={s.footerCopyright} onChange={v => onChange('footerCopyright', v)} placeholder={t('adminSiteEditor.contact.phCopyright')} />
            <Field label={t('adminSiteEditor.contact.bottomRight')} value={s.footerBottomRight} onChange={v => onChange('footerBottomRight', v)} placeholder={t('adminSiteEditor.contact.phBottomRight')} />
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <SaveBtn onClick={onSave} saving={saving} saved={saved} />
      </div>
    </div>
  );
};

/* ─── Aloqalar Sahifasi Editor ───────────────────────────── */

const ContactPageEditor = ({ s, onChange, onSave, saving, saved }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-4 space-y-3">
        <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">{t('adminSiteEditor.contactPage.hero')}</p>
        <Field label={t('adminSiteEditor.contactPage.title')} value={s.contactHeroTitle} onChange={v => onChange('contactHeroTitle', v)} placeholder={t('adminSiteEditor.contactPage.phTitle')} />
        <TextArea label={t('adminSiteEditor.contactPage.subtitle')} value={s.contactHeroSubtitle} onChange={v => onChange('contactHeroSubtitle', v)} rows={2} />
        <ImageUpload label={t('adminSiteEditor.contactPage.image')} value={s.contactHeroImage} onChange={v => onChange('contactHeroImage', v)} />
      </div>

      <div className="border border-gray-100 rounded-xl p-4 space-y-3">
        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">{t('adminSiteEditor.contactPage.cardsSection')}</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('adminSiteEditor.contactPage.card1')}    value={s.contactCard1Title} onChange={v => onChange('contactCard1Title', v)} placeholder={t('adminSiteEditor.contactPage.phCard1')} />
          <Field label={t('adminSiteEditor.contactPage.card2')}   value={s.contactCard2Title} onChange={v => onChange('contactCard2Title', v)} placeholder={t('adminSiteEditor.contactPage.phCard2')} />
          <Field label={t('adminSiteEditor.contactPage.card3')}     value={s.contactCard3Title} onChange={v => onChange('contactCard3Title', v)} placeholder={t('adminSiteEditor.contactPage.phCard3')} />
          <Field label={t('adminSiteEditor.contactPage.card4')} value={s.contactCard4Title} onChange={v => onChange('contactCard4Title', v)} placeholder={t('adminSiteEditor.contactPage.phCard4')} />
        </div>
        <p className="text-xs text-gray-400">
          {t('adminSiteEditor.contactPage.cardValuesHint1')} <strong>{t('adminSiteEditor.contactPage.cardValuesHintStrong')}</strong> {t('adminSiteEditor.contactPage.cardValuesHint2')}
        </p>
      </div>

      <div className="border border-gray-100 rounded-xl p-4 space-y-3">
        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">{t('adminSiteEditor.contactPage.mapSection')}</p>
        <Field label={t('adminSiteEditor.contactPage.mapTitle')} value={s.contactMapTitle} onChange={v => onChange('contactMapTitle', v)} placeholder={t('adminSiteEditor.contactPage.phMapTitle')} />
        <p className="text-xs text-gray-400">
          {t('adminSiteEditor.contactPage.mapHint')}
        </p>
      </div>

      <div className="flex justify-end">
        <SaveBtn onClick={onSave} saving={saving} saved={saved} />
      </div>
    </div>
  );
};

/* ─── Bo'lim sarlavhalari (umumiy) Editor ───────────────── */

const SectionTitlesEditor = ({ s, onChange, onSave, saving, saved }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">{t('adminSiteEditor.sectionTitles.videoSection')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t('adminSiteEditor.sectionTitles.videoLabel')} value={s.videoLabel} onChange={v => onChange('videoLabel', v)} placeholder={t('adminSiteEditor.sectionTitles.phVideoLabel')} />
          <Field label={t('adminSiteEditor.sectionTitles.videoTitle')} value={s.videoTitle} onChange={v => onChange('videoTitle', v)} placeholder={t('adminSiteEditor.sectionTitles.phVideoTitle')} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">{t('adminSiteEditor.sectionTitles.popularSection')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t('adminSiteEditor.sectionTitles.popularLabel')} value={s.popularLabel} onChange={v => onChange('popularLabel', v)} placeholder={t('adminSiteEditor.sectionTitles.phPopularLabel')} />
          <Field label={t('adminSiteEditor.sectionTitles.popularTitle')} value={s.popularTitle} onChange={v => onChange('popularTitle', v)} placeholder={t('adminSiteEditor.sectionTitles.phPopularTitle')} />
          <div className="md:col-span-2">
            <TextArea label={t('adminSiteEditor.sectionTitles.popularSubtitle')} value={s.popularSubtitle} onChange={v => onChange('popularSubtitle', v)} rows={2} placeholder={t('adminSiteEditor.sectionTitles.phPopularSubtitle')} />
          </div>
          <Field label={t('adminSiteEditor.sectionTitles.popularBtn')} value={s.popularBtn} onChange={v => onChange('popularBtn', v)} placeholder={t('adminSiteEditor.sectionTitles.phPopularBtn')} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">{t('adminSiteEditor.sectionTitles.faqSection')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t('adminSiteEditor.sectionTitles.faqLabel')} value={s.faqLabel} onChange={v => onChange('faqLabel', v)} placeholder={t('adminSiteEditor.sectionTitles.phFaqLabel')} />
          <Field label={t('adminSiteEditor.sectionTitles.faqTitle')} value={s.faqTitle} onChange={v => onChange('faqTitle', v)} placeholder={t('adminSiteEditor.sectionTitles.phFaqTitle')} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">{t('adminSiteEditor.sectionTitles.applicationSection')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label={t('adminSiteEditor.sectionTitles.applicationBadge')} value={s.applicationBadge} onChange={v => onChange('applicationBadge', v)} placeholder={t('adminSiteEditor.sectionTitles.phApplicationBadge')} />
          <Field label={t('adminSiteEditor.sectionTitles.applicationFormTitle')} value={s.applicationFormTitle} onChange={v => onChange('applicationFormTitle', v)} placeholder={t('adminSiteEditor.sectionTitles.phApplicationFormTitle')} />
          <div className="md:col-span-2">
            <TextArea label={t('adminSiteEditor.sectionTitles.applicationTitle')} value={s.applicationTitle} onChange={v => onChange('applicationTitle', v)} rows={3} placeholder={t('adminSiteEditor.sectionTitles.phApplicationTitle')} />
          </div>
          <div className="md:col-span-2">
            <TextArea label={t('adminSiteEditor.sectionTitles.applicationSubtitle')} value={s.applicationSubtitle} onChange={v => onChange('applicationSubtitle', v)} rows={3} placeholder={t('adminSiteEditor.sectionTitles.phApplicationSubtitle')} />
          </div>
          <Field label={t('adminSiteEditor.sectionTitles.applicationFormSubtitle')} value={s.applicationFormSubtitle} onChange={v => onChange('applicationFormSubtitle', v)} placeholder={t('adminSiteEditor.sectionTitles.phApplicationFormSubtitle')} />
          <Field label={t('adminSiteEditor.sectionTitles.applicationSubmitBtn')} value={s.applicationSubmitBtn} onChange={v => onChange('applicationSubmitBtn', v)} placeholder={t('adminSiteEditor.sectionTitles.phApplicationSubmitBtn')} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">{t('adminSiteEditor.sectionTitles.logoSection')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label={t('adminSiteEditor.sectionTitles.brandSuffix')}
            value={s.brandSuffix}
            onChange={v => onChange('brandSuffix', v)}
            placeholder={t('adminSiteEditor.sectionTitles.phBrandSuffix')}
          />
          <Field
            label={t('adminSiteEditor.sectionTitles.brandTagline')}
            value={s.brandTagline}
            onChange={v => onChange('brandTagline', v)}
            placeholder={t('adminSiteEditor.sectionTitles.phBrandTagline')}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {t('adminSiteEditor.sectionTitles.logoPreviewPrefix')} <strong className="text-navy">Topex │ TEXNIKUMI</strong> <span className="text-gray-400">/ {t('adminSiteEditor.sectionTitles.logoPreviewSuffix')}</span>. {t('adminSiteEditor.sectionTitles.logoHint')}
        </p>
        <div className="mt-4">
          <ImageUpload label={t('adminSiteEditor.sectionTitles.logo')} value={s.logo} onChange={v => onChange('logo', v)} />
          <p className="text-xs text-gray-400 mt-1">{t('adminSiteEditor.sectionTitles.logoHelper')}</p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">{t('adminSiteEditor.sectionTitles.seoSection')}</h3>
        <div className="space-y-4">
          <Field label={t('adminSiteEditor.sectionTitles.siteTitle')} value={s.siteTitle} onChange={v => onChange('siteTitle', v)} placeholder={t('adminSiteEditor.sectionTitles.phSiteTitle')} />
          <TextArea label={t('adminSiteEditor.sectionTitles.siteDescription')} value={s.siteDescription} onChange={v => onChange('siteDescription', v)} rows={3} placeholder={t('adminSiteEditor.sectionTitles.phSiteDescription')} />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <SaveBtn onClick={onSave} saving={saving} saved={saved} />
      </div>
    </div>
  );
};

/* ─── Linked section shortcut ────────────────────────────── */

const LinkedSection = ({ label, to, desc }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between p-5 rounded-xl border border-gray-200 bg-gray-50">
      <div>
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-sm text-gray-400 mt-0.5">{desc}</p>
      </div>
      <Link to={to}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gray-800 text-white hover:bg-blue-600 transition-colors">
        {t('adminSiteEditor.linkedSection.manage')} <ExternalLink size={13} />
      </Link>
    </div>
  );
};

/* ─── Main Page ──────────────────────────────────────────── */

const SECTIONS = [
  { id: 'hero',         label: "Hero Bo'limi",            icon: Home,          fields: ['heroLabel','heroTitle','heroSubtitle','heroBtn','heroBtn2','heroNote','heroImage','heroBgImage'], previewUrl: '/' },
  { id: 'stats',        label: 'Statistika Raqamlari',    icon: BarChart3,     fields: ['statsStudents','statsBranches','statsTeachers','statsGrades'], previewUrl: '/' },
  { id: 'about',        label: "Biz Haqimizda",           icon: Info,          fields: ['aboutLabel','aboutTitle','aboutText','aboutImage'], previewUrl: '/' },
  { id: 'subjects',     label: "Yo'nalishlar",             icon: BookOpen,      fields: ['subjects'], previewUrl: '/' },
  { id: 'extras',       label: "Qo'shimcha Imkoniyatlar",  icon: List,          fields: ['extras'], previewUrl: '/' },
  { id: 'features',     label: "Nega Bizni Tanlash",      icon: CheckSquare,   fields: ['features','featuresLabel','featuresTitle','featuresSubtitle'], previewUrl: '/' },
  { id: 'grants',       label: "Grant Kartalari",          icon: Award,         fields: ['scholarshipCards','grantsLabel','grantsTitle','grantsSubtitle'], previewUrl: '/' },
  { id: 'diploma',      label: "Diplom Bo'limi",            icon: Award,         fields: ['diplomaTitle','diplomaText','diplomaImage1','diplomaImage2','diplomaCard1Title','diplomaCard1Desc','diplomaCard2Title','diplomaCard2Desc'], previewUrl: '/' },
  { id: 'employment',   label: "Ish bilan ta'minlash",      icon: GraduationCap, fields: ['employmentTitle','employmentText','employmentBullets','employmentFooter','employmentImage'], previewUrl: '/' },
  { id: 'titles',       label: "Bo'lim sarlavhalari",       icon: FileText,      fields: ['videoLabel','videoTitle','popularLabel','popularTitle','popularSubtitle','popularBtn','faqLabel','faqTitle','applicationBadge','applicationTitle','applicationSubtitle','applicationFormTitle','applicationFormSubtitle','applicationSubmitBtn','siteTitle','siteDescription','brandSuffix','brandTagline','logo'], previewUrl: '/' },
  { id: 'courses_page', label: "Kurslar Sahifasi",         icon: GraduationCap, fields: ['coursesHeroTitle','coursesHeroSubtitle','coursesHeroImage','coursesHeroBadge','coursesFacultyLabel','coursesFacultyTitle','coursesFacultySubtitle','coursesHighlights','coursesCtaTitle','coursesCtaSubtitle','coursesCtaPhone','coursesCtaLabel','coursesCtaPhoneBtn','coursesCtaHomeBtn'], previewUrl: '/courses' },
  { id: 'gallery_page', label: "Galereya Sahifasi",        icon: Camera,        fields: ['galleryHeroTitle','galleryHeroSubtitle','galleryHeroImage','galleryHeroBadge','galleryPhotosLabel','galleryPhotosTitle','galleryStudentsTab','galleryTeachersTab'], previewUrl: '/gallery' },
  { id: 'blog_page',    label: "Blog Sahifasi",            icon: FileText,      fields: ['blogHeroTitle','blogHeroSubtitle','blogHeroImage','blogHeroBadge'], previewUrl: '/blog' },
  { id: 'contact_page', label: "Aloqalar Sahifasi",        icon: Phone,         fields: ['contactHeroTitle','contactHeroSubtitle','contactHeroImage','contactCard1Title','contactCard2Title','contactCard3Title','contactCard4Title','contactMapTitle'], previewUrl: '/aloqalar' },
  { id: 'contact',      label: "Kontakt va Ijtimoiy",      icon: Phone,         fields: ['phone','phone2','email','address','workingHours','mapLink','telegram','instagram','facebook','youtube','footerDescription','footerPagesTitle','footerHoursTitle','footerLegalTitle','footerContactsTitle','footerLegal1Label','footerLegal1Url','footerLegal2Label','footerLegal2Url','footerCopyright','footerBottomRight'], previewUrl: '/' },
  { id: 'other',        label: "Boshqa Bo'limlar",         icon: Eye,           fields: [], previewUrl: '/' },

  /* ── PROFI-STYLE bo'limlar (Topex 2026 redizayn) ─── */
  { id: 'profi_hero',       label: '✨ Hero (3 Slayd)',         icon: Home,    fields: ['heroSlides','heroCtaText','heroNoteText'], previewUrl: '/' },
  { id: 'profi_about',      label: '✨ Texnikum haqida',         icon: Info,    fields: ['aboutSectionLabel','aboutSectionTitle','aboutSlogan','aboutParagraph','aboutBtnText','aboutStat1Value','aboutStat1Label','aboutStat2Value','aboutStat2Label','aboutImage1','aboutImage2','aboutImage3','aboutImage4'], previewUrl: '/' },
  { id: 'profi_directions', label: "✨ Yo'nalishlar (sarlavha)", icon: BookOpen,fields: ['directionsLabel','directionsTitle'], previewUrl: '/' },
  { id: 'profi_team',       label: '✨ Jamoa (sarlavha)',        icon: List,    fields: ['teamLabel','teamTitle','teamParagraph','teamBtnText'], previewUrl: '/' },
  { id: 'profi_news',       label: '✨ Yangiliklar (sarlavha)',   icon: FileText,fields: ['newsLabel','newsTitle','newsMoreText'], previewUrl: '/' },
  { id: 'profi_videos',     label: '✨ Videolar (sarlavha)',     icon: Video,   fields: ['videosLabel','videosTitle','videosSubtitle'], previewUrl: '/' },
  { id: 'profi_form',       label: '✨ Ariza forma',             icon: MessageSquare, fields: ['formLabel','formTitle','formParagraph','formNameLabel','formNamePh','formPhoneLabel','formDirLabel','formDirPh','formDir9','formDir11','formAgreeText','formSubmitText','formImage'], previewUrl: '/' },
  { id: 'profi_footer',     label: '✨ Footer (4 ustun)',        icon: List,    fields: ['footerColAboutTitle','footerColApplicantsTitle','footerColStudentsTitle','footerColContactsTitle','footerCopyText','footerOfertaText','footerLicenseText','address2','footerColAboutLinks','footerColApplicantsLinks','footerColStudentsLinks'], previewUrl: '/' },
];

// Mapping label keys → human readable hints for search
const FIELD_LABELS = {
  heroLabel: 'Hero yorlig\'i', heroTitle: 'Hero sarlavha h1', heroSubtitle: 'Hero matn', heroBtn: 'Hero tugma 1', heroBtn2: 'Hero tugma 2', heroNote: 'Hero eslatma', heroImage: 'Hero rasmi', heroBgImage: 'Hero foni',
  statsStudents: "O'quvchilar soni", statsBranches: 'Filiallar', statsTeachers: 'Mutaxassislar', statsGrades: 'Sinflar',
  aboutLabel: 'About yorliq', aboutTitle: 'About sarlavha', aboutText: 'About matn', aboutImage: 'About rasm',
  videoLabel: 'Video yorliq', videoTitle: 'Video sarlavha',
  popularLabel: 'Mashhur kurslar yorliq', popularTitle: 'Mashhur kurslar h2', popularSubtitle: 'Mashhur kurslar tavsif', popularBtn: 'Mashhur kurslar tugma',
  featuresLabel: 'Afzalliklar yorliq', featuresTitle: 'Afzalliklar h2', featuresSubtitle: 'Afzalliklar subtitle',
  grantsLabel: 'Grantlar yorliq', grantsTitle: 'Grantlar h2', grantsSubtitle: 'Grantlar tavsif',
  faqLabel: 'FAQ yorliq', faqTitle: 'FAQ sarlavha',
  applicationBadge: 'Ariza badge', applicationTitle: 'Ariza sarlavha', applicationSubtitle: 'Ariza tavsif', applicationFormTitle: 'Forma sarlavha', applicationFormSubtitle: 'Forma matn', applicationSubmitBtn: 'Forma tugma',
  brandSuffix: 'Logo yozuv', brandTagline: 'Logo slogan',
  siteTitle: 'SEO sarlavha', siteDescription: 'SEO tavsif',
  phone: 'Telefon', phone2: 'Qo\'shimcha telefon', email: 'Email', address: 'Manzil', workingHours: 'Ish vaqti', mapLink: 'Xarita',
  telegram: 'Telegram', instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube',
  footerDescription: 'Footer tavsifi', footerPagesTitle: 'Footer Sahifalar', footerHoursTitle: 'Footer Ish vaqti', footerLegalTitle: 'Footer Huquqiy', footerContactsTitle: 'Footer Kontaktlar', footerCopyright: 'Footer copyright', footerBottomRight: 'Footer pastki o\'ng',
  coursesHeroBadge: 'Kurslar badge', coursesHeroTitle: 'Kurslar h1', coursesHeroSubtitle: 'Kurslar tavsif', coursesHeroImage: 'Kurslar fon',
  coursesFacultyLabel: 'Fakultetlar yorliq', coursesFacultyTitle: 'Fakultetlar h2', coursesFacultySubtitle: 'Fakultetlar tavsif',
  coursesCtaLabel: 'Kurslar CTA yorliq', coursesCtaTitle: 'Kurslar CTA h2', coursesCtaSubtitle: 'Kurslar CTA tavsif',
  coursesCtaPhone: 'Kurslar CTA tel', coursesCtaPhoneBtn: 'Kurslar tugma 1', coursesCtaHomeBtn: 'Kurslar tugma 2',
  galleryHeroBadge: 'Galereya badge', galleryHeroTitle: 'Galereya h1', galleryHeroSubtitle: 'Galereya tavsif', galleryHeroImage: 'Galereya fon',
  galleryPhotosLabel: 'Galereya rasmlar yorliq', galleryPhotosTitle: 'Galereya rasmlar h2', galleryStudentsTab: 'Tab 1', galleryTeachersTab: 'Tab 2',
  blogHeroBadge: 'Blog badge', blogHeroTitle: 'Blog h1', blogHeroSubtitle: 'Blog tavsif', blogHeroImage: 'Blog fon',
  contactHeroTitle: 'Aloqalar h1', contactHeroSubtitle: 'Aloqalar tavsif', contactHeroImage: 'Aloqalar fon',
  contactCard1Title: 'Aloqa karta 1 (manzil)', contactCard2Title: 'Aloqa karta 2 (telefon)', contactCard3Title: 'Aloqa karta 3 (email)', contactCard4Title: 'Aloqa karta 4 (ish vaqti)', contactMapTitle: 'Xarita sarlavha',
  logo: 'Logotip rasmi',
  diplomaTitle: 'Diplom h2', diplomaText: 'Diplom matn', diplomaImage1: 'Diplom rasm 1', diplomaImage2: 'Diplom rasm 2',
  diplomaCard1Title: 'Diplom karta 1 sarl.', diplomaCard1Desc: 'Diplom karta 1 desc', diplomaCard2Title: 'Diplom karta 2 sarl.', diplomaCard2Desc: 'Diplom karta 2 desc',
  employmentTitle: 'Ish h2', employmentText: 'Ish matn', employmentBullets: 'Ish bullets', employmentFooter: 'Ish footer', employmentImage: 'Ish rasm',
  subjects: 'Yo\'nalishlar', extras: 'Imkoniyatlar', features: 'Afzalliklar kartalari', scholarshipCards: 'Grant kartalari', coursesHighlights: 'Kurslar kichik kartalar',
};

const AdminSiteEditor = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(null);
  const [active, setActive] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(new Set()); // set of changed field keys
  const [query, setQuery] = useState('');
  const [confirmSwitch, setConfirmSwitch] = useState(null);
  const [originalSettings, setOriginalSettings] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/settings');
      const d = res.data.data;
      // Ensure array fields exist with defaults
      if (!d.subjects || d.subjects.length === 0) {
        d.subjects = [
          { id: 1, name: 'Laborant analitik', desc: "Laboratoriya tahlillari va ilmiy tadqiqotlar.", duration: '2 yil', features: "Kimyoviy tahlil, Sanoat laboratoriyasi, Sifat nazorati", imgUrl: '/assets/famali-photo/DSC00964.webp', iconName: 'FlaskConical' },
          { id: 2, name: "Dorivor o'simliklar laboranti", desc: "Dorivor o'simliklar yetishtirish va qayta ishlash.", duration: '2 yil', features: "Botanika, Dori tayyorlash, Fitoterapiya", imgUrl: '/assets/famali-photo/DSC00980.webp', iconName: 'Sprout' },
          { id: 3, name: 'Marketing va agrobiznes', desc: "Raqamli marketing va qishloq xo'jaligi iqtisodiyoti.", duration: '2 yil', features: "SMM & Brending, Bozor tahlili, Eksport-import", imgUrl: '/assets/images/DSC00912.webp', iconName: 'TrendingUp' },
          { id: 4, name: 'Dasturlash', desc: "Kod yozishdan tortib, murakkab tizimlar yaratishgacha.", duration: '2 yil', features: "Frontend & Backend, Mobil ilovalar, Portfolio yaratish", imgUrl: '/assets/images/DSC00827.webp', iconName: 'Code' },
          { id: 5, name: 'Kompyuter grafikasi va dizayn', desc: '3D modellashtirish, brending va vizual kontent.', duration: '2 yil', features: "Adobe Photoshop/Illustrator, 3D Blender, Motion dizayn", imgUrl: '/assets/images/DSC01093.webp', iconName: 'Palette' },
          { id: 6, name: 'Bank ishi', desc: 'Bank va moliya tizimi asoslari.', duration: '2 yil', features: "Kredit tahlili, Xavfsizlik tizimlari, Bank auditi", imgUrl: '/assets/famali-photo/DSC00875.webp', iconName: 'ShieldCheck' },
          { id: 7, name: 'Mehmonxona boshqaruvi', desc: "Mehmonxona va turizm menejmenti.", duration: '2 yil', features: "Service Management, Event planning, Xorijiy tillar", imgUrl: '/assets/famali-photo/DSC00954.webp', iconName: 'Hotel' },
          { id: 8, name: 'Raqamli axborotlar analitigi', desc: "Ma'lumotlar tahlili va axborot tizimlari.", duration: '2 yil', features: 'Big Data, Excel & SQL, Biznes strategiya', imgUrl: '/assets/famali-photo/DSC00955.webp', iconName: 'BarChart3' },
        ];
      }
      if (!d.extras || d.extras.length === 0) {
        d.extras = ["IT va Robototexnika", "Ingliz tili (IELTS tayyorlov)", "Matematika olimpiadasi", "Shaxmat", "Stol tennisi", "Ijodiy to'garaklar"];
      }
      if (!d.features || d.features.length === 0) {
        d.features = [
          { title: "Tajribali o'qituvchilar", desc: "Har bir fandan yuqori malakali va tajribali pedagoglar jamoasi" },
          { title: "Zamonaviy sinf xonalar",  desc: "Eng zamonaviy jihozlar, laboratoriya va multimedia vositalari" },
          { title: "Individual yondashuv",    desc: "Har bir o'quvchiga alohida e'tibor va o'quv rejasi" },
          { title: "Olimpiada natijalari",    desc: "Respublika va xalqaro olimpiadalarda yuksak yutuqlar" },
        ];
      }
      if (!d.coursesHighlights || d.coursesHighlights.length === 0) {
        d.coursesHighlights = [
          { img: '/assets/icons/icon-02.webp', title: 'Kimyo',       students: '120+' },
          { img: '/assets/icons/icon-04.webp', title: 'Adabiyot',    students: '85+' },
          { img: '/assets/icons/icon-06.webp', title: 'Olimpiadalar', students: '200+' },
          { img: '/assets/icons/icon-08.webp', title: 'Tadqiqot',    students: '60+' },
        ];
      }
      if (!d.scholarshipCards || d.scholarshipCards.length === 0) {
        d.scholarshipCards = [
          { title: 'SAT 1200+',       subtitle: '',              amount: '2 MLN',    amountUnit: "so'm", badge: "Deyarli bepul o'qish", colorType: 'blue' },
          { title: 'Chet tili C1',    subtitle: 'IELTS 7.0+',   amount: '1 MLN',    amountUnit: "so'm", badge: 'Katta chegirma',       colorType: 'teal' },
          { title: 'Chet tili B2',    subtitle: 'IELTS 5.5-6.5',amount: '500 MING', amountUnit: "so'm", badge: 'Stipendiya',           colorType: 'blue2' },
          { title: 'Fan sertifikati', subtitle: 'B+ darajasi',  amount: '500 MING', amountUnit: "so'm", badge: 'Stipendiya',           colorType: 'coral' },
        ];
      }
      if (!d.blogHeroImage)    d.blogHeroImage    = '/assets/images/DSC01036.webp';
      if (!d.galleryHeroImage) d.galleryHeroImage = '/assets/images/DSC01036.webp';
      if (!d.coursesHeroImage) d.coursesHeroImage = '/assets/images/DSC01036.webp';
      if (!d.heroBgImage)      d.heroBgImage      = '/assets/images/DSC01093.webp';
      if (!d.footerDescription) d.footerDescription = "Toshkent, Chilonzor tumanidagi zamonaviy xususiy texnikum. 10-11 sinflar. Sifatli ta'lim, tajribali o'qituvchilar.";
      setSettings(d);
      setOriginalSettings(JSON.parse(JSON.stringify(d)));
      setDirty(new Set());
    } catch {
      toast.error(t('adminSiteEditor.loadError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Warn before unloading the page if there are unsaved changes
  useEffect(() => {
    const handler = (e) => {
      if (dirty.size > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const change = (key, val) => {
    setSettings(p => ({ ...p, [key]: val }));
    setDirty(prev => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  };

  const save = async (fields) => {
    if (!settings) return;
    const payload = {};
    fields.forEach(f => { payload[f] = settings[f]; });
    try {
      setSaving(true);
      await api.put('/admin/settings', payload);
      toast.success(t('adminSiteEditor.saveSuccess'));
      setSaved(true);
      // Clear dirty state for saved fields
      setDirty(prev => {
        const next = new Set(prev);
        fields.forEach(f => next.delete(f));
        return next;
      });
      // Update originalSettings snapshot for these fields
      setOriginalSettings(prev => {
        const next = { ...(prev || {}) };
        fields.forEach(f => { next[f] = settings[f]; });
        return next;
      });
      setTimeout(() => setSaved(false), 2000);
    } catch {
      toast.error(t('adminSiteEditor.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const revertField = (key) => {
    if (!originalSettings) return;
    setSettings(p => ({ ...p, [key]: originalSettings[key] }));
    setDirty(prev => { const next = new Set(prev); next.delete(key); return next; });
  };

  const switchTab = (id) => {
    if (active === id) return;
    // If current tab has dirty fields, ask for confirmation
    const currentSection = SECTIONS.find(s => s.id === active);
    const currentDirty = currentSection?.fields.filter(f => dirty.has(f)) || [];
    if (currentDirty.length > 0) {
      setConfirmSwitch(id);
    } else {
      setActive(id);
    }
  };

  const dirtyCountForSection = (sec) => {
    if (!sec.fields) return 0;
    return sec.fields.filter(f => dirty.has(f)).length;
  };

  const getBadgeCount = (id) => {
    if (!settings) return 0;
    if (id === 'subjects') return settings.subjects?.length || 0;
    if (id === 'extras') return settings.extras?.length || 0;
    if (id === 'features') return settings.features?.length || 0;
    if (id === 'grants') return settings.scholarshipCards?.length || 0;
    return 0;
  };

  // Filter sections by search query — match label or any field key/label
  const q = query.trim().toLowerCase();
  const visibleSections = q
    ? SECTIONS.filter(sec => {
        if (sec.label.toLowerCase().includes(q)) return true;
        return (sec.fields || []).some(f =>
          f.toLowerCase().includes(q) ||
          (FIELD_LABELS[f] || '').toLowerCase().includes(q)
        );
      })
    : SECTIONS;

  // Auto-jump to first matching section when searching
  useEffect(() => {
    if (q && visibleSections.length > 0 && !visibleSections.find(s => s.id === active)) {
      setActive(visibleSections[0].id);
    }
  }, [q]); // eslint-disable-line

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 size={32} className="animate-spin text-blue-600" />
    </div>
  );

  if (!settings) return null;

  const totalDirty = dirty.size;
  const activeSection = SECTIONS.find(s => s.id === active);

  return (
    <>
      <Helmet><title>{t('adminSiteEditor.pageTitle')}</title></Helmet>

      {/* Confirm-switch modal */}
      <ConfirmModal
        isOpen={confirmSwitch !== null}
        onClose={() => setConfirmSwitch(null)}
        onConfirm={() => { setActive(confirmSwitch); setConfirmSwitch(null); }}
        title={t('adminSiteEditor.confirmSwitch.title')}
        message={t('adminSiteEditor.confirmSwitch.message')}
        confirmLabel={t('adminSiteEditor.confirmSwitch.confirmLabel')}
      />

      {/* Sticky unsaved-changes banner */}
      {totalDirty > 0 && (
        <div className="fixed top-[60px] left-0 right-0 z-30 bg-amber-50 border-b border-amber-200 lg:left-[240px]">
          <div className="px-6 py-2.5 flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle size={15} />
              <span className="font-semibold">{totalDirty} {t('adminSiteEditor.unsavedCount')}</span>
              <span className="hidden md:inline text-amber-700/70">{t('adminSiteEditor.unsavedHint')}</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6" style={{ paddingTop: totalDirty > 0 ? 44 : 0 }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('adminSiteEditor.header')}</h1>
            <p className="text-sm text-gray-500 mt-1">{t('adminSiteEditor.subtitle')}</p>
          </div>
          <a
            href={activeSection?.previewUrl || '/'}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Eye size={14} /> {t('adminSiteEditor.viewOnSite')} <ExternalLink size={12} />
          </a>
        </div>

        <div className="flex gap-5">
          {/* Sidebar */}
          <aside className="w-56 flex-shrink-0 space-y-1 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto">
            {/* Search */}
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('adminSiteEditor.searchPlaceholder')}
                className="w-full pl-9 pr-8 py-2 rounded-xl text-[13px] border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-white"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                  <X size={13} />
                </button>
              )}
            </div>
            {q && visibleSections.length === 0 && (
              <p className="px-3 py-4 text-xs text-gray-400 text-center">{t('adminSiteEditor.notFound')}</p>
            )}
            {visibleSections.map(({ id, label, icon: Icon }) => {
              const sec = SECTIONS.find(s => s.id === id);
              const badgeCount = getBadgeCount(id);
              const dirtyCount = dirtyCountForSection(sec);
              return (
                <button key={id} onClick={() => switchTab(id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                  style={active === id
                    ? { background: '#272829', color: '#fff' }
                    : { background: 'transparent', color: '#61677A' }}
                  onMouseEnter={e => { if (active !== id) { e.currentTarget.style.background = '#F1F2F4'; e.currentTarget.style.color = '#272829'; } }}
                  onMouseLeave={e => { if (active !== id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#61677A'; } }}
                >
                  <Icon size={16} />
                  <span className="flex-1">{t('adminSiteEditor.section.' + id, label)}</span>
                  {dirtyCount > 0 && (
                    <span title={t('adminSiteEditor.unsavedTitle')} style={{
                      background: '#F59E0B',
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    }} />
                  )}
                  {badgeCount > 0 && (
                    <span style={{
                      background: active === id ? 'rgba(255,255,255,0.2)' : '#E5E7EA',
                      color: active === id ? '#fff' : '#61677A',
                      borderRadius: 8,
                      fontSize: 9,
                      padding: '1px 5px',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="pt-3 mt-3 border-t border-gray-200">
              <p className="px-3 text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">{t('adminSiteEditor.quickLinks')}</p>
              {[
                { key: 'videos',    to: '/admin/home-videos',  icon: Video },
                { key: 'faq',       to: '/admin/faq',          icon: HelpCircle },
                { key: 'testimonials', to: '/admin/testimonials', icon: MessageSquare },
                { key: 'courses',   to: '/admin/courses',      icon: GraduationCap },
                { key: 'blog',      to: '/admin/blog',         icon: FileText },
                { key: 'gallery',   to: '/admin/gallery',      icon: Image },
                { key: 'scholarships', to: '/admin/scholarships', icon: Award },
              ].map(({ key, to, icon: Icon }) => (
                <Link key={to} to={to}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <Icon size={14} />
                  <span>{t('adminSiteEditor.quickLink.' + key)}</span>
                  <ExternalLink size={10} className="ml-auto" />
                </Link>
              ))}
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 rounded-xl border border-gray-200 bg-white p-6">
            {active === 'hero' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.hero')}</h2>
                <HeroEditor s={settings} onChange={change} onSave={() => save(['heroLabel','heroTitle','heroSubtitle','heroBtn','heroBtn2','heroNote','heroImage','heroBgImage'])} saving={saving} saved={saved} />
              </>
            )}
            {active === 'stats' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.stats')}</h2>
                <StatsEditor s={settings} onChange={change} onSave={() => save(['statsStudents','statsBranches','statsTeachers','statsGrades'])} saving={saving} saved={saved} />
              </>
            )}
            {active === 'about' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.about')}</h2>
                <AboutEditor s={settings} onChange={change} onSave={() => save(['aboutLabel','aboutTitle','aboutText','aboutImage'])} saving={saving} saved={saved} />
              </>
            )}
            {active === 'subjects' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.subjects')}</h2>
                <SubjectsEditor subjects={settings.subjects || []} onChange={v => change('subjects', v)} onSave={() => save(['subjects'])} saving={saving} saved={saved} />
              </>
            )}
            {active === 'extras' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.extras')}</h2>
                <ExtrasEditor extras={settings.extras || []} onChange={v => change('extras', v)} onSave={() => save(['extras'])} saving={saving} saved={saved} />
              </>
            )}
            {active === 'features' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.features')}</h2>
                <FeaturesEditor s={settings} features={settings.features || []} onChange={v => change('features', v)} onChangeKey={change} onSave={() => save(['features','featuresLabel','featuresTitle','featuresSubtitle'])} saving={saving} saved={saved} />
              </>
            )}
            {active === 'grants' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.grants')}</h2>
                <ScholarshipCardsEditor
                  s={settings}
                  cards={settings.scholarshipCards || []}
                  onChange={v => change('scholarshipCards', v)}
                  onChangeKey={change}
                  onSave={() => save(['scholarshipCards','grantsLabel','grantsTitle','grantsSubtitle'])}
                  saving={saving}
                  saved={saved}
                />
              </>
            )}
            {active === 'diploma' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.diploma')}</h2>
                <DiplomaEditor
                  s={settings}
                  onChange={change}
                  onSave={() => save(['diplomaTitle','diplomaText','diplomaImage1','diplomaImage2','diplomaCard1Title','diplomaCard1Desc','diplomaCard2Title','diplomaCard2Desc'])}
                  saving={saving}
                  saved={saved}
                />
              </>
            )}
            {active === 'employment' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.employment')}</h2>
                <EmploymentEditor
                  s={settings}
                  onChange={change}
                  onSave={() => save(['employmentTitle','employmentText','employmentBullets','employmentFooter','employmentImage'])}
                  saving={saving}
                  saved={saved}
                />
              </>
            )}
            {active === 'titles' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.titles')}</h2>
                <SectionTitlesEditor
                  s={settings}
                  onChange={change}
                  onSave={() => save([
                    'videoLabel','videoTitle',
                    'popularLabel','popularTitle','popularSubtitle','popularBtn',
                    'faqLabel','faqTitle',
                    'applicationBadge','applicationTitle','applicationSubtitle','applicationFormTitle','applicationFormSubtitle','applicationSubmitBtn',
                    'siteTitle','siteDescription',
                    'brandSuffix','brandTagline','logo',
                  ])}
                  saving={saving}
                  saved={saved}
                />
              </>
            )}
            {active === 'courses_page' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.coursesPage')}</h2>
                <CoursesPageEditor
                  s={settings}
                  onChange={change}
                  onSave={() => save([
                    'coursesHeroTitle','coursesHeroSubtitle','coursesHeroImage','coursesHeroBadge',
                    'coursesFacultyLabel','coursesFacultyTitle','coursesFacultySubtitle',
                    'coursesHighlights',
                    'coursesCtaTitle','coursesCtaSubtitle','coursesCtaPhone',
                    'coursesCtaLabel','coursesCtaPhoneBtn','coursesCtaHomeBtn',
                  ])}
                  saving={saving}
                  saved={saved}
                />
              </>
            )}
            {active === 'gallery_page' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.galleryPage')}</h2>
                <GalleryHeroEditor s={settings} onChange={change} onSave={() => save(['galleryHeroTitle','galleryHeroSubtitle','galleryHeroImage','galleryHeroBadge','galleryPhotosLabel','galleryPhotosTitle','galleryStudentsTab','galleryTeachersTab'])} saving={saving} saved={saved} />
              </>
            )}
            {active === 'blog_page' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.blogPage')}</h2>
                <BlogHeroEditor s={settings} onChange={change} onSave={() => save(['blogHeroTitle','blogHeroSubtitle','blogHeroImage','blogHeroBadge'])} saving={saving} saved={saved} />
              </>
            )}
            {active === 'contact_page' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.contactPage')}</h2>
                <ContactPageEditor
                  s={settings}
                  onChange={change}
                  onSave={() => save(['contactHeroTitle','contactHeroSubtitle','contactHeroImage','contactCard1Title','contactCard2Title','contactCard3Title','contactCard4Title','contactMapTitle'])}
                  saving={saving}
                  saved={saved}
                />
              </>
            )}
            {active === 'contact' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.contact')}</h2>
                <ContactEditor
                  s={settings}
                  onChange={change}
                  onSave={() => save([
                    'phone','phone2','email','address','workingHours','mapLink',
                    'telegram','instagram','facebook','youtube',
                    'footerDescription',
                    'footerPagesTitle','footerHoursTitle','footerLegalTitle','footerContactsTitle',
                    'footerLegal1Label','footerLegal1Url','footerLegal2Label','footerLegal2Url',
                    'footerCopyright','footerBottomRight',
                  ])}
                  saving={saving}
                  saved={saved}
                />
              </>
            )}
            {active === 'other' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.other')}</h2>
                <div className="space-y-3">
                  <LinkedSection label={t('adminSiteEditor.other.videos')}                     to="/admin/home-videos"  desc={t('adminSiteEditor.other.descVideos')} />
                  <LinkedSection label={t('adminSiteEditor.other.faq')}         to="/admin/faq"          desc={t('adminSiteEditor.other.descFaq')} />
                  <LinkedSection label={t('adminSiteEditor.other.testimonials')}      to="/admin/testimonials" desc={t('adminSiteEditor.other.descTestimonials')} />
                  <LinkedSection label={t('adminSiteEditor.other.courses')}                      to="/admin/courses"      desc={t('adminSiteEditor.other.descCourses')} />
                  <LinkedSection label={t('adminSiteEditor.other.blog')}           to="/admin/blog"         desc={t('adminSiteEditor.other.descBlog')} />
                  <LinkedSection label={t('adminSiteEditor.other.gallery')}                to="/admin/gallery"      desc={t('adminSiteEditor.other.descGallery')} />
                  <LinkedSection label={t('adminSiteEditor.other.scholarships')}    to="/admin/scholarships" desc={t('adminSiteEditor.other.descScholarships')} />
                  <LinkedSection label={t('adminSiteEditor.other.social')}  to="/admin/settings"     desc={t('adminSiteEditor.other.descSocial')} />
                  <LinkedSection label={t('adminSiteEditor.other.teachers')}        to="/admin/teachers"     desc={t('adminSiteEditor.other.descTeachers')} />
                  <LinkedSection label={t('adminSiteEditor.other.directions')}                 to="/admin/directions"   desc={t('adminSiteEditor.other.descDirections')} />
                </div>
              </>
            )}

            {/* ─── PROFI-STYLE bo'limlar (Topex 2026) ─────────── */}
            {active === 'profi_hero' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.profiHero')}</h2>
                <HeroSlidesEditor s={settings} onChange={change} onSave={() => save(['heroSlides','heroCtaText','heroNoteText'])} saving={saving} saved={saved} />
              </>
            )}
            {active === 'profi_about' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.profiAbout')}</h2>
                <ProfiAboutEditor s={settings} onChange={change}
                  onSave={() => save(['aboutSectionLabel','aboutSectionTitle','aboutSlogan','aboutParagraph','aboutBtnText','aboutStat1Value','aboutStat1Label','aboutStat2Value','aboutStat2Label','aboutImage1','aboutImage2','aboutImage3','aboutImage4'])}
                  saving={saving} saved={saved} />
              </>
            )}
            {active === 'profi_directions' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.profiDirections')}</h2>
                <SimpleFieldsEditor fields={[
                  {key:'directionsLabel', label:t('adminSiteEditor.profiDirections.label')},
                  {key:'directionsTitle', label:t('adminSiteEditor.profiDirections.title')},
                ]} s={settings} onChange={change} onSave={() => save(['directionsLabel','directionsTitle'])} saving={saving} saved={saved} />
                <div className="mt-6">
                  <LinkedSection label={t('adminSiteEditor.profiDirections.listLink')} to="/admin/directions" desc={t('adminSiteEditor.profiDirections.listLinkDesc')} />
                </div>
              </>
            )}
            {active === 'profi_team' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.profiTeam')}</h2>
                <SimpleFieldsEditor fields={[
                  {key:'teamLabel', label:t('adminSiteEditor.profiTeam.label')},
                  {key:'teamTitle', label:t('adminSiteEditor.profiTeam.title')},
                  {key:'teamParagraph', label:t('adminSiteEditor.profiTeam.text'), textarea:true},
                  {key:'teamBtnText', label:t('adminSiteEditor.profiTeam.btnText')},
                ]} s={settings} onChange={change} onSave={() => save(['teamLabel','teamTitle','teamParagraph','teamBtnText'])} saving={saving} saved={saved} />
                <div className="mt-6">
                  <LinkedSection label={t('adminSiteEditor.profiTeam.listLink')} to="/admin/teachers" desc={t('adminSiteEditor.profiTeam.listLinkDesc')} />
                </div>
              </>
            )}
            {active === 'profi_news' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.profiNews')}</h2>
                <SimpleFieldsEditor fields={[
                  {key:'newsLabel', label:t('adminSiteEditor.profiNews.label')},
                  {key:'newsTitle', label:t('adminSiteEditor.profiNews.title')},
                  {key:'newsMoreText', label:t('adminSiteEditor.profiNews.moreText')},
                ]} s={settings} onChange={change} onSave={() => save(['newsLabel','newsTitle','newsMoreText'])} saving={saving} saved={saved} />
                <div className="mt-6">
                  <LinkedSection label={t('adminSiteEditor.profiNews.listLink')} to="/admin/blog" desc={t('adminSiteEditor.profiNews.listLinkDesc')} />
                </div>
              </>
            )}
            {active === 'profi_videos' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.profiVideos')}</h2>
                <SimpleFieldsEditor fields={[
                  {key:'videosLabel', label:t('adminSiteEditor.profiVideos.label')},
                  {key:'videosTitle', label:t('adminSiteEditor.profiVideos.title')},
                  {key:'videosSubtitle', label:t('adminSiteEditor.profiVideos.subtitle')},
                ]} s={settings} onChange={change} onSave={() => save(['videosLabel','videosTitle','videosSubtitle'])} saving={saving} saved={saved} />
                <div className="mt-6">
                  <LinkedSection label={t('adminSiteEditor.profiVideos.listLink')} to="/admin/home-videos" desc={t('adminSiteEditor.profiVideos.listLinkDesc')} />
                </div>
              </>
            )}
            {active === 'profi_form' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.profiForm')}</h2>
                <SimpleFieldsEditor fields={[
                  {key:'formLabel', label:t('adminSiteEditor.profiForm.label')},
                  {key:'formTitle', label:t('adminSiteEditor.profiForm.title')},
                  {key:'formParagraph', label:t('adminSiteEditor.profiForm.text'), textarea:true},
                  {key:'formNameLabel', label:t('adminSiteEditor.profiForm.nameLabel')},
                  {key:'formNamePh',    label:t('adminSiteEditor.profiForm.namePh')},
                  {key:'formPhoneLabel',label:t('adminSiteEditor.profiForm.phoneLabel')},
                  {key:'formDirLabel',  label:t('adminSiteEditor.profiForm.dirLabel')},
                  {key:'formDirPh',     label:t('adminSiteEditor.profiForm.dirPh')},
                  {key:'formDir9',      label:t('adminSiteEditor.profiForm.dir9')},
                  {key:'formDir11',     label:t('adminSiteEditor.profiForm.dir11')},
                  {key:'formAgreeText', label:t('adminSiteEditor.profiForm.agreeText'), textarea:true},
                  {key:'formSubmitText',label:t('adminSiteEditor.profiForm.submitText')},
                ]} s={settings} onChange={change} onSave={() => save(['formLabel','formTitle','formParagraph','formNameLabel','formNamePh','formPhoneLabel','formDirLabel','formDirPh','formDir9','formDir11','formAgreeText','formSubmitText','formImage'])} saving={saving} saved={saved} />
                <div className="mt-6">
                  <ImageUpload label={t('adminSiteEditor.profiForm.formImage')} value={settings.formImage} onChange={v => change('formImage', v)} />
                </div>
              </>
            )}
            {active === 'profi_footer' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">{t('adminSiteEditor.heading.profiFooter')}</h2>
                <ProfiFooterEditor s={settings} onChange={change}
                  onSave={() => save(['footerColAboutTitle','footerColApplicantsTitle','footerColStudentsTitle','footerColContactsTitle','footerCopyText','footerOfertaText','footerLicenseText','address2','footerColAboutLinks','footerColApplicantsLinks','footerColStudentsLinks'])}
                  saving={saving} saved={saved} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

/* ════════════════════════════════════════════════════════════════════
   ─── PROFI-STYLE editorlari ─────────────────────────────────────────
   ════════════════════════════════════════════════════════════════════ */

const SimpleFieldsEditor = ({ fields, s, onChange, onSave, saving, saved }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      {fields.map(f => (
        f.textarea
          ? <TextArea key={f.key} label={f.label} value={s[f.key]} onChange={v => onChange(f.key, v)} />
          : <Field    key={f.key} label={f.label} value={s[f.key]} onChange={v => onChange(f.key, v)} />
      ))}
      <SaveBar saving={saving} saved={saved} onSave={onSave} />
    </div>
  );
};

const HeroSlidesEditor = ({ s, onChange, onSave, saving, saved }) => {
  const { t } = useTranslation();
  const slides = Array.isArray(s.heroSlides) ? s.heroSlides : [];
  const set = (i, key, val) => {
    const next = [...slides];
    next[i] = { ...next[i], [key]: val };
    onChange('heroSlides', next);
  };
  const add = () => onChange('heroSlides', [...slides, { title1:'', title2:'', title3:'', subtitle:'', image:'' }]);
  const del = (i) => onChange('heroSlides', slides.filter((_, j) => j !== i));

  return (
    <div className="space-y-5">
      <Field    label={t('adminSiteEditor.heroSlides.ctaText')}           value={s.heroCtaText}  onChange={v => onChange('heroCtaText',  v)} />
      <TextArea label={t('adminSiteEditor.heroSlides.noteText')} value={s.heroNoteText} onChange={v => onChange('heroNoteText', v)} rows={2} />

      {slides.map((slide, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-700">{t('adminSiteEditor.heroSlides.slide')} {i + 1}</span>
            <button onClick={() => del(i)} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <Field label={t('adminSiteEditor.heroSlides.title1')} value={slide.title1} onChange={v => set(i, 'title1', v)} />
            <Field label={t('adminSiteEditor.heroSlides.title2')} value={slide.title2} onChange={v => set(i, 'title2', v)} />
            <Field label={t('adminSiteEditor.heroSlides.title3')} value={slide.title3} onChange={v => set(i, 'title3', v)} />
          </div>
          <TextArea label={t('adminSiteEditor.heroSlides.subtitle')} value={slide.subtitle} onChange={v => set(i, 'subtitle', v)} rows={2} />
          <div className="mt-3">
            <ImageUpload label={t('adminSiteEditor.heroSlides.image')} value={slide.image} onChange={v => set(i, 'image', v)} />
          </div>
        </div>
      ))}

      <button onClick={add} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-semibold text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
        <Plus size={16} /> {t('adminSiteEditor.heroSlides.addSlide')}
      </button>

      <SaveBar saving={saving} saved={saved} onSave={onSave} />
    </div>
  );
};

const ProfiAboutEditor = ({ s, onChange, onSave, saving, saved }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label={t('adminSiteEditor.profiAbout.label')}     value={s.aboutSectionLabel} onChange={v => onChange('aboutSectionLabel', v)} />
        <Field label={t('adminSiteEditor.profiAbout.title')}           value={s.aboutSectionTitle} onChange={v => onChange('aboutSectionTitle', v)} />
      </div>
      <Field    label={t('adminSiteEditor.profiAbout.slogan')}     value={s.aboutSlogan}    onChange={v => onChange('aboutSlogan',    v)} />
      <TextArea label={t('adminSiteEditor.profiAbout.paragraph')} value={s.aboutParagraph} onChange={v => onChange('aboutParagraph', v)} rows={5} />
      <div className="grid grid-cols-4 gap-3">
        <Field label={t('adminSiteEditor.profiAbout.stat1Value')} value={s.aboutStat1Value} onChange={v => onChange('aboutStat1Value', v)} />
        <Field label={t('adminSiteEditor.profiAbout.stat1Label')} value={s.aboutStat1Label} onChange={v => onChange('aboutStat1Label', v)} />
        <Field label={t('adminSiteEditor.profiAbout.stat2Value')} value={s.aboutStat2Value} onChange={v => onChange('aboutStat2Value', v)} />
        <Field label={t('adminSiteEditor.profiAbout.stat2Label')} value={s.aboutStat2Label} onChange={v => onChange('aboutStat2Label', v)} />
      </div>
      <Field label={t('adminSiteEditor.profiAbout.btnText')} value={s.aboutBtnText} onChange={v => onChange('aboutBtnText', v)} />
      <div className="grid grid-cols-2 gap-3">
        <ImageUpload label={t('adminSiteEditor.profiAbout.image1')}     value={s.aboutImage1} onChange={v => onChange('aboutImage1', v)} />
        <ImageUpload label={t('adminSiteEditor.profiAbout.image2')}     value={s.aboutImage2} onChange={v => onChange('aboutImage2', v)} />
        <ImageUpload label={t('adminSiteEditor.profiAbout.image3')}     value={s.aboutImage3} onChange={v => onChange('aboutImage3', v)} />
        <ImageUpload label={t('adminSiteEditor.profiAbout.image4')}     value={s.aboutImage4} onChange={v => onChange('aboutImage4', v)} />
      </div>
      <SaveBar saving={saving} saved={saved} onSave={onSave} />
    </div>
  );
};

const LinkArrayEditor = ({ label, items, onChange }) => {
  const { t } = useTranslation();
  const arr = Array.isArray(items) ? items : [];
  const set = (i, k, v) => {
    const next = [...arr]; next[i] = { ...next[i], [k]: v }; onChange(next);
  };
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-gray-700">{label}</span>
        <button onClick={() => onChange([...arr, { label:'', url:'/' }])}
                className="text-blue-600 hover:bg-blue-50 p-1.5 rounded">
          <Plus size={14} />
        </button>
      </div>
      <div className="space-y-2">
        {arr.map((it, i) => (
          <div key={i} className="flex gap-2">
            <input className="flex-1 px-3 py-2 rounded-lg text-sm border border-gray-200" placeholder={t('adminSiteEditor.linkArray.text')}
                   value={it.label || ''} onChange={e => set(i, 'label', e.target.value)} />
            <input className="flex-1 px-3 py-2 rounded-lg text-sm border border-gray-200" placeholder={t('adminSiteEditor.linkArray.url')}
                   value={it.url || ''}   onChange={e => set(i, 'url',   e.target.value)} />
            <button onClick={() => onChange(arr.filter((_, j) => j !== i))}
                    className="text-red-500 hover:bg-red-50 p-1.5 rounded">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfiFooterEditor = ({ s, onChange, onSave, saving, saved }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label={t('adminSiteEditor.profiFooter.col1Title')} value={s.footerColAboutTitle}      onChange={v => onChange('footerColAboutTitle',      v)} />
        <Field label={t('adminSiteEditor.profiFooter.col2Title')} value={s.footerColApplicantsTitle} onChange={v => onChange('footerColApplicantsTitle', v)} />
        <Field label={t('adminSiteEditor.profiFooter.col3Title')}   value={s.footerColStudentsTitle}   onChange={v => onChange('footerColStudentsTitle',   v)} />
        <Field label={t('adminSiteEditor.profiFooter.col4Title')}   value={s.footerColContactsTitle}   onChange={v => onChange('footerColContactsTitle',   v)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label={t('adminSiteEditor.profiFooter.copyText')} value={s.footerCopyText}   onChange={v => onChange('footerCopyText',   v)} />
        <Field label={t('adminSiteEditor.profiFooter.ofertaText')} value={s.footerOfertaText} onChange={v => onChange('footerOfertaText', v)} />
      </div>
      <Field label={t('adminSiteEditor.profiFooter.licenseText')}          value={s.footerLicenseText} onChange={v => onChange('footerLicenseText', v)} />
      <Field label={t('adminSiteEditor.profiFooter.address2')} value={s.address2}          onChange={v => onChange('address2',          v)} />

      <LinkArrayEditor label={t('adminSiteEditor.profiFooter.col1Links')} items={s.footerColAboutLinks}      onChange={v => onChange('footerColAboutLinks',      v)} />
      <LinkArrayEditor label={t('adminSiteEditor.profiFooter.col2Links')}   items={s.footerColApplicantsLinks} onChange={v => onChange('footerColApplicantsLinks', v)} />
      <LinkArrayEditor label={t('adminSiteEditor.profiFooter.col3Links')}         items={s.footerColStudentsLinks}   onChange={v => onChange('footerColStudentsLinks',   v)} />

      <SaveBar saving={saving} saved={saved} onSave={onSave} />
    </div>
  );
};

const SaveBar = ({ saving, saved, onSave }) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-end mt-2">
      <button onClick={onSave} disabled={saving}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {saved ? t('adminSiteEditor.saveBtn.saved') : t('adminSiteEditor.saveBtn.save')}
      </button>
    </div>
  );
};

export default AdminSiteEditor;
