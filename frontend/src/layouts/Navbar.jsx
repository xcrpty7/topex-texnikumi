import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, User, LogOut, Shield, Phone, MapPin, Mail, ChevronDown } from 'lucide-react';
import { logout, selectUser, selectIsAuthenticated } from '../features/auth/authSlice';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import api from '../services/api';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const user        = useSelector(selectUser);
  const isAuth      = useSelector(selectIsAuthenticated);
  const [open,   setOpen]   = useState(false);
  const [uMenu,  setUMenu]  = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    api.get('/settings').then(r => { if (r.data.data) setSiteSettings(r.data.data); }).catch(() => {});
  }, []);

  const resolveImg = (u) =>
    !u ? '/assets/logos/topex-logo.png'
       : (u.startsWith('http') || u.startsWith('/assets')) ? u
       : `${import.meta.env.VITE_API_URL || ''}${u}`;
  const logoSrc    = resolveImg(siteSettings?.logo);
  const navPhone   = siteSettings?.phone   || '+998 55 588 44 77';
  const navAddress = t('contact.addressValue') || siteSettings?.address;
  const navEmail   = siteSettings?.email   || 'info@topex.uz';

  const handleLogout = () => {
    dispatch(logout()); navigate('/');
    setUMenu(false); setOpen(false);
  };

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const links = [
    { to: '/',         label: t('nav.about') },
    { to: '/courses',  label: t('nav.courses') },
    { to: '/blog',     label: t('nav.blog') },
    { to: '/videos',   label: t('nav.videos') },
    { to: '/aloqalar', label: t('nav.contacts') },
  ];

  return (
    <header className="bg-white w-full border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
      {/* ═══ ROW 1: LOGO + CONTACTS ═══ */}
      <div className="border-b border-gray-100">
        <div className="w-full px-6 lg:px-12 py-5">
          <div className="flex items-center justify-between gap-8">

            {/* Logo — brendli ko'k rang (CSS mask orqali, shakl saqlanadi) */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0" aria-label="Topex">
              <span
                className="block h-14 lg:h-16"
                style={{
                  width: '16rem',
                  maxWidth: '55vw',
                  backgroundColor: '#1d3a8a',
                  WebkitMaskImage: `url(${logoSrc})`,
                  maskImage: `url(${logoSrc})`,
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskPosition: 'left center',
                  maskPosition: 'left center',
                }}
              />
            </Link>

            {/* Contacts */}
            <div className="hidden lg:flex items-center gap-8">
              <button onClick={() => navigate('/aloqalar#map-section')}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left">
                <div className="w-10 h-10 rounded-full bg-orange-faint flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-orange" />
                </div>
                <div className="leading-tight">
                  <div className="text-brand font-bold text-[14px]">{t('contact.address')}</div>
                  <div className="text-gray-500 text-[12px] mt-0.5">{navAddress.split('\n')[0]}</div>
                </div>
              </button>
              <div className="w-px h-12 bg-gray-200" />
              <ContactItem icon={<Phone size={18} className="text-orange" />} title={t('contact.phone')} lines={[navPhone]} href={`tel:${navPhone.replace(/\s/g,'')}`} />
              <div className="w-px h-12 bg-gray-200" />
              <ContactItem icon={<Mail size={18} className="text-orange" />} title={t('contact.email')} lines={[navEmail]} href={`mailto:${navEmail}`} />
            </div>

            {/* Burger (mobile) */}
            <button className="lg:hidden p-2 rounded-lg text-brand hover:bg-gray-50"
              onClick={() => setOpen(v => !v)}>
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ ROW 2: NAV + ACTIONS ═══ */}
      <nav className="border-b border-gray-100 hidden lg:block">
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-[58px]">

            {/* Links */}
            <div className="flex items-center gap-1">
              {links.map(({ to, label }) => (
                <NavLink key={to} to={to} end={to === '/'}
                  className={({ isActive }) =>
                    `relative px-4 py-2 font-semibold text-[14px] transition-colors flex items-center gap-1 group ${
                      isActive ? 'text-brand' : 'text-gray-700 hover:text-brand'
                    }`
                  }>
                  {({ isActive }) => (
                    <>
                      {label}
                      <ChevronDown size={13} className="text-gray-400 group-hover:text-brand transition-colors" />
                      <span className={`absolute -bottom-0.5 left-4 right-4 h-[2px] bg-orange transition-transform origin-left ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`} />
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Lang */}
              <LanguageSwitcher />

              {isAuth ? (
                <div className="relative">
                  <button onClick={() => setUMenu(v => !v)}
                    className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 hover:border-orange/40 transition-all">
                    <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                      {user?.avatar
                        ? <img src={user.avatar} alt={user?.name || "User avatar"} className="w-full h-full object-cover" />
                        : user?.name?.[0]}
                    </div>
                    <span className="text-brand text-sm font-semibold max-w-[90px] truncate">{user?.name}</span>
                    <ChevronDown size={12} className="text-gray-400" />
                  </button>
                  <AnimatePresence>
                    {uMenu && (
                      <motion.div
                        initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:6 }}
                        transition={{ duration:0.15 }}
                        className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 overflow-hidden z-50">
                        <Link to="/profile" onClick={() => setUMenu(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-orange hover:bg-gray-50 text-sm transition-colors">
                          <User size={14} /> {t('nav.profile')}
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setUMenu(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-orange hover:bg-gray-50 text-sm transition-colors">
                            <Shield size={14} /> {t('nav.admin')}
                          </Link>
                        )}
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-red-500 hover:bg-red-50 text-sm transition-colors">
                            <LogOut size={14} /> {t('nav.logout')}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link to="/register"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border-2 border-brand text-brand font-semibold text-[13px] hover:bg-brand hover:text-white transition-all">
                    {t('nav.register')}
                  </Link>
                  <Link to="/login"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border-2 border-gray-200 text-brand font-semibold text-[13px] hover:border-brand transition-all">
                    {t('nav.login')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
            transition={{ duration:0.22 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-y-auto max-h-[80vh]">
            <div className="w-full px-6 py-4 space-y-1">
              {links.map(({ to, label }) => (
                <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive ? 'text-orange bg-orange-faint' : 'text-brand hover:text-orange hover:bg-gray-50'
                    }`
                  }>
                  {label}
                </NavLink>
              ))}
              <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
                <a href={`tel:${navPhone.replace(/\s/g,'')}`} className="flex items-center gap-2 px-4 py-2 text-gray-600 text-sm">
                  <Phone size={14} className="text-orange" /> {navPhone}
                </a>
                <a href={`mailto:${navEmail}`} className="flex items-center gap-2 px-4 py-2 text-gray-600 text-sm">
                  <Mail size={14} className="text-orange" /> {navEmail}
                </a>
                <div className="flex items-center gap-2 px-4 py-2 text-gray-600 text-sm">
                  <MapPin size={14} className="text-orange" /> {navAddress.replace('\n', ' ')}
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-3">
                {isAuth ? (
                  <>
                    <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-brand rounded-xl hover:bg-gray-50 text-sm">
                      <User size={14} /> {t('nav.profile')}
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-brand rounded-xl hover:bg-gray-50 text-sm">
                        <Shield size={14} /> {t('nav.admin')}
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl text-sm">
                      <LogOut size={14} /> {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 px-1">
                    <Link to="/register" onClick={() => setOpen(false)}
                      className="flex-1 text-center py-2.5 rounded-lg border-2 border-brand text-brand font-semibold text-sm">
                      {t('nav.register')}
                    </Link>
                    <Link to="/login" onClick={() => setOpen(false)}
                      className="flex-1 text-center py-2.5 rounded-lg border-2 border-gray-200 text-brand font-semibold text-sm">
                      {t('nav.login')}
                    </Link>
                  </div>
                )}
              </div>
              <div className="px-4 pt-3">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const ContactItem = ({ icon, title, lines, href }) => {
  const Content = (
    <>
      <div className="w-10 h-10 rounded-full bg-orange-faint flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="leading-tight">
        <div className="text-brand font-bold text-[14px]">{title}</div>
        {lines.map((line, i) => (
          <div key={i} className="text-gray-500 text-[12px] mt-0.5">{line}</div>
        ))}
      </div>
    </>
  );
  return href ? (
    <a href={href} className="flex items-center gap-3 hover:opacity-80 transition-opacity">{Content}</a>
  ) : (
    <div className="flex items-center gap-3">{Content}</div>
  );
};

export default Navbar;
