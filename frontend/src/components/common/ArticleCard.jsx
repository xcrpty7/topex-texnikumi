import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Calendar } from 'lucide-react';

const FALLBACK_IMGS = [
  '/assets/posts/smm-01.webp',
  '/assets/posts/smm-02.webp',
  '/assets/posts/smm-03.webp',
];

const AVATAR_IMGS = [
  '/assets/posts/avatar-01.webp',
  '/assets/posts/avatar-02.webp',
];

const ArticleCard = ({ article, index = 0 }) => {
  const thumb = article.thumbnail || FALLBACK_IMGS[index % FALLBACK_IMGS.length];
  const avatar = AVATAR_IMGS[index % AVATAR_IMGS.length];

  const fmtDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="card overflow-hidden group flex flex-col"
    >
      <Link to={`/blog/${article.slug}`} className="flex flex-col h-full">

        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={thumb}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-all duration-300" />

          {/* Tags overlay */}
          {article.tags?.length > 0 && (
            <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
              {article.tags.slice(0, 2).map(tag => (
                <span key={tag} className="badge badge-blue">#{tag}</span>
              ))}
            </div>
          )}

          {/* Read time */}
          <div className="absolute bottom-3 right-3">
            <span className="badge bg-navy/60 text-white backdrop-blur-sm flex items-center gap-1">
              <Clock size={10} /> {article.readTime || 3} daqiqa
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">

          {/* Date */}
          {article.publishedAt && (
            <p className="text-gray-400 text-[11px] font-medium mb-2 flex items-center gap-1">
              <Calendar size={10} />
              {fmtDate(article.publishedAt)}
            </p>
          )}

          <h3 className="text-navy font-bold text-[15px] leading-snug mb-2 line-clamp-2
                          group-hover:text-blue transition-colors flex-1">
            {article.title}
          </h3>

          {article.excerpt && (
            <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            {article.author ? (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-navy flex-shrink-0">
                  <img src={avatar} alt={article.author.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-gray-500 text-xs font-medium truncate max-w-[120px]">
                  {article.author.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-gray-400 text-xs">
                <span className="flex items-center gap-1">
                  <Eye size={12} /> {article.viewCount || 0}
                </span>
              </div>
            )}
            <span className="text-blue group-hover:translate-x-1 transition-transform flex-shrink-0">
              <ArrowRight size={15} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ArticleCard;
