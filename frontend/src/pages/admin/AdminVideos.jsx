import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Film, Plus, Trash2, Edit2, Eye, EyeOff, X, RefreshCw, Upload, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import { uploadVideo } from '../../services/firebase';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Spinner from '../../components/ui/Spinner';
import ConfirmModal from '../../components/ui/ConfirmModal';

const EMPTY_FORM = { title: '', description: '', order: 0, isActive: true };

const truncateUrl = (url, max = 40) => {
  if (!url) return '—';
  return url.length > max ? url.slice(0, max) + '...' : url;
};

const AdminVideos = () => {
  const { t } = useTranslation();
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [file, setFile]           = useState(null);
  const [preview, setPreview]     = useState(null);
  const [saving, setSaving]       = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [confirmId, setConfirmId]     = useState(null);
  const [deleting, setDeleting]       = useState(false);
  const fileRef = useRef();
  const blobUrl = useRef(null);

  useEffect(() => () => { if (blobUrl.current) URL.revokeObjectURL(blobUrl.current); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/videos');
      setItems(res.data.data || []);
    } catch {
      toast.error(t('adminVideos:loadError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setPreview(null);
    setUploadProgress(0);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item._id);
    setForm({
      title: item.title,
      description: item.description || '',
      order: item.order || 0,
      isActive: item.isActive,
    });
    setPreview(item.url);
    setFile(null);
    setUploadProgress(0);
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

      let videoUrl = editing ? items.find(i => i._id === editing)?.url || '' : '';

      if (file) {
        setUploading(true);
        setUploadProgress(0);
        videoUrl = await uploadVideo(file, (progress) => {
          setUploadProgress(progress);
        });
        setUploading(false);
      }

      const payload = {
        title: form.title,
        description: form.description,
        url: videoUrl,
        order: form.order,
        isActive: form.isActive,
      };

      if (editing) {
        await api.put(`/admin/videos/${editing}`, payload);
        toast.success(t('adminVideos:updated'));
      } else {
        await api.post('/admin/videos', payload);
        toast.success(t('adminVideos:created'));
      }

      setShowModal(false);
      setEditing(null);
      setForm(EMPTY_FORM);
      setFile(null);
      setPreview(null);
      setUploadProgress(0);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || t('common:error'));
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const toggleActive = async (item) => {
    try {
      await api.put(`/admin/videos/${item._id}`, { isActive: !item.isActive });
      setItems(prev => prev.map(i => i._id === item._id ? { ...i, isActive: !i.isActive } : i));
    } catch {
      toast.error(t('common:error'));
    }
  };

  const deleteItem = (id) => setConfirmId(id);

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/admin/videos/${confirmId}`);
      toast.success(t('adminVideos:deleted'));
      setItems(prev => prev.filter(i => i._id !== confirmId));
      setConfirmId(null);
    } catch {
      toast.error(t('adminVideos:deleteError'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-mono font-bold text-[#272829]">{t('adminVideos:header')}</h1>
          <p className="font-mono text-xs mt-1 text-[#61677A]">{items.length} {t('adminVideos:videosCount')}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={load} variant="ghost" size="sm">
            <RefreshCw size={14} className="mr-1" /> {t('adminVideos:refresh')}
          </Button>
          <Button onClick={openCreate} size="sm">
            <Plus size={14} className="mr-1" /> {t('adminVideos:addVideo')}
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
                  src={item.url}
                  className="w-full h-full object-cover"
                  preload="metadata"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Film size={32} className="text-white" />
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
                      {item.isActive ? t('adminVideos:active') : t('adminVideos:hidden')}
                    </span>
                    <span className="font-mono text-[10px] bg-[#FFFFFF] px-2 py-0.5 rounded text-[#61677A]">
                      #{item.order}
                    </span>
                  </div>
                </div>
                {item.description && (
                  <p className="text-xs text-[#61677A] line-clamp-2">{item.description}</p>
                )}
                <p className="font-mono text-[10px] text-[#61677A]" title={item.url}>
                  {truncateUrl(item.url)}
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-[#E5E7EA]">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono font-semibold transition-all"
                    style={{ background: '#EFF6FF', color: '#2563EB' }}
                  >
                    <Edit2 size={12} />
                    <span>{t('adminVideos:edit')}</span>
                  </button>
                  <button
                    onClick={() => toggleActive(item)}
                    className={`p-1.5 rounded-lg hover:bg-[#FFFFFF] transition-all ${item.isActive ? 'text-[#D97706]' : 'text-[#16A34A]'}`}
                  >
                    {item.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-[#FFFFFF] text-[#61677A] hover:text-[#2563EB] transition-all"
                  >
                    <ExternalLink size={14} />
                  </a>
                  <button
                    onClick={() => deleteItem(item._id)}
                    className="p-1.5 rounded-lg hover:bg-[#FFFFFF] text-[#61677A] hover:text-[#DC2626] transition-all ml-auto"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full py-20 text-center glass-card rounded-xl border border-[#E5E7EA]">
              <Film size={40} className="mx-auto mb-4 text-[#9CA3AF]" />
              <p className="font-mono text-sm text-[#61677A]">{t('adminVideos:empty')}</p>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditing(null); setForm(EMPTY_FORM); setFile(null); setPreview(null); setUploadProgress(0); }}
        title={editing ? t('adminVideos:modalEdit') : t('adminVideos:modalAdd')}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('adminVideos:form.title')}
            value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
            placeholder={t('adminVideos:form.titlePlaceholder')}
            required
          />

          <div className="space-y-1">
            <label className="text-xs font-mono text-[#61677A]">{t('adminVideos:form.description')}</label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder={t('adminVideos:form.descriptionPlaceholder')}
              rows={3}
              className="input-field resize-none"
              style={{ background: '#FFFFFF', border: '1px solid #D8D9DA', borderRadius: 10, padding: '10px 14px', fontSize: 13, width: '100%' }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-[#61677A]">{t('adminVideos:form.videoFile')}</label>
            <div
              className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[#2563EB] transition-colors"
              style={{ borderColor: preview ? '#272829' : '#D8D9DA', background: '#FFFFFF' }}
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <video src={preview} className="w-full h-full object-cover" preload="metadata" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Film size={24} className="text-white" />
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
                  <p className="text-[10px] text-[#61677A]">{t('adminVideos:form.clickToUpload')}</p>
                </>
              )}
              <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleFile} />
            </div>

            {uploading && (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-[#61677A]">
                  <span>{t('adminVideos:form.uploading')}</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F1F2F4] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%`, background: '#2563EB' }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t('adminVideos:form.order')}
              type="number"
              value={form.order}
              onChange={e => setForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))}
            />
            <div className="flex flex-col">
              <label className="text-xs font-mono mb-2 text-[#61677A]">{t('adminVideos:form.status')}</label>
              <label className="flex items-center gap-2 cursor-pointer h-full">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))}
                  className="rounded border-[#D8D9DA] bg-[#FFFFFF]"
                />
                <span className="text-sm text-[#272829]">{t('adminVideos:active')}</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EA]">
            <Button variant="ghost" type="button" onClick={() => { setShowModal(false); setEditing(null); setForm(EMPTY_FORM); setFile(null); setPreview(null); setUploadProgress(0); }}>
              {t('common:cancel')}
            </Button>
            <Button type="submit" loading={saving || uploading} disabled={uploading}>
              {uploading ? t('adminVideos:form.uploading') : t('common:save')}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title={t('adminVideos:deleteConfirmTitle')}
        message={t('adminVideos:deleteConfirmMessage')}
        confirmLabel={t('adminVideos:deleteConfirmLabel')}
      />
    </div>
  );
};

export default AdminVideos;
