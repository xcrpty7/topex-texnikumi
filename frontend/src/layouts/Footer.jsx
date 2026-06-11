import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Play, Camera, Share2, Send } from 'lucide-react';
import api from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || '';

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
  const youtube   = settings?.youtube   || 'https://youtube.com';
  const instagram = settings?.instagram || 'https://instagram.com/topex_school';
  const facebook  = settings?.facebook  || 'https://facebook.com';
  const telegram  = settings?.telegram  || 'https://t.me/topex_school';

  const socials = [
    { Icon: Play,    href: youtube,   label: 'YouTube' },
    { Icon: Camera,  href: instagram, label: 'Instagram' },
    { Icon: Share2,  href: facebook,  label: 'Facebook' },
    { Icon: Send,    href: telegram,  label: 'Telegram' },
  ];

  const mapLinks = (arr, fallback) =>
    (Array.isArray(arr) && arr.length ? arr : fallback).map(x => ({
      to:    x.url   || x.to    || '/',
      label: x.label || '',
    }));

  const COL1 = mapLinks(settings?.footerColAboutLinks, [
    { url: '/',         label: t('footer.links.about') },
    { url: '/blog',     label: t('footer.links.news') },
    { url: '/courses',  label: t('footer.links.partners') },
    { url: '/courses',  label: t('footer.links.vacancies') },
    { url: '/gallery',  label: t('footer.links.team') },
    { url: '/blog',     label: t('footer.links.journals') },
  ]);
  const COL2 = mapLinks(settings?.footerColApplicantsLinks, [
    { url: '/courses',     label: t('footer.links.directions') },
    { url: '/#ariza',      label: t('footer.links.faq') },
    { url: '/blog',        label: t('footer.links.examResult') },
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
              <span className="text-white font-bold text-[16px] leading-none">Texnikumi</span>
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
                  className="w-10 h-10 bg-white/10 hover:bg-orange rounded-md flex items-center
                             justify-center text-white transition-all duration-200">
                  <Icon size={18} />
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
