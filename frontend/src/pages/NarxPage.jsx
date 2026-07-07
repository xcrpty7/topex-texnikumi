import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Home, ChevronRight, Wallet, GraduationCap, Award, CheckCircle,
  BookOpen, TrendingUp, Palette, ShieldCheck, Hotel, BarChart3, FlaskConical, Sprout,
  ArrowRight, CreditCard, Percent, Landmark, Gift,
} from 'lucide-react';
import api from '../services/api';

const up = (delay = 0) => ({
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.5, ease: 'easeOut', delay },
});

const ICON_MAP = {
  Dasturlash: BookOpen, Marketing: TrendingUp, Grafikasi: Palette,
  Nazoratchisi: ShieldCheck, Boshqaruvi: Hotel, Analitigi: BarChart3,
    Laborant: FlaskConical, "O'simliklar": Sprout,
};

const NarxPage = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/settings').then(r => {
      const d = r.data.data;
      if (d) setSettings(d);
    }).catch(() => {});
  }, []);

  const subjects = settings?.subjects?.length > 0 ? settings.subjects : [
    { name: 'Dasturlash', duration: '2 yil' },
    { name: 'Marketing va Agrobiznes', duration: '2 yil' },
    { name: 'Kompyuter Grafikasi', duration: '2 yil' },
    { name: 'Bank Nazoratchisi', duration: '2 yil' },
    { name: 'Mehmonxona Boshqaruvi', duration: '2 yil' },
    { name: 'Raqamli Axborotlar Analitigi', duration: '2 yil' },
    { name: 'Laborant-Analitik', duration: '2 yil' },
    { name: "Dorivor O'simliklar Laboranti", duration: '2 yil' },
  ];

  return (
    <>
      <Helmet>
        <title>O'qish narxlari – Topex Texnikumi 2026</title>
        <meta name="description" content="Topex Texnikumi 2026 o'qish narxlari: oylik 2 500 000 so'm, yillik 25 000 000 so'm. 1 milliard so'mlik grant fondi, olimpiada g'oliblari va iqtidorli talabalar uchun chegirmalar." />
        <meta name="keywords" content="texnikum narxi, xususiy texnikum narxi 2026, Topex kontrakt, o'qish to'lovi, grant, stipendiya, Toshkent texnikum" />
        <link rel="canonical" href="https://topex-texnikumi.vercel.app/narx" />
        <meta property="og:title" content="O'qish narxlari – Topex Texnikumi 2026" />
        <meta property="og:description" content="Topex Texnikumi 2026 o'qish narxlari: oylik 2.5 mln so'm. Grant va chegirmalar mavjud." />
        <meta property="og:url" content="https://topex-texnikumi.vercel.app/narx" />
        <meta property="og:image" content="https://topex-texnikumi.vercel.app/assets/images/hero/hero-2.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="O'qish narxlari – Topex Texnikumi 2026" />
        <meta name="twitter:description" content="Topex Texnikumi 2026 narxlari va grantlari." />
        <meta name="twitter:image" content="https://topex-texnikumi.vercel.app/assets/images/hero/hero-2.webp" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": "https://topex-texnikumi.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Narxlar", "item": "https://topex-texnikumi.vercel.app/narx" }
          ]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "Topex Texnikumi ta'lim xizmati",
          "description": "10-11 sinflar uchun zamonaviy kasblar bo'yicha ta'lim",
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "UZS",
            "lowPrice": "0",
            "highPrice": "25000000",
            "offerCount": "8"
          }
        })}</script>
      </Helmet>

      <section className="relative py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/images/hero/hero-2.webp')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/75 to-navy/90" />
        <div className="absolute -top-24 right-0 w-[28rem] h-[28rem] bg-orange/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-24 left-0 w-96 h-96 bg-blue/25 rounded-full blur-[130px] pointer-events-none" />

        <div className="wrap relative z-10 text-center">
          <motion.div {...up(0)}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
          >
            <Wallet size={16} className="text-orange" />
            <span className="text-white/90 text-sm font-semibold">Narxlar va to'lov</span>
          </motion.div>
          <motion.h1 {...up(0.05)} className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-5 drop-shadow-lg">
            O'qish narxlari 2026
          </motion.h1>
          <motion.p {...up(0.1)} className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Topex Texnikumida barcha yo'nalishlar bo'yicha to'lov shartlari, grant va chegirmalar
          </motion.p>
          <motion.div {...up(0.15)} className="flex items-center justify-center gap-2 text-white/70 text-sm font-medium">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-orange transition-colors">
              <Home size={14} /> Bosh sahifa
            </Link>
            <ChevronRight size={14} className="opacity-60" />
            <span className="text-orange">Narxlar</span>
          </motion.div>
        </div>
      </section>

      <section className="sec bg-white">
        <div className="wrap">
          <motion.div {...up(0)} className="text-center mb-14">
            <span className="lbl text-emerald-600">TO'LOV TIZIMI</span>
            <h2 className="text-3xl md:text-4xl font-black text-navy mb-4">
              Asosiy narxlar
            </h2>
            <p className="text-navy/60 max-w-2xl mx-auto">
              Barcha yo'nalishlar bo'yicha o'qish narxi bir xil. Siz qulay to'lov shartini tanlashingiz mumkin
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-14">
            <motion.div {...up(0)} className="bg-white rounded-2xl p-8 border-2 border-emerald-100 shadow-lg shadow-emerald-100/30 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                OYLIK
              </div>
              <CreditCard size={36} className="text-emerald-600 mx-auto mb-4 mt-2" />
              <div className="text-3xl font-black text-navy mb-1">2 500 000 so'm</div>
              <div className="text-navy/50 text-sm">oyiga</div>
              <ul className="mt-6 space-y-2 text-left text-sm text-navy/70">
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> Eng qulay to'lov varianti</li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> 10 oy davomida to'lov</li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> Har oy 1-10 sanalari</li>
              </ul>
            </motion.div>

            <motion.div {...up(0.05)} className="bg-white rounded-2xl p-8 border-2 border-blue shadow-lg shadow-blue/20 text-center relative scale-105">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue text-white text-xs font-bold px-4 py-1 rounded-full">
                ENG MASHHUR
              </div>
              <Landmark size={36} className="text-blue mx-auto mb-4 mt-2" />
              <div className="text-3xl font-black text-navy mb-1">2 375 000 so'm</div>
              <div className="text-navy/50 text-sm">oyiga (choraklik)</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">5% CHEGIRMA</div>
              <ul className="mt-6 space-y-2 text-left text-sm text-navy/70">
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> 3 oyda bir marta to'lov</li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> Jami 7 125 000 so'm/chorak</li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> Yillik tejash: 1 250 000 so'm</li>
              </ul>
            </motion.div>

            <motion.div {...up(0.1)} className="bg-white rounded-2xl p-8 border-2 border-amber-200 shadow-lg shadow-amber-100/30 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                YILLIK
              </div>
              <Percent size={36} className="text-amber-600 mx-auto mb-4 mt-2" />
              <div className="text-3xl font-black text-navy mb-1">25 000 000 so'm</div>
              <div className="text-navy/50 text-sm">yiliga (10 oy)</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">2 oyga to'lovsiz!</div>
              <ul className="mt-6 space-y-2 text-left text-sm text-navy/70">
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> Eng tejamkor variant</li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> Yoz oylari to'lovsiz</li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> Yillik tejash: 5 000 000 so'm</li>
              </ul>
            </motion.div>
          </div>

          <motion.div {...up(0.15)}
            className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-8 md:p-12 border border-emerald-100 max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <Gift size={28} className="text-emerald-600" />
              <h3 className="text-2xl font-bold text-navy">Grant va stipendiyalar</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 border border-emerald-50">
                <div className="text-lg font-bold text-emerald-700 mb-1">1 000 000 000 so'm</div>
                <div className="text-sm text-navy/60">Grant fondi. SAT 1200+, IELTS 7.0+, C1 sertifikat va olimpiada g'oliblari uchun</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-emerald-50">
                <div className="text-lg font-bold text-emerald-700 mb-1">2 000 000 so'm/oy</div>
                <div className="text-sm text-navy/60">Oylik stipendiya. Yuqori natijali o'quvchilar uchun</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-emerald-50">
                <div className="text-lg font-bold text-emerald-700 mb-1">5% chegirma</div>
                <div className="text-sm text-navy/60">Choraklik to'lovda. Bir yo'la 3 oylik to'lasangiz</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-emerald-50">
                <div className="text-lg font-bold text-emerald-700 mb-1">100% grant</div>
                <div className="text-sm text-navy/60">Olimpiada g'oliblari va kam ta'minlangan oilalar uchun</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="sec bg-gray-50">
        <div className="wrap">
          <motion.div {...up(0)} className="text-center mb-12">
            <span className="lbl text-blue">YO'NALISHLAR</span>
            <h2 className="text-3xl md:text-4xl font-black text-navy">Barcha yo'nalishlar uchun narx</h2>
            <p className="text-navy/60 mt-3 max-w-2xl mx-auto">
              8 ta yo'nalish bo'yicha o'qish narxi bir xil — 2 500 000 so'm/oy
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="grid grid-cols-3 bg-navy text-white text-sm font-semibold px-6 py-4">
              <div>Yo'nalish</div>
              <div>Muddat</div>
              <div className="text-right">Narx (oy)</div>
            </div>
            {subjects.map((s, i) => {
              const Icon = ICON_MAP[Object.keys(ICON_MAP).find(k => s.name?.includes(k))] || BookOpen;
              return (
                <div key={i} className={`grid grid-cols-3 items-center px-6 py-4 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <div className="flex items-center gap-2 font-medium text-navy">
                    <Icon size={16} className="text-blue flex-shrink-0" />
                    {s.name}
                  </div>
                  <div className="text-navy/60">{s.duration || '2 yil'}</div>
                  <div className="text-right font-bold text-navy">2 500 000 so'm</div>
                </div>
              );
            })}
          </div>

          <motion.div {...up(0.1)} className="text-center mt-8">
            <Link to="/courses" className="btn-blue inline-flex items-center gap-2 px-8 py-4 text-base">
              Barcha yo'nalishlar <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="sec-mid py-14">
        <div className="wrap">
          <motion.div {...up(0)}
            className="bg-navy rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div>
              <span className="lbl text-coral">QABUL 2026</span>
              <h2 className="text-3xl font-black text-white mb-3">
                Farzandingizni Topexga yozing
              </h2>
              <p className="text-white/55">
                Ariza qoldiring — biz siz bilan bog'lanamiz va barcha savollarga javob beramiz
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <a href="tel:+998787774477" className="btn-coral text-base px-8 py-4 whitespace-nowrap">
                Qo'ng'iroq qilish
              </a>
              <a
                href="/#ariza"
                className="btn-outline text-base px-8 py-4 whitespace-nowrap border-white text-white hover:bg-white hover:text-navy"
              >
                Ariza qoldirish <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="sec bg-white">
        <div className="wrap">
          <motion.div {...up(0)} className="max-w-3xl mx-auto">
            <span className="lbl text-blue">FAQ</span>
            <h2 className="text-3xl font-black text-navy mb-8">To'lov haqida ko'p beriladigan savollar</h2>

            <div className="space-y-4">
              {[
                { q: "O'qish narxi barcha yo'nalishlarda bir xilmi?", a: "Ha, hamma 8 ta yo'nalishda o'qish narxi bir xil — oyiga 2 500 000 so'm." },
                { q: "Grant olish uchun qanday talablar bor?", a: "SAT 1200+, IELTS 7.0+, C1 sertifikat yoki fan olimpiadalari g'olibi bo'lishingiz kerak. Kam ta'minlangan oilalar uchun alohida grantlar mavjud." },
                { q: "To'lovni karta orqali amalga oshirish mumkinmi?", a: "Ha, barcha turdagi plastik kartalar (UzCard, HUMO, VISA, MasterCard) orqali to'lash mumkin. Naqd pulda ham to'lash imkoniyati bor." },
                { q: "To'lovni kechiktirib to'lash mumkinmi?", a: "Ha, alohida holatlarda to'lovni kechiktirish imkoniyati mavjud. Bu haqda admin bilan kelishish kerak." },
              ].map((faq, i) => (
                <details key={i} className="bg-gray-50 rounded-xl border border-gray-100 group">
                  <summary className="px-6 py-4 font-semibold text-navy cursor-pointer list-none flex items-center justify-between group-open:border-b border-gray-100">
                    {faq.q}
                    <ChevronRight size={18} className="text-navy/40 group-open:rotate-90 transition-transform flex-shrink-0 ml-4" />
                  </summary>
                  <p className="px-6 py-4 text-sm text-navy/60 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default NarxPage;
