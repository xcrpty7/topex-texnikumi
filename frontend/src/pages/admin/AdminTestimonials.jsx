import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Plus, Trash2, Edit2, Eye, EyeOff, X, Upload, Search, MessageSquare } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/ui/ConfirmModal';

const API_URL = import.meta.env.VITE_API_URL || '';
const empty = { name: '', role: "O'quvchi", text: '', rating: 5, order: 0 };

const AdminTestimonials = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [visFilter, setVisFilter] = useState('all');
  const [confirmId, setConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const fileRef = useRef();

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/testimonials');
      setItems(res.data.data || []);
    } catch { toast.error(t('admin.loadError')); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setFile(null); setPreview(null); setShowModal(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ name: item.name, role: item.role, text: item.text, rating: item.rating, order: item.order || 0 });
    setPreview(item.avatar ? `${API_URL}${item.avatar}` : null);
    setFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('avatar', file);
      if (editing) {
        await api.put(`/admin/testimonials/${editing._id}`, fd);
        toast.success(t('admin.updated'));
      } else {
        await api.post('/admin/testimonials', fd);
        toast.success(t('admin.created'));
      }
      setShowModal(false);
      load();
    } catch { toast.error(t('admin.error')); }
    finally { setSaving(false); }
  };

  const toggleActive = async (item) => {
    try {
      const fd = new FormData();
      fd.append('isActive', !item.isActive);
      await api.put(`/admin/testimonials/${item._id}`, fd);
      setItems(prev => prev.map(i => i._id === item._id ? { ...i, isActive: !i.isActive } : i));
    } catch { toast.error(t('admin.error')); }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmId) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/admin/testimonials/${confirmId}`);
      toast.success(t('admin.deleted'));
      setItems(prev => prev.filter(i => i._id !== confirmId));
      setConfirmId(null);
    } catch { toast.error(t('admin.error')); }
    finally { setDeleteLoading(false); }
  };

  const filtered = items.filter(i => {
    const q = searchQ.toLowerCase();
    const matchSearch = !q || i.name?.toLowerCase().includes(q) || i.role?.toLowerCase().includes(q);
    const matchVis = visFilter === 'all' || (visFilter === 'active' ? i.isActive : !i.isActive);
    return matchSearch && matchVis;
  });

  const activeCount = items.filter(i => i.isActive).length;
  const hiddenCount = items.length - activeCount;

  return (
    <div style={{ color: '#272829' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-mono font-bold">{t('adminTestimonials.header')}</h1>
          <p className="font-mono text-xs mt-1" style={{ color: '#61677A' }}>{items.length} {t('adminTestimonials.reviewsCount')}</p>
          <div className="flex gap-2 mt-1">
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
              style={{ background: '#DCFCE7', color: '#16A34A' }}>
              {items.filter(i => i.isActive).length} {t('admin.statusActive')}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
              style={{ background: '#F1F2F4', color: '#61677A' }}>
              {items.filter(i => !i.isActive).length} {t('admin.statusHidden')}
            </span>
          </div>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-semibold"
          style={{ background: '#272829', color: '#fff' }}>
          <Plus size={14} /> {t('adminTestimonials.addReview')}
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center mb-4">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder={t('adminTestimonials.searchPlaceholder')}
            className="pl-8 pr-3 py-2 rounded-xl text-sm outline-none"
            style={{ background: '#FFFFFF', border: '1px solid #E5E7EA', color: '#272829', width: 200 }}
          />
        </div>
        <div className="flex gap-2">
          {[
            { v: 'all',    label: t('admin.filterAll') },
            { v: 'active', label: t('admin.statusActive') },
            { v: 'hidden', label: t('admin.statusHidden') },
          ].map(({ v, label }) => (
            <button key={v} onClick={() => setVisFilter(v)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                background: visFilter === v ? '#272829' : '#F1F2F4',
                color: visFilter === v ? '#fff' : '#61677A',
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 font-mono text-sm" style={{ color: '#61677A' }}>{t('admin.loading')}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(item => (
              <div key={item._id} className="rounded-xl p-4 relative transition-opacity"
                style={{ background: '#FFFFFF', border: '1px solid #E5E7EA', opacity: item.isActive ? 1 : 0.6 }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm"
                    style={{ background: '#272829', color: '#fff' }}>
                    {item.avatar ? (
                      <img src={`${API_URL}${item.avatar}`} alt={item.name} className="w-full h-full object-cover" />
                    ) : item.name[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm font-semibold truncate" style={{ color: '#272829' }}>{item.name}</p>
                    <p className="font-mono text-xs" style={{ color: '#61677A' }}>{item.role}</p>
                    <div className="flex gap-0.5 mt-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={10} fill={s <= item.rating ? '#D97706' : 'none'} style={{ color: '#D97706' }} />
                      ))}
                    </div>
                  </div>
                  {!item.isActive && (
                    <span className="px-1.5 py-0.5 rounded font-mono text-[9px]" style={{ background: '#F1F2F4', color: '#9CA3AF' }}>
                      {t('admin.statusHidden')}
                    </span>
                  )}
                </div>
                <p className="font-mono text-xs leading-relaxed" style={{ color: '#61677A' }}>"{item.text}"</p>
                <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #E5E7EA' }}>
                  <button onClick={() => openEdit(item)} className="flex items-center gap-1 px-2 py-1 rounded font-mono text-xs transition-colors"
                    style={{ background: '#E5E7EA', color: '#61677A' }}>
                    <Edit2 size={10} /> {t('admin.edit')}
                  </button>
                  <button onClick={() => toggleActive(item)} className="flex items-center gap-1 px-2 py-1 rounded font-mono text-xs transition-colors"
                    style={{ background: '#E5E7EA', color: item.isActive ? '#D97706' : '#16A34A' }}>
                    {item.isActive ? <><EyeOff size={10} /> {t('admin.hide')}</> : <><Eye size={10} /> {t('admin.show')}</>}
                  </button>
                  <button onClick={() => setConfirmId(item._id)} className="flex items-center gap-1 px-2 py-1 rounded font-mono text-xs ml-auto transition-colors"
                    style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626' }}>
                    <Trash2 size={10} /> {t('admin.delete')}
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && !loading && (
              <div className="col-span-3 text-center py-20">
                <MessageSquare size={36} style={{ color: '#D1D5DB', margin: '0 auto 12px' }} />
                <p className="font-mono text-sm" style={{ color: '#61677A' }}>
                  {searchQ || visFilter !== 'all' ? t('adminTestimonials.filterEmpty') : t('adminTestimonials.empty')}
                </p>
                {(searchQ || visFilter !== 'all') && (
                  <button
                    onClick={() => { setSearchQ(''); setVisFilter('all'); }}
                    className="mt-3 font-mono text-xs px-3 py-1.5 rounded-lg"
                    style={{ background: '#F1F2F4', color: '#61677A' }}
                  >
                    {t('admin.clearFilter')}
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg rounded-xl p-6 overflow-y-auto max-h-[90vh]" style={{ background: '#FFFFFF', border: '1px solid #D8D9DA' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono font-bold" style={{ color: '#272829' }}>{editing ? t('adminTestimonials.modalEdit') : t('adminTestimonials.modalAdd')}</h2>
              <button onClick={() => setShowModal(false)}><X size={16} style={{ color: '#61677A' }} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex items-center gap-4 mb-2">
                <div
                  className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center cursor-pointer flex-shrink-0"
                  style={{ background: '#FFFFFF', border: '2px dashed #D8D9DA' }}
                  onClick={() => fileRef.current?.click()}
                >
                  {preview ? (
                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  ) : <Upload size={18} style={{ color: '#9CA3AF' }} />}
                </div>
                <p className="font-mono text-xs" style={{ color: '#61677A' }}>{t('adminTestimonials.uploadImage')}</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); } }} />
              </div>
              {[
                { key: 'name', label: t('adminTestimonials.form.name'), placeholder: t('adminTestimonials.form.namePlaceholder') },
                { key: 'role', label: t('adminTestimonials.form.role'), placeholder: t('adminTestimonials.form.rolePlaceholder') },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block font-mono text-xs mb-1" style={{ color: '#61677A' }}>{label}</label>
                  <input required value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg font-mono text-sm outline-none"
                    style={{ background: '#FFFFFF', border: '1px solid #D8D9DA', color: '#272829' }}
                    placeholder={placeholder} />
                </div>
              ))}
              <div>
                <label className="block font-mono text-xs mb-1" style={{ color: '#61677A' }}>{t('adminTestimonials.form.text')}</label>
                <textarea required value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 rounded-lg font-mono text-sm outline-none resize-none"
                  style={{ background: '#FFFFFF', border: '1px solid #D8D9DA', color: '#272829' }}
                  placeholder={t('adminTestimonials.form.textPlaceholder')} />
              </div>
              <div>
                <label className="block font-mono text-xs mb-2" style={{ color: '#61677A' }}>{t('adminTestimonials.form.rating')}: {form.rating}/5</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" onClick={() => setForm(p => ({ ...p, rating: s }))}
                      className="w-8 h-8 rounded flex items-center justify-center transition-colors"
                      style={{ background: s <= form.rating ? '#D97706' : '#E5E7EA' }}>
                      <Star size={14} fill={s <= form.rating ? '#fff' : 'none'} style={{ color: s <= form.rating ? '#fff' : '#61677A' }} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-lg font-mono text-sm" style={{ background: '#E5E7EA', color: '#61677A' }}>
                  {t('admin.cancel')}
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2 rounded-lg font-mono text-sm font-semibold disabled:opacity-50"
                  style={{ background: '#272829', color: '#fff' }}>
                  {saving ? t('admin.saving') : t('admin.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title={t('adminTestimonials.confirmTitle')}
        message={t('adminTestimonials.confirmMessage')}
        confirmLabel={t('admin.deleteConfirm')}
        confirmStyle="danger"
      />
    </div>
  );
};

export default AdminTestimonials;
