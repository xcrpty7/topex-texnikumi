import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import 'swiper/css';

const NEWS_IMAGES = [
  '/assets/posts/smm-01.jpg',
  '/assets/posts/smm-02.jpg',
  '/assets/posts/smm-03.jpg',
  '/assets/images/DSC00827.jpg',
  '/assets/images/DSC01036.jpg',
  '/assets/images/DSC01093.jpg',
];

export default function NewsSwiper({ articles, settings }) {
  const { t } = useTranslation();
  const swiperRef = useRef(null);

  const items = (articles && articles.length > 0)
    ? articles.map((a, i) => ({
        title: a.title,
        img: NEWS_IMAGES[i % NEWS_IMAGES.length],
        href: `/blog/${a.slug || a._id}`,
      }))
    : NEWS_IMAGES.map((img, i) => ({
        title: t(`news.items.n${i+1}`),
        img,
        href: '/blog',
      }));

  return (
    <section className="relative bg-white py-20 lg:py-28 overflow-hidden">
      <div
        className="absolute -bottom-32 -right-32 w-[600px] h-[600px] opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 40px, #1d3a8a 40px 41px)',
        }}
      />

      <div className="w-full max-w-[1500px] mx-auto px-6 lg:px-16 relative">
        {/* Header */}
        <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
          <div>
            <motion.span
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              className="inline-block text-orange font-bold text-[13px] uppercase tracking-[0.18em] mb-5">
              {t('news.label')}
            </motion.span>
            <motion.h2
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay:0.1 }}
              className="text-[42px] md:text-[52px] lg:text-[56px] font-black text-brand leading-[1.05]">
              {t('news.title')}
            </motion.h2>
          </div>


        </div>

        {/* Swiper */}
        <Swiper
          modules={[Autoplay]}
          onSwiper={(sw) => { swiperRef.current = sw; }}
          spaceBetween={28}
          slidesPerView={1}
          breakpoints={{
            640:  { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          speed={600}
          loop={false}
          className="!overflow-visible"
        >
          {items.map((it, i) => (
            <SwiperSlide key={i}>
              <Link to={it.href} className="block group">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg mb-5">
                  <img
                    src={it.img}
                    alt={it.title}
                    className="absolute inset-0 w-full h-full object-cover
                               group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-brand font-bold text-[16px] md:text-[17px] uppercase tracking-wide leading-tight mb-5 line-clamp-2
                               group-hover:text-orange transition-colors duration-300">
                  {it.title}
                </h3>
                <div className="inline-flex items-center gap-2 text-orange font-bold text-[13px] uppercase tracking-[0.18em]
                                group-hover:gap-3 transition-all duration-300">
                  {t('news.more')}
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
