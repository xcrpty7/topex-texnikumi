import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import {
  Code, TrendingUp, Palette, ShieldCheck, Hotel, BarChart3, FlaskConical, Sprout,
} from 'lucide-react';

const ICON_MAP = { Code, TrendingUp, Palette, ShieldCheck, Hotel, BarChart3, FlaskConical, Sprout, BookOpen };

const TRANS_KEYS = ['programming','marketing','graphics','bank','hotel','analytics','lab','pharma'];

const PHOTOS = [
  '/assets/images/DSC00827.jpg',
  '/assets/images/DSC00912.jpg',
  '/assets/images/DSC01036.jpg',
  '/assets/images/DSC01093.jpg',
];

const PAGE_SIZE = 6;

export default function DirectionsSplit({ subjects = [], settings, onSelect }) {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);

  // If subjects come from DB (Direction model), they already have .name; use as-is.
  // Otherwise (SUBJECTS fallback), localize the first 8 with i18n keys.
  const isFromDB = subjects[0]?._id != null;
  const localized = isFromDB
    ? subjects.map(s => ({ ...s, iconName: s.icon }))
    : subjects.slice(0, TRANS_KEYS.length).map((s, i) => ({
        ...s,
        name: t(`directions.items.${TRANS_KEYS[i]}`),
      }));
  const pages = Math.max(1, Math.ceil(localized.length / PAGE_SIZE));
  const visible = localized.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const prev = () => {
    setPage(p => (p - 1 + pages) % pages);
    setPhotoIdx(i => (i - 1 + PHOTOS.length) % PHOTOS.length);
  };
  const next = () => {
    setPage(p => (p + 1) % pages);
    setPhotoIdx(i => (i + 1) % PHOTOS.length);
  };

  return (
    <section className="relative bg-white">
      <div className="grid lg:grid-cols-2 min-h-[680px]">

        {/* LEFT — Photo */}
        <div className="relative overflow-hidden bg-gray-900 min-h-[400px] lg:min-h-[680px]">
          <AnimatePresence mode="wait">
            <motion.img
              key={photoIdx}
              src={PHOTOS[photoIdx]}
              alt=""
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand/20 pointer-events-none" />
        </div>

        {/* RIGHT — Navy block with directions */}
        <div className="relative bg-brand px-6 sm:px-10 lg:px-16 py-16 lg:py-20 overflow-hidden">
          {/* subtle decorative pattern */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
               style={{
                 backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                 backgroundSize: '24px 24px',
               }} />

          <div className="relative max-w-2xl">
            <motion.span
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              className="inline-block text-orange font-bold text-[13px] uppercase tracking-[0.18em] mb-5">
              {settings?.directionsLabel || t('directions.label')}
            </motion.span>
            <motion.h2
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay:0.1 }}
              className="text-white text-[48px] md:text-[56px] lg:text-[64px] font-black leading-[1.05] mb-12">
              {settings?.directionsTitle || t('directions.title')}
            </motion.h2>

            {/* Items */}
            <AnimatePresence mode="wait">
              <motion.ul
                key={page}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="space-y-5">
                {visible.map((s, i) => {
                  // DB'dan kelgan s.icon — string nomi (masalan "TrendingUp"), funksiyaga aylantirish kerak.
                  // SUBJECTS fallback'dan kelgan s.icon — to'g'ridan-to'g'ri React komponent.
                  const Icon = typeof s.icon === 'function'
                    ? s.icon
                    : (ICON_MAP[s.iconName] || ICON_MAP[s.icon] || BookOpen);
                  return (
                    <motion.li
                      key={s.id || s.name || i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.06 }}
                      onClick={() => onSelect?.(s)}
                      className="group flex items-center gap-5 cursor-pointer">
                      <div className="w-14 h-14 rounded-xl bg-orange flex items-center justify-center
                                      flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3
                                      transition-all duration-300">
                        <Icon size={26} className="text-white" strokeWidth={2} />
                      </div>
                      <span className="text-white font-bold text-[17px] md:text-[19px] uppercase tracking-wide
                                       group-hover:text-orange transition-colors duration-300">
                        {s.name}
                      </span>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </AnimatePresence>

            {/* Nav arrows */}
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={prev}
                aria-label={t('directions.prev')}
                className="w-12 h-12 rounded-full border-2 border-white/40 hover:border-orange hover:bg-orange
                           text-white flex items-center justify-center transition-all duration-200
                           hover:-translate-x-0.5">
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                aria-label={t('directions.next')}
                className="w-12 h-12 rounded-full border-2 border-white/40 hover:border-orange hover:bg-orange
                           text-white flex items-center justify-center transition-all duration-200
                           hover:translate-x-0.5">
                <ChevronRight size={20} />
              </button>
              <span className="ml-3 text-white/60 text-sm font-medium">
                {String(page + 1).padStart(2,'0')} / {String(pages).padStart(2,'0')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
