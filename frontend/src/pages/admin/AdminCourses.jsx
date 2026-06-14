import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink, Upload, X, Star, Search } from 'lucide-react';
import api from '../../services/api';
import { fetchCourses } from '../../features/courses/coursesSlice';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || '';
const resolveImg = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('/assets')) return url;
  return `${API_URL}${url}`;
};
const EMPTY_FORM = { title: '', description: '', shortDescription: '', level: 'beginner', price: 0, isFree: true, category: '', videoUrl: '', duration: '', isActive: true, isFeatured: false };

const AdminCourses = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { list: courses, loading } = useSelector((s) => s.courses);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef();
  const blobUrl = useRef(null);

  useEffect(() => { dispatch(fetchCourses({ limit: 100 })); }, [dispatch]);
  useEffect(() => () => { if (blobUrl.current) URL.revokeObjectURL(blobUrl.current); }, []);

  const filtered = courses.filter(c => {
    const q = searchQ.toLowerCase();
    const matchSearch = !q || c.title?.toLowerCase().includes(q) || (typeof c.category === 'string' ? c.category.toLowerCase().includes(q) : c.category?.name?.toLowerCase().includes(q));
    const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? c.isActive : !c.isActive);
    return matchSearch && matchStatus;
  });

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
      const url = URL.createObjectURL(f);
      blobUrl.current = url;
      setFile(f);
      setPreview(url);
    }
  };

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setFile(null); setPreview(null); setModal(true); };

  const openEdit = (course) => {
    setEditing(course._id);
    setForm({
      title: course.title,
      description: course.description,
      shortDescription: course.shortDescription || '',
      level: course.level,
      price: course.price,
      isFree: course.isFree,
      category: course.category || '',
      videoUrl: course.videoUrl || '',
      duration: course.duration || '',
      isActive: course.isActive ?? true,
      isFeatured: course.isFeatured ?? false,
    });
    setPreview(resolveImg(course.image));
    setFile(null);
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('image', file);
      if (editing) {
        await api.put(`/courses/${editing}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success(t('adminCourses.toast.updated'));
      } else {
        await api.post('/courses', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success(t('adminCourses.toast.created'));
      }
      setModal(false);
      dispatch(fetchCourses({ limit: 100 }));
    } catch (err) {
      toast.error(err.response?.data?.message || t('adminCourses.toast.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await api.delete(`/courses/${confirmId}`);
      toast.success(t('adminCourses.toast.deleted'));
      dispatch(fetchCourses({ limit: 100 }));
    } catch (err) {
      toast.error(err.response?.data?.message || t('adminCourses.toast.error'));
    } finally {
      setDeleting(false);
      setConfirmId(null);
    }
  };

  const handlePublish = async (id) => {
    try {
      await api.patch(`/courses/${id}/publish`);
      dispatch(fetchCourses({ limit: 100 }));
    } catch { toast.error(t('adminCourses.toast.error')); }
  };

  return (
    <>
      <Helmet><title>{t('adminCourses.pageTitle')}</title></Helmet>
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#272829' }}>{t('adminCourses.header')}</h1>
            <p className="text-xs" style={{ color: '#61677A' }}>{filtered.length}/{courses.length} {t('adminCourses.coursesCount')}</p>
            <div className="flex gap-2 mt-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                style={{ background: '#DCFCE7', color: '#16A34A' }}>
                {courses.filter(c => c.isActive).length} {t('adminCourses.active')}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                style={{ background: '#F1F2F4', color: '#61677A' }}>
                {courses.filter(c => !c.isActive).length} {t('adminCourses.inactive')}
              </span>
            </div>
          </div>
          <Button onClick={openCreate} size="sm"><Plus size={16} /> {t('admin.create')}</Button>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder={t('adminCourses.searchPlaceholder')}
              className="pl-8 pr-3 py-2 rounded-xl text-sm outline-none"
              style={{ background: '#FFFFFF', border: '1px solid #E5E7EA', color: '#272829', width: 240 }}
            />
          </div>
          <div className="flex items-center gap-2">
            {[
              { value: 'all', label: t('adminCourses.filterAll') },
              { value: 'active', label: t('adminCourses.filterPublished') },
              { value: 'draft', label: t('adminCourses.filterDraft') },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  background: statusFilter === f.value ? '#272829' : '#F1F2F4',
                  color: statusFilter === f.value ? '#fff' : '#61677A',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-xl"
            style={{ background: '#FFFFFF', border: '1px solid #E5E7EA' }}
          >
            <Search size={32} style={{ color: '#9CA3AF' }} className="mb-3" />
            <p className="text-sm" style={{ color: '#61677A' }}>{t('adminCourses.notFound')}</p>
          </div>
        ) : (
          <div className="glass-card overflow-x-auto">
            <table className="tm-table">
              <thead>
                <tr>
                  {[t('adminCourses.table.image'), t('adminCourses.table.title'), t('adminCourses.table.level'), t('adminCourses.table.status'), t('adminCourses.table.students'), t('adminCourses.table.actions')].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((course) => (
                  <tr key={course._id}>
                    <td style={{ width: 48 }}>
                      {course.image ? (
                        <img
                          src={resolveImg(course.image)}
                          alt={course.title}
                          className="w-10 h-10 rounded-lg object-cover"
                          style={{ border: '1px solid #E5E7EA' }}
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ background: '#F1F2F4', border: '1px solid #E5E7EA' }}
                        >
                          <span style={{ color: '#9CA3AF', fontSize: 11 }}>N/A</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <p className="text-[13px] font-medium" style={{ color: '#272829' }}>{course.title}</p>
                        {course.isFeatured && (
                          <Star size={11} fill="#F59E0B" style={{ color: '#F59E0B', flexShrink: 0 }} title={t('adminCourses.featured')} />
                        )}
                      </div>
                      {course.category && (
                        <p className="font-mono text-[10px] mt-0.5" style={{ color: '#61677A' }}>
                          {typeof course.category === 'string' ? course.category : course.category.name}
                        </p>
                      )}
                    </td>
                    <td>
                      <span
                        className="font-mono text-[10px] px-2 py-0.5 rounded"
                        style={{ background: '#E5E7EA', color: '#61677A', border: '1px solid #D8D9DA' }}
                      >
                        {t(`courses.level.${course.level}`)}
                      </span>
                    </td>
                    <td>
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px]"
                        style={course.isActive
                          ? { background: '#F0FDF4', color: '#16A34A', border: '1px solid #27282930' }
                          : { background: '#E5E7EA', color: '#61677A', border: '1px solid #D8D9DA' }}
                      >
                        {course.isActive ? t('adminCourses.statusPublished') : t('adminCourses.statusDraft')}
                      </span>
                    </td>
                    <td className="muted font-mono text-[11px]">{course.enrollmentCount}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handlePublish(course._id)}
                          className="p-1.5 rounded transition-colors"
                          title={course.isActive ? t('adminCourses.tooltip.hide') : t('adminCourses.tooltip.publish')}
                          style={{ color: course.isActive ? '#D97706' : '#16A34A' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = course.isActive ? 'rgba(217,119,6,0.08)' : 'rgba(22,163,74,0.08)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          {course.isActive ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        <a
                          href={`/courses/${course.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded transition-colors"
                          style={{ color: '#61677A' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.background = 'rgba(37,99,235,0.08)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#61677A'; e.currentTarget.style.background = 'transparent'; }}
                          title={t('adminCourses.tooltip.viewOnSite')}
                        >
                          <ExternalLink size={13} />
                        </a>
                        <button
                          onClick={() => openEdit(course)}
                          className="p-1.5 rounded transition-colors"
                          style={{ color: '#61677A' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#2563EB'; e.currentTarget.style.background = 'rgba(37,99,235,0.08)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#61677A'; e.currentTarget.style.background = 'transparent'; }}
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => setConfirmId(course._id)}
                          className="p-1.5 rounded transition-colors"
                          style={{ color: '#61677A' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#61677A'; e.currentTarget.style.background = 'transparent'; }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? t('adminCourses.modalEdit') : t('adminCourses.modalAdd')} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center gap-4">
            <div
              className="w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-colors"
              style={{ borderColor: preview ? '#272829' : '#D8D9DA', background: '#FFFFFF' }}
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Upload size={20} style={{ color: '#9CA3AF' }} />
                  <span className="text-[10px] mt-1" style={{ color: '#61677A' }}>{t('adminCourses.form.image')}</span>
                </>
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-mono mb-2" style={{ color: '#61677A' }}>{t('adminCourses.form.imageHint')}</p>
              <Button type="button" variant="ghost" size="sm" onClick={() => fileRef.current?.click()}>{t('admin.chooseImage')}</Button>
              {preview && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                  className="ml-2 p-1.5 rounded-lg transition-colors"
                  style={{ color: '#DC2626', background: 'rgba(220,38,38,0.08)' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>

          <Input label={t('adminCourses.form.title')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required minLength={5} />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-accent">{t('adminCourses.form.description')}</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="input-field resize-none"
              required
              minLength={20}
            />
          </div>
          <Input label={t('adminCourses.form.shortDescription')} value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} maxLength={300} />
          <Input label={t('adminCourses.form.videoUrl')} value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder={t('adminCourses.form.videoUrlPlaceholder')} />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-accent">{t('adminCourses.form.category')}</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field" required>
              <option value="">{t('adminCourses.form.categoryPlaceholder')}</option>
              <option value="Dasturlash">{t('directions.items.programming')}</option>
              <option value="Marketing va Agrobiznes">{t('directions.items.marketing')}</option>
              <option value="Kompyuter Grafikasi">{t('directions.items.graphics')}</option>
              <option value="Bank Nazoratchisi">{t('directions.items.bank')}</option>
              <option value="Mehmonxona Boshqaruvi">{t('directions.items.hotel')}</option>
              <option value="Raqamli Axborotlar Analitigi">{t('directions.items.analytics')}</option>
              <option value="Laborant-Analitik">{t('directions.items.lab')}</option>
              <option value="Dorivor O'simliklar Laboranti">{t('directions.items.pharma')}</option>
              <option value="Boshqa">{t('adminCourses.form.categoryOther')}</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-accent">{t('adminCourses.form.level')}</label>
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="input-field">
                <option value="beginner">{t('courses.level.beginner')}</option>
                <option value="intermediate">{t('courses.level.intermediate')}</option>
                <option value="advanced">{t('courses.level.advanced')}</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-accent">{t('adminCourses.form.price')}</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} min={0} className="input-field" />
            </div>
          </div>
          <Input label={t('adminCourses.form.duration')} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          <div className="flex items-center gap-6 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input type="checkbox" checked={form.isFree} onChange={(e) => setForm({ ...form, isFree: e.target.checked })} className="rounded" />
              <span className="text-accent text-sm">{t('adminCourses.form.isFree')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded" />
              <span className="text-accent text-sm">{t('adminCourses.form.isActive')}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded" />
              <span className="text-accent text-sm flex items-center gap-1">
                <Star size={12} fill={form.isFeatured ? '#F59E0B' : 'none'} style={{ color: '#F59E0B' }} />
                {t('adminCourses.form.isFeatured')}
              </span>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" type="button" onClick={() => setModal(false)}>{t('common.cancel')}</Button>
            <Button type="submit" loading={saving}>{t('common.save')}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title={t('adminCourses.confirmTitle')}
        message={t('adminCourses.confirmMessage')}
        confirmLabel={t('adminCourses.confirmLabel')}
      />
    </>
  );
};

export default AdminCourses;
