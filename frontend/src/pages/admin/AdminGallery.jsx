import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Plus, Trash2, Eye, EyeOff, Upload, X, Edit2 } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/ui/ConfirmModal';

const CATEGORIES = [
  { value: 'all',      labelKey: 'adminGallery.catAll' },
  { value: 'students', labelKey: 'adminGallery.catStudents' },
  { value: 'teachers', labelKey: 'adminGallery.catTeachers' },
  { value: 'events',   labelKey: 'adminGallery.catEvents' },
  { value: 'other',    labelKey: 'adminGallery.catOther' },
];

const API_URL = import.meta.env.VITE_API_URL || '';

const STATIC_ITEMS = [
  { title: "O'quvchilar jamoasi",  category: 'students', order: 1,  image: '/assets/images/DSC01093.jpg' },
  { title: "Dars jarayoni",        category: 'students', order: 2,  image: '/assets/images/DSC01036.jpg' },
  { title: "Laboratoriya ishi",    category: 'students', order: 3,  image: '/assets/images/DSC00912.jpg' },
  { title: "Texnikum hayoti",      category: 'students', order: 4,  image: '/assets/images/DSC00827.jpg' },
  { title: "Talabalar hayoti",     category: 'students', order: 5,  image: '/assets/famali-photo/DSC00875.jpg' },
  { title: "Darsdan lavha",        category: 'students', order: 6,  image: '/assets/famali-photo/DSC00954.jpg' },
  { title: "Amaliyot",             category: 'students', order: 7,  image: '/assets/famali-photo/DSC00955.jpg' },
  { title: "Guruh ishi",           category: 'students', order: 8,  image: '/assets/famali-photo/DSC00964.jpg' },
  { title: "Texnikum tadbiri",     category: 'students', order: 9,  image: '/assets/famali-photo/DSC00980.jpg' },
  { title: "Laboratoriya",         category: 'students', order: 10, image: '/assets/famali-photo/DSC01053.jpg' },
  { title: "Tanaffus",             category: 'students', order: 11, image: '/assets/famali-photo/DSC01065.jpg' },
  { title: "Bitiruvchilar",        category: 'students', order: 12, image: '/assets/famali-photo/DSC01086.jpg' },
  { title: "Kreativlik",           category: 'students', order: 13, image: '/assets/famali-photo/DSC01268.jpg' },
  { title: "Ilmiy kengash",        category: 'teachers', order: 14, image: '/assets/Ustozlar/DSC01143.webp' },
  { title: "Malakali kadrlar",     category: 'teachers', order: 15, image: '/assets/Ustozlar/DSC01155.webp' },
  { title: "Pedagoglar",           category: 'teachers', order: 16, image: '/assets/Ustozlar/DSC01164.webp' },
  { title: "Kafedra mudirlari",    category: 'teachers', order: 17, image: '/assets/Ustozlar/DSC01187.webp' },
  { title: "Texnikum ustozlari",   category: 'teachers', order: 18, image: '/assets/Ustozlar/DSC01199.webp' },
];

const imgSrc = (image) => {
  if (!image) return '';
  if (image.startsWith('http') || image.startsWith('/assets')) return image;
  return `${API_URL}${image}`;
};

const EMPTY_FORM = { title: '', category: 'students', order: 0 };

const AdminGallery = () => {
  const { t } = useTranslation();
  const [items, setItems]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('all');
  const [showModal, setShowModal]   = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [file, setFile]             = useState(null);
  const [preview, setPreview]       = useState(null);
  const [saving, setSaving]         = useState(false);
  const [confirmId, setConfirmId]   = useState(null);
  const [deleting, setDeleting]     = useState(false);
  const [seedConfirm, setSeedConfirm] = useState(false);
  const [seeding, setSeeding]         = useState(false);
  const fileRef = useRef();
  const blobUrl = useRef(null);

  useEffect(() => () => { if (blobUrl.current) URL.revokeObjectURL(blobUrl.current); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/gallery');
      setItems(res.data.data || []);
    } catch {
      toast.error(t('admin.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const seedDefaults = async () => {
    try {
      setSeeding(true);
      const existing = await api.get('/admin/gallery');
      const existingImages = (existing.data.data || []).map(i => i.image);
      const toSeed = STATIC_ITEMS.filter(item => !existingImages.includes(item.image));
      if (toSeed.length === 0) {
        toast.info(t('adminGallery.allDefaultExist'));
        setSeeding(false);
        return;
      }
      await Promise.all(
        toSeed.map(async (item) => {
          const fd = new FormData();
          fd.append('title', item.title);
          fd.append('category', item.category);
          fd.append('order', String(item.order));
          const resp = await fetch(item.image);
          const blob = await resp.blob();
          const filename = item.image.split('/').pop();
          fd.append('image', new File([blob], filename, { type: blob.type }));
          return api.post('/admin/gallery', fd);
        })
      );
      toast.success(t('adminGallery.defaultSeeded', { count: toSeed.length }));
      load();
    } catch {
      toast.error(t('admin.error'));
    } finally {
      setSeeding(false);
      setSeedConfirm(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
    const url = URL.createObjectURL(f);
    blobUrl.current = url;
    setFile(f);
    setPreview(url);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setPreview(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item._id);
    setForm({ title: item.title, category: item.category, order: item.order || 0 });
    setFile(null);
    setPreview(imgSrc(item.image));
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setFile(null);
    setPreview(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing && !file) return toast.error(t('adminGallery.selectImage'));
    if (!form.title.trim()) return toast.error(t('adminGallery.enterTitle'));
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append('title', form.title.trim());
      fd.append('category', form.category);
      fd.append('order', String(form.order));
      if (file) fd.append('image', file);

      if (editing) {
        await api.put(`/admin/gallery/${editing}`, fd);
        toast.success(t('admin.updated'));
      } else {
        await api.post('/admin/gallery', fd);
        toast.success(t('admin.created'));
      }
      closeModal();
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || t('admin.error'));
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item) => {
    try {
      await api.put(`/admin/gallery/${item._id}`, { isActive: !item.isActive });
      setItems(prev => prev.map(i => i._id === item._id ? { ...i, isActive: !i.isActive } : i));
    } catch {
      toast.error(t('admin.error'));
    }
  };

  const deleteItem = (id) => {
    setConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/admin/gallery/${confirmId}`);
      toast.success(t('admin.deleted'));
      setItems(prev => prev.filter(i => i._id !== confirmId));
      setConfirmId(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || t('admin.deleteError'));
    } finally {
      setDeleting(false);
    }
  };

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);

  const activeCount  = items.filter(i => i.isActive).length;
  const hiddenCount  = items.filter(i => !i.isActive).length;

  const catLabel = (val) => {
    const found = CATEGORIES.find(c => c.value === val);
    return found ? t(found.labelKey) : val;
  };

  return (
    <div style={{ color: '#272829' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-mono font-bold" style={{ color: '#272829' }}>{t('adminGallery.header')}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className="font-mono text-xs" style={{ color: '#61677A' }}>{items.length} {t('adminGallery.imagesCount')}</p>
            {items.length > 0 && (
              <>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#F0FDF4', color: '#16A34A' }}>
                  {activeCount} {t('admin.statusActive')}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#F1F2F4', color: '#61677A' }}>
                  {hiddenCount} {t('admin.statusHidden')}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {items.length === 0 && (
            <button
              onClick={() => setSeedConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all"
              style={{ background: '#D97706', color: '#fff' }}
            >
              {t('adminGallery.seedDefaults')}
            </button>
          )}
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all"
            style={{ background: '#272829', color: '#fff' }}
          >
            <Plus size={14} /> {t('adminGallery.addImage')}
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(c => (
          <button
            key={c.value}
            onClick={() => setFilter(c.value)}
            className="px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-colors"
            style={{
              background: filter === c.value ? '#272829' : '#F1F2F4',
              color: filter === c.value ? '#fff' : '#61677A',
            }}
          >
            {t(c.labelKey)}
            {c.value !== 'all' && (
              <span className="ml-1.5 opacity-60">
                ({items.filter(i => i.category === c.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 font-mono text-sm" style={{ color: '#61677A' }}>{t('admin.loading')}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Image size={40} style={{ color: '#9CA3AF', margin: '0 auto 12px' }} />
          <p className="font-mono text-sm" style={{ color: '#61677A' }}>{t('adminGallery.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map(item => (
            <div
              key={item._id}
              className="relative rounded-xl overflow-hidden"
              style={{ background: '#FFFFFF', border: '1px solid #E5E7EA' }}
            >
              <div className="aspect-square">
                <img
                  src={imgSrc(item.image)}
                  alt={item.title}
                  className="w-full h-full object-cover transition-opacity"
                  style={{ opacity: item.isActive ? 1 : 0.35 }}
                />
              </div>
              <div className="p-2 pb-1">
                <p className="font-mono text-[10px] font-semibold truncate" style={{ color: '#272829' }}>{item.title}</p>
                <p className="font-mono text-[9px]" style={{ color: '#9CA3AF' }}>
                  {catLabel(item.category)}
                </p>
              </div>
              <div className="flex items-center gap-1 px-2 pb-2">
                <button
                  onClick={() => openEdit(item)}
                  className="flex-1 flex items-center justify-center gap-1 py-1 rounded font-mono text-[9px] transition-colors"
                  style={{ background: '#EFF6FF', color: '#2563EB' }}
                  title={t('admin.edit')}
                >
                  <Edit2 size={10} />
                  <span>{t('admin.edit')}</span>
                </button>
                <button
                  onClick={() => toggleActive(item)}
                  className="w-7 h-6 rounded flex items-center justify-center transition-colors"
                  style={{ background: item.isActive ? '#FEF3C7' : '#F0FDF4' }}
                  title={item.isActive ? t('admin.hide') : t('admin.show')}
                >
                  {item.isActive
                    ? <EyeOff size={10} style={{ color: '#D97706' }} />
                    : <Eye size={10} style={{ color: '#16A34A' }} />}
                </button>
                <button
                  onClick={() => deleteItem(item._id)}
                  className="w-7 h-6 rounded flex items-center justify-center transition-colors"
                  style={{ background: '#FEF2F2' }}
                  title={t('admin.delete')}
                >
                  <Trash2 size={10} style={{ color: '#DC2626' }} />
                </button>
              </div>
              {!item.isActive && (
                <div className="absolute top-2 left-2">
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded" style={{ background: '#61677A', color: '#fff' }}>
                    {t('admin.statusHidden')}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-xl p-6" style={{ background: '#FFFFFF', border: '1px solid #D8D9DA' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono font-bold" style={{ color: '#272829' }}>
                {editing ? t('adminGallery.modalEdit') : t('adminGallery.modalAdd')}
              </h2>
              <button onClick={closeModal}><X size={16} style={{ color: '#61677A' }} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div
                className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden"
                style={{ borderColor: preview ? '#272829' : '#D8D9DA', minHeight: 160, background: '#FAFAFA' }}
                onClick={() => fileRef.current?.click()}
              >
                {preview ? (
                  <div className="relative w-full">
                    <img src={preview} alt="preview" className="w-full max-h-48 object-cover" />
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setFile(null); setPreview(null); }}
                      className="absolute top-2 right-2 p-1 rounded-full"
                      style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}
                    >
                      <X size={12} />
                    </button>
                    <p className="text-center font-mono text-[10px] py-2" style={{ color: '#9CA3AF' }}>
                      {editing ? t('adminGallery.clickToChangeImage') : ''}
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload size={24} style={{ color: '#9CA3AF', marginBottom: 8 }} />
                    <p className="font-mono text-xs" style={{ color: '#61677A' }}>{t('adminGallery.clickToSelectImage')}</p>
                  </>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </div>

              <div>
                <label className="block font-mono text-xs mb-1" style={{ color: '#61677A' }}>{t('adminGallery.form.title')}</label>
                <input
                  required
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg font-mono text-sm outline-none"
                  style={{ background: '#FFFFFF', border: '1px solid #D8D9DA', color: '#272829' }}
                  placeholder={t('adminGallery.form.titlePlaceholder')}
                />
              </div>

              <div>
                <label className="block font-mono text-xs mb-1" style={{ color: '#61677A' }}>{t('adminGallery.form.category')}</label>
                <select
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg font-mono text-sm outline-none"
                  style={{ background: '#FFFFFF', border: '1px solid #D8D9DA', color: '#272829' }}
                >
                  {CATEGORIES.filter(c => c.value !== 'all').map(c => (
                    <option key={c.value} value={c.value}>{t(c.labelKey)}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2 rounded-lg font-mono text-sm transition-colors"
                  style={{ background: '#E5E7EA', color: '#61677A' }}
                >
                  {t('admin.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 rounded-lg font-mono text-sm font-semibold transition-colors disabled:opacity-50"
                  style={{ background: '#272829', color: '#fff' }}
                >
                  {saving ? t('admin.saving') : t('admin.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={seedConfirm}
        onClose={() => setSeedConfirm(false)}
        onConfirm={seedDefaults}
        loading={seeding}
        confirmStyle="warning"
        title={t('adminGallery.seedConfirmTitle')}
        message={t('adminGallery.seedConfirmMessage')}
        confirmLabel={t('adminGallery.seedConfirmLabel')}
      />
      <ConfirmModal
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title={t('adminGallery.deleteConfirmTitle')}
        message={t('adminGallery.deleteConfirmMessage')}
        confirmLabel={t('admin.deleteConfirm')}
      />
    </div>
  );
};

export default AdminGallery;
