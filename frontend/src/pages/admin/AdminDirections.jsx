import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Eye, EyeOff, BookOpen } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import ConfirmModal from '../../components/ui/ConfirmModal';

const EMPTY = { name: '', icon: 'BookOpen', order: 0, active: true };

const ICONS = ['Code','TrendingUp','Palette','ShieldCheck','Hotel','BarChart3','FlaskConical','Sprout','BookOpen','Globe','Cpu','Music','Camera','Award','GraduationCap'];

const AdminDirections = () => {
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
      toast.error("Yo'nalishlarni yuklab bo'lmadi");
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null); setForm(EMPTY); setShowModal(true);
  };
  const openEdit = (d) => {
    setEditing(d._id);
    setForm({ name: d.name, icon: d.icon || 'BookOpen', order: d.order || 0, active: !!d.active });
    setShowModal(true);
  };

  const save = async () => {
    if (!form.name.trim()) { toast.error('Nom kiritilishi shart'); return; }
    try {
      setSaving(true);
      if (editing) await api.put(`/admin/directions/${editing}`, form);
      else         await api.post('/admin/directions', form);
      toast.success(editing ? 'Yangilandi' : "Qo'shildi");
      setShowModal(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Xatolik');
    } finally { setSaving(false); }
  };

  const del = async () => {
    try {
      await api.delete(`/admin/directions/${confirmId}`);
      toast.success("O'chirildi");
      setConfirmId(null);
      load();
    } catch { toast.error('Xatolik'); }
  };

  return (
    <div className="admin-theme p-6 md:p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#272829] text-white flex items-center justify-center">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Yo'nalishlar</h1>
            <p className="text-sm text-[#61677A]">Bosh sahifa "Yo'nalishlar" bo'limi</p>
          </div>
        </div>
        <Button onClick={openCreate} className="btn-orange">
          <Plus size={16} /> Yangi qo'shish
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <BookOpen size={48} className="mx-auto text-[#9CA3AF] mb-3" />
          <p className="text-[#61677A]">Hozircha yo'nalish qo'shilmagan</p>
        </div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="tm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nom</th>
                <th>Icon</th>
                <th>Tartib</th>
                <th>Status</th>
                <th>Amallar</th>
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
                      ? <span className="badge-active">Faol</span>
                      : <span className="badge-draft">Yashirin</span>}
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
             title={editing ? "Yo'nalishni tahrirlash" : "Yangi yo'nalish"}>
        <div className="space-y-4 admin-theme">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Nom *</label>
            <input className="input-field" value={form.name}
                   onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                   placeholder="Masalan: DASTURLASH" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Icon (lucide-react)</label>
            <select className="input-field" value={form.icon}
                    onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}>
              {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Tartib</label>
              <input type="number" className="input-field" value={form.order}
                     onChange={e => setForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="flex items-end">
              <button type="button"
                      onClick={() => setForm(p => ({ ...p, active: !p.active }))}
                      className={`w-full input-field flex items-center gap-2 justify-center ${form.active ? 'text-green-700' : 'text-gray-500'}`}>
                {form.active ? <><Eye size={15} /> Faol</> : <><EyeOff size={15} /> Yashirin</>}
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={() => setShowModal(false)} className="btn-ghost">Bekor</Button>
            <Button onClick={save} disabled={saving} className="btn-orange">
              {saving ? 'Saqlanmoqda...' : 'Saqlash'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal isOpen={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={del}
                    title="O'chirish" message="Ushbu yo'nalish o'chiriladi. Davom etasizmi?" />
    </div>
  );
};

export default AdminDirections;
