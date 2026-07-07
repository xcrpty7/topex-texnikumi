import { motion } from 'framer-motion';
import SeoHelmet from '../components/common/SeoHelmet';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Home, Calendar, Clock, Phone, Bell, FileText, Users } from 'lucide-react';

const up = (delay = 0) => ({
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.5, ease: 'easeOut', delay },
});

const EXAM_STAGES = [
  {
    Icon: FileText,
    step: '01',
    title: 'Ariza topshirish',
    desc: "Onlayn yoki texnikumga kelib ariza qoldiring. Ismingiz, telefon raqamingiz va tanlagan yo'nalishingizni ko'rsating.",
    status: 'active',
  },
  {
    Icon: Calendar,
    step: '02',
    title: 'Kirish imtihoni',
    desc: "Belgilangan sanada texnikumga keling. Imtihon o'zbek yoki rus tilida o'tkaziladi. Imtihon matematika va ona tili fanlaridan iborat.",
    status: 'active',
  },
  {
    Icon: Users,
    step: '03',
    title: "Natijalar e'lon qilinadi",
    desc: "Imtihon natijalari 3 ish kuni ichida ushbu sahifada va telefon orqali xabar qilinadi.",
    status: 'soon',
  },
  {
    Icon: Bell,
    step: '04',
    title: 'Qabul & Shartnoma',
    desc: "Muvaffaqiyatli o'quvchilar ro'yxatga olinadi va shartnoma imzolanadi. Grantlar darhol hisobga olinadi.",
    status: 'soon',
  },
];

const ImtihonNatijalariPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <SeoHelmet
        title="Kirish imtihon natijalari – Topex Texnikumi"
        description="Topex Texnikumiga kirish imtihon natijalari. Qabul jarayoni, imtihon sanasi va natijalar haqida ma'lumot."
        canonical="https://topextexnikum.uz/imtihon-natijalari"
        ogImage="https://topextexnikum.uz/assets/images/DSC01093.webp"
      >
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": "https://topextexnikum.uz/" },
            { "@type": "ListItem", "position": 2, "name": "Kirish imtihon natijalari", "item": "https://topextexnikum.uz/imtihon-natijalari" }
          ]
        })}</script>
      </SeoHelmet>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/images/DSC01093.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/75 to-navy/90" />
        <div className="wrap relative z-10 text-center">
          <motion.div {...up(0)} className="inline-flex items-center gap-2 bg-orange/20 backdrop-blur-sm border border-orange/30 rounded-full px-4 py-2 mb-6">
            <Clock size={16} className="text-orange" />
            <span className="text-white/90 text-sm font-semibold">Tez orada e'lon qilinadi</span>
          </motion.div>
          <motion.h1 {...up(0.05)} className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-5 drop-shadow-lg">
            Kirish Imtihon Natijalari
          </motion.h1>
          <motion.p {...up(0.1)} className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Topex Texnikumiga 2026-yil qabul imtihoni natijalari yaqin kunlarda ushbu sahifada e'lon qilinadi
          </motion.p>
          <motion.div {...up(0.15)} className="flex items-center justify-center gap-2 text-white/70 text-sm font-medium">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-orange transition-colors">
              <Home size={14} /> {t('loginPage.backHome')}
            </Link>
            <ChevronRight size={14} className="opacity-60" />
            <span className="text-orange">Imtihon natijalari</span>
          </motion.div>
        </div>
      </section>

      {/* ── COMING SOON BANNER ───────────────────────────────────── */}
      <section className="bg-orange py-8">
        <div className="wrap">
          <motion.div {...up(0)} className="flex flex-col sm:flex-row items-center justify-center gap-3 text-white text-center">
            <Bell size={20} />
            <p className="font-bold text-[16px]">
              Natijalar e'lon qilinishi bilanoq SMS va telefon orqali xabardor qilamiz
            </p>
            <a
              href="/#ariza"
              className="bg-white text-orange font-bold px-5 py-1.5 rounded-lg text-sm hover:bg-orange-50 transition-colors whitespace-nowrap"
            >
              Ariza qoldirish →
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── PROCESS STEPS ───────────────────────────────────────── */}
      <section className="bg-white py-16 lg:py-24">
        <div className="wrap">
          <motion.div {...up(0)} className="text-center mb-12">
            <span className="text-orange font-bold text-[13px] uppercase tracking-[0.18em]">QABUL JARAYONI</span>
            <h2 className="text-3xl md:text-4xl font-black text-brand mt-2">Qabul bosqichlari</h2>
            <p className="text-gray-500 mt-3 text-[15px]">Topex Texnikumiga qabul quyidagi bosqichlardan iborat</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {EXAM_STAGES.map(({ Icon, step, title, desc, status }, i) => (
              <motion.div
                key={step}
                {...up(i * 0.08)}
                className={`relative rounded-2xl p-7 border-2 transition-all duration-300 ${
                  status === 'active'
                    ? 'border-brand bg-white hover:shadow-xl hover:-translate-y-1'
                    : 'border-orange/30 bg-orange-faint/30 hover:border-orange/50'
                }`}
              >
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    status === 'active' ? 'bg-brand text-white' : 'bg-orange text-white'
                  }`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-black text-gray-400 tracking-wider">BOSQICH {step}</span>
                      {status === 'soon' && (
                        <span className="text-[10px] bg-orange text-white font-bold px-2 py-0.5 rounded-full">Tez orada</span>
                      )}
                    </div>
                    <h3 className="text-brand font-bold text-[16px] mb-2">{title}</h3>
                    <p className="text-gray-500 text-[13px] leading-relaxed">{desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESULTS PLACEHOLDER ──────────────────────────────────── */}
      <section className="bg-gray-50 py-16 lg:py-24">
        <div className="wrap">
          <motion.div {...up(0)} className="text-center mb-12">
            <span className="text-orange font-bold text-[13px] uppercase tracking-[0.18em]">NATIJALAR</span>
            <h2 className="text-3xl md:text-4xl font-black text-brand mt-2">O'quvchilar ro'yxati</h2>
          </motion.div>

          <motion.div
            {...up(0.1)}
            className="max-w-3xl mx-auto bg-white border-2 border-dashed border-gray-200 rounded-2xl py-20 flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <FileText size={36} className="text-gray-300" />
            </div>
            <h3 className="text-brand font-black text-[22px] mb-3">
              {t('notFound.soonTitle')}
            </h3>
            <p className="text-gray-500 text-[15px] leading-relaxed max-w-md">
              {t('notFound.soonDefault')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-brand text-white font-bold px-6 py-3 rounded-xl hover:brightness-110 transition-all"
              >
                <Home size={16} /> Bosh sahifaga
              </Link>
              <a
                href="tel:+998787774477"
                className="inline-flex items-center gap-2 bg-orange text-white font-bold px-6 py-3 rounded-xl hover:brightness-110 transition-all"
              >
                <Phone size={16} /> Qo'ng'iroq qilish
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────── */}
      <section className="bg-brand py-16">
        <div className="wrap">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div {...up(0)}>
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Phone size={24} className="text-orange" />
              </div>
              <h3 className="text-white font-bold text-[16px] mb-2">Telefon orqali so'rang</h3>
              <a href="tel:+998787774477" className="text-orange font-bold text-[18px] hover:text-orange/80 transition-colors">
                +998 78 777 44 77
              </a>
            </motion.div>
            <motion.div {...up(0.05)}>
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Clock size={24} className="text-orange" />
              </div>
              <h3 className="text-white font-bold text-[16px] mb-2">Qabul vaqti</h3>
              <p className="text-white/70">Du–Sha: 8:00 – 18:00</p>
            </motion.div>
            <motion.div {...up(0.1)}>
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} className="text-orange" />
              </div>
              <h3 className="text-white font-bold text-[16px] mb-2">Qabul davri</h3>
              <p className="text-white/70">2026-yil qabul faol</p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ImtihonNatijalariPage;
