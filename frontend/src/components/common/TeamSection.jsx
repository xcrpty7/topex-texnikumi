import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const FALLBACK = TEACHERS_RAW.map(x => ({ ...x, role: t(`team.roles.${x.roleKey}`) }));
  const TEACHERS = teachers.length > 0
    ? teachers.map(x => ({
        name:  x.name,
        role:  x.role,
        img:   x.image ? (x.image.startsWith('http') || x.image.startsWith('/assets') ? x.image : `${API_URL}${x.image}`) : '/assets/Ustozlar/DSC01143.webp',
      }))
    : FALLBACK;
  const [page, setPage] = useState(0);
  const perView = 2;
  const pages = Math.max(1, Math.ceil(TEACHERS.length / perView));
  const visible = TEACHERS.slice(page * perView, page * perView + perView);

  const prev = () => setPage(p => (p - 1 + pages) % pages);
  const next = () => setPage(p => (p + 1) % pages);

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
              {settings?.teamLabel || t('team.label')}
            </motion.span>
            <motion.h2
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay:0.1 }}
              className="text-[42px] md:text-[52px] lg:text-[56px] font-black text-brand leading-[1.05] mb-8">
              {settings?.teamTitle || t('team.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay:0.2 }}
              className="text-gray-600 text-[15px] md:text-[16px] leading-[1.85] mb-10 max-w-xl">
              {settings?.teamParagraph || t('team.paragraph')}
            </motion.p>
            <motion.div
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay:0.3 }}>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center bg-brand hover:bg-brand-dark
                           text-white font-semibold px-12 py-4 rounded-xl shadow-lg
                           hover:-translate-y-0.5 transition-all duration-200 text-[15px]">
                {settings?.teamBtnText || t('team.allTeachers')}
              </Link>
            </motion.div>
          </div>

          {/* RIGHT — teacher cards */}
          <div className="relative">
            {/* Arrows above cards (top-right) */}
            <div className="flex justify-end gap-3 mb-6">
              <button
                onClick={prev}
                aria-label="Oldingi"
                className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-orange hover:bg-orange
                           text-gray-500 hover:text-white flex items-center justify-center
                           transition-all duration-200 hover:-translate-x-0.5">
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                aria-label="Keyingi"
                className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-orange hover:bg-orange
                           text-gray-500 hover:text-white flex items-center justify-center
                           transition-all duration-200 hover:translate-x-0.5">
                <ChevronRight size={20} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-2 gap-5">
                {visible.map((t, i) => (
                  <motion.div
                    key={t.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl group cursor-pointer">
                    <img
                      src={t.img}
                      alt={t.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover
                                 group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Bottom navy banner */}
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
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* page indicator */}
            <div className="flex items-center justify-end gap-2 mt-5">
              {[...Array(pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`Sahifa ${i+1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    page === i ? 'w-8 bg-orange' : 'w-1.5 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
