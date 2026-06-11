import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import {
  Users, BookOpen, FileText, ClipboardList, TrendingUp,
  GraduationCap, Plus, PenLine, Inbox, Layout, RefreshCw,
} from 'lucide-react';
import { fetchDashboard } from '../../features/admin/adminSlice';
import { selectUser } from '../../features/auth/authSlice';
import { timeAgo } from '../../utils/timeAgo';

// ── Helpers ──────────────────────────────────────────────────────────────────

const getGreeting = () => {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return 'Xayrli ertalab';
  if (h >= 12 && h < 18) return 'Xayrli kun';
  return 'Xayrli kech';
};

// ── Sub-components ────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, accent = '#272829' }) => (
  <div className="rounded-xl p-5" style={{ background: '#FFFFFF', border: '1px solid #E5E7EA' }}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-[12px] font-medium" style={{ color: '#61677A' }}>{label}</span>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ background: `${accent}18` }}>
        <Icon size={18} style={{ color: accent }} />
      </div>
    </div>
    <p className="text-3xl font-bold" style={{ color: '#272829' }}>
      {value ?? <span style={{ color: '#9CA3AF' }}>—</span>}
    </p>
  </div>
);

const STATUS_BADGE = {
  'yangi':              { bg: '#EFF6FF', color: '#1E40AF', label: 'Yangi' },
  'qabul qilindi':      { bg: '#DCFCE7', color: '#166534', label: 'Qabul qilindi' },
  'rad etildi':         { bg: '#FEE2E2', color: '#991B1B', label: 'Rad etildi' },
  "ko'rib chiqilmoqda": { bg: '#FEF3C7', color: '#92400E', label: "Ko'rib chiqilmoqda" },
};

const QuickActions = () => (
  <div className="rounded-xl p-5" style={{ background: '#FFFFFF', border: '1px solid #E5E7EA' }}>
    <p className="text-sm font-semibold mb-4" style={{ color: '#272829' }}>Tezkor Harakatlar</p>
    <div className="flex flex-wrap gap-3">
      <Link to="/admin/courses"
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
        style={{ background: '#DCFCE7', color: '#166534' }}>
        <Plus size={15} />
        Yangi kurs
      </Link>
      <Link to="/admin/blog"
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
        style={{ background: '#EDE9FE', color: '#5B21B6' }}>
        <PenLine size={15} />
        Yangi maqola
      </Link>
      <Link to="/admin/applications"
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
        style={{ background: '#FEF3C7', color: '#92400E' }}>
        <Inbox size={15} />
        Arizalar
      </Link>
      <Link to="/admin/site-editor"
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
        style={{ background: '#272829', color: '#F1F2F4' }}>
        <Layout size={15} />
        Sayt muharriri
      </Link>
    </div>
  </div>
);

const ApplicationStatusBar = ({ stats }) => {
  const totalApps = stats.totalApplications ?? 0;
  if (totalApps === 0) return null;

  const statusData = (stats.applicationsByStatus || []).reduce((acc, s) => {
    acc[s._id] = s.count;
    return acc;
  }, {});

  const rows = [
    { key: 'yangi',              label: 'Yangi',             color: '#2563EB', count: statusData['yangi'] ?? stats.newApplications ?? 0 },
    { key: "ko'rib_chiqilmoqda", label: "Ko'rib chiqilmoqda", color: '#D97706', count: statusData["ko'rib_chiqilmoqda"] ?? 0 },
    { key: 'qabul_qilindi',      label: 'Qabul qilindi',     color: '#16A34A', count: statusData['qabul_qilindi'] ?? 0 },
    { key: 'rad_etildi',         label: 'Rad etildi',         color: '#DC2626', count: statusData['rad_etildi'] ?? 0 },
  ];

  return (
    <div className="rounded-xl p-5" style={{ background: '#FFFFFF', border: '1px solid #E5E7EA' }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold" style={{ color: '#272829' }}>Arizalar taqsimoti</p>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: '#F1F2F4', color: '#61677A' }}>
          Jami: {totalApps} ta
        </span>
      </div>
      <div className="space-y-3">
        {rows.map(({ key, label, color, count }) => {
          const pct = totalApps > 0 ? Math.round((count / totalApps) * 100) : 0;
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#61677A' }}>
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
                  {label}
                </span>
                <span className="text-xs font-bold" style={{ color }}>{count} ta ({pct}%)</span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ background: '#E5E7EA' }}>
                <div className="h-2 rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, loading } = useSelector((s) => s.admin);
  const currentUser = useSelector(selectUser);

  useEffect(() => { dispatch(fetchDashboard()); }, [dispatch]);

  const stats = dashboard?.stats || {};
  const recentUsers = dashboard?.recentUsers || [];
  const recentApplications = dashboard?.recentApplications || [];

  return (
    <>
      <Helmet><title>Dashboard – TOPEX Admin</title></Helmet>

      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#272829' }}>Dashboard</h1>
            <p className="text-sm" style={{ color: '#61677A' }}>Saytning umumiy ko'rinishi va statistika</p>
          </div>
          <button
            onClick={() => dispatch(fetchDashboard())}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-colors"
            style={{ background: '#FFFFFF', color: '#61677A', border: '1px solid #E5E7EA' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#F1F2F4')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
          >
            <RefreshCw size={12} /> Yangilash
          </button>
        </div>

        {/* Welcome banner */}
        <div
          className="rounded-xl px-5 py-4 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #272829 0%, #3a3b3c 100%)', color: '#fff' }}
        >
          <div>
            <p className="text-xs mb-1" style={{ color: '#9ca0ad' }}>
              {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h2 className="text-lg font-bold">
              {getGreeting()}, {currentUser?.name?.split(' ')[0] || 'Admin'}!
            </h2>
            <p className="text-xs mt-0.5" style={{ color: '#9ca0ad' }}>TOPEX admin paneliga xush kelibsiz</p>
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
          >
            {currentUser?.name?.[0]?.toUpperCase() || 'A'}
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* New applications alert */}
        {(stats.newApplications ?? 0) > 0 && (
          <Link
            to="/admin/applications"
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
            style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1E40AF' }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: '#DBEAFE' }}
            >
              <ClipboardList size={16} style={{ color: '#2563EB' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{stats.newApplications} ta yangi ariza kutilmoqda</p>
              <p className="text-xs" style={{ color: '#3B82F6' }}>Ko'rish va javob berish uchun bosing</p>
            </div>
            <span style={{ color: '#2563EB', fontSize: 20 }}>→</span>
          </Link>
        )}

        {/* Stats Grid — 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl p-5" style={{ background: '#FFFFFF', border: '1px solid #E5E7EA' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="admin-skeleton h-3 w-28 rounded" />
                  <div className="admin-skeleton w-9 h-9 rounded-lg" />
                </div>
                <div className="admin-skeleton h-8 w-16 rounded" />
              </div>
            ))
          ) : (
            <>
              <StatCard icon={Users}         label="Foydalanuvchilar"  value={stats.totalUsers}         accent="#2563EB" />
              <StatCard icon={BookOpen}      label="Faol kurslar"       value={stats.totalCourses}       accent="#16A34A" />
              <StatCard icon={FileText}      label="Maqolalar"          value={stats.totalArticles}      accent="#7C3AED" />
              <StatCard icon={ClipboardList} label="Yangi arizalar"     value={stats.newApplications}    accent="#D97706" />
              <StatCard icon={GraduationCap} label="Bugun arizalar"     value={stats.todayApplications}  accent="#DC2626" />
              <StatCard icon={TrendingUp}    label="Haftalik arizalar"  value={stats.weekApplications}   accent="#0891B2" />
            </>
          )}
        </div>

        {/* Application status breakdown */}
        {(stats.totalApplications ?? 0) > 0 && (
          <ApplicationStatusBar stats={stats} />
        )}

        {/* Recent tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          {/* Recent Users */}
          <div className="rounded-xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E5E7EA' }}>
            {loading ? (
              <div className="p-4 space-y-3">
                <div className="admin-skeleton h-4 w-40 rounded mb-4" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-1 py-1">
                    <div className="admin-skeleton w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="admin-skeleton h-3 w-32 rounded" />
                      <div className="admin-skeleton h-2.5 w-48 rounded" />
                    </div>
                    <div className="admin-skeleton h-3 w-16 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #F0F1F3' }}>
                  <div className="flex items-center gap-2">
                    <Users size={16} style={{ color: '#61677A' }} />
                    <span className="text-sm font-semibold" style={{ color: '#272829' }}>So'nggi foydalanuvchilar</span>
                  </div>
                  <Link to="/admin/users"
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors"
                    style={{ color: '#2563EB', background: '#EFF6FF' }}>
                    Barchasi
                  </Link>
                </div>
                <div className="p-2">
                  {recentUsers.length > 0 ? recentUsers.map((u) => (
                    <div key={u._id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#F8F9FA')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: '#272829', color: '#fff' }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: '#272829' }}>{u.name}</p>
                        <p className="text-[11px] truncate" style={{ color: '#61677A' }}>{u.email}</p>
                      </div>
                      <span className="text-[11px]" style={{ color: '#9CA3AF' }} title={new Date(u.createdAt).toLocaleDateString('uz-UZ')}>
                        {timeAgo(u.createdAt)}
                      </span>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#F1F2F4' }}>
                        <Users size={18} style={{ color: '#9CA3AF' }} />
                      </div>
                      <p className="text-sm font-medium" style={{ color: '#61677A' }}>Hozircha foydalanuvchi yo'q</p>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>Ro'yxatdan o'tgan foydalanuvchilar bu yerda ko'rinadi</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Recent Applications */}
          <div className="rounded-xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E5E7EA' }}>
            {loading ? (
              <div className="p-4 space-y-3">
                <div className="admin-skeleton h-4 w-36 rounded mb-4" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-1 py-1">
                    <div className="admin-skeleton w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="admin-skeleton h-3 w-28 rounded" />
                      <div className="admin-skeleton h-2.5 w-44 rounded" />
                    </div>
                    <div className="admin-skeleton h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #F0F1F3' }}>
              <div className="flex items-center gap-2">
                <ClipboardList size={16} style={{ color: '#61677A' }} />
                <span className="text-sm font-semibold" style={{ color: '#272829' }}>So'nggi arizalar</span>
              </div>
              <Link to="/admin/applications"
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors"
                style={{ color: '#D97706', background: '#FEF3C7' }}>
                Barchasi
              </Link>
            </div>
            <div className="p-2">
              {recentApplications.length > 0 ? recentApplications.map((app) => {
                const badge = STATUS_BADGE[app.status] || { bg: '#F1F2F4', color: '#61677A', label: app.status };
                return (
                  <div key={app._id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F8F9FA')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: '#61677A', color: '#fff' }}>
                      {app.fullName?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: '#272829' }}>{app.fullName}</p>
                      <p className="text-[11px]" style={{ color: '#61677A' }}>
                        {app.phone} · {app.grade}-sinf
                        {app.course?.title && <span style={{ color: '#9CA3AF' }}> · {app.course.title}</span>}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-full font-semibold flex-shrink-0"
                      style={{ background: badge.bg, color: badge.color }}>
                      {badge.label}
                    </span>
                  </div>
                );
              }) : (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#FEF3C7' }}>
                    <ClipboardList size={18} style={{ color: '#D97706' }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: '#61677A' }}>Hozircha ariza yo'q</p>
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>Yangi arizalar bu yerda ko'rinadi</p>
                </div>
              )}
            </div>
              </>
            )}
          </div>

        </div>

        {/* Content Health */}
        <div className="rounded-xl p-4" style={{ background: '#FFFFFF', border: '1px solid #E5E7EA' }}>
          <p className="text-xs font-semibold mb-3" style={{ color: '#61677A' }}>Kontent holati</p>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center p-3 rounded-xl">
                  <div className="admin-skeleton h-6 w-10 rounded mb-1" />
                  <div className="admin-skeleton h-3 w-14 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Galereya',   value: stats.totalGallery,      to: '/admin/gallery',      color: '#0891B2' },
                { label: 'Sharhlar',   value: stats.totalTestimonials,  to: '/admin/testimonials', color: '#7C3AED' },
                { label: 'FAQ',        value: stats.totalFAQs,          to: '/admin/faq',          color: '#16A34A' },
                { label: 'Grantlar',   value: stats.totalScholarships,  to: '/admin/scholarships', color: '#D97706' },
              ].map(({ label, value, to, color }) => (
                <Link key={to} to={to}
                  className="flex flex-col items-center p-3 rounded-xl transition-all hover:-translate-y-0.5"
                  style={{ background: `${color}0f`, border: `1px solid ${color}20` }}>
                  <span className="text-xl font-bold" style={{ color }}>{value ?? 0}</span>
                  <span className="text-[11px] font-medium mt-0.5" style={{ color: '#61677A' }}>{label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default AdminDashboard;
