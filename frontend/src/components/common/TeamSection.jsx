import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import 'swiper/css';

const TEACHERS_RAW = [
  { name: "G'AYRAT SHOUMAROV", roleKey: 'new1',   img: '/assets/Ustozlar/DSC01143.webp' },
  { name: 'OLGERD FILLIPOV',   roleKey: 'programming',img: '/assets/Ustozlar/DSC01155.webp' },
  { name: 'RUSTAM KARIMOV',    roleKey: 'marketing',  img: '/assets/Ustozlar/DSC01164.webp' },
  { name: 'DILSHOD AZIZOV',    roleKey: 'design',     img: '/assets/Ustozlar/DSC01187.webp' },
  { name: 'AKMAL RAHIMOV',     roleKey: 'bank',       img: '/assets/Ustozlar/DSC01199.webp' },
  { name: 'NORBOYEV NE\'MATBEK CHORIYEVICH', roleKey: 'new1', img: '/assets/Ustozlar/teacher-new-1.webp' },
  { name: 'KUBAYEV RO\'ZIMUROD HIKMATILLAYEVICH', roleKey: 'new2', img: '/assets/Ustozlar/teacher-new-2.webp' },
  { name: 'BURTSEVA ALEKSANDRA VASILEVNA', roleKey: 'new3', img: '/assets/Ustozlar/teacher-new-3.webp' },
  { name: 'ABDULLAYEV OYBEK ODILOVICH', roleKey: 'new4', img: '/assets/Ustozlar/teacher-new-4.webp' },
  { name: 'ERKINOV JAVOHIRBEK JURABEKOVICH', roleKey: 'new5', img: '/assets/Ustozlar/teacher-new-5.webp' },
];

const API_URL = import.meta.env.VITE_API_URL || '';

export default function TeamSection({ teachers = [], settings }) {
  const { t } = useTranslation();
  const swiperRef = useRef(null);
  const FALLBACK = TEACHERS_RAW.map(x => ({ ...x, role: t(`team.roles.${x.roleKey}`) }));
  const TEACHERS = teachers.length > 0
    ? teachers.map(x => ({
        name:  x.name,
        role:  x.role,
        img:   x.image ? (x.image.startsWith('http') || x.image.startsWith('/assets') ? x.image : `${API_URL}${x.image}`) : '/assets/Ustozlar/DSC01143.webp',
      }))
    : FALLBACK;

  const chunks = [];
  for (let i = 0; i < TEACHERS.length; i += 2) {
    chunks.push(TEACHERS.slice(i, i + 2));
  }

  return (
    <section className="relative bg-white py-20 lg:py-28 overflow-hidden">
      {/* Subtle pattern decoration */}
      <div
        className="absolute top-0 left-0 w-1/2 h-full opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 40px, #1d3a8a 40px 41px)',
        }}
      />
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-orange/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[1500px] mx-auto px-6 lg:px-16 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT — text */}
          <div>
            <motion.span
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              className="inline-block text-orange font-bold text-[13px] uppercase tracking-[0.18em] mb-5">
              {t('team.label')}
            </motion.span>
            <motion.h2
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay:0.1 }}
              className="text-[28px] sm:text-[36px] md:text-[48px] lg:text-[52px] font-black text-brand leading-[1.05] mb-8">
              {t('team.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay:0.2 }}
              className="text-gray-600 text-[15px] md:text-[16px] leading-[1.85] mb-10 max-w-xl">
              {t('team.paragraph')}
            </motion.p>
            <motion.div
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay:0.3 }}>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center bg-brand hover:bg-brand-dark
                           text-white font-semibold px-12 py-4 rounded-xl shadow-lg
                           hover:-translate-y-0.5 transition-all duration-200 text-[15px]">
                {t('team.allTeachers')}
              </Link>
            </motion.div>
          </div>

          {/* RIGHT — teacher cards */}
          <div className="relative">
            <div className="flex justify-end gap-3 mb-6">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Oldingi"
                className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-orange hover:bg-orange
                           text-gray-500 hover:text-white flex items-center justify-center
                           transition-all duration-200 hover:-translate-x-0.5">
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Keyingi"
                className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-orange hover:bg-orange
                           text-gray-500 hover:text-white flex items-center justify-center
                           transition-all duration-200 hover:translate-x-0.5">
                <ChevronRight size={20} />
              </button>
            </div>

            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={chunks.length > 1}
              speed={600}
              slidesPerView={1}
              watchSlidesProgress={true}
              resizeObserver={true}
              onSwiper={(sw) => { swiperRef.current = sw; }}
              className="w-full min-h-[200px]"
            >
              {chunks.map((chunk, ci) => (
                <SwiperSlide key={ci}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {chunk.map((t, i) => (
                      <div
                        key={t.name}
                        className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl group cursor-pointer bg-brand-dark">
                        <img
                          src={t.img}
                          alt={t.name}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover
                                     group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute left-3 right-3 bottom-3 bg-brand/95 backdrop-blur-sm
                                        rounded-lg px-4 py-3 text-center
                                        group-hover:bg-orange transition-colors duration-300">
                          <p className="text-white font-bold text-[13px] md:text-[14px] uppercase tracking-wide leading-tight">
                            {t.name}
                          </p>
                          <p className="text-white/80 text-[11px] mt-1">
                            {t.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
