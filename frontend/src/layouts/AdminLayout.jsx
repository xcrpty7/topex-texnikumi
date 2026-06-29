import { useState, useEffect, useMemo } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, Users, BookOpen, FileText,
  LogOut, ClipboardList, Menu, X,
  Image, Star, HelpCircle, Award, Settings, Play, Film, ExternalLink, Globe, UserCog,
} from 'lucide-react';
import { logout, selectUser } from '../features/auth/authSlice';
import { fetchDashboard } from '../features/admin/adminSlice';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

const AdminLayout = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const NAV = useMemo(() => [
    { section: t('adminLayout.section.home'), items: [
      { to: '/admin',              label: t('adminLayout.dashboard'),   icon: LayoutDashboard, end: true },
    ]},
    { section: t('adminLayout.section.data'), items: [
      { to: '/admin/users',        label: t('adminLayout.users'),       icon: Users },
      { to: '/admin/applications', label: t('adminLayout.applications'), icon: ClipboardList, badge: true },
    ]},
    { section: t('adminLayout.section.content'), items: [
      { to: '/admin/courses',      label: t('adminLayout.courses'),      icon: BookOpen },
      { to: '/admin/blog',         label: t('adminLayout.blog'),         icon: FileText },
      { to: '/admin/gallery',      label: t('adminLayout.gallery'),      icon: Image },
      { to: '/admin/testimonials', label: t('adminLayout.testimonials'), icon: Star },
      { to: '/admin/faq',          label: t('adminLayout.faq'),          icon: HelpCircle },
      { to: '/admin/scholarships', label: t('adminLayout.scholarships'), icon: Award },
      { to: '/admin/home-videos',  label: t('adminLayout.homeVideos'),   icon: Play },
      { to: '/admin/videos',       label: t('adminLayout.videos'),       icon: Film },
      { to: '/admin/teachers',     label: t('adminLayout.teachers'),     icon: Users },
      { to: '/admin/directions',   label: t('adminLayout.directions'),   icon: BookOpen },
    ]},
    { section: t('adminLayout.section.settings'), items: [
      { to: '/admin/site-editor',  label: t('adminLayout.siteEditor'),   icon: Globe },
      { to: '/admin/settings',     label: t('adminLayout.settings'),     icon: Settings },
      { to: '/profile',            label: t('adminMisc.profile'),        icon: UserCog },
    ]},
  ], [t, i18n.language]);
  const user = useSelector(selectUser);
  const { dashboard, applications } = useSelector((s) => s.admin);
  const [mobileOpen, setMobileOpen] = useState(false);
  const locale = i18n.language === 'en' ? 'en-US' : i18n.language === 'ru' ? 'ru-RU' : 'uz-UZ';
  const [time, setTime] = useState(() => new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }));
    }, 30000); // every 30s is enough for HH:MM format
    return () => clearInterval(id);
  }, []);

  // Fetch dashboard on mount if not yet loaded (for badge count)
  useEffect(() => {
    if (!dashboard) {
      dispatch(fetchDashboard());
    }
  }, [dispatch, dashboard]);

  // Derive new applications count from dashboard stats or local applications array
  const newAppsCount =
    dashboard?.stats?.newApplications ||
    applications?.filter((a) => a.status === 'yangi').length ||
    0;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="admin-theme min-h-screen flex" style={{ background: '#F1F2F4' }}>

      {/* ── Sidebar ── */}
      <aside
        className={`flex flex-col flex-shrink-0 fixed lg:sticky lg:top-0 z-40 h-screen transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          width: 240,
          background: '#272829',
          color: '#D8D9DA',
        }}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5 flex-shrink-0" style={{ borderBottom: '1px solid #3a3b3c' }}>
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-base flex-shrink-0 shadow-md"
              style={{ background: 'linear-gradient(135deg, #2949a8, #1d3a8a)', color: '#fff' }}>
              T
            </div>
            <div className="min-w-0">
              <p className="font-bold text-[15px] truncate" style={{ color: '#6f9aee' }}>TOPEX</p>
              <p className="text-[11px] truncate" style={{ color: '#9ca0ad' }}>{t('adminLayout.adminPanel')}</p>
            </div>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="p-1 rounded lg:hidden" style={{ color: '#D8D9DA' }}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-hide">
          {NAV.map((section, si) => (
            <div key={si} className="mb-5">
              <div className="px-3 pb-2 text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#7c8190' }}>
                {section.section}
              </div>
              {section.items.map(({ to, label, icon: Icon, end, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors mb-0.5"
                  style={({ isActive }) => ({
                    background: isActive ? '#D8D9DA' : 'transparent',
                    color: isActive ? '#272829' : '#D8D9DA',
                  })}
                >
                  <Icon size={16} />
                  <span className="flex-1">{label}</span>
                  {badge && newAppsCount > 0 && (
                    <span style={{
                      background: '#DC2626',
                      color: '#fff',
                      borderRadius: 999,
                      fontSize: 9,
                      padding: '1px 5px',
                      fontWeight: 700,
                      lineHeight: '14px',
                      display: 'inline-block',
                    }}>
                      {newAppsCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 flex-shrink-0" style={{ borderTop: '1px solid #3a3b3c' }}>
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg mb-2" style={{ background: '#1f2021' }}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{ background: '#D8D9DA', color: '#272829', fontSize: 15 }}
            >
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold truncate" style={{ color: '#fff' }}>{user?.name}</p>
              <p className="text-[10px] truncate" style={{ color: '#9ca0ad' }}>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[12px] font-medium transition-colors"
            style={{ color: '#D8D9DA' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#3a2a2a'; e.currentTarget.style.color = '#ff8b85'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#D8D9DA'; }}
          >
            <LogOut size={14} /> {t('adminLayout.logout')}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(39,40,41,0.5)' }}
        />
      )}

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* Topbar */}
        <header
          className="flex items-center justify-between px-4 sm:px-6 flex-shrink-0 sticky top-0 z-20"
          style={{ height: 60, background: '#FFFFFF', borderBottom: '1px solid #E5E7EA' }}
        >
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded lg:hidden" style={{ color: '#272829' }}>
            <Menu size={20} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            {/* Today's date + live clock */}
            <span className="hidden sm:flex items-center gap-2 text-[12px]" style={{ color: '#61677A' }}>
              {new Date().toLocaleDateString(i18n.language === 'en' ? 'en-US' : i18n.language === 'ru' ? 'ru-RU' : 'uz-UZ', { weekday: 'long', day: 'numeric', month: 'long' })}
              <span className="font-mono px-1.5 py-0.5 rounded text-[11px]"
                style={{ background: '#F1F2F4', color: '#272829' }}>
                {time}
              </span>
            </span>
            <LanguageSwitcher />
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
              style={{ color: '#61677A', border: '1px solid #D8D9DA', background: '#fff' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#272829'; e.currentTarget.style.borderColor = '#61677A'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#61677A'; e.currentTarget.style.borderColor = '#D8D9DA'; }}
            >
              <ExternalLink size={13} /> {t('adminLayout.viewSite')}
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8" style={{ background: '#F1F2F4' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
