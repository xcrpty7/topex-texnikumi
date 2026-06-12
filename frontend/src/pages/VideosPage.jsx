import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Film, X, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';

const up = (delay = 0) => ({
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.5, ease: 'easeOut', delay },
});

const VideosPage = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/videos')
      .then(res => setItems(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('nav.videos') || 'Videolar'} — TOPEX</title>
      </Helmet>

      <section className="w-full pt-36 pb-24">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div className="text-center mb-14" {...up()}>
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4"
              style={{ background: '#FFF3E0', color: '#E65100' }}>
              TOPEX
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#272829] mb-4">
              {t('videos.title') || 'Video galereya'}
            </h1>
            <p className="text-[#61677A] max-w-2xl mx-auto text-lg">
              {t('videos.subtitle') || 'Texnikum hayotidan lavhalar, dars jarayonlari va tadbirlar'}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <Film size={48} className="mx-auto mb-4 text-[#9CA3AF]" />
              <p className="text-[#61677A]">{t('videos.empty') || 'Hali videolar mavjud emas'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item, i) => (
                <motion.div
                  key={item._id}
                  {...up(i * 0.05)}
                  className="group cursor-pointer rounded-2xl overflow-hidden border border-[#E5E7EA] bg-white hover:shadow-lg transition-all"
                  onClick={() => setSelected(item)}
                >
                  <div className="aspect-video bg-[#F1F2F4] relative overflow-hidden">
                    <video
                      src={item.url}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-all">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play size={28} className="text-[#272829] ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[#272829] text-lg mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-[#61677A] line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)' }}
            onClick={() => setSelected(null)}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-10"
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={selected.url}
                controls
                autoPlay
                className="w-full rounded-2xl shadow-2xl"
                style={{ maxHeight: '80vh' }}
              >
                <p>Brauzeringiz videoni qo'llab-quvvatlamaydi</p>
              </video>
              <div className="mt-4 text-white">
                <h3 className="text-xl font-bold">{selected.title}</h3>
                {selected.description && (
                  <p className="text-white/70 mt-1">{selected.description}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VideosPage;
