import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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

const Field = ({ label, value, onChange, type = 'text', placeholder }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
    <input
      type={type} value={value ?? ''} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg text-sm outline-none border border-gray-200 focus:border-blue-500 transition-colors"
    />
  </div>
);

const TextArea = ({ label, value, onChange, rows = 4, placeholder }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
    <textarea
      value={value ?? ''} onChange={e => onChange(e.target.value)}
      rows={rows} placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg text-sm outline-none border border-gray-200 focus:border-blue-500 transition-colors resize-none"
    />
  </div>
);

const ImageUpload = ({ value, onChange, label = 'Rasm' }) => {
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
      toast.success('Rasm yuklandi');
    } catch {
      toast.error('Yuklashda xatolik');
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-2">{label}</label>
      <div className="flex items-center gap-3 flex-wrap">
        {value && (
          <img src={imgSrc(value)} alt="" className="w-20 h-20 object-cover rounded-xl border border-gray-200" />
        )}
        <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border-2 border-dashed border-gray-300 hover:border-blue-400 text-blue-600 transition-colors disabled:opacity-60">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? 'Yuklanmoqda...' : 'Rasm yuklash'}
        </button>
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
};

const SaveBtn = ({ onClick, saving, saved }) => (
  <button onClick={onClick} disabled={saving}
    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 hover:-translate-y-0.5"
    style={{ background: saved ? '#16A34A' : '#272829', color: '#fff', transition: 'background 0.3s' }}>
    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
    {saving ? 'Saqlanmoqda...' : saved ? 'Saqlandi ✓' : 'Saqlash'}
  </button>
);

/* ─── Section Editors ───────────────────────────────────── */

const HeroEditor = ({ s, onChange, onSave, saving, saved }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Yuqoridagi kichik yorliq (label)" value={s.heroLabel} onChange={v => onChange('heroLabel', v)} placeholder="TOPEX TEXNIKUMI –" />
      <Field label="1-tugma matni" value={s.heroBtn} onChange={v => onChange('heroBtn', v)} placeholder="Yo'nalishlarni ko'rish" />
      <div className="md:col-span-2">
        <TextArea label="Asosiy sarlavha (h1)" value={s.heroTitle} onChange={v => onChange('heroTitle', v)} rows={3}
          placeholder="Kelajak kasbini bugun egallang..." />
      </div>
      <div className="md:col-span-2">
        <TextArea label="Kichik matn (paragraf)" value={s.heroSubtitle} onChange={v => onChange('heroSubtitle', v)} rows={2}
          placeholder="Topex Texnikumida zamonaviy yo'nalishlar..." />
      </div>
      <Field label="2-tugma matni (chiziqli)" value={s.heroBtn2} onChange={v => onChange('heroBtn2', v)} placeholder="Grant uchun ro'yxatdan o'tish" />
      <div className="md:col-span-2">
        <TextArea
          label="Eslatma kartasi (tugmalar ostida ko'rinadi, bo'sh qoldirsangiz yashirinadi)"
          value={s.heroNote}
          onChange={v => onChange('heroNote', v)}
          rows={2}
          placeholder="9-sinfni tamomlaganlar va 11 yillik ta'limi tugallanmay qolganlar uchun!"
        />
      </div>
    </div>
    <ImageUpload label="O'ng tomonidagi rasm (asosiy)" value={s.heroImage} onChange={v => onChange('heroImage', v)} />
    <div className="p-4 rounded-xl border border-blue-100 bg-blue-50">
      <p className="text-xs font-semibold text-blue-700 mb-3">Fon rasmi (orqa taraf, shaffof)</p>
      <ImageUpload label="Fon rasmi" value={s.heroBgImage} onChange={v => onChange('heroBgImage', v)} />
    </div>
    <div className="flex justify-end pt-2">
      <SaveBtn onClick={onSave} saving={saving} saved={saved} />
    </div>
  </div>
);

const StatsEditor = ({ s, onChange, onSave, saving, saved }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <Field label="O'quvchilar soni" value={s.statsStudents} onChange={v => onChange('statsStudents', v)} placeholder="600+" />
      <Field label="Filiallar soni"   value={s.statsBranches} onChange={v => onChange('statsBranches', v)} placeholder="3+" />
      <Field label="Mutaxassislar"    value={s.statsTeachers} onChange={v => onChange('statsTeachers', v)} placeholder="50+" />
      <Field label="Sinflar"          value={s.statsGrades}   onChange={v => onChange('statsGrades', v)}   placeholder="10–11" />
    </div>
    <div className="flex justify-end">
      <SaveBtn onClick={onSave} saving={saving} saved={saved} />
    </div>
  </div>
);

const AboutEditor = ({ s, onChange, onSave, saving, saved }) => (
  <div className="space-y-4">
    <Field label="Yuqoridagi kichik yorliq (label)" value={s.aboutLabel} onChange={v => onChange('aboutLabel', v)} placeholder="TOPEX HAQIDA" />
    <Field label="Sarlavha" value={s.aboutTitle} onChange={v => onChange('aboutTitle', v)} placeholder="Toshkentning zamonaviy texnikumi" />
    <TextArea
      label="Asosiy matn (xatboshilar)"
      value={s.aboutText}
      onChange={v => onChange('aboutText', v)}
      rows={14}
      placeholder={"Birinchi xatboshi matni...\n\nIkkinchi xatboshi matni...\n\nUchinchi xatboshi matni..."}
    />
    <p className="text-xs text-gray-500 -mt-2">
      Yangi xatboshi qo'shish uchun ikki marta <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border">Enter</kbd> bosing.
      Har bir bo'sh qator yangi paragraf yaratadi.
    </p>
    <ImageUpload label="Bo'lim rasmi" value={s.aboutImage} onChange={v => onChange('aboutImage', v)} />
    <div className="flex justify-end">
      <SaveBtn onClick={onSave} saving={saving} saved={saved} />
    </div>
  </div>
);

const SubjectsEditor = ({ subjects, onChange, onSave, saving, saved }) => {
  const [editing, setEditing] = useState(null);
  const [pendingRemove, setPendingRemove] = useState(null);

  const update = (idx, key, val) => {
    const arr = [...subjects];
    arr[idx] = { ...arr[idx], [key]: val };
    onChange(arr);
  };

  const addNew = () => {
    const newItem = { id: Date.now(), name: 'Yangi yo\'nalish', desc: 'Tavsif...', duration: '2 yil', features: 'Feature 1, Feature 2', imgUrl: '', iconName: 'BookOpen' };
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
        <p className="text-sm text-gray-500">Jami: <strong>{subjects.length}</strong> ta yo'nalish</p>
        <button onClick={addNew}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Plus size={14} /> Yangi qo'shish
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
                <Field label="Nomi" value={sub.name} onChange={v => update(idx, 'name', v)} />
                <Field label="Davomiyligi" value={sub.duration} onChange={v => update(idx, 'duration', v)} placeholder="2 yil" />
                <div className="md:col-span-2">
                  <TextArea label="Tavsif" value={sub.desc} onChange={v => update(idx, 'desc', v)} rows={2} />
                </div>
                <div className="md:col-span-2">
                  <Field label="Imkoniyatlar (vergul bilan ajrating)" value={sub.features} onChange={v => update(idx, 'features', v)}
                    placeholder="Frontend & Backend, Mobil ilovalar, Portfolio" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Ikonka</label>
                  <select value={sub.iconName || 'BookOpen'} onChange={e => update(idx, 'iconName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border border-gray-200 outline-none">
                    {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
              </div>
              <ImageUpload label="Rasm" value={sub.imgUrl} onChange={v => update(idx, 'imgUrl', v)} />
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
        title="Yo'nalishni o'chirish"
        message="Bu yo'nalish ro'yxatdan butunlay o'chiriladi. Saqlashni unutmang."
        confirmLabel="Ha, o'chirish"
      />
    </div>
  );
};

const ExtrasEditor = ({ extras, onChange, onSave, saving, saved }) => {
  const addItem = () => onChange([...extras, 'Yangi faoliyat']);
  const removeItem = (i) => onChange(extras.filter((_, idx) => idx !== i));
  const updateItem = (i, val) => { const a = [...extras]; a[i] = val; onChange(a); };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Sinfdan tashqari faoliyatlar</p>
        <button onClick={addItem}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Plus size={14} /> Qo'shish
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
  const updateItem = (i, key, val) => {
    const arr = [...features];
    arr[i] = { ...arr[i], [key]: val };
    onChange(arr);
  };
  const addItem = () => onChange([...features, { title: 'Yangi afzallik', desc: 'Tavsif...' }]);
  const removeItem = (i) => onChange(features.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-4 space-y-3">
        <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">Bo'lim sarlavhalari</p>
        <Field label="Yorliq (label)" value={s.featuresLabel} onChange={v => onChangeKey('featuresLabel', v)} placeholder="Nega bizni tanlashingiz kerak?" />
        <Field label="Asosiy sarlavha (h2)" value={s.featuresTitle} onChange={v => onChangeKey('featuresTitle', v)} placeholder="Topex texnikumining afzalliklari" />
        <Field label="Pastki yozuv (bo'sh qoldirsangiz yashirinadi)" value={s.featuresSubtitle} onChange={v => onChangeKey('featuresSubtitle', v)} placeholder="TOPEX TEXNIKUM hamasini katta bilan yozamiz" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <p className="text-sm text-gray-500">Afzalliklar kartalari</p>
        <button onClick={addItem}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Plus size={14} /> Qo'shish
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
          <Field label="Sarlavha" value={feat.title} onChange={v => updateItem(i, 'title', v)} />
          <TextArea label="Tavsif" value={feat.desc} onChange={v => updateItem(i, 'desc', v)} rows={2} />
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
  const COLOR_OPTIONS = ['blue', 'teal', 'blue2', 'coral'];
  const update = (i, key, val) => {
    const arr = [...cards];
    arr[i] = { ...arr[i], [key]: val };
    onChange(arr);
  };

  return (
    <div className="space-y-4">
      <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-4 space-y-3">
        <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">Bo'lim sarlavhalari</p>
        <Field label="Yorliq (label)" value={s.grantsLabel} onChange={v => onChangeKey('grantsLabel', v)} placeholder="STIPENDIYA VA GRANTLAR" />
        <Field label="Asosiy sarlavha (h2)" value={s.grantsTitle} onChange={v => onChangeKey('grantsTitle', v)} placeholder="Bilimingizni daromadga aylantiring!" />
        <TextArea label="Pastki tavsif" value={s.grantsSubtitle} onChange={v => onChangeKey('grantsSubtitle', v)} rows={3} placeholder="Topex Texnikumida oylik kontrakt to'lovi..." />
      </div>
      <p className="text-xs text-gray-500">4 ta grant kartasini tahrirlang (rang, miqdor, matn)</p>
      {cards.map((card, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Grant Kartasi {i + 1}</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Sarlavha" value={card.title} onChange={v => update(i, 'title', v)} placeholder="SAT 1200+" />
            <Field label="Kichik matn" value={card.subtitle} onChange={v => update(i, 'subtitle', v)} placeholder="IELTS 7.0+" />
            <Field label="Miqdor" value={card.amount} onChange={v => update(i, 'amount', v)} placeholder="2 MLN" />
            <Field label="Valyuta" value={card.amountUnit} onChange={v => update(i, 'amountUnit', v)} placeholder="so'm" />
            <Field label="Badge matni" value={card.badge} onChange={v => update(i, 'badge', v)} placeholder="Deyarli bepul o'qish" />
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Rang turi</label>
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
  const update = (i, key, val) => {
    const arr = [...highlights];
    arr[i] = { ...arr[i], [key]: val };
    onChange(arr);
  };
  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 font-semibold">Hero bo'limidagi 4 ta kichik karta:</p>
      {highlights.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Karta {i + 1}</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Sarlavha" value={item.title} onChange={v => update(i, 'title', v)} />
            <Field label="O'quvchilar soni" value={item.students} onChange={v => update(i, 'students', v)} placeholder="120+" />
          </div>
          <ImageUpload label="Kichik rasm" value={item.img} onChange={v => update(i, 'img', v)} />
        </div>
      ))}
    </div>
  );
};

const CoursesPageEditor = ({ s, onChange, onSave, saving, saved }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">Hero Bo'limi</h3>
      <div className="space-y-4">
        <Field label="Yuqoridagi badge" value={s.coursesHeroBadge} onChange={v => onChange('coursesHeroBadge', v)} placeholder="O'quv kurslari" />
        <Field label="Sarlavha (h1)" value={s.coursesHeroTitle} onChange={v => onChange('coursesHeroTitle', v)} placeholder="Barcha kurslar va yo'nalishlar" />
        <TextArea label="Kichik matn" value={s.coursesHeroSubtitle} onChange={v => onChange('coursesHeroSubtitle', v)} rows={2} />
        <ImageUpload label="Fon rasmi (Curses sahifasi orqa fon)" value={s.coursesHeroImage} onChange={v => onChange('coursesHeroImage', v)} />
      </div>
    </div>
    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">"Bizning fakultetlar" bo'limi</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Yorliq" value={s.coursesFacultyLabel} onChange={v => onChange('coursesFacultyLabel', v)} placeholder="FAKULTETLAR" />
        <Field label="Sarlavha (h2)" value={s.coursesFacultyTitle} onChange={v => onChange('coursesFacultyTitle', v)} placeholder="Bizning fakultetlar" />
        <div className="md:col-span-2">
          <TextArea label="Pastki tavsif" value={s.coursesFacultySubtitle} onChange={v => onChange('coursesFacultySubtitle', v)} rows={2} />
        </div>
      </div>
    </div>
    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">Kichik Kartalar (4 ta)</h3>
      <CoursesHighlightsEditor
        highlights={s.coursesHighlights || []}
        onChange={v => onChange('coursesHighlights', v)}
      />
    </div>
    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">CTA Bo'limi (Pastki qism)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Yorliq" value={s.coursesCtaLabel} onChange={v => onChange('coursesCtaLabel', v)} placeholder="QABUL" />
        <Field label="Telefon raqam (link)" value={s.coursesCtaPhone} onChange={v => onChange('coursesCtaPhone', v)} placeholder="+998787774477" />
        <div className="md:col-span-2">
          <TextArea label="Sarlavha" value={s.coursesCtaTitle} onChange={v => onChange('coursesCtaTitle', v)} rows={2} placeholder="Farzandingizni Topexga yozing!" />
        </div>
        <div className="md:col-span-2">
          <Field label="Kichik matn" value={s.coursesCtaSubtitle} onChange={v => onChange('coursesCtaSubtitle', v)} placeholder="Ariza qoldiring — biz siz bilan bog'lanamiz" />
        </div>
        <Field label="Tugma 1 matni" value={s.coursesCtaPhoneBtn} onChange={v => onChange('coursesCtaPhoneBtn', v)} placeholder="Qo'ng'iroq qilish" />
        <Field label="Tugma 2 matni" value={s.coursesCtaHomeBtn} onChange={v => onChange('coursesCtaHomeBtn', v)} placeholder="Bosh sahifa" />
      </div>
    </div>
    <div className="flex justify-end">
      <SaveBtn onClick={onSave} saving={saving} saved={saved} />
    </div>
  </div>
);

/* ─── Diplom Bo'limi Editor ─────────────────────────────── */

const DiplomaEditor = ({ s, onChange, onSave, saving, saved }) => (
  <div className="space-y-5">
    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">Asosiy matn</h3>
      <div className="space-y-4">
        <Field label="Sarlavha (h2)" value={s.diplomaTitle} onChange={v => onChange('diplomaTitle', v)} placeholder="Davlat namunasidagi diplom" />
        <TextArea label="Asosiy matn (paragraflar)" value={s.diplomaText} onChange={v => onChange('diplomaText', v)} rows={8}
          placeholder="Topex bitiruvchilari davlat namunasidagi diplom oladilar..." />
      </div>
    </div>
    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">Diplom rasmlari (chap tomon)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImageUpload label="1-rasm (chap)" value={s.diplomaImage1} onChange={v => onChange('diplomaImage1', v)} />
        <ImageUpload label="2-rasm (o'ng)" value={s.diplomaImage2} onChange={v => onChange('diplomaImage2', v)} />
      </div>
      <p className="text-xs text-gray-400 mt-2">Bo'sh qoldirsangiz — chiroyli default ko'rinish (DIPLOM/OTPRAV) chiqadi.</p>
    </div>
    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">Pastdagi 2 ta kichik karta</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Karta 1</p>
          <Field label="Sarlavha" value={s.diplomaCard1Title} onChange={v => onChange('diplomaCard1Title', v)} placeholder="Davlat tan olishi" />
          <Field label="Tavsif" value={s.diplomaCard1Desc} onChange={v => onChange('diplomaCard1Desc', v)} placeholder="Rasmiy hujjat" />
        </div>
        <div className="border border-gray-200 rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Karta 2</p>
          <Field label="Sarlavha" value={s.diplomaCard2Title} onChange={v => onChange('diplomaCard2Title', v)} placeholder="Kasbiy ko'nikmalar" />
          <Field label="Tavsif" value={s.diplomaCard2Desc} onChange={v => onChange('diplomaCard2Desc', v)} placeholder="Amaliy tasdiqlash" />
        </div>
      </div>
    </div>
    <div className="flex justify-end pt-2">
      <SaveBtn onClick={onSave} saving={saving} saved={saved} />
    </div>
  </div>
);

/* ─── Ish bilan ta'minlash Editor ────────────────────────── */

const EmploymentEditor = ({ s, onChange, onSave, saving, saved }) => {
  const bullets = s.employmentBullets || [];
  const updateBullet = (i, val) => {
    const a = [...bullets]; a[i] = val;
    onChange('employmentBullets', a);
  };
  const addBullet = () => onChange('employmentBullets', [...bullets, "Yangi punkt"]);
  const removeBullet = (i) => onChange('employmentBullets', bullets.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">Asosiy matn</h3>
        <div className="space-y-4">
          <Field label="Sarlavha (h2)" value={s.employmentTitle} onChange={v => onChange('employmentTitle', v)} placeholder="Ish bilan ta'minlash" />
          <TextArea label="Tavsif (asosiy paragraf)" value={s.employmentText} onChange={v => onChange('employmentText', v)} rows={6}
            placeholder="Topexda o'qish davomida..." />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">Yordam punktlari (ro'yxat)</h3>
          <button onClick={addBullet}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <Plus size={12} /> Qo'shish
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
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">Pastki matn (statistika)</h3>
        <TextArea label="Pastki matn" value={s.employmentFooter} onChange={v => onChange('employmentFooter', v)} rows={2}
          placeholder="Topex bitiruvchilarining 100 % i amaliyotga chiqadi..." />
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">Rasm (o'ng tomonda)</h3>
        <ImageUpload label="Bo'lim rasmi" value={s.employmentImage} onChange={v => onChange('employmentImage', v)} />
      </div>
      <div className="flex justify-end pt-2">
        <SaveBtn onClick={onSave} saving={saving} saved={saved} />
      </div>
    </div>
  );
};

/* ─── Gallery / Blog Hero Editors ───────────────────────── */

const GalleryHeroEditor = ({ s, onChange, onSave, saving, saved }) => (
  <div className="space-y-4">
    <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-4 space-y-3">
      <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">Hero (yuqorigi)</p>
      <Field label="Yuqoridagi badge" value={s.galleryHeroBadge} onChange={v => onChange('galleryHeroBadge', v)} placeholder="Bizning Galereya" />
      <Field label="Sarlavha (h1)" value={s.galleryHeroTitle} onChange={v => onChange('galleryHeroTitle', v)} placeholder="Topex hayoti kadrlarda" />
      <TextArea label="Kichik matn" value={s.galleryHeroSubtitle} onChange={v => onChange('galleryHeroSubtitle', v)} rows={2} />
      <ImageUpload label="Fon rasmi (Hero)" value={s.galleryHeroImage} onChange={v => onChange('galleryHeroImage', v)} />
    </div>
    <div className="border border-gray-100 rounded-xl p-4 space-y-3">
      <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Rasmlar bo'limi</p>
      <Field label="Yorliq" value={s.galleryPhotosLabel} onChange={v => onChange('galleryPhotosLabel', v)} placeholder="FOTO LAVHALAR" />
      <Field label="Sarlavha (h2)" value={s.galleryPhotosTitle} onChange={v => onChange('galleryPhotosTitle', v)} placeholder="Rasmlar galereyasi" />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tab 1 nomi" value={s.galleryStudentsTab} onChange={v => onChange('galleryStudentsTab', v)} placeholder="O'quvchilar" />
        <Field label="Tab 2 nomi" value={s.galleryTeachersTab} onChange={v => onChange('galleryTeachersTab', v)} placeholder="O'qituvchilar" />
      </div>
    </div>
    <div className="flex justify-end">
      <SaveBtn onClick={onSave} saving={saving} saved={saved} />
    </div>
  </div>
);

const BlogHeroEditor = ({ s, onChange, onSave, saving, saved }) => (
  <div className="space-y-4">
    <Field label="Yuqoridagi badge" value={s.blogHeroBadge} onChange={v => onChange('blogHeroBadge', v)} placeholder="Video Galereya" />
    <Field label="Sarlavha (h1)" value={s.blogHeroTitle} onChange={v => onChange('blogHeroTitle', v)} placeholder="Bizning Videolar" />
    <TextArea label="Kichik matn" value={s.blogHeroSubtitle} onChange={v => onChange('blogHeroSubtitle', v)} rows={2} />
    <ImageUpload label="Fon rasmi (Hero)" value={s.blogHeroImage} onChange={v => onChange('blogHeroImage', v)} />
    <div className="flex justify-end">
      <SaveBtn onClick={onSave} saving={saving} saved={saved} />
    </div>
  </div>
);

/* ─── Contact Editor ─────────────────────────────────────── */

const ContactEditor = ({ s, onChange, onSave, saving, saved }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">Telefon va Aloqa</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Asosiy telefon" value={s.phone} onChange={v => onChange('phone', v)} placeholder="+998 71 123 45 67" />
        <Field label="Qo'shimcha telefon" value={s.phone2} onChange={v => onChange('phone2', v)} placeholder="+998 90 123 45 67" />
        <Field label="Email" value={s.email} onChange={v => onChange('email', v)} placeholder="info@topex.uz" />
        <Field label="Ish vaqti" value={s.workingHours} onChange={v => onChange('workingHours', v)} placeholder="Du-Sha: 8:00-18:00" />
        <div className="md:col-span-2">
          <Field label="Manzil" value={s.address} onChange={v => onChange('address', v)} placeholder="Toshkent shahri, Chilonzor tumani" />
        </div>
        <div className="md:col-span-2">
          <Field label="Xarita havolasi (Google Maps embed URL)" value={s.mapLink} onChange={v => onChange('mapLink', v)} placeholder="https://maps.google.com/..." />
        </div>
      </div>
    </div>
    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">Ijtimoiy Tarmoqlar</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Telegram" value={s.telegram} onChange={v => onChange('telegram', v)} placeholder="https://t.me/topex_uz" />
        <Field label="Instagram" value={s.instagram} onChange={v => onChange('instagram', v)} placeholder="https://instagram.com/topex.uz" />
        <Field label="Facebook" value={s.facebook} onChange={v => onChange('facebook', v)} placeholder="https://facebook.com/topex.uz" />
        <Field label="YouTube" value={s.youtube} onChange={v => onChange('youtube', v)} placeholder="https://youtube.com/@topex" />
      </div>
    </div>
    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">Footer Tavsifi va Sarlavhalari</h3>
      <div className="space-y-4">
        <TextArea
          label="Footer qismidagi texnikum tavsifi"
          value={s.footerDescription}
          onChange={v => onChange('footerDescription', v)}
          rows={3}
          placeholder="Toshkent, Chilonzor tumanidagi zamonaviy xususiy texnikum..."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Field label="Ustun 1 sarlavhasi" value={s.footerPagesTitle} onChange={v => onChange('footerPagesTitle', v)} placeholder="Sahifalar" />
          <Field label="Ustun 2 sarlavhasi" value={s.footerHoursTitle} onChange={v => onChange('footerHoursTitle', v)} placeholder="Ish vaqti" />
          <Field label="Huquqiy bo'lim sarl." value={s.footerLegalTitle} onChange={v => onChange('footerLegalTitle', v)} placeholder="Huquqiy" />
          <Field label="Ustun 4 sarlavhasi" value={s.footerContactsTitle} onChange={v => onChange('footerContactsTitle', v)} placeholder="Kontaktlar" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
          <Field label="Huquqiy link 1 — matn" value={s.footerLegal1Label} onChange={v => onChange('footerLegal1Label', v)} placeholder="Maxfiylik siyosati" />
          <Field label="Huquqiy link 1 — URL" value={s.footerLegal1Url} onChange={v => onChange('footerLegal1Url', v)} placeholder="/privacy" />
          <Field label="Huquqiy link 2 — matn" value={s.footerLegal2Label} onChange={v => onChange('footerLegal2Label', v)} placeholder="Foydalanish shartlari" />
          <Field label="Huquqiy link 2 — URL" value={s.footerLegal2Url} onChange={v => onChange('footerLegal2Url', v)} placeholder="/terms" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
          <Field label="Copyright matni (yil avtomatik)" value={s.footerCopyright} onChange={v => onChange('footerCopyright', v)} placeholder="Topex Texnikumi. Barcha huquqlar himoyalangan." />
          <Field label="Pastki o'ng yozuv" value={s.footerBottomRight} onChange={v => onChange('footerBottomRight', v)} placeholder="topex.uz" />
        </div>
      </div>
    </div>
    <div className="flex justify-end pt-2">
      <SaveBtn onClick={onSave} saving={saving} saved={saved} />
    </div>
  </div>
);

/* ─── Aloqalar Sahifasi Editor ───────────────────────────── */

const ContactPageEditor = ({ s, onChange, onSave, saving, saved }) => (
  <div className="space-y-6">
    <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-4 space-y-3">
      <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">Hero (yuqori banner)</p>
      <Field label="Sarlavha (h1)" value={s.contactHeroTitle} onChange={v => onChange('contactHeroTitle', v)} placeholder="Aloqalar" />
      <TextArea label="Kichik matn (bo'sh qoldirsangiz yashirinadi)" value={s.contactHeroSubtitle} onChange={v => onChange('contactHeroSubtitle', v)} rows={2} />
      <ImageUpload label="Fon rasmi (Hero)" value={s.contactHeroImage} onChange={v => onChange('contactHeroImage', v)} />
    </div>

    <div className="border border-gray-100 rounded-xl p-4 space-y-3">
      <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Kontakt kartalari (sarlavhalar)</p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="1-karta (manzil)"    value={s.contactCard1Title} onChange={v => onChange('contactCard1Title', v)} placeholder="Bizning manzil" />
        <Field label="2-karta (telefon)"   value={s.contactCard2Title} onChange={v => onChange('contactCard2Title', v)} placeholder="Telefon raqam" />
        <Field label="3-karta (email)"     value={s.contactCard3Title} onChange={v => onChange('contactCard3Title', v)} placeholder="E-mail" />
        <Field label="4-karta (ish vaqti)" value={s.contactCard4Title} onChange={v => onChange('contactCard4Title', v)} placeholder="Ish vaqti" />
      </div>
      <p className="text-xs text-gray-400">
        Kartalardagi <strong>qiymatlar</strong> (telefon, email, manzil, ish vaqti) "Kontakt va Ijtimoiy" bo'limidan olinadi.
      </p>
    </div>

    <div className="border border-gray-100 rounded-xl p-4 space-y-3">
      <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Xarita bo'limi</p>
      <Field label="Sarlavha" value={s.contactMapTitle} onChange={v => onChange('contactMapTitle', v)} placeholder="BIZ XARITADA!" />
      <p className="text-xs text-gray-400">
        Xarita havolasi (Google Maps embed) "Kontakt va Ijtimoiy" bo'limidagi "Xarita havolasi" maydonidan olinadi. Bo'sh bo'lsa — manzil bo'yicha avtomatik chiqadi.
      </p>
    </div>

    <div className="flex justify-end">
      <SaveBtn onClick={onSave} saving={saving} saved={saved} />
    </div>
  </div>
);

/* ─── Bo'lim sarlavhalari (umumiy) Editor ───────────────── */

const SectionTitlesEditor = ({ s, onChange, onSave, saving, saved }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">Video Galereya bo'limi</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Yorliq" value={s.videoLabel} onChange={v => onChange('videoLabel', v)} placeholder="VIDEO GALEREYA" />
        <Field label="Sarlavha (h2)" value={s.videoTitle} onChange={v => onChange('videoTitle', v)} placeholder="Bizning hayotimizdan lavhalar" />
      </div>
    </div>

    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">"Mashhur kurslar" bo'limi</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Yorliq" value={s.popularLabel} onChange={v => onChange('popularLabel', v)} placeholder="★ KURSLARIMIZ" />
        <Field label="Sarlavha (h2)" value={s.popularTitle} onChange={v => onChange('popularTitle', v)} placeholder="Mashhur kurslar" />
        <div className="md:col-span-2">
          <TextArea label="Pastki tavsif" value={s.popularSubtitle} onChange={v => onChange('popularSubtitle', v)} rows={2} placeholder="Eng so'nggi yo'nalishlar..." />
        </div>
        <Field label="Pastki tugma" value={s.popularBtn} onChange={v => onChange('popularBtn', v)} placeholder="Barcha kurslarni ko'rish" />
      </div>
    </div>

    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">FAQ bo'limi</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Yorliq" value={s.faqLabel} onChange={v => onChange('faqLabel', v)} placeholder="FAQ" />
        <Field label="Sarlavha (h2)" value={s.faqTitle} onChange={v => onChange('faqTitle', v)} placeholder="Tez-tez beriladigan savollar" />
      </div>
    </div>

    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">Ariza qoldirish (CTA) bo'limi</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Yuqoridagi badge" value={s.applicationBadge} onChange={v => onChange('applicationBadge', v)} placeholder="Qabul 2026" />
        <Field label="Forma sarlavhasi" value={s.applicationFormTitle} onChange={v => onChange('applicationFormTitle', v)} placeholder="Ariza qoldirish" />
        <div className="md:col-span-2">
          <TextArea label="Asosiy sarlavha (h2)" value={s.applicationTitle} onChange={v => onChange('applicationTitle', v)} rows={3} placeholder="Kelajagingizni biz bilan boshlang!" />
        </div>
        <div className="md:col-span-2">
          <TextArea label="Pastki tavsif (paragraf)" value={s.applicationSubtitle} onChange={v => onChange('applicationSubtitle', v)} rows={3} placeholder="Hoziroq ro'yxatdan o'ting..." />
        </div>
        <Field label="Forma kichik tavsifi" value={s.applicationFormSubtitle} onChange={v => onChange('applicationFormSubtitle', v)} placeholder="Biz 24 soat ichida siz bilan bog'lanamiz" />
        <Field label="Yuborish tugmasi" value={s.applicationSubmitBtn} onChange={v => onChange('applicationSubmitBtn', v)} placeholder="Arizani yuborish" />
      </div>
    </div>

    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">Logotip (Navbar)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field
          label="Logotip yonidagi yozuv (asosiy)"
          value={s.brandSuffix}
          onChange={v => onChange('brandSuffix', v)}
          placeholder="TEXNIKUMI"
        />
        <Field
          label="Slogan (kichik, pastki yozuv)"
          value={s.brandTagline}
          onChange={v => onChange('brandTagline', v)}
          placeholder="Sifatli ta'lim"
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Logotip ko'rinishi: <strong className="text-navy">Topex │ TEXNIKUMI</strong> <span className="text-gray-400">/ Sifatli ta'lim</span>. Bo'sh qoldirsangiz tegishli qism yashirinadi.
      </p>
      <div className="mt-4">
        <ImageUpload label="Logotip rasmi (Navbar va Footer)" value={s.logo} onChange={v => onChange('logo', v)} />
        <p className="text-xs text-gray-400 mt-1">Shaffof fonli PNG tavsiya etiladi. Footerda rasm avtomatik oq rangga aylantiriladi.</p>
      </div>
    </div>

    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">SEO (brauzer ko'rinishi)</h3>
      <div className="space-y-4">
        <Field label="Sayt sarlavhasi (browser tab)" value={s.siteTitle} onChange={v => onChange('siteTitle', v)} placeholder="Topex Texnikumi – Sifatli Ta'lim, 10–11 Sinflar" />
        <TextArea label="Sayt tavsifi (meta description)" value={s.siteDescription} onChange={v => onChange('siteDescription', v)} rows={3} placeholder="Topex – Toshkent, Chilonzor tumanidagi..." />
      </div>
    </div>

    <div className="flex justify-end pt-2">
      <SaveBtn onClick={onSave} saving={saving} saved={saved} />
    </div>
  </div>
);

/* ─── Linked section shortcut ────────────────────────────── */

const LinkedSection = ({ label, to, desc }) => (
  <div className="flex items-center justify-between p-5 rounded-xl border border-gray-200 bg-gray-50">
    <div>
      <p className="font-semibold text-gray-800">{label}</p>
      <p className="text-sm text-gray-400 mt-0.5">{desc}</p>
    </div>
    <Link to={to}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gray-800 text-white hover:bg-blue-600 transition-colors">
      Boshqarish <ExternalLink size={13} />
    </Link>
  </div>
);

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
          { id: 1, name: 'Dasturlash', desc: "Kod yozishdan tortib, murakkab tizimlar yaratishgacha.", duration: '2 yil', features: "Frontend & Backend, Mobil ilovalar, Portfolio yaratish", imgUrl: '/assets/images/DSC00827.jpg', iconName: 'Code' },
          { id: 2, name: 'Marketing va Agrobiznes', desc: "Zamonaviy savdo san'ati va agrar soha menejmenti.", duration: '2 yil', features: "SMM & Brending, Bozor tahlili, Eksport-import", imgUrl: '/assets/images/DSC00912.jpg', iconName: 'TrendingUp' },
          { id: 3, name: 'Kompyuter Grafikasi', desc: '3D modellashtirish, brending va vizual kontent.', duration: '2 yil', features: "Adobe Photoshop/Illustrator, 3D Blender, Motion dizayn", imgUrl: '/assets/images/DSC01093.jpg', iconName: 'Palette' },
          { id: 4, name: 'Bank Nazoratchisi', desc: 'Moliya tizimi xavfsizligi va audit mutaxassisi.', duration: '2 yil', features: "Kredit tahlili, Xavfsizlik tizimlari, Bank auditi", imgUrl: '/assets/famali-photo/DSC00875.jpg', iconName: 'ShieldCheck' },
          { id: 5, name: 'Mehmonxona Boshqaruvi', desc: "Xalqaro servis va mehmondo'stlik san'ati.", duration: '2 yil', features: "Service Management, Event planning, Xorijiy tillar", imgUrl: '/assets/famali-photo/DSC00954.jpg', iconName: 'Hotel' },
          { id: 6, name: 'Raqamli Axborotlar Analitigi', desc: "Ma'lumotlar tahlili va biznes-bashorat.", duration: '2 yil', features: "Big Data, Excel & SQL, Biznes strategiya", imgUrl: '/assets/famali-photo/DSC00955.jpg', iconName: 'BarChart3' },
          { id: 7, name: 'Laborant-Analitik', desc: 'Tibbiy va sanoat tahlillari ustasi.', duration: '2 yil', features: "Kimyoviy tahlil, Sanoat laboratoriyasi, Sifat nazorati", imgUrl: '/assets/famali-photo/DSC00964.jpg', iconName: 'FlaskConical' },
          { id: 8, name: "Dorivor O'simliklar Laboranti", desc: 'Farmatsevtika va fitoterapiya sirlari.', duration: '2 yil', features: "Botanika, Dori tayyorlash, Fitoterapiya", imgUrl: '/assets/famali-photo/DSC00980.jpg', iconName: 'Sprout' },
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
          { img: '/assets/icons/icon-02.jpg', title: 'Kimyo',       students: '120+' },
          { img: '/assets/icons/icon-04.jpg', title: 'Adabiyot',    students: '85+' },
          { img: '/assets/icons/icon-06.jpg', title: 'Olimpiadalar', students: '200+' },
          { img: '/assets/icons/icon-08.jpg', title: 'Tadqiqot',    students: '60+' },
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
      if (!d.blogHeroImage)    d.blogHeroImage    = '/assets/images/DSC01036.jpg';
      if (!d.galleryHeroImage) d.galleryHeroImage = '/assets/images/DSC01036.jpg';
      if (!d.coursesHeroImage) d.coursesHeroImage = '/assets/images/DSC01036.jpg';
      if (!d.heroBgImage)      d.heroBgImage      = '/assets/images/DSC01093.jpg';
      if (!d.footerDescription) d.footerDescription = "Toshkent, Chilonzor tumanidagi zamonaviy xususiy texnikum. 10-11 sinflar. Sifatli ta'lim, tajribali o'qituvchilar.";
      setSettings(d);
      setOriginalSettings(JSON.parse(JSON.stringify(d)));
      setDirty(new Set());
    } catch {
      toast.error('Yuklab bo\'lmadi');
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
      toast.success('Saqlandi ✓');
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
      toast.error('Xatolik yuz berdi');
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
      <Helmet><title>Sayt Muhariri – TOPEX Admin</title></Helmet>

      {/* Confirm-switch modal */}
      <ConfirmModal
        isOpen={confirmSwitch !== null}
        onClose={() => setConfirmSwitch(null)}
        onConfirm={() => { setActive(confirmSwitch); setConfirmSwitch(null); }}
        title="Saqlanmagan o'zgarishlar"
        message="Bu bo'limda saqlanmagan o'zgarishlar bor. O'zgarishlarni yo'qotib, boshqa bo'limga o'tasizmi?"
        confirmLabel="Ha, davom etish"
      />

      {/* Sticky unsaved-changes banner */}
      {totalDirty > 0 && (
        <div className="fixed top-[60px] left-0 right-0 z-30 bg-amber-50 border-b border-amber-200 lg:left-[240px]">
          <div className="px-6 py-2.5 flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle size={15} />
              <span className="font-semibold">{totalDirty} ta saqlanmagan o'zgarish</span>
              <span className="hidden md:inline text-amber-700/70">— ushbu bo'limning «Saqlash» tugmasini bosing</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6" style={{ paddingTop: totalDirty > 0 ? 44 : 0 }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sayt Muhariri</h1>
            <p className="text-sm text-gray-500 mt-1">Saytdagi barcha ma'lumotlarni shu yerdan o'zgartiring</p>
          </div>
          <a
            href={activeSection?.previewUrl || '/'}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Eye size={14} /> Saytda ko'rish <ExternalLink size={12} />
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
                placeholder="Maydonni qidirish..."
                className="w-full pl-9 pr-8 py-2 rounded-xl text-[13px] border border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-white"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                  <X size={13} />
                </button>
              )}
            </div>
            {q && visibleSections.length === 0 && (
              <p className="px-3 py-4 text-xs text-gray-400 text-center">Topilmadi</p>
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
                  <span className="flex-1">{label}</span>
                  {dirtyCount > 0 && (
                    <span title="Saqlanmagan o'zgarishlar" style={{
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
              <p className="px-3 text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Tezkor havolalar</p>
              {[
                { label: 'Videolar',    to: '/admin/home-videos',  icon: Video },
                { label: 'FAQ',         to: '/admin/faq',          icon: HelpCircle },
                { label: 'Sharhlar',    to: '/admin/testimonials', icon: MessageSquare },
                { label: 'Kurslar',     to: '/admin/courses',      icon: GraduationCap },
                { label: 'Blog',        to: '/admin/blog',         icon: FileText },
                { label: 'Galereya',    to: '/admin/gallery',      icon: Image },
                { label: 'Grantlar',    to: '/admin/scholarships', icon: Award },
              ].map(({ label, to, icon: Icon }) => (
                <Link key={to} to={to}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <Icon size={14} />
                  <span>{label}</span>
                  <ExternalLink size={10} className="ml-auto" />
                </Link>
              ))}
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 rounded-xl border border-gray-200 bg-white p-6">
            {active === 'hero' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">Hero Bo'limi (Bosh sahifa)</h2>
                <HeroEditor s={settings} onChange={change} onSave={() => save(['heroLabel','heroTitle','heroSubtitle','heroBtn','heroBtn2','heroNote','heroImage','heroBgImage'])} saving={saving} saved={saved} />
              </>
            )}
            {active === 'stats' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">Statistika Raqamlari</h2>
                <StatsEditor s={settings} onChange={change} onSave={() => save(['statsStudents','statsBranches','statsTeachers','statsGrades'])} saving={saving} saved={saved} />
              </>
            )}
            {active === 'about' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">Biz Haqimizda Bo'limi</h2>
                <AboutEditor s={settings} onChange={change} onSave={() => save(['aboutLabel','aboutTitle','aboutText','aboutImage'])} saving={saving} saved={saved} />
              </>
            )}
            {active === 'subjects' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">Yo'nalishlar (Fanlar)</h2>
                <SubjectsEditor subjects={settings.subjects || []} onChange={v => change('subjects', v)} onSave={() => save(['subjects'])} saving={saving} saved={saved} />
              </>
            )}
            {active === 'extras' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">Qo'shimcha Imkoniyatlar</h2>
                <ExtrasEditor extras={settings.extras || []} onChange={v => change('extras', v)} onSave={() => save(['extras'])} saving={saving} saved={saved} />
              </>
            )}
            {active === 'features' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">Nega Bizni Tanlash (Afzalliklar)</h2>
                <FeaturesEditor s={settings} features={settings.features || []} onChange={v => change('features', v)} onChangeKey={change} onSave={() => save(['features','featuresLabel','featuresTitle','featuresSubtitle'])} saving={saving} saved={saved} />
              </>
            )}
            {active === 'grants' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">Grant Kartalari (Bosh sahifa)</h2>
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
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">Diplom Bo'limi (Bosh sahifa)</h2>
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
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">Ish bilan ta'minlash (Bosh sahifa)</h2>
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
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">Bo'lim sarlavhalari (Bosh sahifa)</h2>
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
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">Kurslar Sahifasi</h2>
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
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">Galereya Sahifasi Hero</h2>
                <GalleryHeroEditor s={settings} onChange={change} onSave={() => save(['galleryHeroTitle','galleryHeroSubtitle','galleryHeroImage','galleryHeroBadge','galleryPhotosLabel','galleryPhotosTitle','galleryStudentsTab','galleryTeachersTab'])} saving={saving} saved={saved} />
              </>
            )}
            {active === 'blog_page' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">Blog Sahifasi Hero</h2>
                <BlogHeroEditor s={settings} onChange={change} onSave={() => save(['blogHeroTitle','blogHeroSubtitle','blogHeroImage','blogHeroBadge'])} saving={saving} saved={saved} />
              </>
            )}
            {active === 'contact_page' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">Aloqalar Sahifasi</h2>
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
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">Kontakt va Ijtimoiy Tarmoqlar</h2>
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
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">Boshqa Bo'limlar</h2>
                <div className="space-y-3">
                  <LinkedSection label="Videolar"                     to="/admin/home-videos"  desc="Bosh sahifadagi video galereyani boshqarish" />
                  <LinkedSection label="FAQ — Savol-Javoblar"         to="/admin/faq"          desc="Tez-tez beriladigan savollarni qo'shish/o'chirish" />
                  <LinkedSection label="Sharhlar (Otalar fikri)"      to="/admin/testimonials" desc="O'quvchi ota-onalarining sharhlarini boshqarish" />
                  <LinkedSection label="Kurslar"                      to="/admin/courses"      desc="Kurslarni qo'shish, tahrirlash, o'chirish" />
                  <LinkedSection label="Blog / Yangiliklar"           to="/admin/blog"         desc="Maqola va yangiliklar" />
                  <LinkedSection label="Foto Galereya"                to="/admin/gallery"      desc="Rasmlarni yuklash va boshqarish" />
                  <LinkedSection label="Grantlar va Stipendiyalar"    to="/admin/scholarships" desc="Grant ma'lumotlarini yangilash" />
                  <LinkedSection label="Aloqa va Ijtimoiy Tarmoqlar"  to="/admin/settings"     desc="Telefon, email, manzil, Instagram, Telegram..." />
                  <LinkedSection label="O'qituvchilar (Jamoa)"        to="/admin/teachers"     desc="Bosh sahifa 'Jamoa' bo'limidagi ustozlar" />
                  <LinkedSection label="Yo'nalishlar"                 to="/admin/directions"   desc="'Yo'nalishlar' bo'limidagi yo'nalishlar ro'yxati" />
                </div>
              </>
            )}

            {/* ─── PROFI-STYLE bo'limlar (Topex 2026) ─────────── */}
            {active === 'profi_hero' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">✨ Hero swiper — 3 slayd</h2>
                <HeroSlidesEditor s={settings} onChange={change} onSave={() => save(['heroSlides','heroCtaText','heroNoteText'])} saving={saving} saved={saved} />
              </>
            )}
            {active === 'profi_about' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">✨ Texnikum haqida (yangi Profi stili)</h2>
                <ProfiAboutEditor s={settings} onChange={change}
                  onSave={() => save(['aboutSectionLabel','aboutSectionTitle','aboutSlogan','aboutParagraph','aboutBtnText','aboutStat1Value','aboutStat1Label','aboutStat2Value','aboutStat2Label','aboutImage1','aboutImage2','aboutImage3','aboutImage4'])}
                  saving={saving} saved={saved} />
              </>
            )}
            {active === 'profi_directions' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">✨ Yo'nalishlar — Sarlavha qismi</h2>
                <SimpleFieldsEditor fields={[
                  {key:'directionsLabel', label:'Yorliq (kichik oranj matn)'},
                  {key:'directionsTitle', label:'Sarlavha'},
                ]} s={settings} onChange={change} onSave={() => save(['directionsLabel','directionsTitle'])} saving={saving} saved={saved} />
                <div className="mt-6">
                  <LinkedSection label="Yo'nalishlar ro'yxati" to="/admin/directions" desc="Yo'nalish element(lar)ini qo'shish/o'chirish" />
                </div>
              </>
            )}
            {active === 'profi_team' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">✨ Jamoa — Sarlavha qismi</h2>
                <SimpleFieldsEditor fields={[
                  {key:'teamLabel', label:'Yorliq'},
                  {key:'teamTitle', label:'Sarlavha'},
                  {key:'teamParagraph', label:'Matn', textarea:true},
                  {key:'teamBtnText', label:"Tugma matni"},
                ]} s={settings} onChange={change} onSave={() => save(['teamLabel','teamTitle','teamParagraph','teamBtnText'])} saving={saving} saved={saved} />
                <div className="mt-6">
                  <LinkedSection label="O'qituvchilar ro'yxati" to="/admin/teachers" desc="Ustozlarni qo'shish/o'chirish, rasm yuklash" />
                </div>
              </>
            )}
            {active === 'profi_news' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">✨ Yangiliklar — Sarlavha qismi</h2>
                <SimpleFieldsEditor fields={[
                  {key:'newsLabel', label:'Yorliq'},
                  {key:'newsTitle', label:'Sarlavha'},
                  {key:'newsMoreText', label:"'Batafsil' tugma matni"},
                ]} s={settings} onChange={change} onSave={() => save(['newsLabel','newsTitle','newsMoreText'])} saving={saving} saved={saved} />
                <div className="mt-6">
                  <LinkedSection label="Maqolalar ro'yxati" to="/admin/blog" desc="Yangiliklar maqolalarini qo'shish/o'chirish" />
                </div>
              </>
            )}
            {active === 'profi_videos' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">✨ Videolar — Sarlavha qismi</h2>
                <SimpleFieldsEditor fields={[
                  {key:'videosLabel', label:'Yorliq'},
                  {key:'videosTitle', label:'Sarlavha'},
                  {key:'videosSubtitle', label:'Kartochka pastidagi subtitle'},
                ]} s={settings} onChange={change} onSave={() => save(['videosLabel','videosTitle','videosSubtitle'])} saving={saving} saved={saved} />
                <div className="mt-6">
                  <LinkedSection label="Videolar ro'yxati" to="/admin/home-videos" desc="Talabalik hayoti videolarini boshqarish" />
                </div>
              </>
            )}
            {active === 'profi_form' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">✨ Ariza forma</h2>
                <SimpleFieldsEditor fields={[
                  {key:'formLabel', label:'Yorliq'},
                  {key:'formTitle', label:'Sarlavha'},
                  {key:'formParagraph', label:'Tavsif', textarea:true},
                  {key:'formNameLabel', label:'Ism label'},
                  {key:'formNamePh',    label:'Ism placeholder'},
                  {key:'formPhoneLabel',label:'Telefon label'},
                  {key:'formDirLabel',  label:'Yo\'nalish label'},
                  {key:'formDirPh',     label:'Yo\'nalish placeholder'},
                  {key:'formDir9',      label:'9-sinf option'},
                  {key:'formDir11',     label:'11-sinf option'},
                  {key:'formAgreeText', label:'Rozilik matni', textarea:true},
                  {key:'formSubmitText',label:'Submit tugmasi'},
                ]} s={settings} onChange={change} onSave={() => save(['formLabel','formTitle','formParagraph','formNameLabel','formNamePh','formPhoneLabel','formDirLabel','formDirPh','formDir9','formDir11','formAgreeText','formSubmitText','formImage'])} saving={saving} saved={saved} />
                <div className="mt-6">
                  <ImageUpload label="Forma yonidagi rasm" value={settings.formImage} onChange={v => change('formImage', v)} />
                </div>
              </>
            )}
            {active === 'profi_footer' && (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-5 pb-4 border-b border-gray-100">✨ Footer (4 ustun)</h2>
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

const SimpleFieldsEditor = ({ fields, s, onChange, onSave, saving, saved }) => (
  <div className="space-y-4">
    {fields.map(f => (
      f.textarea
        ? <TextArea key={f.key} label={f.label} value={s[f.key]} onChange={v => onChange(f.key, v)} />
        : <Field    key={f.key} label={f.label} value={s[f.key]} onChange={v => onChange(f.key, v)} />
    ))}
    <SaveBar saving={saving} saved={saved} onSave={onSave} />
  </div>
);

const HeroSlidesEditor = ({ s, onChange, onSave, saving, saved }) => {
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
      <Field    label="CTA tugma matni"           value={s.heroCtaText}  onChange={v => onChange('heroCtaText',  v)} />
      <TextArea label="Pastdagi eslatma (yorliq)" value={s.heroNoteText} onChange={v => onChange('heroNoteText', v)} rows={2} />

      {slides.map((slide, i) => (
        <div key={i} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-700">Slayd {i + 1}</span>
            <button onClick={() => del(i)} className="text-red-500 hover:bg-red-50 p-1.5 rounded">
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <Field label="Title — 1-qator" value={slide.title1} onChange={v => set(i, 'title1', v)} />
            <Field label="Title — 2-qator" value={slide.title2} onChange={v => set(i, 'title2', v)} />
            <Field label="Title — 3-qator" value={slide.title3} onChange={v => set(i, 'title3', v)} />
          </div>
          <TextArea label="Subtitle" value={slide.subtitle} onChange={v => set(i, 'subtitle', v)} rows={2} />
          <div className="mt-3">
            <ImageUpload label="Fon rasm" value={slide.image} onChange={v => set(i, 'image', v)} />
          </div>
        </div>
      ))}

      <button onClick={add} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-semibold text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
        <Plus size={16} /> Yangi slayd qo'shish
      </button>

      <SaveBar saving={saving} saved={saved} onSave={onSave} />
    </div>
  );
};

const ProfiAboutEditor = ({ s, onChange, onSave, saving, saved }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-3">
      <Field label="Yorliq (oranj)"     value={s.aboutSectionLabel} onChange={v => onChange('aboutSectionLabel', v)} />
      <Field label="Sarlavha"           value={s.aboutSectionTitle} onChange={v => onChange('aboutSectionTitle', v)} />
    </div>
    <Field    label="Slogan (qisqa)"     value={s.aboutSlogan}    onChange={v => onChange('aboutSlogan',    v)} />
    <TextArea label="Uzun matn / paragraf" value={s.aboutParagraph} onChange={v => onChange('aboutParagraph', v)} rows={5} />
    <div className="grid grid-cols-4 gap-3">
      <Field label="Stat 1 raqam" value={s.aboutStat1Value} onChange={v => onChange('aboutStat1Value', v)} />
      <Field label="Stat 1 label" value={s.aboutStat1Label} onChange={v => onChange('aboutStat1Label', v)} />
      <Field label="Stat 2 raqam" value={s.aboutStat2Value} onChange={v => onChange('aboutStat2Value', v)} />
      <Field label="Stat 2 label" value={s.aboutStat2Label} onChange={v => onChange('aboutStat2Label', v)} />
    </div>
    <Field label="Batafsil tugma matni" value={s.aboutBtnText} onChange={v => onChange('aboutBtnText', v)} />
    <div className="grid grid-cols-2 gap-3">
      <ImageUpload label="Rasm 1 (tepa-chap)"     value={s.aboutImage1} onChange={v => onChange('aboutImage1', v)} />
      <ImageUpload label="Rasm 2 (tepa-o'ng)"     value={s.aboutImage2} onChange={v => onChange('aboutImage2', v)} />
      <ImageUpload label="Rasm 3 (past-chap)"     value={s.aboutImage3} onChange={v => onChange('aboutImage3', v)} />
      <ImageUpload label="Rasm 4 (past-o'ng)"     value={s.aboutImage4} onChange={v => onChange('aboutImage4', v)} />
    </div>
    <SaveBar saving={saving} saved={saved} onSave={onSave} />
  </div>
);

const LinkArrayEditor = ({ label, items, onChange }) => {
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
            <input className="flex-1 px-3 py-2 rounded-lg text-sm border border-gray-200" placeholder="Matn"
                   value={it.label || ''} onChange={e => set(i, 'label', e.target.value)} />
            <input className="flex-1 px-3 py-2 rounded-lg text-sm border border-gray-200" placeholder="URL"
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

const ProfiFooterEditor = ({ s, onChange, onSave, saving, saved }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-3">
      <Field label="1-ustun sarlavha" value={s.footerColAboutTitle}      onChange={v => onChange('footerColAboutTitle',      v)} />
      <Field label="2-ustun sarlavha" value={s.footerColApplicantsTitle} onChange={v => onChange('footerColApplicantsTitle', v)} />
      <Field label="3-ustun sarlavha" value={s.footerColStudentsTitle}   onChange={v => onChange('footerColStudentsTitle',   v)} />
      <Field label="4-ustun sarlavha" value={s.footerColContactsTitle}   onChange={v => onChange('footerColContactsTitle',   v)} />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <Field label="Copyright matni" value={s.footerCopyText}   onChange={v => onChange('footerCopyText',   v)} />
      <Field label="Ommaviy oferta matni" value={s.footerOfertaText} onChange={v => onChange('footerOfertaText', v)} />
    </div>
    <Field label="Litsenziya matni"          value={s.footerLicenseText} onChange={v => onChange('footerLicenseText', v)} />
    <Field label="2-manzil (Aloqa ustunda)" value={s.address2}          onChange={v => onChange('address2',          v)} />

    <LinkArrayEditor label="1-ustun linklari (Texnikum haqida)" items={s.footerColAboutLinks}      onChange={v => onChange('footerColAboutLinks',      v)} />
    <LinkArrayEditor label="2-ustun linklari (Abituriyentlar)"   items={s.footerColApplicantsLinks} onChange={v => onChange('footerColApplicantsLinks', v)} />
    <LinkArrayEditor label="3-ustun linklari (Talabalar)"         items={s.footerColStudentsLinks}   onChange={v => onChange('footerColStudentsLinks',   v)} />

    <SaveBar saving={saving} saved={saved} onSave={onSave} />
  </div>
);

const SaveBar = ({ saving, saved, onSave }) => (
  <div className="flex justify-end mt-2">
    <button onClick={onSave} disabled={saving}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
      {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
      {saved ? 'Saqlandi ✓' : 'Saqlash'}
    </button>
  </div>
);

export default AdminSiteEditor;
