import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, ChevronRight, Home } from 'lucide-react';
import api from '../services/api';
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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/settings').then(r => { if (r.data.data) setSettings(r.data.data); }).catch(() => {});
  }, []);

  const phone   = settings?.phone   || '+998 78 777 44 77';
  const phone2  = settings?.phone2  || '';
  const email   = settings?.email   || 'info@topex.uz';
  const address = settings?.address || t('contact.addressValue');
  const hours   = settings?.workingHours || 'Du-Sha: 8:00 - 18:00';
  const mapSrc  = settings?.mapLink
    || `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  const cards = [
    { Icon: MapPin, title: settings?.contactCard1Title || 'Bizning manzil', lines: [address] },
    { Icon: Phone,  title: settings?.contactCard2Title || 'Telefon raqam',  lines: [phone, phone2].filter(Boolean), href: `tel:${phone.replace(/\s/g, '')}` },
    { Icon: Mail,   title: settings?.contactCard3Title || 'E-mail',          lines: [email], href: `mailto:${email}` },
    { Icon: Clock,  title: settings?.contactCard4Title || settings?.footerHoursTitle || 'Ish vaqti', lines: [hours] },
  ];

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const fullName = (form.name || '').trim();
    const ph = (form.phone || '').trim();
    const grade = String(form.grade || '').trim();

    if (!fullName) { toast.error('Ismingizni kiriting'); return; }
    if (!ph)       { toast.error('Telefon raqamingizni kiriting'); return; }
    if (grade !== '9' && grade !== '11') { toast.error("Sinf 9 yoki 11 bo'lishi kerak"); return; }

    try {
      setSubmitting(true);
      await api.post('/applications', { fullName, phone: ph, grade });
      toast.success(`Rahmat, ${fullName}! Arizangiz qabul qilindi. Tez orada bog'lanamiz.`);
      setForm({ name: '', phone: '', grade: '9' });
    } catch (err) {
      const msg = err?.response?.data?.message
        || err?.response?.data?.errors?.[0]?.msg
        || (err?.message === 'Network Error'
            ? "Internet bilan bog'lanishda muammo. Iltimos, keyinroq urinib ko'ring."
            : "Ariza yuborishda xatolik. Qayta urinib ko'ring.");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Aloqalar – Topex Texnikumi</title>
        <meta name="description" content="Topex Texnikumi bilan bog'laning: manzil, telefon, e-mail va ish vaqti. Savollaringiz bo'lsa, ariza qoldiring." />
        <meta name="keywords" content="aloqa, Topex, manzil, telefon, e-mail, bog'lanish" />
        <link rel="canonical" href="https://topex-texnikumi.vercel.app/aloqalar" />
        <meta property="og:title" content="Aloqalar – Topex Texnikumi" />
        <meta property="og:description" content="Topex Texnikumi bilan bog'laning." />
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
            {settings?.contactHeroTitle || 'Aloqalar'}
          </motion.h1>
          {settings?.contactHeroSubtitle && (
            <motion.p {...up(0.05)} className="text-white/65 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
              {settings.contactHeroSubtitle}
            </motion.p>
          )}
          <motion.div {...up(0.1)} className="flex items-center justify-center gap-2 text-white/70 text-sm font-medium">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-orange transition-colors">
              <Home size={14} /> Bosh sahifa
            </Link>
            <ChevronRight size={14} className="opacity-60" />
            <span className="text-orange">Aloqalar</span>
          </motion.div>
        </div>
      </section>

      {/* ══ CONTACT CARDS ════════════════════════════════════ */}
      <section className="bg-white py-14 lg:py-20">
        <div className="w-full max-w-[1500px] mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map(({ Icon, title, lines, href }, i) => {
              const body = (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-orange-faint flex items-center justify-center text-orange mb-5">
                    <Icon size={26} />
                  </div>
                  <h3 className="text-brand font-bold text-[16px] mb-2">{title}</h3>
                  {lines.map((line, j) => (
                    <p key={j} className="text-gray-500 text-[14px] leading-relaxed">{line}</p>
                  ))}
                </>
              );
              return (
                <motion.div {...up(i * 0.08)} key={title}
                  className="bg-white border border-gray-200 rounded-2xl p-7 hover:border-orange/40 hover:shadow-lg transition-all duration-300">
                  {href ? <a href={href} className="block">{body}</a> : body}
                </motion.div>
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
                {settings?.formLabel || t('form.label')}
              </motion.span>
              <motion.h2 {...up(0.1)}
                className="text-[42px] md:text-[52px] lg:text-[58px] font-black text-brand leading-[1.05] mb-8">
                {settings?.formTitle || t('form.title')}
              </motion.h2>
              <motion.p {...up(0.2)}
                className="text-gray-600 text-[16px] leading-[1.85] mb-10 max-w-xl">
                {settings?.formParagraph || t('form.paragraph')}
              </motion.p>

              <motion.form onSubmit={submit} {...up(0.3)} className="space-y-5 max-w-xl">
                <div>
                  <label className="block text-brand font-semibold text-[14px] mb-2">{settings?.formNameLabel || t('form.nameLabel')}</label>
                  <input
                    type="text"
                    placeholder={settings?.formNamePh || t('form.namePh')}
                    className="w-full bg-white border-2 border-gray-200 rounded-xl py-4 px-5 text-brand text-[15px]
                               placeholder:text-gray-400 focus:outline-none focus:border-orange transition-all"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-brand font-semibold text-[14px] mb-2">{settings?.formPhoneLabel || t('form.phoneLabel')}</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-base leading-none">🇺🇿</span>
                    <input
                      type="tel"
                      placeholder="+998 __ ___-__-__"
                      className="w-full bg-white border-2 border-gray-200 rounded-xl py-4 pl-14 pr-5 text-brand text-[15px]
                                 placeholder:text-gray-400 focus:outline-none focus:border-orange transition-all"
                      value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-brand font-semibold text-[14px] mb-2">{settings?.formDirLabel || t('form.directionLabel')}</label>
                  <div className="relative">
                    <select
                      className="w-full bg-white border-2 border-gray-200 rounded-xl py-4 px-5 text-brand text-[15px]
                                 focus:outline-none focus:border-orange transition-all appearance-none cursor-pointer"
                      value={form.grade}
                      onChange={e => setForm(p => ({ ...p, grade: e.target.value }))}
                    >
                      <option value="">{settings?.formDirPh || t('form.directionPh')}</option>
                      <option value="9">{settings?.formDir9 || t('form.direction9')}</option>
                      <option value="11">{settings?.formDir11 || t('form.direction11')}</option>
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
                    {settings?.formAgreeText || t('form.agree')}
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
                      <>{settings?.formSubmitText || t('form.submit')}</>
                    )}
                  </button>
                </div>
              </motion.form>
            </div>

            {/* RIGHT — photo with orange arch */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative hidden lg:flex items-end justify-center min-h-[600px]">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[420px] h-[560px]
                              bg-orange-grad shadow-2xl shadow-orange/20"
                   style={{ borderRadius: '210px 210px 24px 24px' }} />
              <img
                src={settings?.formImage
                  ? (settings.formImage.startsWith('/assets') || settings.formImage.startsWith('http') ? settings.formImage : `${API_URL}${settings.formImage}`)
                  : '/assets/images/DSC00912.jpg'}
                alt="Topex talabasi"
                className="relative z-10 w-[400px] h-[540px] object-cover rounded-t-[200px] shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ MAP — "BIZ XARITADA!" ════════════════════════════ */}
      <section className="bg-white pb-20">
        <div className="w-full max-w-[1500px] mx-auto px-6 lg:px-16">
          <motion.h2 {...up(0)}
            className="text-3xl md:text-4xl font-black text-brand mb-8">
            {settings?.contactMapTitle || 'BIZ XARITADA!'}
          </motion.h2>
          <motion.div {...up(0.1)}
            className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <iframe
              title="Topex Texnikumi xaritada"
              src={mapSrc}
              width="100%"
              height="460"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
