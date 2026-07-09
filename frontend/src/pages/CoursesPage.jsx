import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import SeoHelmet from '../components/common/SeoHelmet';
import {
  BookOpen, GraduationCap, ArrowRight, Home, ChevronRight,
  Code, TrendingUp, Palette, ShieldCheck, Hotel, BarChart3, FlaskConical, Sprout,
  Star, Award, Users, Globe, Cpu, Music, Camera, X, Wallet,
} from 'lucide-react';
import { fetchCourses, setFilters } from '../features/courses/coursesSlice';
import CourseCard from '../components/common/CourseCard';
import Spinner from '../components/ui/Spinner';
import api from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || '';

const ICON_MAP = {
  Code, TrendingUp, Palette, ShieldCheck, Hotel, BarChart3, FlaskConical, Sprout,
  BookOpen, Star, Award, Users, Globe, Cpu, Music, Camera,
};

const resolveImg = (url) => {
  if (!url) return '/assets/images/form-photo.webp';
  if (url.startsWith('http') || url.startsWith('/assets')) return url;
  return `${API_URL}${url}`;
};

/* Yo'nalish nomi bo'yicha lokal zaxira rasm — admin rasm yuklamagan bo'lsa
   qora "Rasm mavjud emas" o'rniga shu ko'rsatiladi */
const SUBJECT_IMG_FALLBACKS = [
  ['dorivor',     '/assets/images/DSC03528.jpg'],
  ['laborant',    '/assets/images/dir-5.jpg'],
  ['marketing',   '/assets/images/DSC02988.jpg'],
  ['grafik',      '/assets/images/DSC03024.jpg'],
  ['dizayn',      '/assets/images/DSC03024.jpg'],
  ['bank',        '/assets/images/DSC04146.jpg'],
  ['mehmonxona',  '/assets/images/DSC03972.jpg'],
  ['raqamli',     '/assets/images/DSC03700.jpg'],
  ['dasturlash',  '/assets/images/dir-1.jpg'],
];
const subjectFallbackImg = (name = '') => {
  const n = name.toLowerCase();
  const hit = SUBJECT_IMG_FALLBACKS.find(([k]) => n.includes(k));
  return hit ? hit[1] : '/assets/images/form-photo.webp';
};

const up = (delay = 0) => ({
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.5, ease: 'easeOut', delay },
});

const DEFAULT_HIGHLIGHTS = (t) => [
  { img: '/assets/icons/icon-02.webp', title: t('coursesPage.highlights.chemistry'),   students: '120+' },
  { img: '/assets/icons/icon-04.webp', title: t('coursesPage.highlights.literature'),  students: '85+' },
  { img: '/assets/icons/icon-06.webp', title: t('coursesPage.highlights.olympiads'),   students: '200+' },
  { img: '/assets/icons/icon-08.webp', title: t('coursesPage.highlights.research'),    students: '60+' },
];

const DEFAULT_SUBJECTS = (t) => [
  { icon: Code,        name: t('coursesPage.subjects.programming'), desc: t('coursesPage.subjects.programmingDesc'),  img: '/assets/images/dir-1.jpg',      duration: t('narxPage.years3'), features: [t('coursesPage.subjects.programmingF1'), t('coursesPage.subjects.programmingF2'), t('coursesPage.subjects.programmingF3')] },
  { icon: TrendingUp,  name: t('coursesPage.subjects.marketing'),   desc: t('coursesPage.subjects.marketingDesc'),    img: '/assets/images/DSC02988.jpg',   duration: t('narxPage.years3'), features: [t('coursesPage.subjects.marketingF1'), t('coursesPage.subjects.marketingF2'), t('coursesPage.subjects.marketingF3')] },
  { icon: Palette,     name: t('coursesPage.subjects.design'),      desc: t('coursesPage.subjects.designDesc'),       img: '/assets/images/DSC03024.jpg',   duration: t('narxPage.years3'), features: [t('coursesPage.subjects.designF1'), t('coursesPage.subjects.designF2'), t('coursesPage.subjects.designF3')] },
  { icon: ShieldCheck, name: t('coursesPage.subjects.banking'),     desc: t('coursesPage.subjects.bankingDesc'),      img: '/assets/images/DSC04146.jpg',   duration: t('narxPage.years3'), features: [t('coursesPage.subjects.bankingF1'), t('coursesPage.subjects.bankingF2'), t('coursesPage.subjects.bankingF3')] },
  { icon: Hotel,       name: t('coursesPage.subjects.hotel'),       desc: t('coursesPage.subjects.hotelDesc'),        img: '/assets/images/DSC03972.jpg',   imgPos: '50% 18%', duration: t('narxPage.years3'), features: [t('coursesPage.subjects.hotelF1'), t('coursesPage.subjects.hotelF2'), t('coursesPage.subjects.hotelF3')] },
  { icon: BarChart3,   name: t('coursesPage.subjects.analytics'),   desc: t('coursesPage.subjects.analyticsDesc'),    img: '/assets/images/DSC03700.jpg',   duration: t('narxPage.years3'), features: [t('coursesPage.subjects.analyticsF1'), t('coursesPage.subjects.analyticsF2'), t('coursesPage.subjects.analyticsF3')] },
  { icon: FlaskConical,name: t('coursesPage.subjects.laborant'),    desc: t('coursesPage.subjects.laborantDesc'),     img: '/assets/images/dir-5.jpg',      duration: t('narxPage.years3'), features: [t('coursesPage.subjects.laborantF1'), t('coursesPage.subjects.laborantF2'), t('coursesPage.subjects.laborantF3')] },
  { icon: Sprout,      name: t('coursesPage.subjects.phytolab'),    desc: t('coursesPage.subjects.phytolabDesc'),     img: '/assets/images/DSC03528.jpg',   duration: t('narxPage.years3'), features: [t('coursesPage.subjects.phytolabF1'), t('coursesPage.subjects.phytolabF2'), t('coursesPage.subjects.phytolabF3')] },
];

const COURSES_BGS = [
  '/assets/images/DSC03752.jpg',
  '/assets/images/DSC03690.jpg',
  '/assets/images/DSC02973.jpg',
];

const CoursesPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { list, loading, meta, filters } = useSelector((s) => s.courses);
  const [selected, setSelected] = useState(null);
  const [settings, setSettings] = useState(null);
  const [dbSubjects, setDbSubjects] = useState([]);
  const [dbHighlights, setDbHighlights] = useState([]);
  const [bgIdx, setBgIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setBgIdx(p => (p + 1) % COURSES_BGS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    dispatch(fetchCourses(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    api.get('/settings').then(r => {
      const d = r.data.data;
      if (!d) return;
      setSettings(d);
      if (d.coursesHighlights?.length > 0) setDbHighlights(d.coursesHighlights);
    }).catch(() => {});
  }, []);

  const handlePage = (page) => dispatch(setFilters({ page }));

  const displaySubjects  = dbSubjects.length > 0 ? dbSubjects : DEFAULT_SUBJECTS(t);
  const displayHighlights = dbHighlights.length > 0 ? dbHighlights : DEFAULT_HIGHLIGHTS(t);

  return (
    <>
      <SeoHelmet
        title={t('coursesPage.meta.title')}
        description={t('coursesPage.meta.description')}
        keywords={t('coursesPage.meta.keywords')}
        canonical="https://topextexnikum.uz/courses"
        ogImage="https://topextexnikum.uz/assets/images/DSC01036.webp"
      >
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": "https://topextexnikum.uz/" },
            { "@type": "ListItem", "position": 2, "name": "Yo'nalishlar", "item": "https://topextexnikum.uz/courses" }
          ]
        })}</script>
      </SeoHelmet>

      {/* ── Hero (dark banner — admin fon-rasmni boshqaradi) ── */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-opacity duration-700"
          style={{
            backgroundImage: `url('${COURSES_BGS[bgIdx]}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/80 to-navy/95" />
        {/* glow accents */}
        <div className="absolute -top-24 right-0 w-[28rem] h-[28rem] bg-orange/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-24 left-0 w-96 h-96 bg-blue/25 rounded-full blur-[130px] pointer-events-none" />
        {/* line pattern */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 50px, #fff 50px 51px)' }}
        />

        <div className="wrap relative z-10 text-center">
          <motion.div {...up(0)}
            className="inline-flex items-center gap-2 bg-white/10 text-white/85 backdrop-blur-md
                       border border-white/15 rounded-full px-4 py-2 text-sm font-semibold mb-6">
            <GraduationCap size={15} className="text-orange" /> {t('coursesPage.heroBadge')}
          </motion.div>
          <motion.h1 {...up(0.05)} className="text-4xl md:text-6xl font-black text-white leading-[1.08] mb-5 drop-shadow-lg">
            {t('coursesPage.heroTitle')}
          </motion.h1>
          <motion.p {...up(0.1)} className="text-white/65 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
            {t('coursesPage.heroSubtitle')}
          </motion.p>
          <motion.div {...up(0.15)} className="flex items-center justify-center gap-2 text-white/70 text-sm font-medium">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-orange transition-colors">
              <Home size={14} /> {t('coursesPage.breadcrumbHome')}
            </Link>
            <ChevronRight size={14} className="opacity-60" />
            <span className="text-orange">{t('coursesPage.breadcrumbDirections')}</span>
          </motion.div>
        </div>
      </section>

      {/* ── Bizning fakultetlar ── */}
      <section className="sec bg-gray-50">
        <div className="wrap">
          <motion.div {...up(0)} className="text-center mb-12">
            <span className="lbl text-blue">{t('coursesPage.facultyLabel')}</span>
            <h2 className="text-3xl md:text-4xl font-black text-navy">
              {t('coursesPage.facultyTitle')}
            </h2>
            <p className="text-navy/60 mt-3 max-w-2xl mx-auto">
              {t('coursesPage.facultySubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displaySubjects.map((s, i) => {
              const Icon = s.icon || ICON_MAP[s.iconName] || BookOpen;
              return (
                <motion.button
                  key={i}
                  {...up(i * 0.05)}
                  onClick={() => setSelected(s)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl
                             hover:-translate-y-1.5 transition-all duration-300 ease-out text-left border border-gray-100"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={s.img}
                      alt={s.name}
                      loading="lazy"
                      style={{ objectPosition: s.imgPos || 'center' }}
                      onError={(e) => { if (s.imgFallback && e.currentTarget.src !== location.origin + s.imgFallback) e.currentTarget.src = s.imgFallback; }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[600ms] ease-out"
                    />
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center text-blue shadow">
                      <Icon size={20} strokeWidth={2} />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-navy font-bold text-lg mb-2 group-hover:text-blue transition-colors">
                      {s.name}
                    </h3>
                    <p className="text-navy/60 text-sm leading-relaxed line-clamp-2">
                      {s.desc}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Courses grid ── */}
      {(loading || list.length > 0) && (
        <section className="sec bg-white">
          <div className="wrap">
            {loading ? (
              <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            ) : (
              <>
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {list.map((course, i) => (
                    <motion.div
                      key={course._id}
                      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                    >
                      <CourseCard course={course} index={i} />
                    </motion.div>
                  ))}
                </motion.div>

                {meta && meta.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {[...Array(meta.pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePage(i + 1)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                          filters.page === i + 1
                            ? 'bg-navy text-white shadow-card'
                            : 'bg-gray-100 text-navy hover:bg-gray-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* ── Pricing ── */}
      <section className="sec bg-white">
        <div className="wrap">
          <motion.div {...up(0)} className="text-center mb-12">
            <span className="lbl text-emerald-600">{t('coursesPage.heroBadge')}</span>
            <h2 className="text-3xl md:text-4xl font-black text-navy">
              {t('coursesPage.pricingTitle')}
            </h2>
            <p className="text-navy/60 mt-3 max-w-2xl mx-auto">
              {t('coursesPage.pricingSubtitle')}
            </p>
          </motion.div>

          <motion.div {...up(0.05)}
            className="max-w-2xl mx-auto bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 rounded-3xl p-8 pt-12 md:p-12 md:pt-14 border border-emerald-100 relative overflow-hidden
                       shadow-[0_24px_60px_-18px_rgba(16,185,129,0.35)] ring-1 ring-emerald-100/60
                       transition-transform duration-300 hover:-translate-y-1"
          >
            {/* 20% discount badge — to'liq ko'rinadigan 3D lenta */}
            <div className="absolute top-0 right-0">
              <div className="bg-gradient-to-b from-red-500 to-red-600 text-white font-black text-sm tracking-wider
                              px-6 py-2.5 rounded-bl-3xl rounded-tr-3xl
                              border-b-4 border-red-800/60
                              shadow-[0_10px_24px_rgba(239,68,68,0.45)]
                              [text-shadow:0_1px_3px_rgba(0,0,0,0.4)]">
                {t('pricing.badge')}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-6">
              <div className="text-center">
                {/* Old price — strikethrough red */}
                <div className="text-3xl font-black text-red-500 line-through whitespace-nowrap">
                  25 000 000 {t('pricing.sum')}
                </div>
                <div className="text-xs text-red-400 mb-2">{t('pricing.noDiscount')}</div>
                {/* Actual price — green */}
                <div className="text-4xl font-black text-emerald-700 whitespace-nowrap [text-shadow:0_2px_10px_rgba(16,185,129,0.25)]">
                  20 000 000 {t('pricing.sum')}
                </div>
                <div className="text-sm text-emerald-600 font-semibold">{t('pricing.yearly')}</div>
              </div>
              <div className="hidden sm:block w-px h-20 bg-emerald-200" />
              <div className="text-center">
                <div className="text-3xl font-black text-emerald-700 whitespace-nowrap">
                  2 000 000 {t('pricing.sum')}
                </div>
                <div className="text-sm text-navy/50 mt-1">{t('pricing.monthly')}</div>
              </div>
            </div>
            <div className="text-center text-sm text-navy/60 mb-6">
              {t('coursesPage.pricingNote')}
            </div>
            <div className="text-center text-[13px] font-bold text-red-500 mb-4">
              ⏳ {t('pricing.until')}
            </div>
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-100/60 rounded-xl px-5 py-3">
              <Award size={18} />
              {t('coursesPage.pricingGrant')}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="sec-mid py-14">
        <div className="wrap">
          <motion.div
            {...up(0)}
            className="bg-navy rounded-3xl p-10 md:p-14 flex flex-col md:flex-row
                       items-center justify-between gap-8"
          >
            <div>
              <span className="lbl text-coral">{t('coursesPage.ctaLabel')}</span>
              <h2 className="text-3xl font-black text-white mb-3 whitespace-pre-line">
                {t('coursesPage.ctaTitle')}
              </h2>
              <p className="text-white/55">
                {t('coursesPage.ctaSubtitle')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <a href={`tel:${settings?.coursesCtaPhone || '+998787774477'}`} className="btn-coral text-base px-8 py-4 whitespace-nowrap">
                {t('coursesPage.ctaPhoneBtn')}
              </a>
              <a href="/" className="btn-outline text-base px-8 py-4 whitespace-nowrap border-white text-white hover:bg-white hover:text-navy">
                {t('coursesPage.ctaHomeBtn')} <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {selected && (() => {
          const SelIcon = selected.icon || ICON_MAP[selected.iconName] || BookOpen;
          const selImg  = selected.img || resolveImg(selected.imgUrl || '');
          const selFeatures = Array.isArray(selected.features)
            ? selected.features
            : (selected.features || '').split(',').map(f => f.trim()).filter(Boolean);
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-navy/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
              onClick={() => setSelected(null)}
            >
              <button
                className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
                onClick={() => setSelected(null)}
              >
                <X size={24} />
              </button>

              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="max-w-4xl w-full bg-white rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
                onClick={e => e.stopPropagation()}
              >
                <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                  <img src={selImg} alt={selected.name} loading="lazy" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent md:hidden"></div>
                </div>
                <div className="w-full md:w-1/2 p-5 md:p-8 lg:p-12 flex flex-col bg-white">
                  <div className="w-16 h-16 rounded-2xl bg-blue/10 flex items-center justify-center text-blue mb-6">
                    <SelIcon size={32} strokeWidth={2} />
                  </div>
                  <h2 className="text-navy text-3xl font-black mb-4">{selected.name}</h2>
                  <p className="text-gray-500 text-lg leading-relaxed mb-8">{selected.desc}</p>

                  <div className="mt-auto space-y-4">
                    <div className="flex items-center gap-3 text-sm font-medium text-navy bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <GraduationCap size={20} className="text-blue" />
                      <span>{t('coursesPage.duration')} <span className="font-bold">{selected.duration} {t('coursesPage.grades1011')}</span></span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-emerald-700 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                      <Wallet size={20} className="text-emerald-600" />
                      <span>{t('coursesPage.payment')} <span className="font-bold">{t('coursesPage.pricingMonthly')}</span></span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-navy bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <TrendingUp size={20} className="text-coral" />
                      <div className="flex flex-wrap gap-1">
                        {selFeatures.map((f, i) => (
                          <span key={i} className="after:content-[','] last:after:content-[''] mr-1">{f}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelected(null);
                      window.location.href = '/#ariza';
                    }}
                    className="btn-blue w-full mt-8 py-4 text-base"
                  >
                    {t('coursesPage.applyBtn')}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </>
  );
};

export default CoursesPage;
