import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL || '';

const resolveImg = (img) => {
  if (!img) return '/assets/posts/smm-01.jpg';
  if (img.startsWith('http') || img.startsWith('/assets')) return img;
  return `${API_URL}${img}`;
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'long', year: 'numeric' }) : '';

export default function NewsCard({ article, index = 0, moreText }) {
  const { t } = useTranslation();
  const btnText = moreText || t('newsCard.moreText');
  const to = `/blog/${article.slug || article._id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200
                 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <Link to={to} className="block relative aspect-[16/10] overflow-hidden">
        <img
          src={resolveImg(article.image)}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {article.category && (
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-brand text-[11px]
                           font-bold uppercase tracking-wide px-3 py-1.5 rounded-full shadow-sm">
            {article.category}
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 text-gray-400 text-[12px] font-medium mb-3">
          <Calendar size={13} className="text-orange" />
          {fmtDate(article.publishedAt || article.createdAt)}
        </div>

        <h3 className="text-brand font-bold text-[17px] leading-snug mb-5 line-clamp-2
                       group-hover:text-orange transition-colors flex-1">
          {article.title}
        </h3>

        <Link
          to={to}
          className="inline-flex items-center justify-center gap-2 self-start bg-orange-grad text-white
                     font-bold text-[12px] uppercase tracking-[0.12em] px-6 py-3 rounded-xl
                     shadow-lg shadow-orange/25 hover:brightness-110 hover:-translate-y-0.5 transition-all">
          {btnText}
          <ArrowRight size={15} />
        </Link>
      </div>
    </motion.div>
  );
}
