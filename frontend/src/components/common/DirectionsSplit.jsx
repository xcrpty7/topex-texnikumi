import { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useTranslation } from 'react-i18next';
import { BookOpen } from 'lucide-react';
import {
  Code, TrendingUp, Palette, ShieldCheck, Hotel, BarChart3, FlaskConical, Sprout,
} from 'lucide-react';
import 'swiper/css';

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
              alt=""
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

          <div className="relative max-w-xl">
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
                  <ul className="space-y-5">
                    {chunk.map((s, i) => {
                      const Icon = typeof s.icon === 'function'
                        ? s.icon
                        : (ICON_MAP[s.iconName] || ICON_MAP[s.icon] || BookOpen);
                      return (
                        <li
                          key={s.id || s.name || i}
                          onClick={() => onSelect?.(s)}
                          className="group flex items-center gap-5 cursor-pointer py-1"
                        >
                          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-orange flex items-center justify-center
                                          flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3
                                          transition-all duration-300">
                            <Icon size={24} className="text-white" strokeWidth={2} />
                          </div>
                          <span className="text-white font-bold text-[15px] md:text-[19px] uppercase tracking-wide
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
            <div className="flex items-center justify-center gap-2 mt-12">
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
          </div>
        </div>
      </div>
    </section>
  );
}
