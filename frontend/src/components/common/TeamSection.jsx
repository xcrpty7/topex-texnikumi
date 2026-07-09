import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import 'swiper/css';

const TEACHERS_RAW = [
  { name: 'ABDURASULOV KOZIMJON',   roleKey: 'kimyo',          img: '/assets/Ustozlar/DSC03820.webp' },
  { name: "SHARIPOVA MA'MURA",      roleKey: 'ona_adabiyot',   img: '/assets/Ustozlar/DSC03830.webp' },
  { name: 'SHOVQIYEVA LAYLO',       roleKey: 'ingliz',         img: '/assets/Ustozlar/DSC03842.webp' },
  { name: 'DONIYOROVA SHAHNOZA',    roleKey: 'ingliz',         img: '/assets/Ustozlar/DSC03856.webp' },
  { name: 'IBRAGIMOVA KAMILA',      roleKey: 'matematika',     img: '/assets/Ustozlar/DSC03861.webp' },
  { name: 'MUKIMBOEV FIRDAVS',      roleKey: 'matematika',     img: '/assets/Ustozlar/DSC03872.webp' },
  { name: 'AYTBAYEVA SARBINAZ',     roleKey: 'biologiya_rus',  img: '/assets/Ustozlar/DSC03883.webp' },
  { name: 'SULTONALIYEV SHOXRUH',   roleKey: 'biologiya_uz',   img: '/assets/Ustozlar/DSC03894.webp' },
  { name: 'VALIYEV JAMSHIDBEK',     roleKey: 'ingliz',         img: '/assets/Ustozlar/DSC03901.webp' },
  { name: 'BEKOVA OYSARA',          roleKey: 'bosh_direktor',  img: '/assets/Ustozlar/DSC03904.webp' },
  { name: 'ESHONQULOVA MUNISA',     roleKey: 'administrator',  img: '/assets/Ustozlar/DSC03943.webp' },
  { name: 'ABDUJALILOV BUNYODBEK',  roleKey: 'moliya',         img: '/assets/Ustozlar/DSC03944.webp' },
  { name: 'KARIMOV ISLOM',          roleKey: 'administrator',  img: '/assets/Ustozlar/DSC03951.webp' },
];

export default function TeamSection({ settings }) {
  const { t } = useTranslation();
  const swiperRef = useRef(null);
  // Faqat statik ro'yxat — bazadagi eski yozuvlar ishlatilmaydi
  const TEACHERS = TEACHERS_RAW.map(x => ({ ...x, role: t(`team.roles.${x.roleKey}`) }));

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
          <div className="relative min-w-0">
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
              spaceBetween={0}
              slidesPerView={1}
              onSwiper={(sw) => { swiperRef.current = sw; }}
              className="w-full min-h-[200px]"
            >
              {chunks.map((chunk, ci) => (
                <SwiperSlide key={ci}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {chunk.map((tc) => (
                      <div
                        key={tc.name}
                        className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl group cursor-pointer bg-brand-dark
                                   ring-1 ring-black/5 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                        <img
                          src={tc.img}
                          alt={tc.name}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover object-top
                                     group-hover:scale-[1.06] transition-transform duration-700 ease-out"
                        />
                        {/* pastki gradient — matn o'qilishi uchun */}
                        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
                        <div className="absolute left-3 right-3 bottom-3 bg-brand/85 backdrop-blur-md
                                        rounded-xl px-4 py-3 text-center ring-1 ring-white/15
                                        transition-colors duration-300 group-hover:bg-orange/90">
                          <p className="text-white font-bold text-[13px] md:text-[14px] uppercase tracking-wide leading-tight">
                            {tc.name}
                          </p>
                          <p className="text-white/80 text-[11px] mt-1 leading-snug">
                            {tc.role}
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
