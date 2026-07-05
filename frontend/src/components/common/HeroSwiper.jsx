import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, GraduationCap } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/effect-fade';

const API_URL = import.meta.env.VITE_API_URL || '';

const resolveImg = (val, fallback) => {
  if (!val) return fallback;
  return val.startsWith('/assets') ? val : `${API_URL}${val}`;
};

const srcSetFor = (path) => {
  const base = path?.replace('.webp', '');
  if (!base || !base.startsWith('/assets')) return undefined;
  return `${base}-480w.webp 480w, ${base}-960w.webp 960w, ${base}-1440w.webp 1440w, ${path} 1920w`;
};

const IMAGES = [
  '/assets/images/hero/hero-1.webp',
  '/assets/images/hero/hero-2.webp',
  '/assets/images/hero/hero-3.webp',
];

export default function HeroSwiper({ settings }) {
  const { t, i18n } = useTranslation();
  const [activeIdx, setActiveIdx] = useState(0);
  const swiperRef = useRef(null);

  const dbSlides = Array.isArray(settings?.heroSlides) && settings.heroSlides.length > 0;

  const resolveBg = (val, fallback) => {
    const src = val ? resolveImg(val, fallback) : fallback;
    return src.replace('.webp', '-960w.webp');
  };

  const slides = dbSlides
    ? settings.heroSlides.map((s, i) => ({
        title: i < 3
          ? [t(`hero.slide${i+1}Title1`), t(`hero.slide${i+1}Title2`), t(`hero.slide${i+1}Title3`)].filter(Boolean)
          : [s.title1, s.title2, s.title3].filter(Boolean),
        subtitle: i < 3 ? t(`hero.slide${i+1}Sub`) : (s.subtitle || ''),
        imageBg: resolveBg(s.image, IMAGES[i]),
        imageFg: s.image ? resolveImg(s.image, IMAGES[i]) : IMAGES[i],
      }))
    : IMAGES.map((img, i) => ({
        title: [
          t(`hero.slide${i+1}Title1`),
          t(`hero.slide${i+1}Title2`),
          t(`hero.slide${i+1}Title3`),
        ],
        subtitle: t(`hero.slide${i+1}Sub`),
        imageBg: img.replace('.webp', '-960w.webp'),
        imageFg: img,
      }));

  const ctaText  = t('hero.ctaApply');
  const noteText = t('hero.note');

  return (
    <section className="relative bg-white overflow-hidden" key={i18n.language}>
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        speed={900}
        onSwiper={(sw) => { swiperRef.current = sw; }}
        onSlideChange={(sw) => setActiveIdx(sw.realIndex)}
        className="w-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="grid lg:grid-cols-2 min-h-[450px] lg:min-h-[720px]">

              <div className="relative flex items-center px-6 sm:px-10 lg:px-20 py-14 lg:py-0 overflow-hidden bg-brand-deep">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${slide.imageBg}')` }}
                />
                <div className="absolute inset-0 bg-brand-deep/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-deep/30 via-transparent to-brand-deep/40" />

                <AnimatePresence mode="wait">
                  {activeIdx === i && (
                    <motion.div
                      key={`text-${i}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
                      className="relative z-10 max-w-xl">
                      <h1 className="text-white font-black uppercase leading-[1.05]
                                     text-[32px] sm:text-[48px] lg:text-[60px] tracking-tight">
                        {slide.title.map((line, j) => (
                          <motion.span
                            key={j}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + j * 0.1 }}
                            className="block">
                            {line}
                          </motion.span>
                        ))}
                      </h1>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.55 }}
                        className="text-white/85 text-base md:text-lg leading-relaxed mt-7 max-w-lg">
                        {slide.subtitle}
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="mt-10 flex flex-wrap gap-3">
                        <button
                          onClick={() => window.open('https://forms.amocrm.ru/rdrtdrm?fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPNTY3MDY3MzQzMzUyNDI3AAGndm__bflw3M_s4CioAF2rbxIM8i_P_ZmsUz2VAl1Z4TmfDBB3zZOKHVfFpfk_aem_1TL6rTe_jeiibetDD5BbVA', '_blank')}
                          className="inline-flex items-center gap-2 bg-orange-grad hover:brightness-110
                                     text-white font-bold px-8 py-4 rounded-lg shadow-lg
                                     hover:-translate-y-0.5 transition-all duration-200 text-[15px]">
                          {ctaText} <ArrowRight size={18} />
                        </button>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.85 }}
                        className="mt-8 inline-flex items-start gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-sm">
                        <GraduationCap size={20} className="text-orange-light mt-0.5 flex-shrink-0" />
                        <p className="text-white text-sm font-medium leading-snug">
                          {noteText}
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative h-[260px] sm:h-[320px] lg:h-auto overflow-hidden bg-gray-900">
                <AnimatePresence mode="wait">
                  {activeIdx === i && (
                    <motion.img
                      key={`img-${i}`}
                      src={slide.imageFg}
                      alt=""
                      fetchpriority={i === 0 ? 'high' : undefined}
                      srcSet={srcSetFor(slide.imageFg)}
                      sizes="(max-width: 480px) 480px, (max-width: 960px) 960px, (max-width: 1440px) 1440px, 1920px"
                      width={1920}
                      height={1080}
                      initial={{ scale: 1.12, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1, opacity: 0 }}
                      transition={{ scale: { duration: 7, ease: 'easeOut' }, opacity: { duration: 0.9 } }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-brand-deep/30 lg:to-brand-deep/10 pointer-events-none" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute right-5 lg:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => swiperRef.current?.slideToLoop(i)}
            aria-label={`${t('directions.next')} ${i + 1}`}
            className="group relative flex items-center justify-center w-4 h-4">
            <span
              className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
                activeIdx === i ? 'border-orange scale-100' : 'border-white/40 scale-75 group-hover:border-white/80'
              }`}
            />
            <span
              className={`relative rounded-full transition-all duration-300 ${
                activeIdx === i ? 'w-2 h-2 bg-orange' : 'w-1.5 h-1.5 bg-white/60 group-hover:bg-white'
              }`}
            />
            {activeIdx === i && (
              <motion.span
                layoutId="hero-dot-glow"
                className="absolute inset-0 rounded-full bg-orange/30 blur-md"
              />
            )}
          </button>
        ))}
        <div className="mt-2 w-px h-16 bg-white/15 relative overflow-hidden rounded-full">
          <motion.div
            key={activeIdx}
            initial={{ height: '0%' }}
            animate={{ height: '100%' }}
            transition={{ duration: 6, ease: 'linear' }}
            className="absolute top-0 left-0 w-full bg-orange"
          />
        </div>
      </div>
    </section>
  );
}
