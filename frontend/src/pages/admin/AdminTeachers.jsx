import { useEffect, useState, useRef } from 'react';
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
      toast.error("O'qituvchilarni yuklab bo'lmadi");
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null); setForm(EMPTY); setFile(null); setPreview(null); setShowModal(true);
  };
  const openEdit = (t) => {
    setEditing(t._id);
    setForm({ name: t.name, role: t.role || '', order: t.order || 0, active: !!t.active });
    setPreview(resolveImg(t.image));
    setFile(null);
    setShowModal(true);
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const save = async () => {
    if (!form.name.trim()) { toast.error('Ism kiritilishi shart'); return; }
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
      toast.success(editing ? 'Yangilandi' : "Qo'shildi");
      setShowModal(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Xatolik');
    } finally { setSaving(false); }
  };

  const del = async () => {
    try {
      await api.delete(`/admin/teachers/${confirmId}`);
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
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold">O'qituvchilar</h1>
            <p className="text-sm text-[#61677A]">Jamoa bo'limi uchun ustozlarni boshqarish</p>
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
          <Users size={48} className="mx-auto text-[#9CA3AF] mb-3" />
          <p className="text-[#61677A]">Hozircha o'qituvchi qo'shilmagan</p>
        </div>
      ) : (
        <div className="glass-card overflow-x-auto">
          <table className="tm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Rasm</th>
                <th>Ism</th>
                <th>Lavozim</th>
                <th>Tartib</th>
                <th>Status</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t, i) => (
                <tr key={t._id}>
                  <td>{i + 1}</td>
                  <td>
                    {resolveImg(t.image) ? (
                      <img src={resolveImg(t.image)} alt={t.name}
                           className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#F1F2F4] flex items-center justify-center">
                        <Users size={20} className="text-[#9CA3AF]" />
                      </div>
                    )}
                  </td>
                  <td className="font-semibold">{t.name}</td>
                  <td className="muted">{t.role || '—'}</td>
                  <td>{t.order || 0}</td>
                  <td>
                    {t.active
                      ? <span className="badge-active">Faol</span>
                      : <span className="badge-draft">Yashirin</span>}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(t)}
                              className="p-2 rounded-md hover:bg-[#F1F2F4] text-[#272829]">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => setConfirmId(t._id)}
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
             title={editing ? "O'qituvchini tahrirlash" : "Yangi o'qituvchi"}>
        <div className="space-y-4 admin-theme">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Ism familiya *</label>
            <input className="input-field" value={form.name}
                   onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                   placeholder="Masalan: G'AYRAT SHOUMAROV" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Lavozim</label>
            <input className="input-field" value={form.role}
                   onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                   placeholder="Masalan: Direktor" />
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
          <div>
            <label className="block text-sm font-semibold mb-1.5">Rasm</label>
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
                <Upload size={14} /> Rasm tanlash
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
                    title="O'chirish" message="Ushbu o'qituvchi o'chiriladi. Davom etasizmi?" />
    </div>
  );
};

export default AdminTeachers;
