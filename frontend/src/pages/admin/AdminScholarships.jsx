import { useEffect, useState } from 'react';
import { Award, Plus, Trash2, Edit2, Eye, EyeOff, X, Search } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/ui/ConfirmModal';

const empty = { title: '', description: '', requirement: '', icon: 'Award', color: '#3b82f6', order: 0 };

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const AdminScholarships = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/scholarships');
      setItems(res.data.data || []);
    } catch { toast.error('Yuklab bo\'lmadi'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ title: item.title, description: item.description, requirement: item.requirement, icon: item.icon, color: item.color, order: item.order || 0 });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editing) {
        await api.put(`/admin/scholarships/${editing._id}`, form);
        toast.success('Yangilandi');
      } else {
        await api.post('/admin/scholarships', form);
        toast.success('Qo\'shildi');
      }
      setShowModal(false);
      load();
    } catch { toast.error('Xatolik'); }
    finally { setSaving(false); }
  };

  const toggleActive = async (item) => {
    try {
      await api.put(`/admin/scholarships/${item._id}`, { isActive: !item.isActive });
      setItems(prev => prev.map(i => i._id === item._id ? { ...i, isActive: !i.isActive } : i));
    } catch { toast.error('Xatolik'); }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/scholarships/${confirmId}`);
      toast.success('O\'chirildi');
      setItems(prev => prev.filter(i => i._id !== confirmId));
    } catch { toast.error('Xatolik'); }
    finally { setDeleting(false); setConfirmId(null); }
  };

  const filtered = items.filter(i =>
    !searchQ || i.title?.toLowerCase().includes(searchQ.toLowerCase()) || i.requirement?.toLowerCase().includes(searchQ.toLowerCase())
  );

  return (
    <div style={{ color: '#272829' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#272829' }}>Grantlar va Stipendiyalar</h1>
          <p className="text-xs mt-0.5" style={{ color: '#61677A' }}>{filtered.length}/{items.length} ta grant</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{ background: '#272829', color: '#fff' }}>
          <Plus size={14} /> Grant qo'shish
        </button>
      </div>

      {/* Search */}
      <div className="mb-5 relative" style={{ maxWidth: 280 }}>
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
        <input
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
          placeholder="Grant nomi yoki talab..."
          className="pl-8 pr-3 py-2 rounded-xl text-sm outline-none w-full"
          style={{ background: '#FFFFFF', border: '1px solid #E5E7EA', color: '#272829' }}
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-sm" style={{ color: '#61677A' }}>Yuklanmoqda...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-20">
              <Award size={40} style={{ color: '#9CA3AF', margin: '0 auto 12px' }} />
              <p className="text-sm" style={{ color: '#61677A' }}>{searchQ ? 'Grant topilmadi' : 'Hali grant yo\'q'}</p>
            </div>
          )}
          {filtered.map(item => (
            <div key={item._id} className="rounded-xl p-4 transition-all"
              style={{ background: '#FFFFFF', border: '1px solid #E5E7EA', opacity: item.isActive ? 1 : 0.55 }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: item.color + '22', border: `1px solid ${item.color}44` }}>
                  <Award size={20} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: '#272829' }}>{item.title}</p>
                  <p className="text-xs truncate font-medium" style={{ color: item.color }}>{item.requirement}</p>
                </div>
                {!item.isActive && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold flex-shrink-0"
                    style={{ background: '#E5E7EA', color: '#61677A' }}>yashirin</span>
                )}
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: '#61677A' }}>{item.description}</p>
              <div className="flex gap-2 pt-3" style={{ borderTop: '1px solid #F0F1F3' }}>
                <button onClick={() => openEdit(item)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                  style={{ background: '#F1F2F4', color: '#61677A' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#E5E7EA'}
                  onMouseLeave={e => e.currentTarget.style.background = '#F1F2F4'}>
                  <Edit2 size={10} /> Tahrir
                </button>
                <button onClick={() => toggleActive(item)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                  style={{ background: '#F1F2F4', color: item.isActive ? '#D97706' : '#16A34A' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#E5E7EA'}
                  onMouseLeave={e => e.currentTarget.style.background = '#F1F2F4'}>
                  {item.isActive ? <><EyeOff size={10} /> Yashir</> : <><Eye size={10} /> Ko'rsat</>}
                </button>
                <button onClick={() => setConfirmId(item._id)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs ml-auto transition-colors"
                  style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(220,38,38,0.08)'}>
                  <Trash2 size={10} /> O'chir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6 overflow-y-auto max-h-[90vh]"
            style={{ background: '#FFFFFF', border: '1px solid #D8D9DA', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-base" style={{ color: '#272829' }}>{editing ? 'Grant tahrirlash' : 'Grant qo\'shish'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg transition-colors"
                style={{ color: '#61677A' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F1F2F4'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: 'title', label: 'Sarlavha', placeholder: 'SAT 1200+' },
                { key: 'requirement', label: 'Talab', placeholder: 'SAT imtihonidan 1200+ ball' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#61677A' }}>{label}</label>
                  <input required value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl text-sm outline-none transition-colors"
                    style={{ background: '#FAFAFA', border: '1px solid #E5E7EA', color: '#272829' }}
                    onFocus={e => e.target.style.borderColor = '#2563EB'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EA'}
                    placeholder={placeholder} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#61677A' }}>Tavsif</label>
                <textarea required value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={3} className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none transition-colors"
                  style={{ background: '#FAFAFA', border: '1px solid #E5E7EA', color: '#272829' }}
                  onFocus={e => e.target.style.borderColor = '#2563EB'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EA'}
                  placeholder="Grant haqida ma'lumot..." />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: '#61677A' }}>Rang tanlang</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setForm(p => ({ ...p, color: c }))}
                      className="w-8 h-8 rounded-lg transition-all"
                      style={{
                        background: c,
                        transform: form.color === c ? 'scale(1.2)' : 'none',
                        outline: form.color === c ? `3px solid ${c}` : 'none',
                        outlineOffset: 2,
                        boxShadow: form.color === c ? `0 0 0 3px ${c}33` : 'none',
                      }} />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-3">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={{ background: '#F1F2F4', color: '#61677A' }}>
                  Bekor
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                  style={{ background: '#272829', color: '#fff' }}>
                  {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Grantni o'chirishni tasdiqlang"
        message="Bu grant butunlay o'chiriladi va uni qayta tiklash mumkin emas."
        confirmLabel="Ha, o'chirish"
      />
    </div>
  );
};

export default AdminScholarships;
