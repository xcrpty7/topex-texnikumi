import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Plus, Trash2, Edit2, Eye, EyeOff, Briefcase } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import ConfirmModal from '../../components/ui/ConfirmModal';

const EMPTY = { title: '', description: '', requirements: '', salary: '', location: '', type: 'full-time', order: 0, isActive: true };

const TYPE_LABELS = {
  'full-time': 'To\'liq stavka',
  'part-time': 'Yarim stavka',
  'remote': 'Masofaviy',
  'project': 'Loyiha asosida',
};

const AdminVacancies = () => {
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
      const res = await api.get('/admin/vacancies');
      setItems(res.data.data || []);
    } catch {
      toast.error(t('admin.loadError'));
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null); setForm(EMPTY); setShowModal(true);
  };
  const openEdit = (item) => {
    setEditing(item._id);
    setForm({
      title: item.title,
      description: item.description || '',
      requirements: item.requirements || '',
      salary: item.salary || '',
      location: item.location || '',
      type: item.type || 'full-time',
      order: item.order || 0,
      isActive: !!item.isActive,
    });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.title.trim()) { toast.error(t('admin.requiredName')); return; }
    try {
      setSaving(true);
      if (editing) await api.put(`/admin/vacancies/${editing}`, form);
      else         await api.post('/admin/vacancies', form);
      toast.success(editing ? t('admin.updated') : t('admin.created'));
      setShowModal(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || t('admin.error'));
    } finally { setSaving(false); }
  };

  const del = async () => {
    try {
      await api.delete(`/admin/vacancies/${confirmId}`);
      toast.success(t('admin.deleted'));
      setConfirmId(null);
      load();
    } catch { toast.error(t('admin.error')); }
  };

  return (
    <><Helmet><title>Vakansiyalar — Admin</title></Helmet>
    <div className="admin-theme p-6 md:p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#272829] text-white flex items-center justify-center">
            <Briefcase size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Vakansiyalar</h1>
            <p className="text-sm text-[#61677A]">Ochiq vakansiyalarni boshqarish</p>
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
          <Briefcase size={48} className="mx-auto text-[#9CA3AF] mb-3" />
          <p className="text-[#61677A] mb-4">Hozircha vakansiyalar yo'q</p>
        </div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="tm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nomi</th>
                <th>Tur</th>
                <th>Ish haqi</th>
                <th>Joy</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item._id}>
                  <td>{i + 1}</td>
                  <td className="font-semibold">{item.title}</td>
                  <td className="text-xs">{TYPE_LABELS[item.type] || item.type}</td>
                  <td className="muted">{item.salary || '—'}</td>
                  <td className="muted">{item.location || '—'}</td>
                  <td>{item.order || 0}</td>
                  <td>
                    {item.isActive
                      ? <span className="badge-active">{t('admin.statusActive')}</span>
                      : <span className="badge-draft">{t('admin.statusHidden')}</span>}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(item)}
                              className="p-2 rounded-md hover:bg-[#F1F2F4] text-[#272829]">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => setConfirmId(item._id)}
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
             title={editing ? 'Vakansiyani tahrirlash' : 'Yangi vakansiya'}>
        <div className="space-y-4 admin-theme">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Nomi *</label>
            <input className="input-field" value={form.title}
                   onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                   placeholder="Masalan: AI Video bo'yicha o'qituvchi" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Tavsif</label>
            <textarea className="input-field resize-none" rows={3} value={form.description}
                      onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      placeholder="Vakansiya haqida batafsil" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Talablar</label>
            <textarea className="input-field resize-none" rows={3} value={form.requirements}
                      onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))}
                      placeholder="Nomzodga qo'yiladigan talablar" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Ish haqi</label>
              <input className="input-field" value={form.salary}
                     onChange={e => setForm(p => ({ ...p, salary: e.target.value }))}
                     placeholder="Masalan: 5 000 000 so'm" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Joy</label>
              <input className="input-field" value={form.location}
                     onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                     placeholder="Masalan: Toshkent" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Tur</label>
              <select className="input-field" value={form.type}
                      onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                {Object.entries(TYPE_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Order</label>
              <input type="number" className="input-field" value={form.order}
                     onChange={e => setForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button"
                    onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
                    className={`input-field flex items-center gap-2 justify-center ${form.isActive ? 'text-green-700' : 'text-gray-500'}`}>
              {form.isActive ? <><Eye size={15} /> Aktiv</> : <><EyeOff size={15} /> Yashirin</>}
            </button>
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
                    title={t('admin.confirmDeleteTitle')} message="Bu vakansiyani o'chirishni tasdiqlaysizmi?" />
    </div>
    </>
  );
};

export default AdminVacancies;
