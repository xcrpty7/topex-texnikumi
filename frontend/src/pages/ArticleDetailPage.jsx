import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Calendar, Eye, Home, ChevronRight } from 'lucide-react';
import { fetchArticleBySlug, clearCurrentArticle, fetchArticles } from '../features/blog/blogSlice';
import { useTranslation } from 'react-i18next';
import NewsCard from '../components/common/NewsCard';
import Spinner from '../components/ui/Spinner';
import { STATIC_NEWS } from '../data/staticNews';
import DOMPurify from 'dompurify';

const API_URL = import.meta.env.VITE_API_URL || '';

const resolveImg = (img) => {
  if (!img) return '';
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

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { current: article, list, loading } = useSelector((s) => s.blog);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    dispatch(fetchArticleBySlug(slug));
    dispatch(fetchArticles({ limit: 12 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => { dispatch(clearCurrentArticle()); };
  }, [slug, dispatch]);

  const staticMatch = STATIC_NEWS.find((a) => a.slug === slug);

  if (loading && !article && !staticMatch) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;

  const data = article?.article || staticMatch;
  if (!data) {
    return (
      <div className="text-center py-32">
        <p className="text-gray-500 text-lg font-semibold mb-4">Maqola topilmadi</p>
        <Link to="/blog" className="text-orange font-bold hover:underline">← Barcha yangiliklar</Link>
      </div>
    );
  }

  // "Boshqa yangiliklar" — baza maqolalari + statik yangiliklar (dublikatsiz, joriysidan tashqari)
  const seen = new Set();
  const others = [...(list || []), ...STATIC_NEWS]
    .filter((a) => {
      const key = a.slug || a._id;
      if (key === slug || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 3);

  return (
    <>
      <Helmet>
        <title>{data.title} – Topex Texnikumi</title>
        <meta name="description" content={data.excerpt || data.title} />
        {data.tags?.length > 0 && <meta name="keywords" content={data.tags.join(', ')} />}
        <link rel="canonical" href={`https://topextexnikum.uz/blog/${data.slug || slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${data.title} – Topex Texnikumi`} />
        <meta property="og:description" content={data.excerpt || ''} />
        <meta property="og:url" content={`https://topextexnikum.uz/blog/${data.slug || slug}`} />
        <meta property="og:image" content={resolveImg(data.image) || 'https://topextexnikum.uz/assets/logos/topex-logo.png'} />
        {data.createdAt && <meta property="article:published_time" content={new Date(data.createdAt).toISOString()} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${data.title} – Topex Texnikumi`} />
        <meta name="twitter:description" content={data.excerpt || ''} />
        <meta name="twitter:image" content={resolveImg(data.image) || 'https://topextexnikum.uz/assets/logos/topex-logo.png'} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": "https://topextexnikum.uz/" },
            { "@type": "ListItem", "position": 2, "name": "Yangiliklar", "item": "https://topextexnikum.uz/blog" },
            { "@type": "ListItem", "position": 3, "name": data.title, "item": `https://topextexnikum.uz/blog/${data.slug || slug}` }
          ]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["Article", "NewsArticle"],
          "headline": data.title,
          "description": data.excerpt || data.title,
          "image": resolveImg(data.image) || 'https://topextexnikum.uz/assets/logos/topex-logo.png',
          "datePublished": data.publishedAt || data.createdAt || new Date().toISOString(),
          "dateModified": data.updatedAt || data.publishedAt || data.createdAt || new Date().toISOString(),
          "author": {
            "@type": "Organization",
            "name": "TOPEX Texnikumi",
            "url": "https://topextexnikum.uz/"
          },
          "publisher": {
            "@type": "Organization",
            "name": "TOPEX Texnikumi",
            "logo": {
              "@type": "ImageObject",
              "url": "https://topextexnikum.uz/assets/logos/topex-logo.png"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://topextexnikum.uz/blog/${data.slug || slug}`
          }
        })}</script>
      </Helmet>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${settings?.blogHeroImage || '/assets/images/DSC01036.webp'}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/75 to-navy/90" />
        <div className="wrap relative z-10 text-center">
          <motion.h1 {...up(0)} className="text-3xl md:text-5xl font-black text-white leading-[1.1] mb-5 drop-shadow-lg">
            {t('news.title')}
          </motion.h1>
          <motion.div {...up(0.1)} className="flex items-center justify-center flex-wrap gap-2 text-white/70 text-sm font-medium">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-orange transition-colors">
              <Home size={14} /> Bosh sahifa
            </Link>
            <ChevronRight size={14} className="opacity-60" />
            <Link to="/blog" className="hover:text-orange transition-colors">{t('news.title')}</Link>
          </motion.div>
        </div>
      </section>

      {/* ══ ARTICLE ══════════════════════════════════════════ */}
      <section className="bg-white py-14 lg:py-20">
        <article className="w-full max-w-4xl mx-auto px-6">
          {data.image && (
            <motion.div {...up(0)} className="rounded-[1.75rem] overflow-hidden shadow-xl mb-10 aspect-[16/9]">
              <img src={resolveImg(data.image)} alt={data.title} loading="lazy" className="w-full h-full object-cover" />
            </motion.div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-gray-400 text-[13px] font-medium mb-5">
            {data.category && (
              <span className="bg-orange-faint text-orange font-bold uppercase tracking-wide px-3 py-1 rounded-full text-[11px]">
                {data.category}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-orange" /> {fmtDate(data.publishedAt || data.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={14} className="text-orange" /> {data.views || 0}
            </span>
          </div>

          {/* Title */}
          <motion.h2 {...up(0)} className="text-3xl md:text-[42px] font-black text-brand leading-[1.12] mb-6">
            {data.title}
          </motion.h2>

          {/* Brief / excerpt */}
          {data.excerpt && (
            <p className="text-gray-600 text-lg md:text-xl leading-[1.7] font-medium border-l-4 border-orange pl-5 mb-8">
              {data.excerpt}
            </p>
          )}

          {/* Content */}
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content || '') }}
          />

          {/* Tags */}
          {data.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
              {data.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-500 text-[13px] font-medium px-3 py-1.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </section>

      {/* ══ BOSHQA YANGILIKLAR ═══════════════════════════════ */}
      {others.length > 0 && (
        <section className="bg-white pb-20 lg:pb-28">
          <div className="w-full max-w-[1500px] mx-auto px-6 lg:px-16">
            <motion.h2 {...up(0)} className="text-[32px] md:text-[44px] font-black text-brand leading-tight mb-10">
              Boshqa yangiliklar
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {others.map((a, i) => (
                <NewsCard key={a._id || i} article={a} index={i} moreText={settings?.newsMoreText || t('news.more')} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ArticleDetailPage;
