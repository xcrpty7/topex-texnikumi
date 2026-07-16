import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SeoHelmet from '../components/common/SeoHelmet';
import { useTranslation } from 'react-i18next';
import { Clock, Home, ArrowLeft } from 'lucide-react';

const BlogPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <SeoHelmet
        title={t('blogPage.meta.title')}
        description={t('blogPage.meta.description')}
        keywords={t('blogPage.meta.keywords')}
        canonical="https://topextexnikum.uz/blog"
        ogImage="https://topextexnikum.uz/assets/images/DSC01036.webp"
        ogType="blog"
      >
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": "https://topextexnikum.uz/" },
            { "@type": "ListItem", "position": 2, "name": "Yangiliklar", "item": "https://topextexnikum.uz/blog" }
          ]
        })}</script>
      </SeoHelmet>

      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-brand-deep py-24">
        <svg className="absolute inset-0 w-full h-full opacity-[0.1] pointer-events-none"
          viewBox="0 0 1500 600" preserveAspectRatio="none" fill="none">
          {[...Array(12)].map((_, i) => (
            <path key={i}
              d={`M -100 ${80 + i * 40} Q 400 ${10 + i * 40}, 800 ${100 + i * 40} T 1700 ${60 + i * 40}`}
              stroke="white" strokeWidth="1" fill="none" />
          ))}
        </svg>
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '26px 26px' }} />

        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-orange/15 text-orange mb-8">
            <Clock size={38} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="text-4xl md:text-6xl font-black text-white leading-none mb-5 drop-shadow-lg">
            {t('blogPage.soonTitle') || 'Yangiliklar'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-white/70 text-base md:text-lg leading-relaxed mb-10 max-w-lg mx-auto">
            {t('blogPage.soonText') || 'Tez orada yangiliklar bo\'limi ishga tushadi.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/"
              className="inline-flex items-center justify-center gap-2 bg-orange-grad hover:brightness-110
                         text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-orange/30
                         hover:-translate-y-0.5 transition-all duration-200 text-[15px]">
              <Home size={18} /> {t('notFound.home')}
            </Link>
            <button onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20
                         text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-[15px]">
              <ArrowLeft size={18} /> {t('notFound.back')}
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default BlogPage;
