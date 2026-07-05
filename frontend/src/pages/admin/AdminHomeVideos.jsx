import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Play, Plus, Trash2, Edit2, Eye, EyeOff, X, RefreshCw, Upload } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import ConfirmModal from '../../components/ui/ConfirmModal';

const API_URL = import.meta.env.VITE_API_URL || '';
const EMPTY_FORM = { title: '', url: '', order: 0, isActive: true };

const STATIC_VIDEOS = [];

const truncateUrl = (url, max = 40) => {
  if (!url) return '—';
  return url.length > max ? url.slice(0, max) + '...' : url;
};

const AdminHomeVideos = () => {
  const { t } = useTranslation();
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [file, setFile]           = useState(null);
  const [preview, setPreview]     = useState(null);
  const [saving, setSaving]       = useState(false);
  const [confirmId, setConfirmId]     = useState(null);
  const [deleting, setDeleting]       = useState(false);
  const [seedConfirm, setSeedConfirm] = useState(false);
  const [seeding, setSeeding]         = useState(false);
  const fileRef = useRef();
  const blobUrl = useRef(null);

  useEffect(() => () => { if (blobUrl.current) URL.revokeObjectURL(blobUrl.current); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/home-videos');
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
      const existing = await api.get('/admin/home-videos');
      const existingUrls = (existing.data.data || []).map(v => v.url);
      const toSeed = STATIC_VIDEOS.filter(v => !existingUrls.includes(v.url));
      if (toSeed.length === 0) {
        toast.info(t('adminHomeVideos.allDefaultExist'));
        setSeeding(false);
        return;
      }
      await Promise.all(
        toSeed.map(v => {
          const fd = new FormData();
          fd.append('title', v.title);
          fd.append('url', v.url);
          fd.append('order', String(v.order));
          fd.append('isActive', 'true');
          return api.post('/admin/home-videos', fd);
        })
      );
      toast.success(t('adminHomeVideos.defaultSeeded', { count: toSeed.length }));
      load();
    } catch {
      toast.error(t('admin.error'));
    } finally {
      setSeeding(false);
      setSeedConfirm(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setPreview(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item._id);
    setForm({
      title: item.title,
      url: item.url,
      order: item.order || 0,
      isActive: item.isActive
    });
    setPreview(item.url
      ? (item.url.startsWith('http') ? item.url
        : item.url.startsWith('/uploads') ? `${API_URL}${item.url}`
        : item.url)
      : null);
    setFile(null);
    setShowModal(true);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('video', file);

      if (editing) {
        await api.put(`/admin/home-videos/${editing}`, fd);
        toast.success(t('admin.updated'));
      } else {
        await api.post('/admin/home-videos', fd);
        toast.success(t('admin.created'));
      }
      setShowModal(false);
      setEditing(null);
      setForm(EMPTY_FORM);
      setFile(null);
      setPreview(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || t('admin.error'));
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (item) => {
    try {
      await api.put(`/admin/home-videos/${item._id}`, { isActive: !item.isActive });
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
      await api.delete(`/admin/home-videos/${confirmId}`);
      toast.success(t('admin.deleted'));
      setItems(prev => prev.filter(i => i._id !== confirmId));
      setConfirmId(null);
    } catch {
      toast.error(t('admin.deleteError'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <><Helmet><title>{t('adminHomeVideos.pageTitle')}</title></Helmet>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-mono font-bold text-[#272829]">{t('adminHomeVideos.header')}</h1>
          <p className="font-mono text-xs mt-1 text-[#61677A]">{items.length} {t('adminHomeVideos.videosCount')}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={load} variant="ghost" size="sm">
            <RefreshCw size={14} className="mr-1" /> {t('admin.refresh')}
          </Button>
          {items.length === 0 && (
            <Button onClick={() => setSeedConfirm(true)} variant="ghost" size="sm" style={{ borderColor: '#D97706', color: '#D97706' }}>
              {t('adminHomeVideos.seedDefaults')}
            </Button>
          )}
          <Button onClick={openCreate} size="sm">
            <Plus size={14} className="mr-1" /> {t('adminHomeVideos.addVideo')}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div
              key={item._id}
              className="rounded-xl overflow-hidden glass-card border border-[#E5E7EA] transition-all"
              style={{ opacity: item.isActive ? 1 : 0.6 }}
            >
              <div className="aspect-video bg-[#FFFFFF] relative group">
                <video
                  src={item.url?.startsWith('/uploads') ? `${API_URL}${item.url}` : item.url}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={32} className="text-white fill-white" />
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-sm text-[#272829] line-clamp-1">{item.title}</h3>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span
                      className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                      style={{
                        background: item.isActive ? '#F0FDF4' : '#F1F2F4',
                        color: item.isActive ? '#16A34A' : '#61677A',
                      }}
                    >
                      {item.isActive ? t('admin.statusActive') : t('admin.statusHidden')}
                    </span>
                    <span className="font-mono text-[10px] bg-[#FFFFFF] px-2 py-0.5 rounded text-[#61677A]">
                      #{item.order}
                    </span>
                  </div>
                </div>
                <p className="font-mono text-[10px] text-[#61677A]" title={item.url}>
                  {truncateUrl(item.url)}
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-[#E5E7EA]">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono font-semibold transition-all"
                    style={{ background: '#EFF6FF', color: '#2563EB' }}
                    title={t('admin.edit')}
                  >
                    <Edit2 size={12} />
                    <span>{t('admin.edit')}</span>
                  </button>
                  <button
                    onClick={() => toggleActive(item)}
                    className={`p-1.5 rounded-lg hover:bg-[#FFFFFF] transition-all ${item.isActive ? 'text-[#D97706]' : 'text-[#16A34A]'}`}
                    title={item.isActive ? t('admin.hide') : t('admin.show')}
                  >
                    {item.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={() => deleteItem(item._id)}
                    className="p-1.5 rounded-lg hover:bg-[#FFFFFF] text-[#61677A] hover:text-[#DC2626] transition-all ml-auto"
                    title={t('admin.delete')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full py-20 text-center glass-card rounded-xl border border-[#E5E7EA]">
              <Play size={40} className="mx-auto mb-4 text-[#9CA3AF]" />
              <p className="font-mono text-sm text-[#61677A]">{t('adminHomeVideos.empty')}</p>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditing(null); setForm(EMPTY_FORM); setFile(null); setPreview(null); }}
        title={editing ? t('adminHomeVideos.modalEdit') : t('adminHomeVideos.modalAdd')}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('adminHomeVideos.form.title')}
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder={t('adminHomeVideos.form.titlePlaceholder')}
            required
          />

          <div className="space-y-2">
            <label className="text-xs font-mono text-[#61677A]">{t('adminHomeVideos.form.videoFile')}</label>
            <div
              className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[#2563EB] transition-colors"
              style={{ borderColor: preview ? '#272829' : '#D8D9DA', background: '#FFFFFF' }}
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <video src={preview} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play size={24} className="text-white fill-white" />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); }}
                    className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={24} className="text-[#9CA3AF] mb-2" />
                  <p className="text-[10px] text-[#61677A]">{t('adminHomeVideos.form.clickToUpload')}</p>
                </>
              )}
              <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleFile} />
            </div>
          </div>

          <Input
            label={t('adminHomeVideos.form.videoUrl')}
            value={form.url}
            onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
            placeholder="https://..."
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t('adminHomeVideos.form.order')}
              type="number"
              value={form.order}
              onChange={e => setForm(p => ({ ...p, order: parseInt(e.target.value) }))}
            />
            <div className="flex flex-col">
              <label className="text-xs font-mono mb-2 text-[#61677A]">{t('adminHomeVideos.form.status')}</label>
              <label className="flex items-center gap-2 cursor-pointer h-full">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))}
                  className="rounded border-[#D8D9DA] bg-[#FFFFFF]"
                />
                <span className="text-sm text-[#272829]">{t('admin.statusActive')}</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EA]">
            <Button variant="ghost" type="button" onClick={() => { setShowModal(false); setEditing(null); setForm(EMPTY_FORM); setFile(null); setPreview(null); }}>
              {t('admin.cancel')}
            </Button>
            <Button type="submit" loading={saving}>
              {t('admin.save')}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={seedConfirm}
        onClose={() => setSeedConfirm(false)}
        onConfirm={seedDefaults}
        loading={seeding}
        confirmStyle="warning"
        title={t('adminHomeVideos.seedConfirmTitle')}
        message={t('adminHomeVideos.seedConfirmMessage')}
        confirmLabel={t('adminHomeVideos.seedConfirmLabel')}
      />
      <ConfirmModal
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title={t('adminHomeVideos.deleteConfirmTitle')}
        message={t('adminHomeVideos.deleteConfirmMessage')}
        confirmLabel={t('admin.deleteConfirm')}
      />
    </div>
    </>
  );
};

export default AdminHomeVideos;
