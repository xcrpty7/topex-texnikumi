import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Home, Award, Building2, Calendar, Hash, MapPin, Shield } from 'lucide-react';

const up = (delay = 0) => ({
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.5, ease: 'easeOut', delay },
});

const DIRECTIONS = [
  { code: '30410501', name: 'Bank nazoratchisi' },
  { code: '30411201', name: 'Agrobiznes va marketing agenti' },
  { code: '30610101', name: "Raqamli axborotlarni qayta ishlash ustasi" },
  { code: '30610102', name: 'Kompyuter grafikasi va dizayn operatori' },
  { code: '30610202', name: 'Kompyuter tizimlarida dasturlash' },
  { code: '30720101', name: 'Laborant-analitik' },
  { code: '30811101', name: "Dorivor o'simliklarni yetishtirish va qayta ishlash laboranti" },
  { code: '31010304', name: "Mehmonxona xo'jaligini tashkil qilish va boshqarish" },
];

const INFO_CARDS = [
  { Icon: Hash,      label: 'Litsenziya raqami',      value: '№ 420567' },
  { Icon: Hash,      label: 'Litsenziya reestri raqami', value: 'L-44091494' },
  { Icon: Shield,    label: 'STIR',                   value: '303963872' },
  { Icon: Calendar,  label: 'Amal qilish muddati',    value: '30.09.2024 dan — cheksiz' },
  { Icon: Building2, label: 'Vakolatli organ',        value: "O'zbekiston Respublikasi Oliy ta'lim, fan va innovatsiyalar vazirligi" },
  { Icon: MapPin,    label: 'Joylashgan manzil',      value: "Toshkent shahri, Sirg'ali tumani, Nurhayot MFY, Yangi Sergeli ko'chasi, 49-uy" },
];

const LitsenziyaPage = () => {
  const { t } = useTranslation();
  const [imgErrors, setImgErrors] = useState({});

  return (
    <>
      <Helmet>
        <title>Litsenziya – Topex Texnikumi</title>
        <meta name="description" content="Topex Texnikumi davlat litsenziyasi № 420567. O'zbekiston Respublikasi Oliy ta'lim, fan va innovatsiyalar vazirligi tomonidan berilgan." />
        <link rel="canonical" href="https://topex-texnikumi.vercel.app/litsenziya" />
        <meta property="og:title" content="Litsenziya – Topex Texnikumi" />
        <meta property="og:description" content="Topex Texnikumi davlat litsenziyasi № 420567." />
        <meta property="og:url" content="https://topex-texnikumi.vercel.app/litsenziya" />
        <meta property="og:image" content="https://topex-texnikumi.vercel.app/assets/images/DSC01036.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Litsenziya – Topex Texnikumi" />
        <meta name="twitter:description" content="Topex Texnikumi davlat litsenziyasi № 420567." />
        <meta name="twitter:image" content="https://topex-texnikumi.vercel.app/assets/images/DSC01036.webp" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": "https://topex-texnikumi.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Litsenziya", "item": "https://topex-texnikumi.vercel.app/litsenziya" }
          ]
        })}</script>
      </Helmet>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/images/DSC01036.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/75 to-navy/90" />
        <div className="wrap relative z-10 text-center">
          <motion.div {...up(0)} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <Award size={16} className="text-orange" />
            <span className="text-white/90 text-sm font-semibold">Rasmiy hujjat</span>
          </motion.div>
          <motion.h1 {...up(0.05)} className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-5 drop-shadow-lg">
            Texnikum Litsenziyasi
          </motion.h1>
          <motion.p {...up(0.1)} className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            O'zbekiston Respublikasi Oliy ta'lim, fan va innovatsiyalar vazirligi tomonidan berilgan nodavlat ta'lim xizmatlarini ko'rsatish uchun litsenziya
          </motion.p>
          <motion.div {...up(0.15)} className="flex items-center justify-center gap-2 text-white/70 text-sm font-medium">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-orange transition-colors">
              <Home size={14} /> {t('loginPage.backHome')}
            </Link>
            <ChevronRight size={14} className="opacity-60" />
            <span className="text-orange">Litsenziya</span>
          </motion.div>
        </div>
      </section>

      {/* ── LICENSE NUMBER BANNER ─────────────────────────────── */}
      <section className="bg-brand py-10">
        <div className="wrap text-center">
          <motion.div {...up(0)} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <Award size={28} className="text-orange" />
              </div>
              <div className="text-left">
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Litsenziya raqami</p>
                <p className="text-white text-3xl font-black">№ 420567</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-14 bg-white/20" />
            <div className="text-left">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Tashkilot</p>
              <p className="text-white text-xl font-bold">"TOPEX TEXNIKUM" MChJ</p>
            </div>
            <div className="hidden sm:block w-px h-14 bg-white/20" />
            <div className="text-left">
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Faoliyat turi</p>
              <p className="text-white text-base font-semibold">Professional ta'lim xizmatlari</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── INFO CARDS ───────────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="wrap">
          <motion.div {...up(0)} className="text-center mb-12">
            <span className="text-orange font-bold text-[13px] uppercase tracking-[0.18em]">RASMIY MA'LUMOTLAR</span>
            <h2 className="text-3xl md:text-4xl font-black text-brand mt-2">Litsenziya tafsilotlari</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {INFO_CARDS.map(({ Icon, label, value }, i) => (
              <motion.div
                key={label}
                {...up(i * 0.07)}
                className="bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:border-orange/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-orange-faint flex items-center justify-center mb-4">
                  <Icon size={20} className="text-orange" />
                </div>
                <p className="text-gray-500 text-[12px] font-semibold uppercase tracking-wider mb-1">{label}</p>
                <p className="text-brand font-bold text-[15px] leading-snug">{value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIRECTIONS TABLE ─────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="wrap">
          <motion.div {...up(0)} className="text-center mb-12">
            <span className="text-orange font-bold text-[13px] uppercase tracking-[0.18em]">TA'LIM YO'NALISHLARI</span>
            <h2 className="text-3xl md:text-4xl font-black text-brand mt-2">Litsenziyalashtirilgan yo'nalishlar</h2>
            <p className="text-gray-500 text-[15px] mt-3">Quyidagi yo'nalishlar bo'yicha ta'lim berish uchun rasmiy litsenziya mavjud</p>
          </motion.div>

          <motion.div {...up(0.1)} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-brand text-white">
                    <th className="text-left py-4 px-6 text-[13px] font-semibold uppercase tracking-wide w-12">№</th>
                    <th className="text-left py-4 px-6 text-[13px] font-semibold uppercase tracking-wide">Kod</th>
                    <th className="text-left py-4 px-6 text-[13px] font-semibold uppercase tracking-wide">Yo'nalish nomi</th>
                  </tr>
                </thead>
                <tbody>
                  {DIRECTIONS.map(({ code, name }, i) => (
                    <tr key={code} className={`border-t border-gray-100 hover:bg-orange-faint transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                      <td className="py-4 px-6 text-gray-400 text-sm font-medium">{i + 1}</td>
                      <td className="py-4 px-6">
                        <span className="font-mono text-[13px] bg-brand/8 text-brand px-2 py-0.5 rounded-md font-semibold">{code}</span>
                      </td>
                      <td className="py-4 px-6 text-brand font-medium text-[14px]">{name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── LICENSE DOCUMENT PHOTOS ───────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="wrap">
          <motion.div {...up(0)} className="text-center mb-12">
            <span className="text-orange font-bold text-[13px] uppercase tracking-[0.18em]">RASMIY HUJJAT</span>
            <h2 className="text-3xl md:text-4xl font-black text-brand mt-2">Litsenziya hujjati</h2>
            <p className="text-gray-500 mt-3 text-[15px]">O'zbekiston Respublikasi Oliy ta'lim vazirligi tomonidan berilgan rasmiy litsenziya</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Main license photo */}
            <motion.div {...up(0.1)} className="group">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-200">
                {!imgErrors['main-license'] ? (
                  <img
                    src="/assets/license/license-main.webp"
                    alt="Topex Texnikumi Litsenziyasi - asosiy sahifa"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={() => setImgErrors(prev => ({ ...prev, 'main-license': true }))}
                  />
                ) : (
                  <div className="border-2 border-blue-200 rounded-2xl p-8 bg-gradient-to-br from-blue-50 to-white min-h-[500px] flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 leading-relaxed">
                      O'ZBEKISTON RESPUBLIKASI OLIY TA'LIM,<br/>FAN VA INNOVATSIYALAR VAZIRLIGI
                    </p>
                    <h3 className="text-5xl font-black text-brand mb-2">LITSENZIYA</h3>
                    <p className="text-2xl font-bold text-gray-700 mb-6">№ 420567</p>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">Tashkilot</p>
                        <p className="font-bold text-brand">"TOPEX TEXNIKUM" MChJ</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">Reestri raqami</p>
                        <p className="font-bold text-brand">L-44091494</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">STIR</p>
                        <p className="font-bold text-brand">303963872</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">Amal qilish muddati</p>
                        <p className="font-bold text-green-600">30.09.2024 — CHEKSIZ</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-4">Taqdim etilgan: 30.09.2024 22:17</p>
                </div>
                )}
              </div>
              <p className="text-center text-gray-500 text-sm mt-3 font-medium">Litsenziya — asosiy sahifa</p>
            </motion.div>

            {/* Directions page photo */}
            <motion.div {...up(0.15)} className="group">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-200">
                {!imgErrors['directions-license'] ? (
                  <img
                    src="/assets/license/license-directions.webp"
                    alt="Topex Texnikumi Litsenziyasi - yo'nalishlar"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={() => setImgErrors(prev => ({ ...prev, 'directions-license': true }))}
                  />
                ) : (
                  <div className="border-2 border-blue-200 rounded-2xl p-8 bg-gradient-to-br from-blue-50 to-white min-h-[500px] flex-col">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Litsenziya</p>
                  <p className="text-right text-gray-500 text-sm mb-6">№ 420567</p>
                  <h4 className="text-brand font-black text-lg mb-1">Faoliyat turi</h4>
                  <p className="text-gray-600 text-sm mb-6">Professional ta'lim xizmatlari</p>
                  <h4 className="text-brand font-black text-lg mb-3">Ta'lim yo'nalishlari</h4>
                  <div className="space-y-2">
                    {['Bank nazoratchisi', 'Agrobiznes va marketing agenti', 'Raqamli axborotlarni qayta ishlash ustasi', 'Kompyuter grafikasi va dizayn operatori', 'Kompyuter tizimlarida dasturlash'].map(d => (
                      <p key={d} className="text-[12px] text-gray-600 border-b border-gray-100 pb-1">{d}</p>
                    ))}
                  </div>
                </div>
                )}
              </div>
              <p className="text-center text-gray-500 text-sm mt-3 font-medium">Litsenziya — ta'lim yo'nalishlari</p>
            </motion.div>
          </div>

          {/* Note about real license images */}
          <motion.p {...up(0.2)} className="text-center text-gray-400 text-[13px] mt-8">
            * Rasmiy litsenziya hujjati O'zbekiston Respublikasi Oliy ta'lim, fan va innovatsiyalar vazirligi tomonidan berilgan
          </motion.p>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="bg-brand py-16">
        <div className="wrap text-center">
          <motion.h2 {...up(0)} className="text-3xl font-black text-white mb-4">
            Savollaringiz bormi?
          </motion.h2>
          <motion.p {...up(0.05)} className="text-white/70 mb-8 text-[15px]">
            Litsenziya va ta'lim yo'nalishlari haqida batafsil ma'lumot olish uchun biz bilan bog'laning
          </motion.p>
          <motion.div {...up(0.1)} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/aloqalar"
              className="inline-flex items-center gap-2 bg-orange text-white font-bold px-8 py-3.5 rounded-xl hover:brightness-110 transition-all"
            >
              Bog'lanish
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 bg-white/10 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-all"
            >
              Yo'nalishlar
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default LitsenziyaPage;
