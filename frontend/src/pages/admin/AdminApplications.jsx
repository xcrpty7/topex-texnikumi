import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { ClipboardList, Phone, User, BookOpen, ChevronDown, Trash2, RefreshCw, MessageSquare, Search } from 'lucide-react';
import { fetchAdminApplications } from '../../features/admin/adminSlice';
import api from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { toast } from 'react-toastify';
import { timeAgo } from '../../utils/timeAgo';

const STATUS_CONFIG = {
  yangi:              { label: 'yangi',              color: '#2563EB', bg: '#EFF6FF' },
  ko_rib_chiqilmoqda: { label: "ko'rib chiqilmoqda", color: '#D97706', bg: '#FEF3C7' },
  qabul_qilindi:      { label: 'qabul qilindi',      color: '#16A34A', bg: '#F0FDF4' },
  rad_etildi:         { label: 'rad etildi',          color: '#DC2626', bg: '#FEF2F2' },
};

const normalize = (s) => s?.replace(/'/g, '_').replace(/\s/g, '_') || s;

const StatusBadge = ({ status }) => {
  const key = normalize(status) || status;
  const cfg = STATUS_CONFIG[key] || STATUS_CONFIG[status] || { label: status, color: '#61677A', bg: '#E5E7EA' };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[10px] font-medium"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}
    >
      {cfg.label}
    </span>
  );
};

const STATUSES = [
  { value: '', label: '── barchasi' },
  { value: 'yangi', label: 'yangi' },
  { value: "ko'rib_chiqilmoqda", label: "ko'rib chiqilmoqda" },
  { value: 'qabul_qilindi', label: 'qabul qilindi' },
  { value: 'rad_etildi', label: 'rad etildi' },
];

const AdminApplications = () => {
  const dispatch = useDispatch();
  const { applications, applicationsLoading, applicationsMeta } = useSelector((s) => s.admin);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterGrade, setFilterGrade]   = useState('');
  const [search, setSearch]             = useState('');
  const [selected, setSelected]         = useState(null);
  const [modal, setModal]               = useState(false);
  const [newStatus, setNewStatus]       = useState('');
  const [note, setNote]                 = useState('');
  const [saving, setSaving]             = useState(false);
  const [confirmId, setConfirmId]       = useState(null);
  const [deleting, setDeleting]         = useState(false);

  const load = (page) => {
    const params = {};
    if (filterStatus)  params.status = filterStatus;
    if (filterGrade)   params.grade  = filterGrade;
    if (search.trim()) params.search = search.trim();
    if (page)          params.page   = page;
    dispatch(fetchAdminApplications(params));
  };

  useEffect(() => { load(); }, [filterStatus, filterGrade]);

  const openDetail = (app) => {
    setSelected(app);
    setNewStatus(app.status);
    setNote(app.note || '');
    setModal(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/admin/applications/${selected._id}`, { status: newStatus, note });
      toast.success('Ariza holati yangilandi');
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xatolik');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/admin/applications/${confirmId}`);
      toast.success("Ariza o'chirildi");
      setConfirmId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xatolik');
    } finally {
      setDeleting(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Ism Familiya', 'Telefon', 'Sinf', 'Kurs', 'Holat', 'Sana', 'Izoh'];
    const rows = filtered.map(app => [
      app.fullName || '',
      app.phone || '',
      `${app.grade}-sinf`,
      app.course?.title || '',
      app.status || '',
      new Date(app.createdAt).toLocaleDateString('uz-UZ'),
      app.note || '',
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arizalar_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const list = applications || [];

  const todayCount = list.filter(app => {
    const d = new Date(app.createdAt);
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const filtered = list;

  const statusCounts = {
    yangi:    list.filter(a => a.status === 'yangi').length,
    reviewing: list.filter(a => a.status?.includes('chiqilmoqda')).length,
    accepted:  list.filter(a => a.status?.includes('qabul')).length,
    rejected:  list.filter(a => a.status?.includes('rad')).length,
  };

  return (
    <>
      <Helmet><title>Arizalar – TOPEX Admin</title></Helmet>

      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px]" style={{ color: '#61677A' }}>~/admin/</span>
              <span className="font-mono text-sm font-semibold" style={{ color: '#16A34A' }}>applications</span>
              {todayCount > 0 && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-semibold font-mono"
                  style={{ background: '#DCFCE7', color: '#16A34A' }}
                >
                  Bugun: +{todayCount}
                </span>
              )}
            </div>
            <p className="text-xs font-mono" style={{ color: '#61677A' }}>
              {list.length} ta ariza ({filtered.length} ko'rsatilmoqda)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs transition-colors"
              style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#DCFCE7')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#F0FDF4')}
            >
              ↓ CSV export
            </button>
            <button
              onClick={load}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs transition-colors"
              style={{ background: '#FFFFFF', color: '#61677A', border: '1px solid #E5E7EA' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#272829')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#61677A')}
            >
              <RefreshCw size={12} />
              yangilash
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px]" style={{ color: '#61677A' }}>status:</span>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field pr-7 pl-2 py-1 font-mono text-[11px] appearance-none"
                style={{ minWidth: 160 }}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#61677A' }} />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px]" style={{ color: '#61677A' }}>sinf:</span>
            <div className="relative">
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="input-field pr-7 pl-2 py-1 font-mono text-[11px] appearance-none"
                style={{ minWidth: 100 }}
              >
                <option value="">── barchasi</option>
                <option value="10">10-sinf</option>
                <option value="11">11-sinf</option>
              </select>
              <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#61677A' }} />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px]" style={{ color: '#61677A' }}>qidirish:</span>
            <form onSubmit={(e) => { e.preventDefault(); load(); }} className="flex gap-1">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ism yoki telefon..."
                className="input-field font-mono text-[11px] py-1 px-2"
                style={{ minWidth: 180 }}
              />
              <button type="submit"
                className="px-2.5 py-1 rounded font-mono text-[10px] transition-colors"
                style={{ background: '#272829', color: '#fff' }}>
                <Search size={11} />
              </button>
            </form>
          </div>
        </div>

        {/* Status summary pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px]" style={{ color: '#61677A' }}>Holat bo'yicha:</span>
          {[
            { label: 'Yangi', count: statusCounts.yangi, color: '#2563EB', bg: '#EFF6FF' },
            { label: "Ko'rilmoqda", count: statusCounts.reviewing, color: '#D97706', bg: '#FEF3C7' },
            { label: 'Qabul', count: statusCounts.accepted, color: '#16A34A', bg: '#F0FDF4' },
            { label: 'Rad', count: statusCounts.rejected, color: '#DC2626', bg: '#FEF2F2' },
          ].map(({ label, count, color, bg }) => (
            <span key={label} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold"
              style={{ background: bg, color }}>
              {label}: {count}
            </span>
          ))}
        </div>

        {/* Table */}
        {applicationsLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-xl"
            style={{ background: '#FFFFFF', border: '1px solid #E5E7EA' }}
          >
            <ClipboardList size={32} style={{ color: '#9CA3AF' }} className="mb-3" />
            <p className="font-mono text-sm" style={{ color: '#61677A' }}>arizalar topilmadi</p>
          </div>
        ) : (
          <>
          <div className="glass-card overflow-x-auto">
            <table className="tm-table">
              <thead>
                <tr>
                  <th>ism / telefon</th>
                  <th>sinf</th>
                  <th>kurs</th>
                  <th>holat</th>
                  <th>sana</th>
                  <th>amal</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold"
                          style={{ background: '#DCFCE7', color: '#16A34A' }}
                        >
                          {app.fullName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-[13px]" style={{ color: '#272829' }}>{app.fullName}</p>
                          <p className="font-mono text-[10px] flex items-center gap-1" style={{ color: '#61677A' }}>
                            <Phone size={9} />{app.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="muted font-mono text-[11px]">{app.grade}-sinf</td>
                    <td className="muted text-[12px]">{app.course?.title || '—'}</td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="muted font-mono text-[10px]">
                      <span title={new Date(app.createdAt).toLocaleDateString('uz-UZ')}>
                        {timeAgo(app.createdAt)}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openDetail(app)}
                          className="p-1.5 rounded transition-colors font-mono text-[10px] flex items-center gap-1"
                          style={{ color: '#2563EB', background: 'rgba(88,166,255,0.08)', border: '1px solid rgba(88,166,255,0.2)' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(88,166,255,0.15)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(88,166,255,0.08)')}
                        >
                          <MessageSquare size={11} />
                          ko'rish
                        </button>
                        <button
                          onClick={() => handleDelete(app._id)}
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

          {applicationsMeta && applicationsMeta.pages > 1 && (
            <div className="flex items-center justify-between pt-3">
              <span className="text-xs font-mono" style={{ color: '#61677A' }}>
                {applicationsMeta.page}/{applicationsMeta.pages} sahifa · {applicationsMeta.total} ta
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => load(applicationsMeta.page - 1)}
                  disabled={applicationsMeta.page <= 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono transition-colors disabled:opacity-40"
                  style={{ background: '#FFFFFF', border: '1px solid #E5E7EA', color: '#272829' }}
                >
                  ← Oldingi
                </button>
                <button
                  onClick={() => load(applicationsMeta.page + 1)}
                  disabled={applicationsMeta.page >= applicationsMeta.pages}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono transition-colors disabled:opacity-40"
                  style={{ background: '#FFFFFF', border: '1px solid #E5E7EA', color: '#272829' }}
                >
                  Keyingi →
                </button>
              </div>
            </div>
          )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title="Ariza tafsiloti" size="md">
        {selected && (
          <div className="space-y-5">
            {/* Info grid */}
            <div
              className="rounded-lg p-4 space-y-3"
              style={{ background: '#FFFFFF', border: '1px solid #E5E7EA' }}
            >
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>To'liq ism</p>
                  <p className="font-medium flex items-center gap-1.5" style={{ color: '#272829' }}>
                    <User size={12} style={{ color: '#61677A' }} />
                    {selected.fullName}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>Telefon</p>
                  <p className="font-mono text-[12px] flex items-center gap-1.5" style={{ color: '#272829' }}>
                    <Phone size={12} style={{ color: '#61677A' }} />
                    {selected.phone}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>Sinf</p>
                  <p style={{ color: '#D97706' }} className="font-mono text-sm">{selected.grade}-sinf</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>Kurs</p>
                  <p className="flex items-center gap-1.5 text-sm" style={{ color: '#272829' }}>
                    <BookOpen size={12} style={{ color: '#61677A' }} />
                    {selected.course?.title || '—'}
                  </p>
                </div>
              </div>
              {selected.message && (
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>Xabar</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#61677A' }}>{selected.message}</p>
                </div>
              )}
            </div>

            {/* Update form */}
            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: '#61677A' }}>
                  Holat o'zgartirish
                </label>
                <div className="relative">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="input-field font-mono text-[12px] appearance-none pr-8"
                  >
                    <option value="yangi">yangi</option>
                    <option value="ko'rib_chiqilmoqda">ko'rib chiqilmoqda</option>
                    <option value="qabul_qilindi">qabul qilindi</option>
                    <option value="rad_etildi">rad etildi</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#61677A' }} />
                </div>
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: '#61677A' }}>
                  Izoh (ixtiyoriy)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Ariza haqida izoh..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" type="button" onClick={() => setModal(false)}>Bekor</Button>
                <Button type="submit" loading={saving}>Saqlash</Button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Arizani o'chirishni tasdiqlang"
        message="Bu ariza tizimdan butunlay o'chiriladi va tiklab bo'lmaydi."
        confirmLabel="Ha, o'chirish"
      />
    </>
  );
};

export default AdminApplications;
