import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Plus, Trash2, Edit2, Eye, EyeOff, X, ChevronDown, Search } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import ConfirmModal from '../../components/ui/ConfirmModal';

const empty = { question: '', answer: '', order: 0 };

const AdminFAQ = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [searchQ, setSearchQ] = useState('');
  const [visFilter, setVisFilter] = useState('all');
  const [confirmId, setConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/faq');
      setItems(res.data.data || []);
    } catch { toast.error(t('admin.loadError')); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ question: item.question, answer: item.answer, order: item.order || 0 });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editing) {
        await api.put(`/admin/faq/${editing._id}`, form);
        toast.success(t('admin.updated'));
      } else {
        await api.post('/admin/faq', form);
        toast.success(t('admin.created'));
      }
      setShowModal(false);
      load();
    } catch { toast.error(t('admin.error')); }
    finally { setSaving(false); }
  };

  const toggleActive = async (item) => {
    try {
      await api.put(`/admin/faq/${item._id}`, { isActive: !item.isActive });
      setItems(prev => prev.map(i => i._id === item._id ? { ...i, isActive: !i.isActive } : i));
    } catch { toast.error(t('admin.error')); }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmId) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/admin/faq/${confirmId}`);
      toast.success(t('admin.deleted'));
      setItems(prev => prev.filter(i => i._id !== confirmId));
      setConfirmId(null);
    } catch { toast.error(t('admin.error')); }
    finally { setDeleteLoading(false); }
  };

  const filtered = items.filter(i => {
    const matchSearch = !searchQ || i.question?.toLowerCase().includes(searchQ.toLowerCase());
    const matchVis = visFilter === 'all' || (visFilter === 'active' ? i.isActive : !i.isActive);
    return matchSearch && matchVis;
  });

  const activeCount = items.filter(i => i.isActive).length;

  return (
    <div style={{ color: '#272829' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-mono font-bold">{t('adminFAQ.header')}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className="font-mono text-xs" style={{ color: '#61677A' }}>{items.length} {t('adminFAQ.questionsCount')}</p>
            {items.length > 0 && (
              <>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: '#F0FDF4', color: '#16A34A' }}>
                  {activeCount} {t('admin.statusActive')}
                </span>
                {items.length - activeCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: '#F1F2F4', color: '#61677A' }}>
                    {items.length - activeCount} {t('admin.statusHidden')}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs font-semibold"
          style={{ background: '#272829', color: '#fff' }}>
          <Plus size={14} /> {t('adminFAQ.addQuestion')}
        </button>
      </div>

      <div className="flex flex-wrap gap-3 items-center mb-4">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9CA3AF' }} />
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder={t('adminFAQ.searchPlaceholder')}
            className="pl-8 pr-3 py-2 rounded-xl text-sm outline-none"
            style={{ background: '#FFFFFF', border: '1px solid #E5E7EA', color: '#272829', width: 240 }}
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
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <HelpCircle size={40} style={{ color: '#9CA3AF', margin: '0 auto 12px' }} />
              <p className="font-mono text-sm" style={{ color: '#61677A' }}>
                {searchQ || visFilter !== 'all' ? t('adminFAQ.filterEmpty') : t('adminFAQ.empty')}
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
          {filtered.map((item, idx) => (
            <div key={item._id} className="rounded-xl overflow-hidden transition-opacity"
              style={{ background: '#FFFFFF', border: '1px solid #E5E7EA', opacity: item.isActive ? 1 : 0.5 }}>
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                onClick={() => setExpanded(expanded === item._id ? null : item._id)}
              >
                <span className="font-mono text-xs flex-shrink-0" style={{ color: '#9CA3AF' }}>#{idx + 1}</span>
                <p className="flex-1 font-mono text-sm font-medium" style={{ color: '#272829' }}>{item.question}</p>
                <div className="flex items-center gap-2">
                  {!item.isActive && (
                    <span className="px-1.5 py-0.5 rounded font-mono text-[9px]" style={{ background: '#F1F2F4', color: '#9CA3AF' }}>
                      {t('admin.statusHidden')}
                    </span>
                  )}
                  <button onClick={e => { e.stopPropagation(); openEdit(item); }}
                    className="p-1.5 rounded transition-colors" style={{ color: '#61677A' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#2563EB'}
                    onMouseLeave={e => e.currentTarget.style.color = '#61677A'}>
                    <Edit2 size={13} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); toggleActive(item); }}
                    className="p-1.5 rounded transition-colors"
                    style={{ color: item.isActive ? '#D97706' : '#16A34A' }}>
                    {item.isActive ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setConfirmId(item._id); }}
                    className="p-1.5 rounded transition-colors" style={{ color: '#DC2626' }}>
                    <Trash2 size={13} />
                  </button>
                  <ChevronDown size={14} style={{
                    color: '#61677A',
                    transform: expanded === item._id ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                  }} />
                </div>
              </div>
              {expanded === item._id && (
                <div className="px-4 pb-4 pt-1" style={{ borderTop: '1px solid #E5E7EA' }}>
                  <p className="font-mono text-sm leading-relaxed" style={{ color: '#61677A' }}>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-lg rounded-xl p-6" style={{ background: '#FFFFFF', border: '1px solid #D8D9DA' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono font-bold" style={{ color: '#272829' }}>{editing ? t('adminFAQ.modalEdit') : t('adminFAQ.modalAdd')}</h2>
              <button onClick={() => setShowModal(false)}><X size={16} style={{ color: '#61677A' }} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-mono text-xs mb-1" style={{ color: '#61677A' }}>{t('adminFAQ.form.question')}</label>
                <input required value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg font-mono text-sm outline-none"
                  style={{ background: '#FFFFFF', border: '1px solid #D8D9DA', color: '#272829' }}
                  placeholder={t('adminFAQ.form.questionPlaceholder')} />
              </div>
              <div>
                <label className="block font-mono text-xs mb-1" style={{ color: '#61677A' }}>{t('adminFAQ.form.answer')}</label>
                <textarea required value={form.answer} onChange={e => setForm(p => ({ ...p, answer: e.target.value }))}
                  rows={5} className="w-full px-3 py-2 rounded-lg font-mono text-sm outline-none resize-none"
                  style={{ background: '#FFFFFF', border: '1px solid #D8D9DA', color: '#272829' }}
                  placeholder={t('adminFAQ.form.answerPlaceholder')} />
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
        title={t('adminFAQ.confirmTitle')}
        message={t('adminFAQ.confirmMessage')}
        confirmLabel={t('admin.delete')}
        confirmStyle="danger"
      />
    </div>
  );
};

export default AdminFAQ;
