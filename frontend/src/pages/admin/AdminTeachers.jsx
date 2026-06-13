import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Edit2, Eye, EyeOff, X, Upload, Users } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import ConfirmModal from '../../components/ui/ConfirmModal';

const API_URL = import.meta.env.VITE_API_URL || '';
const EMPTY = { name: '', role: '', order: 0, active: true };

const resolveImg = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  if (img.startsWith('/uploads')) return `${API_URL}${img}`;
  return img;
};

const AdminTeachers = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const fileRef = useRef();

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/teachers');
      setItems(res.data.data || []);
    } catch {
      toast.error(t('admin.loadError'));
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null); setForm(EMPTY); setFile(null); setPreview(null); setShowModal(true);
  };
  const openEdit = (tchr) => {
    setEditing(tchr._id);
    setForm({ name: tchr.name, role: tchr.role || '', order: tchr.order || 0, active: !!tchr.active });
    setPreview(resolveImg(tchr.image));
    setFile(null);
    setShowModal(true);
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const save = async () => {
    if (!form.name.trim()) { toast.error(t('admin.requiredName')); return; }
    try {
      setSaving(true);
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('role', form.role);
      fd.append('order', String(form.order));
      fd.append('active', String(form.active));
      if (file) fd.append('image', file);
      if (editing) await api.put(`/admin/teachers/${editing}`, fd);
      else         await api.post('/admin/teachers', fd);
      toast.success(editing ? t('admin.updated') : t('admin.created'));
      setShowModal(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || t('admin.error'));
    } finally { setSaving(false); }
  };

  const del = async () => {
    try {
      await api.delete(`/admin/teachers/${confirmId}`);
      toast.success(t('admin.deleted'));
      setConfirmId(null);
      load();
    } catch { toast.error(t('admin.error')); }
  };

  return (
    <div className="admin-theme p-6 md:p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#272829] text-white flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold">{t('adminTeachers.header')}</h1>
            <p className="text-sm text-[#61677A]">{t('adminTeachers.subtitle')}</p>
          </div>
        </div>
        <Button onClick={openCreate} className="btn-orange">
          <Plus size={16} /> {t('admin.addNew')}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <Users size={48} className="mx-auto text-[#9CA3AF] mb-3" />
          <p className="text-[#61677A] mb-4">{t('adminTeachers.empty')}</p>
          <Button onClick={async () => {
            try {
              await api.post('/admin/seed-teachers');
              toast.success(t('admin.success'));
              load();
            } catch (e) { toast.error(e.response?.data?.message || t('admin.error')); }
          }} className="btn-orange">
            <Plus size={16} /> {t('adminTeachers.seed')}
          </Button>
        </div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="tm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{t('adminTeachers.table.image')}</th>
                <th>{t('adminTeachers.table.name')}</th>
                <th>{t('adminTeachers.table.role')}</th>
                <th>{t('adminTeachers.table.order')}</th>
                <th>{t('adminTeachers.table.status')}</th>
                <th>{t('adminTeachers.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((tchr, i) => (
                <tr key={tchr._id}>
                  <td>{i + 1}</td>
                  <td>
                    {resolveImg(tchr.image) ? (
                      <img src={resolveImg(tchr.image)} alt={tchr.name}
                           className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#F1F2F4] flex items-center justify-center">
                        <Users size={20} className="text-[#9CA3AF]" />
                      </div>
                    )}
                  </td>
                  <td className="font-semibold">{tchr.name}</td>
                  <td className="muted">{tchr.role || '—'}</td>
                  <td>{tchr.order || 0}</td>
                  <td>
                    {tchr.active
                      ? <span className="badge-active">{t('admin.statusActive')}</span>
                      : <span className="badge-draft">{t('admin.statusHidden')}</span>}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(tchr)}
                              className="p-2 rounded-md hover:bg-[#F1F2F4] text-[#272829]">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => setConfirmId(tchr._id)}
                              className="p-2 rounded-md hover:bg-red-50 text-red-600">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}
             title={editing ? t('adminTeachers.modalEdit') : t('adminTeachers.modalAdd')}>
        <div className="space-y-4 admin-theme">
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('adminTeachers.form.name')}</label>
            <input className="input-field" value={form.name}
                   onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                   placeholder={t('adminTeachers.form.namePlaceholder')} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('adminTeachers.form.role')}</label>
            <input className="input-field" value={form.role}
                   onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                   placeholder={t('adminTeachers.form.rolePlaceholder')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('adminTeachers.form.order')}</label>
              <input type="number" className="input-field" value={form.order}
                     onChange={e => setForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="flex items-end">
              <button type="button"
                      onClick={() => setForm(p => ({ ...p, active: !p.active }))}
                      className={`w-full input-field flex items-center gap-2 justify-center ${form.active ? 'text-green-700' : 'text-gray-500'}`}>
                {form.active ? <><Eye size={15} /> {t('admin.statusActive')}</> : <><EyeOff size={15} /> {t('admin.statusHidden')}</>}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('adminTeachers.form.image')}</label>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
            <div className="flex items-center gap-3">
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="" className="w-20 h-20 rounded-lg object-cover" />
                  <button onClick={() => { setFile(null); setPreview(null); }}
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg bg-[#F1F2F4] flex items-center justify-center text-[#9CA3AF]">
                  <Users size={24} />
                </div>
              )}
              <button onClick={() => fileRef.current?.click()} className="btn-outline">
                <Upload size={14} /> {t('admin.chooseImage')}
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={() => setShowModal(false)} className="btn-ghost">{t('admin.cancel')}</Button>
            <Button onClick={save} disabled={saving} className="btn-orange">
              {saving ? t('admin.saving') : t('admin.save')}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal isOpen={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={del}
                    title={t('admin.confirmDeleteTitle')} message={t('adminTeachers.confirmMessage')} />
    </div>
  );
};

export default AdminTeachers;
