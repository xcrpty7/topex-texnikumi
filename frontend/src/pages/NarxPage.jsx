import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SeoHelmet from '../components/common/SeoHelmet';
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
    { name: t('directions.items.lab'), duration: t('narxPage.years3'), Icon: FlaskConical },
    { name: t('directions.items.pharma'), duration: t('narxPage.years3'), Icon: Sprout },
    { name: t('directions.items.marketing'), duration: t('narxPage.years3'), Icon: TrendingUp },
    { name: t('directions.items.programming'), duration: t('narxPage.years3'), Icon: BookOpen },
    { name: t('directions.items.graphics'), duration: t('narxPage.years3'), Icon: Palette },
    { name: t('directions.items.bank'), duration: t('narxPage.years3'), Icon: ShieldCheck },
    { name: t('directions.items.hotel'), duration: t('narxPage.years3'), Icon: Hotel },
    { name: t('directions.items.analytics'), duration: t('narxPage.years3'), Icon: BarChart3 },
  ];

  return (
    <>
      <SeoHelmet
        title="O'qish narxlari – Topex Texnikumi 2026"
        description="Topex Texnikumi 2026 o'qish narxlari: oylik 2 500 000 so'm, yillik 25 000 000 so'm. 1 milliard so'mlik grant fondi, olimpiada g'oliblari va iqtidorli talabalar uchun chegirmalar."
        keywords="texnikum narxi, xususiy texnikum narxi 2026, Topex kontrakt, o'qish to'lovi, grant, stipendiya, Toshkent texnikum"
        canonical="https://topextexnikum.uz/narx"
        ogImage="https://topextexnikum.uz/assets/images/hero/hero-2.webp"
      >
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": "https://topextexnikum.uz/" },
            { "@type": "ListItem", "position": 2, "name": "Narxlar", "item": "https://topextexnikum.uz/narx" }
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
            "lowPrice": "500000",
            "highPrice": "25000000",
            "offerCount": "8"
          }
        })}</script>
      </SeoHelmet>

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
            <span className="text-white/90 text-sm font-semibold">{t('narxPage.heroBadge')}</span>
          </motion.div>
          <motion.h1 {...up(0.05)} className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-5 drop-shadow-lg">
            {t('narxPage.heroTitle')}
          </motion.h1>
          <motion.p {...up(0.1)} className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            {t('narxPage.heroSubtitle')}
          </motion.p>
          <motion.div {...up(0.15)} className="flex items-center justify-center gap-2 text-white/70 text-sm font-medium">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-orange transition-colors">
              <Home size={14} /> {t('coursesPage.breadcrumbHome')}
            </Link>
            <ChevronRight size={14} className="opacity-60" />
            <span className="text-orange">{t('narxPage.breadcrumbPrices')}</span>
          </motion.div>
        </div>
      </section>

      <section className="sec bg-white">
        <div className="wrap">
          <motion.div {...up(0)} className="text-center mb-14">
            <span className="lbl text-emerald-600">{t('narxPage.paymentLabel')}</span>
            <h2 className="text-3xl md:text-4xl font-black text-navy mb-4">
              {t('narxPage.mainTitle')}
            </h2>
            <p className="text-navy/60 max-w-2xl mx-auto">
              {t('narxPage.mainSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-14">
            <motion.div {...up(0)} className="bg-white rounded-2xl p-8 border-2 border-emerald-100 shadow-lg shadow-emerald-100/30 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                {t('narxPage.monthlyBadge')}
              </div>
              <CreditCard size={36} className="text-emerald-600 mx-auto mb-4 mt-2" />
              <div className="text-3xl font-black text-navy mb-1">2 500 000 {t('pricing.sum')}</div>
              <div className="text-navy/50 text-sm">{t('narxPage.perMonth')}</div>
              <ul className="mt-6 space-y-2 text-left text-sm text-navy/70">
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> {t('narxPage.monthlyF1')}</li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> {t('narxPage.monthlyF2')}</li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> {t('narxPage.monthlyF3')}</li>
              </ul>
            </motion.div>

            <motion.div {...up(0.05)} className="bg-white rounded-2xl p-8 border-2 border-blue shadow-lg shadow-blue/20 text-center relative scale-105">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue text-white text-xs font-bold px-4 py-1 rounded-full">
                {t('narxPage.popularBadge')}
              </div>
              <Landmark size={36} className="text-blue mx-auto mb-4 mt-2" />
              <div className="text-3xl font-black text-navy mb-1">2 375 000 {t('pricing.sum')}</div>
              <div className="text-navy/50 text-sm">{t('narxPage.perMonthQuarterly')}</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">{t('narxPage.discount5Badge')}</div>
              <ul className="mt-6 space-y-2 text-left text-sm text-navy/70">
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> {t('narxPage.quarterlyF1')}</li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> {t('narxPage.quarterlyF2')}</li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> {t('narxPage.quarterlyF3')}</li>
              </ul>
            </motion.div>

            <motion.div {...up(0.1)} className="bg-white rounded-2xl p-8 border-2 border-amber-200 shadow-lg shadow-amber-100/30 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                {t('narxPage.yearlyBadge')}
              </div>
              <Percent size={36} className="text-amber-600 mx-auto mb-4 mt-2" />
              <div className="text-3xl font-black text-navy mb-1">25 000 000 {t('pricing.sum')}</div>
              <div className="text-navy/50 text-sm">{t('narxPage.perYear')}</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">{t('narxPage.freeMonthsBadge')}</div>
              <ul className="mt-6 space-y-2 text-left text-sm text-navy/70">
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> {t('narxPage.yearlyF1')}</li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> {t('narxPage.yearlyF2')}</li>
                <li className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" /> {t('narxPage.yearlyF3')}</li>
              </ul>
            </motion.div>
          </div>

          <motion.div {...up(0.15)}
            className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-8 md:p-12 border border-emerald-100 max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-6">
              <Gift size={28} className="text-emerald-600" />
              <h3 className="text-2xl font-bold text-navy">{t('narxPage.grantsTitle')}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 border border-emerald-50">
                <div className="text-lg font-bold text-emerald-700 mb-1">1 000 000 000 {t('pricing.sum')}</div>
                <div className="text-sm text-navy/60">{t('narxPage.grantFundDesc')}</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-emerald-50">
                <div className="text-lg font-bold text-emerald-700 mb-1">2 000 000 {t('pricing.sum')}/{t('narxPage.monthShort')}</div>
                <div className="text-sm text-navy/60">{t('narxPage.grantStipendDesc')}</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-emerald-50">
                <div className="text-lg font-bold text-emerald-700 mb-1">{t('narxPage.grantDiscountTitle')}</div>
                <div className="text-sm text-navy/60">{t('narxPage.grantDiscountDesc')}</div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-emerald-50">
                <div className="text-lg font-bold text-emerald-700 mb-1">{t('narxPage.grant100Title')}</div>
                <div className="text-sm text-navy/60">{t('narxPage.grant100Desc')}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="sec bg-gray-50">
        <div className="wrap">
          <motion.div {...up(0)} className="text-center mb-12">
            <span className="lbl text-blue">{t('narxPage.directionsLabel')}</span>
            <h2 className="text-3xl md:text-4xl font-black text-navy">{t('narxPage.directionsTitle')}</h2>
            <p className="text-navy/60 mt-3 max-w-2xl mx-auto">
              {t('narxPage.directionsSubtitle')}
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="grid grid-cols-3 bg-navy text-white text-sm font-semibold px-6 py-4">
              <div>{t('narxPage.tableDirection')}</div>
              <div>{t('narxPage.tableDuration')}</div>
              <div className="text-right">{t('narxPage.tablePrice')}</div>
            </div>
            {subjects.map((s, i) => {
              const Icon = s.Icon || ICON_MAP[Object.keys(ICON_MAP).find(k => s.name?.includes(k))] || BookOpen;
              return (
                <div key={i} className={`grid grid-cols-3 items-center px-6 py-4 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <div className="flex items-center gap-2 font-medium text-navy">
                    <Icon size={16} className="text-blue flex-shrink-0" />
                    {s.name}
                  </div>
                  <div className="text-navy/60">{s.duration || t('narxPage.years2')}</div>
                  <div className="text-right font-bold text-navy">2 500 000 {t('pricing.sum')}</div>
                </div>
              );
            })}
          </div>

          <motion.div {...up(0.1)} className="text-center mt-8">
            <Link to="/courses" className="btn-blue inline-flex items-center gap-2 px-8 py-4 text-base">
              {t('narxPage.allDirectionsBtn')} <ArrowRight size={18} />
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
              <span className="lbl text-coral">{t('narxPage.ctaLabel')}</span>
              <h2 className="text-3xl font-black text-white mb-3">
                {t('narxPage.ctaTitle')}
              </h2>
              <p className="text-white/55">
                {t('narxPage.ctaSubtitle')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <a href="tel:+998787774477" className="btn-coral text-base px-8 py-4 whitespace-nowrap">
                {t('narxPage.ctaCall')}
              </a>
              <a
                href="/#ariza"
                className="btn-outline text-base px-8 py-4 whitespace-nowrap border-white text-white hover:bg-white hover:text-navy"
              >
                {t('narxPage.ctaApply')} <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="sec bg-white">
        <div className="wrap">
          <motion.div {...up(0)} className="max-w-3xl mx-auto">
            <span className="lbl text-blue">FAQ</span>
            <h2 className="text-3xl font-black text-navy mb-8">{t('narxPage.faqTitle')}</h2>

            <div className="space-y-4">
              {[
                { q: t('narxPage.faq1q'), a: t('narxPage.faq1a') },
                { q: t('narxPage.faq2q'), a: t('narxPage.faq2a') },
                { q: t('narxPage.faq3q'), a: t('narxPage.faq3a') },
                { q: t('narxPage.faq4q'), a: t('narxPage.faq4a') },
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
