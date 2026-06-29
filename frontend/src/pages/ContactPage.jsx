import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, ChevronRight, Home } from 'lucide-react';
import api from '../services/api';
import PhoneInput from '../components/ui/PhoneInput';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || '';

const up = (delay = 0) => ({
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.5, ease: 'easeOut', delay },
});

const ContactPage = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', grade: '9' });
  const [activeTab, setActiveTab] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/settings').then(r => { if (r.data.data) setSettings(r.data.data); }).catch(() => {});
  }, []);

  const phone   = settings?.phone   || '+998 78 777 44 77';
  const phone2  = settings?.phone2  || '';
  const email   = settings?.email   || 'info@topex.uz';
  const address = settings?.address || t('contact.addressValue');
  const hours   = settings?.workingHours || t('contactPage.workingHours');
  const mapSrc  = settings?.mapLink
    || `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  const mapQueryUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const scrollToMap = (e) => {
    e.preventDefault();
    const target = document.getElementById('map-section');
    if (!target) return;

    const startY = window.scrollY;
    const offset = 90; // header balandligi uchun
    const endY = target.getBoundingClientRect().top + startY - offset;
    const distance = endY - startY;
    const duration = 850;
    let startTime = null;

    // easeInOutCubic — yumshoq boshlanish va tugash
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const step = (now) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * ease(progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const cards = [
    { Icon: MapPin, title: t('contactPage.cardAddress'), lines: [address], href: '#map-section', onClick: scrollToMap },
    { Icon: Phone,  title: t('contactPage.cardPhone'),  lines: [phone, phone2].filter(Boolean), href: `tel:${phone.replace(/\s/g, '')}` },
    { Icon: Mail,   title: t('contactPage.cardEmail'),   lines: [email], href: `mailto:${email}` },
    { Icon: Clock,  title: t('contactPage.cardHours'), lines: [hours], href: '#map-section', onClick: scrollToMap },
  ];

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const fullName = (form.name || '').trim();
    const ph = (form.phone || '').trim();
    const grade = String(form.grade || '').trim();

    if (!fullName) { toast.error(t('formToast.errName')); return; }
    if (!ph)       { toast.error(t('formToast.errPhone')); return; }
    if (grade !== '9' && grade !== '11') { toast.error(t('formToast.errGrade')); return; }

    try {
      setSubmitting(true);
      await api.post('/applications', { fullName, phone: ph, grade });
      toast.success(t('formToast.success', { name: fullName }));
      setForm({ name: '', phone: '', grade: '9' });
    } catch (err) {
      const isTimeout = err?.code === 'ECONNABORTED' || /timeout/i.test(err?.message || '');
      const msg = err?.response?.data?.message
        || err?.response?.data?.errors?.[0]?.msg
        || (isTimeout
            ? t('formToast.errTimeout')
            : err?.message === 'Network Error'
            ? t('formToast.errNetwork')
            : t('formToast.errGeneric'));
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('contactPage.meta.title')}</title>
        <meta name="description" content={t('contactPage.meta.description')} />
        <meta name="keywords" content={t('contactPage.meta.keywords')} />
        <link rel="canonical" href="https://topex-texnikumi.vercel.app/aloqalar" />
        <meta property="og:title" content={t('contactPage.meta.ogTitle')} />
        <meta property="og:description" content={t('contactPage.meta.ogDescription')} />
        <meta property="og:url" content="https://topex-texnikumi.vercel.app/aloqalar" />
        <meta property="og:image" content="https://topex-texnikumi.vercel.app/assets/logos/topex-logo.png" />
      </Helmet>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${settings?.contactHeroImage || '/assets/images/DSC01036.jpg'}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/75 to-navy/90" />
        <div className="wrap relative z-10 text-center">
            <motion.h1 {...up(0)} className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-5 drop-shadow-lg">
            {t('contactPage.heroTitle')}
          </motion.h1>
          {settings?.contactHeroSubtitle && (
            <motion.p {...up(0.05)} className="text-white/65 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
              {settings.contactHeroSubtitle}
            </motion.p>
          )}
          <motion.div {...up(0.1)} className="flex items-center justify-center gap-2 text-white/70 text-sm font-medium">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-orange transition-colors">
              <Home size={14} /> {t('loginPage.backHome')}
            </Link>
            <ChevronRight size={14} className="opacity-60" />
            <span className="text-orange">{t('nav.contacts')}</span>
          </motion.div>
        </div>
      </section>

      {/* ══ CONTACT CARDS ════════════════════════════════════ */}
      <section className="bg-white py-14 lg:py-20">
        <div className="w-full max-w-[1500px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map(({ Icon, title, lines, href, external, onClick }, i) => {
              const body = (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-orange-faint flex items-center justify-center text-orange mb-5 group-hover:bg-orange group-hover:text-white transition-colors duration-300">
                    <Icon size={26} />
                  </div>
                  <h3 className="text-brand font-bold text-[16px] mb-2">{title}</h3>
                  {lines.map((line, j) => (
                    <p key={j} className="text-gray-500 text-[14px] leading-relaxed group-hover:text-gray-700 transition-colors">{line}</p>
                  ))}
                </>
              );
              return (
                <motion.a {...up(i * 0.08)} key={title}
                  href={href}
                  onClick={onClick}
                  {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="group block bg-white border border-gray-200 rounded-2xl p-7 cursor-pointer
                             hover:border-orange/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  {body}
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ FORM — "Ma'lumotlaringizni to'ldiring" ═══════════ */}
      <section className="relative bg-white py-12 lg:py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 60px, #1d3a8a 60px 61px)' }}
        />
        <div className="w-full max-w-[1500px] mx-auto px-6 lg:px-16 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* LEFT — Form */}
            <div>
              <motion.span {...up(0)}
                className="inline-block text-orange font-bold text-[13px] uppercase tracking-[0.18em] mb-5">
                {t('form.label')}
              </motion.span>
              <motion.h2 {...up(0.1)}
                className="text-[42px] md:text-[52px] lg:text-[58px] font-black text-brand leading-[1.05] mb-8">
                {t('form.title')}
              </motion.h2>
              <motion.p {...up(0.2)}
                className="text-gray-600 text-[16px] leading-[1.85] mb-10 max-w-xl">
                {t('form.paragraph')}
              </motion.p>

              <motion.form onSubmit={submit} {...up(0.3)} className="space-y-5 max-w-xl">
                <div>
                  <label className="block text-brand font-semibold text-[14px] mb-2">{t('form.nameLabel')}</label>
                  <input
                    type="text"
                    placeholder={t('form.namePh')}
                    className="w-full bg-white border-2 border-gray-200 rounded-xl py-4 px-5 text-brand text-[15px]
                               placeholder:text-gray-400 focus:outline-none focus:border-orange transition-all"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-brand font-semibold text-[14px] mb-2">{t('form.phoneLabel')}</label>
                  <PhoneInput
                    value={form.phone}
                    onChange={(v) => setForm(p => ({ ...p, phone: v }))}
                    required
                    className="w-full bg-white border-2 border-gray-200 rounded-xl py-4 pr-5 text-brand text-[15px]
                               placeholder:text-gray-400 focus:outline-none focus:border-orange transition-all"
                  />
                </div>

                <div>
                  <label className="block text-brand font-semibold text-[14px] mb-2">{t('form.directionLabel')}</label>
                  <div className="relative">
                    <select
                      className="w-full bg-white border-2 border-gray-200 rounded-xl py-4 px-5 text-brand text-[15px]
                                 focus:outline-none focus:border-orange transition-all appearance-none cursor-pointer"
                      value={form.grade}
                      onChange={e => setForm(p => ({ ...p, grade: e.target.value }))}
                    >
                      <option value="">{t('form.directionPh')}</option>
                      <option value="9">{t('form.direction9')}</option>
                      <option value="11">{t('form.direction11')}</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 w-4 h-4 rounded border-2 border-gray-300 text-orange focus:ring-orange focus:ring-2 cursor-pointer"
                  />
                  <span className="text-gray-500 text-[13px] leading-relaxed">
                    {t('consent.prefix')}{' '}
                    <Link to="/" className="text-brand font-semibold hover:underline">{t('consent.brand')}</Link>{' '}
                    {t('consent.suffix')}
                  </span>
                </label>

                <div className="pt-4 flex justify-center lg:justify-start">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 bg-orange-grad hover:brightness-110
                               text-white font-bold px-14 py-4 rounded-xl shadow-xl shadow-orange/30
                               hover:-translate-y-0.5 transition-all duration-200 text-[15px]
                               disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t('form.submitting')}
                      </>
                    ) : (
                      <>{t('form.submit')}</>
                    )}
                  </button>
                </div>
              </motion.form>
            </div>

            {/* RIGHT — photo, toza va zamonaviy (orange yo'q) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative hidden lg:flex items-center justify-center min-h-[620px]">
              <div className="absolute w-[360px] h-[480px] rounded-[60px] bg-brand/5 blur-3xl" />
              <div className="absolute top-6 right-10 w-32 h-32 opacity-20 pointer-events-none"
                   style={{ backgroundImage: 'radial-gradient(circle, #1d3a8a 1.6px, transparent 1.6px)', backgroundSize: '18px 18px' }} />
              <div className="relative z-10 w-[400px] h-[560px] overflow-hidden ring-4 ring-white
                              shadow-2xl bg-gray-100"
                   style={{ borderRadius: '180px 180px 36px 36px' }}>
                <img
                  src={settings?.formImage
                    ? (settings.formImage.startsWith('/assets') || settings.formImage.startsWith('http') ? settings.formImage : `${API_URL}${settings.formImage}`)
                    : '/assets/images/form-photo.jpg'}
                  alt="Topex talabasi"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ MAP — "BIZ XARITADA!" ════════════════════════════ */}
      <section id="map-section" className="bg-white pb-20 scroll-mt-24">
        <div className="w-full max-w-[1500px] mx-auto px-6 lg:px-16">
          <motion.h2 {...up(0)}
            className="text-3xl md:text-4xl font-black text-brand mb-8">
            {t('contactPage.mapTitle')}
          </motion.h2>

          {/* Branch tabs */}
          <div className="flex gap-3 mb-6 flex-wrap">
            {[
              { name: 'Yunusobod', lat: 41.350913, lng: 69.327955 },
              { name: 'Chilonzor', lat: 41.283532, lng: 69.210518 },
              { name: 'Sergeli',   lat: 41.211476, lng: 69.230987 },
            ].map((branch, i) => (
              <button
                key={branch.name}
                onClick={() => setActiveTab(i)}
                className={`px-6 py-2.5 rounded-xl font-bold text-[14px] transition-all duration-200 ${
                  activeTab === i
                    ? 'bg-orange text-white shadow-lg shadow-orange/30'
                    : 'bg-gray-100 text-brand hover:bg-gray-200'
                }`}
              >
                {branch.name}
              </button>
            ))}
          </div>

          {[
            { name: 'Yunusobod', lat: 41.350913, lng: 69.327955 },
            { name: 'Chilonzor', lat: 41.283532, lng: 69.210518 },
            { name: 'Sergeli',   lat: 41.211476, lng: 69.230987 },
          ].map((branch, i) => (
            <div key={branch.name} className={activeTab === i ? 'block' : 'hidden'}>
              <motion.div {...up(0.1)}
                className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <iframe
                  title={`${branch.name} — Topex Texnikumi`}
                  src={`https://maps.google.com/maps?q=${branch.lat},${branch.lng}&output=embed&z=16`}
                  width="100%"
                  height="460"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </motion.div>
              <div className="mt-4 flex items-center gap-2">
                <MapPin size={15} className="text-orange flex-shrink-0" />
                <a
                  href={`https://www.google.com/maps?q=${branch.lat},${branch.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[14px] text-gray-600 hover:text-orange transition-colors"
                >
                  {branch.name} filialni Google Maps'da ko'rish →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ContactPage;
