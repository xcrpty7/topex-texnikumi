import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Award } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';
const resolveImg = (u) =>
  !u ? '' : (u.startsWith('http') || u.startsWith('/assets')) ? u : `${API_URL}${u}`;

/**
 * Hujjat / Sertifikat (Diplom) bo'limi — matn statik (i18n), rasmlar admin paneldan (ixtiyoriy).
 * Rasmlar object-contain bilan to'liq, kesilmasdan, matni o'qiladigan ko'rinishda.
 */
const DiplomaSection = ({ settings }) => {
  const { t } = useTranslation();

  const img1 = resolveImg(settings?.diplomaImage1);
  const img2 = resolveImg(settings?.diplomaImage2);
  const title = t('diplomaSection.title');
  const text = t('diplomaSection.text');

  const images = [img1, img2].filter(Boolean);
  const cards = [
    { t: t('diplomaSection.card1Title'), d: t('diplomaSection.card1Desc') },
    { t: t('diplomaSection.card2Title'), d: t('diplomaSection.card2Desc') },
  ];

  // Sertifikat rasmlari hali yuklanmagan bo'lsa — matn qismini baribir ko'rsatamiz
  if (!images.length && !title && !text) return null;

  return (
    <section className="relative bg-gray-50 py-12 sm:py-20 lg:py-28 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 60px, #1d3a8a 60px 61px)' }}
      />
      <div className="w-full max-w-[1500px] mx-auto px-6 lg:px-16 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT — matn + kartalar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.55 }}>
            <span className="inline-block text-orange font-bold text-[13px] uppercase tracking-[0.18em] mb-5">
              {t('diplomaSection.badge')}
            </span>
            {title && (
              <h2 className="text-[28px] sm:text-[36px] md:text-[44px] font-black text-brand leading-[1.1] mb-6">
                {title}
              </h2>
            )}
            {text && (
              <p className="text-gray-600 text-[15px] md:text-base leading-[1.8] mb-8 whitespace-pre-line max-w-xl">
                {text}
              </p>
            )}
            {cards.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {cards.map((c, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-11 h-11 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-3">
                      <Award size={22} />
                    </div>
                    {c.t && <h3 className="font-bold text-brand text-[15px] mb-1">{c.t}</h3>}
                    {c.d && <p className="text-gray-500 text-[13px] leading-relaxed">{c.d}</p>}
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT — sertifikat rasmlari (to'liq, kesilmasdan) */}
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4 sm:gap-6">
              {images.map((src, i) => (
                <div key={i}
                  className={`rounded-2xl bg-white shadow-xl ring-1 ring-gray-200 overflow-hidden p-2
                              ${images.length === 1 ? 'col-span-2 max-w-md mx-auto' : ''}`}>
                  <img src={src} alt="Topex hujjati / sertifikati"
                    className="w-full h-auto object-contain rounded-xl" loading="lazy" />
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DiplomaSection;
