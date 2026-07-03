import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Edit2, Eye, EyeOff, BookOpen } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import ConfirmModal from '../../components/ui/ConfirmModal';

const EMPTY = { name: '', icon: 'BookOpen', order: 0, active: true, desc: '', duration: '', img: '', features: '' };

const ICONS = ['Code','TrendingUp','Palette','ShieldCheck','Hotel','BarChart3','FlaskConical','Sprout','BookOpen','Globe','Cpu','Music','Camera','Award','GraduationCap'];

const AdminDirections = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/directions');
      setItems(res.data.data || []);
    } catch {
      toast.error(t('admin.loadError'));
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null); setForm(EMPTY); setShowModal(true);
  };
  const openEdit = (d) => {
    setEditing(d._id);
    setForm({ name: d.name, icon: d.icon || 'BookOpen', order: d.order || 0, active: !!d.active, desc: d.desc || '', duration: d.duration || '', img: d.img || '', features: d.features ? d.features.join(', ') : '' });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.name.trim()) { toast.error(t('admin.requiredName')); return; }
    try {
      setSaving(true);
      const payload = {
        ...form,
        features: form.features ? form.features.split(',').map(f => f.trim()).filter(Boolean) : [],
      };
      if (editing) await api.put(`/admin/directions/${editing}`, payload);
      else         await api.post('/admin/directions', payload);
      toast.success(editing ? t('admin.updated') : t('admin.created'));
      setShowModal(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || t('admin.error'));
    } finally { setSaving(false); }
  };

  const del = async () => {
    try {
      await api.delete(`/admin/directions/${confirmId}`);
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
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold">{t('adminDirections.header')}</h1>
            <p className="text-sm text-[#61677A]">{t('adminDirections.subtitle')}</p>
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
          <BookOpen size={48} className="mx-auto text-[#9CA3AF] mb-3" />
          <p className="text-[#61677A] mb-4">{t('adminDirections.empty')}</p>
          <Button onClick={async () => {
            try {
              await api.post('/admin/seed-directions');
              toast.success(t('admin.success'));
              load();
            } catch (e) { toast.error(e.response?.data?.message || t('admin.error')); }
          }} className="btn-orange">
            <Plus size={16} /> {t('adminDirections.seed')}
          </Button>
        </div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="tm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{t('adminDirections.table.name')}</th>
                <th>{t('adminDirections.table.icon')}</th>
                <th>{t('adminDirections.table.order')}</th>
                <th>{t('adminDirections.table.status')}</th>
                <th>{t('adminDirections.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((d, i) => (
                <tr key={d._id}>
                  <td>{i + 1}</td>
                  <td className="font-semibold">{d.name}</td>
                  <td className="muted">{d.icon || '—'}</td>
                  <td>{d.order || 0}</td>
                  <td>
                    {d.active
                      ? <span className="badge-active">{t('admin.statusActive')}</span>
                      : <span className="badge-draft">{t('admin.statusHidden')}</span>}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(d)}
                              className="p-2 rounded-md hover:bg-[#F1F2F4] text-[#272829]">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => setConfirmId(d._id)}
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
             title={editing ? t('adminDirections.modalEdit') : t('adminDirections.modalAdd')} size="lg">
        <div className="space-y-4 admin-theme">
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('adminDirections.form.name')}</label>
            <input className="input-field" value={form.name}
                   onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                   placeholder={t('adminDirections.form.namePlaceholder')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('adminDirections.form.icon')}</label>
              <select className="input-field" value={form.icon}
                      onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}>
                {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('adminDirections.form.duration')}</label>
              <input className="input-field" value={form.duration}
                     onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                     placeholder={t('adminDirections.form.durationPlaceholder')} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('adminDirections.form.desc')}</label>
            <textarea className="input-field resize-none" rows={2} value={form.desc}
                      onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
                      placeholder={t('adminDirections.form.descPlaceholder')} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('adminDirections.form.img')}</label>
            <input className="input-field" value={form.img}
                   onChange={e => setForm(p => ({ ...p, img: e.target.value }))}
                   placeholder="/assets/images/DSC00827.webp" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t('adminDirections.form.features')}</label>
            <input className="input-field" value={form.features}
                   onChange={e => setForm(p => ({ ...p, features: e.target.value }))}
                   placeholder={t('adminDirections.form.featuresPlaceholder')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t('adminDirections.form.order')}</label>
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
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={() => setShowModal(false)} className="btn-ghost">{t('admin.cancel')}</Button>
            <Button onClick={save} disabled={saving} className="btn-orange">
              {saving ? t('admin.saving') : t('admin.save')}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal isOpen={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={del}
                    title={t('admin.confirmDeleteTitle')} message={t('adminDirections.confirmMessage')} />
    </div>
  );
};

export default AdminDirections;
