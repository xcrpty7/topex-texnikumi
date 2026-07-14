import { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useTranslation } from 'react-i18next';
import { BookOpen } from 'lucide-react';
import {
  Code, TrendingUp, Palette, ShieldCheck, Hotel, BarChart3, FlaskConical, Sprout,
} from 'lucide-react';
import 'swiper/css';

const ICON_MAP = { Code, TrendingUp, Palette, ShieldCheck, Hotel, BarChart3, FlaskConical, Sprout, BookOpen };

/* Tartib SUBJECTS (HomePage) bilan bir xil bo'lishi shart */
const TRANS_KEYS = ['lab','pharma','marketing','programming','graphics','bank','hotel','analytics'];

const PHOTOS = [
  '/assets/images/DSC04074.jpg',
  '/assets/images/DSC04165.jpg',
  '/assets/images/DSC04114.jpg',
  '/assets/images/DSC04055.jpg',
];

const PAGE_SIZE = 8;

export default function DirectionsSplit({ subjects = [], settings, onSelect }) {
  const { t, i18n } = useTranslation();
  const swiperRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [photoIdx, setPhotoIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setPhotoIdx(p => (p + 1) % PHOTOS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const isFromDB = subjects[0]?._id != null;
  const localized = isFromDB
    ? subjects.map(s => ({ ...s, iconName: s.icon }))
    : subjects.slice(0, TRANS_KEYS.length).map((s, i) => ({
        ...s,
        name: t(`directions.items.${TRANS_KEYS[i]}`),
      }));
  const chunks = [];
  for (let i = 0; i < localized.length; i += PAGE_SIZE) {
    chunks.push(localized.slice(i, i + PAGE_SIZE));
  }

  return (
    <section className="relative bg-white">
      <div className="grid lg:grid-cols-2">

        {/* LEFT — Photo */}
        <div className="relative overflow-hidden bg-gray-900 h-full min-h-[300px]">
          {PHOTOS.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Topex Texnikumi filiali ${i + 1}`}
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === photoIdx ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand/20 pointer-events-none z-10" />
        </div>

        {/* RIGHT — Navy block with directions */}
        <div className="relative bg-brand px-6 sm:px-10 lg:px-16 py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
               style={{
                 backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                 backgroundSize: '24px 24px',
               }} />

          <div className="relative max-w-2xl">
            <span
              className="inline-block text-orange font-bold text-[13px] uppercase tracking-[0.18em] mb-5">
              {t('directions.label')}
            </span>
            <h2
              className="text-white text-[36px] md:text-[48px] lg:text-[56px] font-black leading-[1.05] mb-10">
              {t('directions.title')}
            </h2>

            <Swiper
              modules={[]}
              onSwiper={(sw) => { swiperRef.current = sw; }}
              onSlideChange={(sw) => setActiveIdx(sw.realIndex)}
              className="w-full"
              autoHeight
            >
              {chunks.map((chunk, ci) => (
                <SwiperSlide key={ci}>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 md:gap-y-5">
                    {chunk.map((s, i) => {
                      const Icon = typeof s.icon === 'string'
                        ? (ICON_MAP[s.icon] || BookOpen)
                        : (s.icon || ICON_MAP[s.iconName] || BookOpen);
                      return (
                        <li
                          key={s.id || s.name || i}
                          onClick={() => onSelect?.(s)}
                          className="group flex items-center gap-4 md:gap-5 cursor-pointer py-0.5"
                        >
                          <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-orange flex items-center justify-center
                                          flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3
                                          transition-all duration-300">
                            <Icon size={22} className="text-white" strokeWidth={2} />
                          </div>
                          <span className="text-white font-bold text-[13px] md:text-[15px] uppercase tracking-wide leading-snug
                                           group-hover:text-orange transition-colors duration-300">
                            {s.name}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Dots */}
            {chunks.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {chunks.map((_, ci) => (
                  <button
                    key={ci}
                    onClick={() => swiperRef.current?.slideTo(ci)}
                    className={`w-2.5 h-2.5 rounded-full border transition-all duration-200 ${
                      activeIdx === ci ? 'bg-orange border-orange' : 'border-white/40 hover:bg-orange'
                    }`}
                    aria-label={`${t('directions.next')} ${ci + 1}`}
                  />
                ))}
              </div>
            )}

            {/* ── Discount pricing panel ── */}
            <div className="mt-10 rounded-2xl p-5 pt-7 border border-white/20 relative
                            bg-gradient-to-br from-white/[0.14] to-white/[0.06] backdrop-blur-sm
                            shadow-[0_16px_40px_-12px_rgba(0,0,0,0.45)]
                            transition-transform duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0">
                <div className="bg-gradient-to-b from-red-500 to-red-600 text-white font-black text-[11px]
                                tracking-wider px-4 py-2 rounded-bl-2xl rounded-tr-2xl
                                border-b-2 border-red-800/70
                                shadow-[0_6px_16px_rgba(239,68,68,0.45)]
                                [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
                  {t('pricing.badge')}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-xl font-black text-red-300 line-through">25 000 000 {t('pricing.sum')}</div>
                  <div className="text-2xl font-black text-emerald-300 [text-shadow:0_2px_8px_rgba(52,211,153,0.35)]">20 000 000 {t('pricing.sum')}</div>
                  <div className="text-xs text-white/60 mt-1">{t('pricing.yearly')}</div>
                </div>
                <div className="hidden sm:block w-px h-10 bg-white/20" />
                <div className="text-center">
                  <div className="text-xl font-black text-emerald-300">2 000 000 {t('pricing.sum')}</div>
                  <div className="text-xs text-white/60 mt-1">{t('pricing.monthly')}</div>
                </div>
              </div>
              <div className="text-center text-[11px] text-orange font-semibold mt-3">
                {t('pricing.until')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
