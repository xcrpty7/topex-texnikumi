import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Home, ChevronRight, Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { fetchArticles } from '../features/blog/blogSlice';
import NewsCard from '../components/common/NewsCard';
import Spinner from '../components/ui/Spinner';
import api from '../services/api';
import { STATIC_NEWS } from '../data/staticNews';

const API_URL = import.meta.env.VITE_API_URL || '';

const resolveImg = (img) => {
  if (!img) return '/assets/posts/smm-01.jpg';
  if (img.startsWith('http') || img.startsWith('/assets')) return img;
  return `${API_URL}${img}`;
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'long', year: 'numeric' }) : '';

const up = (delay = 0) => ({
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.5, ease: 'easeOut', delay },
});

/* ─── Featured (eng so'nggi) yangilik — keng gorizontal karta ─── */
const FeaturedNews = ({ article, moreText }) => {
  const to = `/blog/${article.slug || article._id}`;
  return (
    <motion.div {...up(0)} className="mb-12">
      <Link
        to={to}
        className="group grid lg:grid-cols-2 rounded-[2rem] overflow-hidden bg-white border border-gray-200
                   shadow-card hover:shadow-xl transition-all duration-500"
      >
        {/* Image */}
        <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[420px] overflow-hidden">
          <img
            src={resolveImg(article.image)}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent lg:bg-gradient-to-r" />
          <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 bg-orange text-white text-[11px]
                           font-bold uppercase tracking-wide px-3.5 py-1.5 rounded-full shadow-lg">
            ✦ {article.category || t('blogPage.fallbackCategory')}
          </span>
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center p-8 lg:p-14">
          <div className="flex items-center gap-2 text-gray-400 text-[13px] font-medium mb-4">
            <Calendar size={14} className="text-orange" />
            {fmtDate(article.publishedAt || article.createdAt)}
          </div>
          <h3 className="text-[26px] md:text-[34px] font-black text-brand leading-[1.12] mb-5
                         group-hover:text-orange transition-colors">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-gray-500 text-[15px] md:text-[16px] leading-relaxed line-clamp-3 mb-8">
              {article.excerpt}
            </p>
          )}
          <span className="inline-flex items-center gap-2 self-start bg-orange-grad text-white font-bold
                           text-[13px] uppercase tracking-[0.12em] px-7 py-3.5 rounded-xl shadow-lg shadow-orange/25
                           group-hover:gap-3.5 group-hover:-translate-y-0.5 transition-all">
            {moreText}
            <ArrowRight size={16} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

const BlogPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { list: articles, loading } = useSelector((s) => s.blog);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    dispatch(fetchArticles({ limit: 50 }));
    api.get('/settings').then((r) => { if (r.data.data) setSettings(r.data.data); }).catch(() => {});
  }, [dispatch]);

  const heroTitle = settings?.blogHeroTitle || t('news.title');
  const moreText  = settings?.newsMoreText || t('news.more');
  const display   = articles.length > 0 ? articles : STATIC_NEWS;
  const featured  = display[0];
  const rest      = display.slice(1);

  return (
    <>
      <Helmet>
        <title>{t('blogPage.meta.title')}</title>
        <meta name="description" content={t('blogPage.meta.description')} />
        <meta name="keywords" content={t('blogPage.meta.keywords')} />
        <link rel="canonical" href="https://topex-texnikumi.vercel.app/blog" />
        <meta property="og:title" content={t('blogPage.meta.ogTitle')} />
        <meta property="og:description" content={t('blogPage.meta.ogDescription')} />
        <meta property="og:url" content="https://topex-texnikumi.vercel.app/blog" />
        <meta property="og:image" content="https://topex-texnikumi.vercel.app/assets/logos/topex-logo.png" />
      </Helmet>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url('${settings?.blogHeroImage || '/assets/images/DSC01036.jpg'}')` }}
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
            <Newspaper size={15} className="text-orange" /> {settings?.newsLabel || t('news.label')}
          </motion.div>
          <motion.h1 {...up(0.05)} className="text-4xl md:text-6xl font-black text-white leading-[1.08] mb-5 drop-shadow-lg">
            {heroTitle}
          </motion.h1>
          <motion.p {...up(0.1)} className="text-white/65 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
            {settings?.blogHeroSubtitle || "Texnikumimiz hayotidan eng so'nggi yangiliklar, yutuqlar va tadbirlar."}
          </motion.p>
          <motion.div {...up(0.15)} className="flex items-center justify-center gap-2 text-white/70 text-sm font-medium">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-orange transition-colors">
              <Home size={14} /> Bosh sahifa
            </Link>
            <ChevronRight size={14} className="opacity-60" />
            <span className="text-orange">{t('news.title')}</span>
          </motion.div>
        </div>
      </section>

      {/* ══ NEWS ═════════════════════════════════════════════ */}
      <section className="relative bg-gray-50 py-16 lg:py-24 overflow-hidden">
        {/* subtle corner decoration */}
        <div
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 40px, #1d3a8a 40px 41px)' }}
        />

        <div className="w-full max-w-[1500px] mx-auto px-6 lg:px-16 relative">
          <motion.div {...up(0)} className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <span className="inline-flex items-center gap-2 text-orange font-bold text-[13px] uppercase tracking-[0.18em] mb-4">
                <span className="w-8 h-[2px] bg-orange inline-block" />
                {settings?.newsLabel || t('news.label')}
              </span>
              <h2 className="text-[38px] md:text-[52px] font-black text-brand leading-[1.05]">
                {t('news.title')}
              </h2>
            </div>
            {!loading && (
              <span className="text-gray-400 text-sm font-semibold bg-white border border-gray-200 rounded-full px-4 py-2">
                {display.length} ta maqola
              </span>
            )}
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-24"><Spinner size="lg" /></div>
          ) : (
            <>
              {featured && <FeaturedNews article={featured} moreText={moreText} />}

              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rest.map((article, i) => (
                    <NewsCard key={article._id || i} article={article} index={i} moreText={moreText} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogPage;
