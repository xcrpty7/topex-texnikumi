import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Home } from 'lucide-react';

const up = (delay = 0) => ({
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.5, ease: 'easeOut', delay },
});

const VakansiyaPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Vakansiyalar | Topex Texnikumi</title>
        <meta name="description" content="Topex Texnikumi vakansiyalari va litsenziya haqida ma'lumot" />
      </Helmet>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/images/DSC01036.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/75 to-navy/90" />
        <div className="wrap relative z-10 text-center">
          <motion.h1 {...up(0)} className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-5 drop-shadow-lg">
            {t('footer.links.vacancies')}
          </motion.h1>
          <motion.div {...up(0.1)} className="flex items-center justify-center gap-2 text-white/70 text-sm font-medium">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-orange transition-colors">
              <Home size={14} /> {t('loginPage.backHome')}
            </Link>
            <ChevronRight size={14} className="opacity-60" />
            <span className="text-orange">{t('footer.links.vacancies')}</span>
          </motion.div>
        </div>
      </section>

      {/* ══ LICENSE DOCS ══════════════════════════════════════ */}
      <section className="bg-white py-16 lg:py-24">
        <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-16">
          <motion.h2 {...up(0)} className="text-3xl md:text-4xl font-black text-brand mb-3 text-center">
            Litsenziya
          </motion.h2>
          <motion.p {...up(0.05)} className="text-gray-500 text-center mb-12 text-[15px]">
            Topex Texnikumi rasmiy litsenziyaga ega ta'lim muassasasi
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <motion.div {...up(0.1)} className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-gray-50">
              <img
                src="/assets/images/license-main.jpg"
                alt="Topex Texnikumi Litsenziyasi"
                className="w-full h-auto object-contain"
              />
            </motion.div>
            <motion.div {...up(0.2)} className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-gray-50">
              <img
                src="/assets/images/license-appendix.jpg"
                alt="Litsenziya ilovasi — ta'lim yo'nalishlari"
                className="w-full h-auto object-contain"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VakansiyaPage;
