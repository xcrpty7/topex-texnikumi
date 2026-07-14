import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, X, ZoomIn } from 'lucide-react';
import api from '../services/api';
import { fbTrackCustom } from '../utils/metaPixel';

const API_URL = import.meta.env.VITE_API_URL || '';

/* ─── Brand SVG icons ───────────────────────────────────────────── */
const YouTubeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
  </svg>
);
const InstagramIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
    <circle cx="12" cy="12" r="4.3" />
    <circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);
const FacebookIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.08 24 18.09 24 12.07Z" />
  </svg>
);
const TelegramIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.94 4.64 18.9 19.2c-.23 1.01-.83 1.26-1.68.79l-4.64-3.42-2.24 2.16c-.25.25-.46.46-.93.46l.33-4.72L18.6 6.2c.37-.33-.08-.51-.58-.18L6.9 13.13l-4.6-1.44c-1-.31-1.02-1 .21-1.48l17.97-6.93c.83-.31 1.56.2 1.46 1.36Z" />
  </svg>
);

/* ─── Lightbox ──────────────────────────────────────────────────── */
const Lightbox = ({ src, alt, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        onClick={onClose}
      >
        <X size={20} />
      </button>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api.get('/settings').then(r => { if (r.data.data) setSettings(r.data.data); }).catch(() => {});
  }, []);

  const resolveImg = (u) =>
    !u ? '/assets/logos/topex-logo.png'
       : (u.startsWith('http') || u.startsWith('/assets')) ? u
       : `${API_URL}${u}`;
  const logoSrc   = resolveImg(settings?.logo);
  const phone     = '+998 55 588 44 77';
  const phone2    = '+998 78 777 44 77';
  const email     = settings?.email     || 'info@topex.uz';
  const address1  = t('contact.addressValue') || settings?.address;
  const address2  = t('contact.addressValue2') || settings?.address2;
  const instagram = settings?.instagram || 'https://www.instagram.com/topex.uz/';
  const facebook  = settings?.facebook  || 'https://www.facebook.com/topex.uz';
  const telegram  = settings?.telegram  || 'https://t.me/topex_uz';
  const youtube   = settings?.youtube   || 'https://www.youtube.com/@topex.uz';

  const socials = [
    { Icon: TelegramIcon,  href: telegram,  label: 'Telegram' },
    { Icon: InstagramIcon, href: instagram, label: 'Instagram' },
    { Icon: YouTubeIcon,   href: youtube,   label: 'YouTube' },
    { Icon: FacebookIcon,  href: facebook,  label: 'Facebook' },
  ];

  const normalizeUrl = (url) => {
    if (!url) return '/';
    if (url.startsWith('http') || url.startsWith('#')) return url;
    return url.startsWith('/') ? url : '/' + url;
  };

  // Fix known wrong URL mappings from DB, keyed by label substring
  const LABEL_URL_FIX = [
    { match: 'vakansiy', url: '/vakansiyalar' },
    { match: 'imtihon',  url: '/imtihon-natijalari' },
    { match: 'aloqalar', url: '/aloqalar' },
    { match: 'contact',  url: '/aloqalar' },
    { match: 'narx',     url: '/narx' },
  ];

  // Translated label by URL (always takes priority over DB label)
  const urlLabel = (to) => ({
    '/':                    t('footer.links.about'),
    '/blog':                t('footer.links.news'),
    '/courses':             t('footer.links.directions'),
    '/vakansiyalar':        t('footer.links.vacancies'),
    '/gallery':             t('footer.links.team'),
    '/imtihon-natijalari':  t('footer.links.examResult'),
    '/profile':             t('footer.links.contract'),
    '/aloqalar':            t('nav.contacts'),
    '/narx':                t('footer.links.prices'),
  }[to]);

  const REMOVED = ['jurnal', 'savol'];
  const mapLinks = (arr, fallback) =>
    (Array.isArray(arr) && arr.length ? arr : fallback)
      .map(x => {
        let to = normalizeUrl(x.url || x.to);
        const raw = (x.label || '').toLowerCase();
        // Correct wrong URLs based on label
        for (const fix of LABEL_URL_FIX) {
          if (raw.includes(fix.match)) { to = fix.url; break; }
        }
        const label = urlLabel(to) || x.label || '';
        return { to, label };
      })
      .filter(l => !REMOVED.some(r => l.label.toLowerCase().includes(r)));

  const COL1 = mapLinks(settings?.footerColAboutLinks, [
    { url: '/',             label: t('footer.links.about') },
    { url: '/blog',         label: t('footer.links.news') },
    { url: '/vakansiyalar', label: t('footer.links.vacancies') },
    { url: '/gallery',      label: t('footer.links.team') },
  ]);

  const COL2 = mapLinks(settings?.footerColApplicantsLinks, [
    { url: '/courses',      label: t('footer.links.directions') },
    { url: '/vakansiyalar', label: t('footer.links.vacancies') },
    { url: '/imtihon-natijalari', label: t('footer.links.examResult') },
    { url: '/narx', label: t('footer.links.prices') },
  ]);
  if (!COL2.some(l => l.to === '/imtihon-natijalari' || l.label.toLowerCase().includes('imtihon'))) {
    COL2.push({ to: '/imtihon-natijalari', label: t('footer.links.examResult') });
  } else {
    COL2.forEach(l => {
      if (l.label.toLowerCase().includes('imtihon')) l.to = '/imtihon-natijalari';
    });
  }

  const COL3 = mapLinks(settings?.footerColStudentsLinks, [
    { url: '/profile', label: t('footer.links.contract') },
    { url: '/gallery', label: t('footer.links.studentLife') },
  ]);

  const LICENSE_IMGS = [
    { src: '/assets/license/license-main.webp',       label: `${t('footer.license')} № 420567` },
    { src: '/assets/license/license-directions.webp', label: t('footer.links.directions') },
  ];

  return (
    <>
      {lightbox && (
        <Lightbox src={lightbox.src} alt={lightbox.label} onClose={() => setLightbox(null)} />
      )}

      <footer className="relative bg-brand-deep text-white overflow-hidden">
        {/* Wavy background lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none"
          viewBox="0 0 1500 600"
          preserveAspectRatio="none"
          fill="none">
          {[...Array(14)].map((_, i) => (
            <path
              key={i}
              d={`M -100 ${80 + i * 35} Q 400 ${10 + i * 35}, 800 ${100 + i * 35} T 1700 ${60 + i * 35}`}
              stroke="white"
              strokeWidth="1"
              fill="none"
            />
          ))}
        </svg>

        <div className="relative w-full max-w-[1500px] mx-auto px-6 lg:px-16 pt-20 pb-10">
          {/* ── Main columns ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

            {/* Brand column */}
            <div className="lg:col-span-1">
              <Link to="/" className="inline-flex items-center gap-3 mb-6">
                <img
                  src={logoSrc}
                  alt="Topex"
                  loading="lazy"
                  className="h-12 w-auto object-contain brightness-0 invert"
                />
              </Link>
              <div className="flex gap-2.5 mb-5">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => fbTrackCustom('ContactClick', { channel: label.toLowerCase() })}
                    className="w-10 h-10 bg-white/10 hover:bg-orange rounded-lg flex items-center
                               justify-center text-white transition-all duration-200 hover:-translate-y-0.5">
                    <Icon size={20} />
                  </a>
                ))}
              </div>
              {/* License thumbnails */}
              <div className="flex gap-2">
                {LICENSE_IMGS.map(({ src, label }) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setLightbox({ src, label })}
                    className="group relative flex-shrink-0 w-[84px] h-[116px] rounded-md overflow-hidden
                               border border-white/20 hover:border-orange/70 transition-all duration-200
                               hover:shadow-lg hover:shadow-orange/20 hover:-translate-y-0.5"
                    title={label}
                  >
                    <img
                      src={src}
                      alt={label}
                      loading="lazy"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                      <ZoomIn size={14} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <FooterCol title={t('footer.colAbout')}      links={COL1} />
            <FooterCol title={t('footer.colApplicants')} links={COL2} />
            <FooterCol title={t('footer.colStudents')}   links={COL3} />

            {/* Column 4: Aloqalar */}
            <div>
              <h4 className="text-white font-bold text-[18px] mb-6">{t('footer.colContacts')}</h4>
              <ul className="space-y-5">
                <li>
                  <a href={`tel:${phone.replace(/\s/g,'')}`}
                     onClick={() => fbTrackCustom('ContactClick', { channel: 'phone' })}
                     className="flex items-start gap-3 text-white/85 hover:text-orange transition-colors">
                    <Phone size={16} className="text-orange mt-0.5 flex-shrink-0" />
                    <span className="text-[14px]">{phone}</span>
                  </a>
                  <a href={`tel:${phone2.replace(/\s/g,'')}`}
                     onClick={() => fbTrackCustom('ContactClick', { channel: 'phone' })}
                     className="flex items-start gap-3 text-white/85 hover:text-orange transition-colors mt-1.5">
                    <Phone size={16} className="text-orange mt-0.5 flex-shrink-0" />
                    <span className="text-[14px]">{phone2}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${email}`}
                     className="flex items-start gap-3 text-white/85 hover:text-orange transition-colors">
                    <Mail size={16} className="text-orange mt-0.5 flex-shrink-0" />
                    <span className="text-[14px]">{email}</span>
                  </a>
                </li>
                <li className="flex items-start gap-3 text-white/85">
                  <MapPin size={16} className="text-orange mt-0.5 flex-shrink-0" />
                  <span className="text-[14px] leading-relaxed">{address1}</span>
                </li>
                {address2 && (
                  <li className="flex items-start gap-3 text-white/85">
                    <MapPin size={16} className="text-orange mt-0.5 flex-shrink-0" />
                    <span className="text-[14px] leading-relaxed">{address2}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* ── Copyright ── */}
          <div className="mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/60 text-[13px]">
              {t('footer.copyright')} {year}
            </p>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-white/60 hover:text-orange text-[13px] underline-offset-2 hover:underline transition-colors">
              {t('footer.oferta')}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

const FooterCol = ({ title, links }) => (
  <div>
    <h4 className="text-white font-bold text-[18px] mb-6">{title}</h4>
    <ul className="space-y-3.5">
      {links.map(({ to, label }, i) => (
        <li key={i}>
          <Link
            to={to}
            className="text-white/85 hover:text-orange text-[14px] transition-colors inline-block">
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
