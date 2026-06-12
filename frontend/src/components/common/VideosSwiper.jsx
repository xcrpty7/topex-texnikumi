import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';
import 'swiper/css';

export default function VideosSwiper({ videos = [], onOpen, settings }) {
  const { t } = useTranslation();
  const swiperRef = useRef(null);

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
              {settings?.videosLabel || t('videos.label')}
            </motion.span>
            <motion.h2
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay:0.1 }}
              className="text-[42px] md:text-[52px] lg:text-[56px] font-black text-brand leading-[1.05]">
              {settings?.videosTitle || t('videos.title')}
            </motion.h2>
          </div>


        </div>

        {/* Swiper — vertical 3:4 cards */}
        <Swiper
          modules={[Autoplay]}
          onSwiper={(sw) => { swiperRef.current = sw; }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640:  { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          autoplay={{ delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          speed={600}
          loop={videos.length > 4}
          className="!overflow-visible"
        >
          {videos.map((vid, i) => (
            <SwiperSlide key={i}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
                onClick={() => onOpen?.(vid)}>

                {/* Video element */}
                <video
                  src={vid.src}
                  className="absolute inset-0 w-full h-full object-cover
                             group-hover:scale-105 transition-transform duration-700"
                  muted
                  loop
                  playsInline
                  onMouseOver={e => e.target.play().catch(()=>{})}
                  onMouseOut={e => { e.target.pause(); e.target.currentTime = 0; }}
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30
                                group-hover:from-black/70 group-hover:via-transparent group-hover:to-black/10
                                transition-all duration-500" />

                {/* Play button center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/25 backdrop-blur-md
                                  border-2 border-white/40 flex items-center justify-center
                                  group-hover:scale-110 group-hover:bg-orange group-hover:border-orange
                                  transition-all duration-300 shadow-xl">
                    <Play className="text-white fill-white ml-1" size={28} />
                  </div>
                </div>

                {/* Bottom title */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-white font-black text-lg md:text-xl uppercase tracking-tight leading-tight">
                    {vid.title}
                  </p>
                  <p className="text-orange-light text-[11px] mt-2 uppercase tracking-[0.18em] font-bold">
                    {settings?.videosSubtitle || t('videos.subtitle')}
                  </p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
