import { useEffect, useState } from 'react';
const API_URL = import.meta.env.VITE_API_URL || '';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SeoHelmet from '../components/common/SeoHelmet';
import {
  CheckCircle2, Plus, Minus,
  Users, Award, Star, GraduationCap, BookOpen,
  MapPin,
  Code, TrendingUp, Palette, ShieldCheck, Hotel, BarChart3, FlaskConical, Sprout, X,
  Cpu, Music, Camera, Globe,
} from 'lucide-react';

const ICON_MAP = { Code, TrendingUp, Palette, ShieldCheck, Hotel, BarChart3, FlaskConical, Sprout, BookOpen, Star, Award, Users, Globe, Cpu, Music, Camera };
import { fetchCourses } from '../features/courses/coursesSlice';
import CourseCard from '../components/common/CourseCard';
import HeroSwiper from '../components/common/HeroSwiper';
import DirectionsSplit from '../components/common/DirectionsSplit';
import TeamSection from '../components/common/TeamSection';
import DiplomaSection from '../components/common/DiplomaSection';
import VideosSwiper from '../components/common/VideosSwiper';
import Spinner from '../components/ui/Spinner';
import PhoneInput from '../components/ui/PhoneInput';
import api from '../services/api';
import { toast } from 'react-toastify';

/* ─── reusable Stat block ──────────────────────────────── */
const StatBlock = ({ value, label }) => (
  <motion.div
    initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
    transition={{ duration:0.6 }}
    className="flex flex-col">
    <div className="flex items-start gap-1 leading-none">
      <span className="text-[44px] sm:text-[64px] md:text-[78px] font-black text-gray-900 leading-none">{value}</span>
      <span className="text-[32px] sm:text-[44px] md:text-[54px] font-black text-orange leading-none mt-2">+</span>
    </div>
    <span className="text-gray-500 text-[15px] mt-2 font-medium">{label}</span>
  </motion.div>
);

/* ─── animation helper ─────────────────────────────────── */
const up = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: 'easeOut', delay },
});

/* ─── Static data ───────────────────────────────────────── */
const STATS = [
  { val: '600+',  lbl: "O'quvchi",       icon: Users },
  { val: '3+',    lbl: "Filial",          icon: MapPin },
  { val: '50+',   lbl: "Mutaxassis",     icon: Award },
  { val: '10–11',  lbl: "Sinflar",         icon: GraduationCap },
];

const SUBJECTS = [
  { 
    icon: FlaskConical,   
    name: 'Laborant analitik',             
    desc: 'Laboratoriya tahlillari va ilmiy tadqiqotlar.', 
    img: '/assets/images/dir-5.jpg',
    duration: '2 yil',
    features: ['Kimyoviy tahlil', 'Sanoat laboratoriyasi', 'Sifat nazorati']
  },
  { 
    icon: Sprout,         
    name: "Dorivor o'simliklar laboranti",
    desc: 'Dorivor o\'simliklar yetishtirish va qayta ishlash.', 
    img: '/assets/images/dir-6.jpg',
    duration: '2 yil',
    features: ['Botanika', 'Dori tayyorlash', 'Fitoterapiya']
  },
  { 
    icon: TrendingUp,     
    name: 'Marketing va agrobiznes',       
    desc: "Raqamli marketing va qishloq xo'jaligi iqtisodiyoti.", 
    img: '/assets/images/dir-4.jpg',
    duration: '2 yil',
    features: ['SMM & Brending', 'Bozor tahlili', 'Eksport-import']
  },
  { 
    icon: Code,           
    name: 'Dasturlash',                    
    desc: 'Kod yozishdan tortib, murakkab tizimlar yaratishgacha.', 
    img: '/assets/images/dir-1.jpg',
    duration: '2 yil',
    features: ['Frontend & Backend', 'Mobil ilovalar', 'Portfolio yaratish']
  },
  { 
    icon: Palette,        
    name: 'Kompyuter grafikasi va dizayn',           
    desc: '3D modellashtirish, brending va vizual kontent.', 
    img: '/assets/images/dir-2.jpg',
    duration: '2 yil',
    features: ['Adobe Photoshop/Illustrator', '3D Blender', 'Motion dizayn']
  },
  { 
    icon: ShieldCheck,    
    name: 'Bank ishi',             
    desc: 'Bank va moliya tizimi asoslari.', 
    img: '/assets/images/dir-9.jpg',
    duration: '2 yil',
    features: ['Kredit tahlili', 'Xavfsizlik tizimlari', 'Bank auditi']
  },
  { 
    icon: Hotel,          
    name: 'Mehmonxona boshqaruvi',         
    desc: "Mehmonxona va turizm menejmenti.", 
    img: '/assets/images/dir-10.jpg',
    duration: '2 yil',
    features: ['Service Management', 'Event planning', 'Xorijiy tillar']
  },
  { 
    icon: BarChart3,      
    name: 'Raqamli axborotlar analitigi',   
    desc: "Ma'lumotlar tahlili va axborot tizimlari.",
    img: '/assets/images/dir-3.jpg',
    duration: '2 yil',
    features: ['Big Data', 'Excel & SQL', 'Biznes strategiya']
  },
];

const VIDEOS = [
  { src: '/assets/images/AQM2loG1aPrNuG2FTRwfoI0IVFG5Q0Sj3Ru3sDUJa8MTtZGtFt3NfdibVyfBr08.mp4?v=2', title: '' },
  { src: '/assets/images/AQNVohQJLVps32Fjk5QM6GotJ1A2VROgEZbGgigO7EqoawCIRlrzwPEblUpONxr.mp4?v=2', title: '' },
  { src: '/assets/images/AQOg3sZQMrzC4wXOlnIa_Q4_3rhnd0iUd1hCvLkg_e5XHST8RTuI_ycE8hdNHSa.mp4?v=2', title: '' },
  { src: '/assets/images/AQPNyI22OTZPaXj3NUGSKD3kFs6bzqdxkodds_uuUV0Lwq0eDy_WaArlTHUMil96DCvNrrnHjCT.mp4?v=2', title: '' },
  { src: '/assets/images/AQPTt2KL3eeR5E_oD0skwnKQNJposlGgzp0MHWhSu2_2znBnZoj98qXDJk8cqrf.mp4?v=2', title: '' },
];

const EXTRAS = [
  "IT va Robototexnika",
  "Ingliz tili (IELTS tayyorlov)",
  "Matematika olimpiadasi",
  "Shaxmat",
  "Stol tennisi",
  "Ijodiy to'garaklar",
];

const FEATURES = [
  {
    title: "Tajribali o'qituvchilar",
    desc: "Har bir fandan yuqori malakali va tajribali pedagoglar jamoasi",
    bg: 'bg-blue/8', col: 'text-blue',
  },
  {
    title: "Zamonaviy sinf xonalar",
    desc: "Eng zamonaviy jihozlar, laboratoriya va multimedia vositalari",
    bg: 'bg-teal/10', col: 'text-teal-dark',
  },
  {
    title: "Individual yondashuv",
    desc: "Har bir o'quvchiga alohida e'tibor va o'quv rejasi",
    bg: 'bg-coral/8', col: 'text-coral-dark',
  },
  {
    title: "Olimpiada natijalari",
    desc: "Respublika va xalqaro olimpiadalarda yuksak yutuqlar",
    bg: 'bg-blue/8', col: 'text-blue',
  },
];

const STATIC_SCHOLARSHIP_CARDS = [
  { title: 'SAT 1200+',       subtitle: '',            amount: '2 MLN',    amountUnit: "so'm", badge: "Deyarli bepul o'qish", colorType: 'blue' },
  { title: 'Chet tili C1',    subtitle: 'IELTS 7.0+',  amount: '1 MLN',    amountUnit: "so'm", badge: 'Katta chegirma',       colorType: 'teal' },
  { title: 'Chet tili B2',    subtitle: 'IELTS 5.5-6.5', amount: '500 MING', amountUnit: "so'm", badge: 'Stipendiya',          colorType: 'blue2' },
  { title: 'Fan sertifikati', subtitle: 'B+ darajasi', amount: '500 MING', amountUnit: "so'm", badge: 'Stipendiya',           colorType: 'coral' },
];

const SC_COLORS = {
  blue:  { grad: 'bg-blue-grad',  shadow: 'shadow-blue/5',  iconBg: 'from-blue to-blue-dark',        iconShadow: 'shadow-blue/30',  amtColor: 'text-blue',      badgeCls: 'text-coral bg-coral/10',    Icon: Award },
  teal:  { grad: 'bg-teal-grad',  shadow: 'shadow-teal/5',  iconBg: 'from-teal-400 to-teal-600',     iconShadow: 'shadow-teal/30',  amtColor: 'text-teal-600',  badgeCls: 'text-teal-700 bg-teal-100', Icon: Star },
  blue2: { grad: 'bg-blue-grad',  shadow: 'shadow-blue/5',  iconBg: 'from-blue-400 to-blue-600',     iconShadow: 'shadow-blue/30',  amtColor: 'text-blue',      badgeCls: 'text-blue bg-blue/10',      Icon: BookOpen },
  coral: { grad: 'bg-coral-grad', shadow: 'shadow-coral/5', iconBg: 'from-coral to-coral-dark',      iconShadow: 'shadow-coral/30', amtColor: 'text-coral',     badgeCls: 'text-coral bg-coral/10',    Icon: CheckCircle2 },
};

const STATIC_FAQS = [
  { _id: 'f1', question: "Diplom davlat namunasidagimi?", answer: "Ha, bitiruvchilarga davlat namunasidagi diplom beriladi." },
  { _id: 'f2', question: "O'qish narxi qancha?", answer: "Oylik to'lov 2 500 000 so'm (yiliga 10 oy)." },
  { _id: 'f3', question: "Grantlar bormi?", answer: "Ha, bizda jami 1 milliard so'mlik grant fondi mavjud." },
];

const STATIC_REVIEWS = [
  { _id: 'r1', name: 'Zulfiya Xasanova', role: "9-sinf o'quvchisining onasi", avatar: '/assets/posts/avatar-02.webp', text: "Topex texnikumiga o'tganidan beri o'g'lim matematika va fizikadan sezilarli yutuqlar ko'rsatyapti. O'qituvchilar juda mehribon va tajribali.", rating: 5 },
  { _id: 'r2', name: 'Behruz Toshmatov', role: '11-sinf bitiruvchisi', avatar: '/assets/posts/avatar-01.webp', text: "Topexda o'qigan 3 yilim hayotimning eng foydali davri bo'ldi. Olimpiadada birinchi o'rin oldim va universitetga kirish oson bo'ldi.", rating: 5 },
  { _id: 'r3', name: 'Nilufar Rahimova', role: "6-sinf o'quvchisining otasi", avatar: '/assets/posts/avatar-02.webp', text: "Individual yondashuv va zamonaviy usullar tufayli qizimning o'zlashtirishi keskin yaxshilandi. Texnikum bilan juda mamnunmiz.", rating: 5 },
];

/* ─── Accordion item ─────────────────────────────────────── */
const Acc = ({ q, a, dark }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={dark ? 'faq-row' : 'acc-row'}>
      <button className={dark ? 'faq-btn' : 'acc-btn'} onClick={() => setOpen(v => !v)}>
        <span>{q}</span>
        <span className="ml-4 flex-shrink-0">
          {open ? <Minus size={17} /> : <Plus size={17} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className={`pb-4 text-sm leading-relaxed ${dark ? 'text-white/65' : 'text-gray-500'}`}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PremiumAcc = ({ q, a, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`border border-gray-200/80 rounded-[1.5rem] bg-white/60 backdrop-blur-md overflow-hidden transition-all duration-300 ${open ? 'shadow-xl shadow-blue/5 border-blue/30 bg-white' : 'hover:border-blue/40 hover:bg-white hover:shadow-md'}`}
    >
      <button 
        className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none group" 
        onClick={() => setOpen(v => !v)}
      >
        <span className={`font-extrabold text-[15px] sm:text-base pr-4 transition-colors ${open ? 'text-blue' : 'text-navy group-hover:text-blue'}`}>{q}</span>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${open ? 'bg-blue text-white rotate-180' : 'bg-gray-100 text-gray-500 group-hover:bg-blue/10 group-hover:text-blue'}`}>
          {open ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>
              <p className="text-gray-500 text-[15px] leading-relaxed">
                {a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Page ───────────────────────────────────────────────── */
const HomePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const { list: courses, loading: cLoad } = useSelector(s => s.courses);
  const [form, setForm] = useState({ name: '', phone: '', grade: '9' });
  const [faqs, setFaqs] = useState(STATIC_FAQS);
  const [reviews, setReviews] = useState(STATIC_REVIEWS);
  const [settings, setSettings] = useState(null);
  const [homeVideos, setHomeVideos] = useState([]);
  const [dbSubjects, setDbSubjects] = useState([]);
  const [dbExtras, setDbExtras] = useState([]);
  const [dbFeatures, setDbFeatures] = useState([]);
  const [dbScholarshipCards, setDbScholarshipCards] = useState([]);

  useEffect(() => {
    dispatch(fetchCourses({ limit: 6 }));
    api.get('/faq').then(r => { if (r.data.data?.length) setFaqs(r.data.data); }).catch(() => {});
    api.get('/testimonials').then(r => { if (r.data.data?.length) setReviews(r.data.data); }).catch(() => {});
    api.get('/settings').then(r => {
      const d = r.data.data;
      if (d) {
        setSettings(d);
        if (d.subjects?.length > 0)         setDbSubjects(d.subjects);
        if (d.extras?.length > 0)            setDbExtras(d.extras);
        if (d.features?.length > 0)          setDbFeatures(d.features);
        if (d.scholarshipCards?.length > 0)  setDbScholarshipCards(d.scholarshipCards);
      }
    }).catch(() => {});
    api.get('/home-videos').then(r => { if (Array.isArray(r.data.data)) setHomeVideos(r.data.data); }).catch(() => {});
  }, [dispatch]);

  const displaySubjects        = dbSubjects.length        > 0 ? dbSubjects        : SUBJECTS;
  const displayExtras          = dbExtras.length          > 0 ? dbExtras          : EXTRAS;
  const displayFeatures        = dbFeatures.length        > 0 ? dbFeatures        : FEATURES;
  const displayScholarshipCards = dbScholarshipCards.length > 0 ? dbScholarshipCards : STATIC_SCHOLARSHIP_CARDS;

  const displayVideos = homeVideos.length > 0
    ? homeVideos.map(v => ({
        src: !v.url
          ? ''
          : v.url.startsWith('http') || v.url.startsWith('/assets')
            ? v.url
            : `${API_URL}${v.url}`,
        title: v.title,
        photo: v.photo || '',
      }))
    : VIDEOS;

  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const fullName = (form.name || '').trim();
    const phone = (form.phone || '').trim();
    const grade = String(form.grade || '').trim();

    if (!fullName) { toast.error(t('formToast.errName')); return; }
    if (!phone)    { toast.error(t('formToast.errPhone')); return; }
    if (grade !== '9' && grade !== '11') { toast.error(t('formToast.errGrade')); return; }

    try {
      setSubmitting(true);
      await api.post('/applications', { fullName, phone, grade });
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
      <SeoHelmet
        title={settings?.siteTitle || "Topex Texnikumi – Sifatli Ta'lim, 10–11 Sinflar"}
        description={settings?.siteDescription || "Topex – Toshkent, Chilonzor tumanidagi zamonaviy xususiy texnikum. 10-11 sinflar. Tajribali o'qituvchilar, olimpiada natijalari."}
        keywords="TOPEX, Topex Texnikumi, xususiy texnikum Toshkent, Chilonzor, 10-sinf, 11-sinf, olimpiada, grant, akademik litsey"
        canonical="https://topextexnikum.uz/"
        ogImage="https://topextexnikum.uz/assets/images/hero/hero-2.webp"
      />

      {/* ══ 1. HERO — Profi-style split ══════════════════════ */}
      <HeroSwiper settings={settings} />


      {/* ══ 2. STATS BAR ══════════════════════════════════════ */}
      <section className="bg-navy-grad py-10">
        <div className="wrap">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:divide-x divide-white/10">
            {[
              { val: settings?.statsStudents || STATS[0].val, lbl: t('stats.students'), icon: STATS[0].icon },
              { val: settings?.statsBranches || STATS[1].val, lbl: t('stats.branches'), icon: STATS[1].icon },
              { val: settings?.statsTeachers || STATS[2].val, lbl: t('stats.teachers'), icon: STATS[2].icon },
            ].map(({ val, lbl, icon:Icon }, i) => (
              <motion.div {...up(i*0.07)} key={lbl} className="flex flex-col items-center text-center py-2 px-4">
                <Icon size={26} className="text-coral mb-3" />
                <p className="text-white font-black text-3xl">{val}</p>
                <p className="text-white/55 text-sm mt-1">{lbl}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3. TEXNIKUM HAQIDA — Profi-style ══════════════════ */}
      <section className="relative bg-white py-12 sm:py-20 lg:py-28 overflow-hidden">
        {/* Subtle linework decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.04] pointer-events-none"
             style={{
               backgroundImage: "repeating-linear-gradient(135deg, transparent 0 40px, #1d3a8a 40px 41px)"
             }} />

        <div className="w-full px-6 lg:px-16 max-w-[1500px] mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* LEFT — foto kollaj: bitta katta + ikkita kichik */}
            <motion.div {...up(0)} className="relative">
              <div className="grid grid-cols-2 gap-4 lg:gap-5">
                <motion.div
                  initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ duration:0.6 }}
                  className="col-span-2 rounded-2xl overflow-hidden shadow-xl aspect-[16/9]">
                  <img src="/assets/images/DSC03766.jpg" alt="Topex Texnikumi" loading="lazy"
                       className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </motion.div>
                {['/assets/images/DSC03779.jpg', '/assets/images/DSC04192.jpg'].map((src, i) => (
                  <motion.div key={src}
                    initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                    transition={{ duration:0.6, delay: 0.12 + i*0.1 }}
                    className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
                    <img src={src} alt="Topex Texnikumi" loading="lazy"
                         className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT — text + stats */}
            <motion.div {...up(0.15)}>
              <span className="inline-block text-orange font-bold text-[13px] uppercase tracking-[0.18em] mb-5">
                {t('about.label')}
              </span>
              <h2 className="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[52px] font-black text-brand leading-[1.05] mb-7">
                {t('about.title')}
              </h2>
              <p className="text-gray-600 text-base mb-5">
                {t('about.slogan')}
              </p>
              <p className="text-gray-600 text-[15px] md:text-[16px] leading-[1.75] mb-10 max-w-xl">
                {t('about.paragraph')}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-8 mb-12 max-w-md">
              <StatBlock value={settings?.aboutStat1Value || '600'} label={t('stats.students')} />
              <StatBlock value={settings?.aboutStat2Value || '50'} label={t('stats.teacher')} />
              </div>

              <button
                onClick={() => document.getElementById('ariza')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center bg-brand hover:bg-brand-dark
                           text-white font-semibold px-12 py-4 rounded-xl shadow-lg
                           hover:-translate-y-0.5 transition-all duration-200 text-[15px]">
                {t('about.more')}
              </button>
            </motion.div>
          </div>
        </div>
      </section>



      {/* ══ 4. YO'NALISHLAR — statik ro'yxat ══ */}
      <DirectionsSplit subjects={SUBJECTS} settings={settings} onSelect={setSelected} />

      {/* ══ 5. JAMOA — Bizning mutaxassislar (statik 13 ustoz) ═ */}
      <TeamSection settings={settings} />

      {/* ══ 6. HUJJAT / SERTIFIKAT — Diplom bo'limi ═══════════ */}
      <DiplomaSection settings={settings} />

      {/* ══ 7. VIDEO — Talabalik hayoti ═════════════════════ */}
      {displayVideos.length > 0 && <VideosSwiper videos={displayVideos} onOpen={setActiveVideo} settings={settings} />}







      {/* ══ ARIZA — Profi-style form ═════════════════════════ */}
      <section id="ariza" className="relative bg-white py-12 sm:py-20 lg:py-28 overflow-hidden">
        {/* Decorative line pattern */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 60px, #1d3a8a 60px 61px)',
          }}
        />

        <div className="w-full max-w-[1500px] mx-auto px-6 lg:px-16 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* LEFT — Form */}
            <div>
              <motion.span
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                className="inline-block text-orange font-bold text-[13px] uppercase tracking-[0.18em] mb-5">
                {t('form.label')}
              </motion.span>
              <motion.h2
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay:0.1 }}
                className="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[52px] font-black text-brand leading-[1.05] mb-8">
                {t('form.title')}
              </motion.h2>
              <motion.p
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay:0.2 }}
                className="text-gray-600 text-[16px] leading-[1.85] mb-10 max-w-xl">
                {t('form.paragraph')}
              </motion.p>

              <motion.form
                onSubmit={submit}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay:0.3 }}
                className="space-y-5 max-w-xl">

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
              initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
              transition={{ duration:0.7 }}
              className="relative hidden lg:flex items-center justify-center min-h-[620px]">
              {/* Yumshoq brend nur (orqada) */}
              <div className="absolute w-[360px] h-[480px] rounded-[60px] bg-brand/5 blur-3xl" />
              {/* Dekorativ nuqtalar (tepa-o'ng) */}
              <div className="absolute top-6 right-10 w-32 h-32 opacity-20 pointer-events-none"
                   style={{ backgroundImage: 'radial-gradient(circle, #1d3a8a 1.6px, transparent 1.6px)', backgroundSize: '18px 18px' }} />
              {/* Foto — toza arch, oq chekka, bosh to'liq (object-top) */}
              <div className="relative z-10 w-[400px] h-[560px] overflow-hidden ring-4 ring-white
                              shadow-2xl bg-gray-100"
                   style={{ borderRadius: '180px 180px 36px 36px' }}>
                <img
                  src="/assets/images/DSC04276.jpg"
                  alt="Topex talabasi"
                  loading="lazy"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* ── Lightbox ── */}
      <AnimatePresence>
        {selected && (
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
                <img
                  src={selected.imgUrl ? (selected.imgUrl.startsWith('/assets') ? selected.imgUrl : `${API_URL}${selected.imgUrl}`) : (selected.img || '')}
                  alt={selected.name}
                  loading="lazy"
                  className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent md:hidden"></div>
              </div>
              <div className="w-full md:w-1/2 p-5 md:p-8 lg:p-12 flex flex-col bg-white text-left">
                {(() => { const SelIcon = selected.icon || ICON_MAP[selected.iconName] || BookOpen; return (
                  <div className="w-16 h-16 rounded-2xl bg-blue/10 flex items-center justify-center text-blue mb-6">
                    <SelIcon size={32} strokeWidth={2} />
                  </div>
                ); })()}
                <h2 className="text-navy text-3xl font-black mb-4">{selected.name}</h2>
                <p className="text-gray-500 text-lg leading-relaxed mb-8">{selected.desc}</p>

                <div className="mt-auto space-y-4">
                  <div className="flex items-center gap-3 text-sm font-medium text-navy bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <GraduationCap size={20} className="text-blue" />
                    <span>{t('coursesPage.duration')} <span className="font-bold">{selected.duration} {t('coursesPage.grades1011')}</span></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-navy bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <TrendingUp size={20} className="text-coral" />
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(selected.features)
                        ? selected.features
                        : (selected.features || '').split(',').map(f => f.trim()).filter(Boolean)
                      ).map((f, i) => (
                        <span key={i} className="after:content-[','] last:after:content-[''] mr-1">{f}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setSelected(null);
                    document.getElementById('ariza')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-blue w-full mt-8 py-4 text-base"
                >
                  {t('coursesPage.applyBtn')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Video Lightbox ── */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setActiveVideo(null)}
          >
            <button 
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all z-[120]"
              onClick={() => setActiveVideo(null)}
            >
              <X size={24} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="max-w-5xl w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <video 
                src={activeVideo.url || activeVideo.src} 
                className="w-full h-full"
                controls 
                autoPlay 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HomePage;
