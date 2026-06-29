import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin } from 'lucide-react';
import api from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || '';

/* ─── Brand SVG icons (lucide v1 brand ikonkalarini bermaydi) ───────── */
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

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/settings').then(r => { if (r.data.data) setSettings(r.data.data); }).catch(() => {});
  }, []);

  const resolveImg = (u) =>
    !u ? '/assets/logos/topex-logo.png'
       : (u.startsWith('http') || u.startsWith('/assets')) ? u
       : `${API_URL}${u}`;
  const logoSrc   = resolveImg(settings?.logo);
  const phone     = settings?.phone     || '+998 78 777 44 77';
  const email     = settings?.email     || 'info@topex.uz';
  const address1  = settings?.address   || t('contact.addressValue');
  const address2  = settings?.address2  || t('contact.addressValue2');
  const instagram = settings?.instagram || 'https://www.instagram.com/topex.uz/';
  const facebook  = settings?.facebook  || 'https://www.facebook.com/topex.uz';
  const telegram  = settings?.telegram  || 'https://t.me/topex_uz';
  const youtube   = settings?.youtube   || 'https://www.youtube.com/@topex.uz';

  // Faqat sozlamada (admin) qiymat bo'lsa ko'rsatamiz — bo'sh havolalar chiqmasin
  const socials = [
    { Icon: TelegramIcon,  href: telegram,  label: 'Telegram' },
    { Icon: InstagramIcon, href: instagram, label: 'Instagram' },
    { Icon: YouTubeIcon,   href: youtube,   label: 'YouTube' },
    { Icon: FacebookIcon,  href: facebook,  label: 'Facebook' },
  ];

  // Keraksiz bo'limlarni (admin/DB'dan kelsa ham) butunlay olib tashlaymiz
  const REMOVED = ['jurnal', 'savol', 'galer'];
  const mapLinks = (arr, fallback) =>
    (Array.isArray(arr) && arr.length ? arr : fallback)
      .map(x => ({ to: x.url || x.to || '/', label: x.label || '' }))
      .filter(l => !REMOVED.some(r => l.label.toLowerCase().includes(r)));

  const COL1 = mapLinks(settings?.footerColAboutLinks, [
    { url: '/',         label: t('footer.links.about') },
    { url: '/blog',     label: t('footer.links.news') },
    { url: '/courses',  label: t('footer.links.partners') },
    { url: '/gallery',  label: t('footer.links.team') },
  ]);
  const COL2 = mapLinks(settings?.footerColApplicantsLinks, [
    { url: '/courses',           label: t('footer.links.directions') },
    { url: '/imtihon-natijalari', label: t('footer.links.examResult') },
    { url: '/vakansiyalar',       label: t('footer.links.vacancies') },
  ]);
  const COL3 = mapLinks(settings?.footerColStudentsLinks, [
    { url: '/profile',     label: t('footer.links.contract') },
    { url: '/gallery',     label: t('footer.links.studentLife') },
  ]);

  return (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <img
                src={logoSrc}
                alt="Topex"
                className="h-12 w-auto object-contain brightness-0 invert"
              />
              
            </Link>

            {/* Socials */}
            <div className="flex gap-2.5">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-orange rounded-lg flex items-center
                             justify-center text-white transition-all duration-200 hover:-translate-y-0.5">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title={settings?.footerColAboutTitle      || t('footer.colAbout')}      links={COL1} />
          <FooterCol title={settings?.footerColApplicantsTitle || t('footer.colApplicants')} links={COL2} />
          <FooterCol title={settings?.footerColStudentsTitle   || t('footer.colStudents')}   links={COL3} />

          {/* Column 4: Aloqalar */}
          <div>
            <h4 className="text-white font-bold text-[18px] mb-6">{settings?.footerColContactsTitle || t('footer.colContacts')}</h4>
            <ul className="space-y-5">
              <li>
                <a href={`tel:${phone.replace(/\s/g,'')}`}
                   className="flex items-start gap-3 text-white/85 hover:text-orange transition-colors">
                  <Phone size={16} className="text-orange mt-0.5 flex-shrink-0" />
                  <span className="text-[14px]">{phone}</span>
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

        {/* Bottom divider + copyright */}
        <div className="mt-16 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/60 text-[13px]">
            {settings?.footerCopyText || t('footer.copyright')} {year}
          </p>
          <a href="#" className="text-white/60 hover:text-orange text-[13px] underline-offset-2 hover:underline transition-colors">
            {settings?.footerOfertaText || t('footer.oferta')}
          </a>
        </div>
      </div>
    </footer>
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
