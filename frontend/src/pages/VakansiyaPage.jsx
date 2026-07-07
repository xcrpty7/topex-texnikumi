import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SeoHelmet from '../components/common/SeoHelmet';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Home, Briefcase, Bell, Phone, Mail, MapPin, DollarSign, ListChecks } from 'lucide-react';

const up = (delay = 0) => ({
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.5, ease: 'easeOut', delay },
});

const API = import.meta.env.VITE_API_URL || '';

const TYPE_LABELS = {
  'full-time': 'To\'liq stavka',
  'part-time': 'Yarim stavka',
  'remote': 'Masofaviy',
  'project': 'Loyiha asosida',
};

const VakansiyaPage = () => {
  const { t } = useTranslation();
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/vacancies/active`)
      .then(r => r.json())
      .then(d => setVacancies(d.data || []))
      .catch(() => setVacancies([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SeoHelmet
        title="Vakansiyalar – Topex Texnikumi"
        description="Topex Texnikumidagi ochiq ish o'rinlari va vakansiyalar."
        canonical="https://topextexnikum.uz/vakansiya"
        ogImage="https://topextexnikum.uz/assets/images/DSC01036.webp"
      >
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": "https://topextexnikum.uz/" },
            { "@type": "ListItem", "position": 2, "name": "Vakansiyalar", "item": "https://topextexnikum.uz/vakansiya" }
          ]
        })}</script>
      </SeoHelmet>

      {/* ── HERO ── */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/images/DSC01036.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/75 to-navy/90" />
        <div className="wrap relative z-10 text-center">
          <motion.div {...up(0)} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <Briefcase size={16} className="text-orange" />
            <span className="text-white/90 text-sm font-semibold">Ish o'rinlari</span>
          </motion.div>
          <motion.h1 {...up(0.05)} className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-5 drop-shadow-lg">
            Vakansiyalar
          </motion.h1>
          <motion.p {...up(0.1)} className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Topex Texnikumida professional jamoa bilan ishlashni xohlaysizmi? Biz doimo iqtidorli mutaxassislarni qidirmoqdamiz
          </motion.p>
          <motion.div {...up(0.15)} className="flex items-center justify-center gap-2 text-white/70 text-sm font-medium">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-orange transition-colors">
              <Home size={14} /> {t('loginPage.backHome')}
            </Link>
            <ChevronRight size={14} className="opacity-60" />
            <span className="text-orange">Vakansiyalar</span>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="bg-white py-20 lg:py-32">
        <div className="wrap">
          <div className="max-w-3xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-orange/30 border-t-orange rounded-full animate-spin" />
              </div>
            ) : vacancies.length === 0 ? (
              <div className="text-center">
                <motion.div {...up(0)} className="w-24 h-24 rounded-3xl bg-orange-faint flex items-center justify-center mx-auto mb-8">
                  <Briefcase size={44} className="text-orange" />
                </motion.div>
                <motion.h2 {...up(0.05)} className="text-3xl md:text-4xl font-black text-brand mb-4">
                  Hozircha ochiq vakansiyalar mavjud emas
                </motion.h2>
                <motion.p {...up(0.1)} className="text-gray-500 text-[16px] leading-relaxed mb-10">
                  Biz doimo malakali pedagog va mutaxassislarni izlaymiz. Yangi vakansiyalar paydo bo'lishi bilanoq bu yerda e'lon qilamiz. Rezyumengizni jo'nating — siz bilan bog'lanamiz!
                </motion.p>
              </div>
            ) : (
              <div className="space-y-6">
                {vacancies.map((v, i) => (
                  <motion.div key={v._id} {...up(i * 0.05)}
                    className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-orange/30 transition-all">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-xl font-black text-brand">{v.title}</h3>
                      <span className="shrink-0 bg-orange-faint text-orange text-xs font-bold px-3 py-1 rounded-full">
                        {TYPE_LABELS[v.type] || v.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                      {v.salary && <span className="flex items-center gap-1"><DollarSign size={14} /> {v.salary}</span>}
                      {v.location && <span className="flex items-center gap-1"><MapPin size={14} /> {v.location}</span>}
                    </div>
                    {v.description && (
                      <p className="text-gray-600 text-[15px] leading-relaxed mb-4 whitespace-pre-line">{v.description}</p>
                    )}
                    {v.requirements && (
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-brand mb-2">
                          <ListChecks size={16} className="text-orange" /> Talablar
                        </div>
                        <p className="text-gray-600 text-[14px] leading-relaxed whitespace-pre-line">{v.requirements}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            <motion.div {...up(0.15)} className="bg-gray-50 border border-gray-200 rounded-2xl p-8 mt-10 text-left">
              <div className="flex items-center gap-3 mb-5">
                <Bell size={18} className="text-orange" />
                <h3 className="text-brand font-bold text-[17px]">Rezyume qoldiring</h3>
              </div>
              <p className="text-gray-500 text-[14px] mb-5 leading-relaxed">
                Quyidagi kontaktlar orqali rezyumengizni yuboring. Mos vakansiya paydo bo'lganda siz bilan darhol bog'lanamiz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="tel:+998787774477"
                  className="inline-flex items-center gap-2 bg-brand text-white font-bold px-6 py-3 rounded-xl hover:brightness-110 transition-all">
                  <Phone size={16} /> +998 78 777 44 77
                </a>
                <a href="mailto:info@topex.uz"
                  className="inline-flex items-center gap-2 bg-white border-2 border-brand text-brand font-bold px-6 py-3 rounded-xl hover:bg-brand hover:text-white transition-all">
                  <Mail size={16} /> info@topex.uz
                </a>
              </div>
            </motion.div>

            <motion.div {...up(0.2)} className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <Link to="/"
                className="inline-flex items-center gap-2 bg-orange text-white font-bold px-7 py-3 rounded-xl hover:brightness-110 transition-all">
                <Home size={16} /> Bosh sahifaga
              </Link>
              <Link to="/aloqalar"
                className="inline-flex items-center gap-2 bg-gray-100 text-brand font-bold px-7 py-3 rounded-xl hover:bg-gray-200 transition-all">
                Aloqalar
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VakansiyaPage;
