import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Star, Clock, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LEVEL_MAP = {
  beginner:     { label: 'Boshlang\'ich', cls: 'badge-teal' },
  intermediate: { label: 'O\'rta',        cls: 'badge-blue' },
  advanced:     { label: 'Yuqori',        cls: 'badge-coral' },
};

const API_URL = import.meta.env.VITE_API_URL || '';

/* Cycle through the 3 SMM post images as fallback thumbnails */
const FALLBACK_IMGS = [
  '/assets/posts/smm-01.jpg',
  '/assets/posts/smm-02.jpg',
  '/assets/posts/smm-03.jpg',
];

const resolveImg = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('/assets')) return url;
  return `${API_URL}${url}`;
};

const CourseCard = ({ course, index = 0 }) => {
  const { t } = useTranslation();
  const level = course.level || 'beginner';
  const lvl   = LEVEL_MAP[level] || LEVEL_MAP.beginner;
  const rawImg = course.image || course.thumbnail;
  const thumb  = rawImg ? resolveImg(rawImg) : FALLBACK_IMGS[index % FALLBACK_IMGS.length];

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="card overflow-hidden group flex flex-col"
    >
      <Link to={`/courses/${course.slug}`} className="flex flex-col h-full">

        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={thumb}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[600ms] ease-out"
          />
          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-all duration-300 ease-out" />

          {/* Price badge */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className={`badge text-xs font-bold ${course.isFree ? 'badge-teal' : 'badge-coral'}`}>
              {course.isFree ? "Bepul" : `${course.price?.toLocaleString()} so'm`}
            </span>
            {course.isFeatured && (
              <span className="badge text-[10px] font-bold" style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A' }}>
                ★ Tanlangan
              </span>
            )}
          </div>
          {/* Level */}
          <div className="absolute top-3 right-3">
            <span className={`badge text-[11px] ${lvl.cls}`}>{lvl.label}</span>
          </div>

          {/* Arrow on hover */}
          <div className="absolute bottom-3 right-3 opacity-0 translate-y-1 group-hover:opacity-100
                          group-hover:translate-y-0 transition-all duration-300 ease-out">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <ArrowRight size={15} className="text-navy" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {course.category && (
            <p className="text-coral text-[11px] font-bold uppercase tracking-widest mb-2">
              {typeof course.category === 'string' ? course.category : course.category.name}
            </p>
          )}
          <h3 className="text-navy font-bold text-[15px] leading-snug mb-3 line-clamp-2
                          group-hover:text-blue transition-colors flex-1">
            {course.title || "Kurs nomi"}
          </h3>

          {course.description && (
            <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
              {course.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-gray-400 text-xs mt-auto mb-4 flex-wrap">
            <span className="flex items-center gap-1">
              <Users size={12} /> {course.enrollmentCount || 0} o'quvchi
            </span>
            {course.duration && (
              <span className="flex items-center gap-1">
                <Clock size={12} /> {course.duration}
              </span>
            )}
            {course.rating?.count > 0 && (
              <span className="flex items-center gap-1 ml-auto">
                <Star size={12} className="fill-coral text-coral" />
                {course.rating.average.toFixed(1)}
              </span>
            )}
          </div>

          {course.instructor && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center
                                 text-white font-bold text-xs flex-shrink-0">
                  {course.instructor.name?.[0]}
                </div>
                <span className="text-gray-500 text-xs font-medium truncate max-w-[140px]">
                  {course.instructor.name}
                </span>
              </div>
              <span className="text-blue group-hover:translate-x-1 transition-transform">
                <ArrowRight size={15} />
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
