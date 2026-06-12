import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Image as ImageIcon, X, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const up = (delay = 0) => ({
  initial:     { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true },
  transition:  { duration: 0.5, ease: 'easeOut', delay },
});

const STATIC_ITEMS = (t) => [
  { _id: 's1', src: '/assets/images/DSC01093.jpg', title: t('galleryPage.static.s1'), category: 'students' },
  { _id: 's2', src: '/assets/images/DSC01036.jpg', title: t('galleryPage.static.s2'), category: 'students' },
  { _id: 's3', src: '/assets/images/DSC00912.jpg', title: t('galleryPage.static.s3'), category: 'students' },
  { _id: 's4', src: '/assets/images/DSC00827.jpg', title: t('galleryPage.static.s4'), category: 'students' },
  { _id: 's10', src: '/assets/famali-photo/DSC00875.jpg', title: t('galleryPage.static.s10'), category: 'students' },
  { _id: 's11', src: '/assets/famali-photo/DSC00954.jpg', title: t('galleryPage.static.s11'), category: 'students' },
  { _id: 's12', src: '/assets/famali-photo/DSC00955.jpg', title: t('galleryPage.static.s12'), category: 'students' },
  { _id: 's13', src: '/assets/famali-photo/DSC00964.jpg', title: t('galleryPage.static.s13'), category: 'students' },
  { _id: 's14', src: '/assets/famali-photo/DSC00980.jpg', title: t('galleryPage.static.s14'), category: 'students' },
  { _id: 's16', src: '/assets/famali-photo/DSC01053.jpg', title: t('galleryPage.static.s16'), category: 'students' },
  { _id: 's18', src: '/assets/famali-photo/DSC01065.jpg', title: t('galleryPage.static.s18'), category: 'students' },
  { _id: 's19', src: '/assets/famali-photo/DSC01086.jpg', title: t('galleryPage.static.s19'), category: 'students' },
  { _id: 's25', src: '/assets/famali-photo/DSC01268.jpg', title: t('galleryPage.static.s25'), category: 'students' },
  { _id: 't1', src: '/assets/Ustozlar/DSC01143.webp', title: t('galleryPage.static.t1'), category: 'teachers' },
  { _id: 't2', src: '/assets/Ustozlar/DSC01155.webp', title: t('galleryPage.static.t2'), category: 'teachers' },
  { _id: 't3', src: '/assets/Ustozlar/DSC01164.webp', title: t('galleryPage.static.t3'), category: 'teachers' },
  { _id: 't4', src: '/assets/Ustozlar/DSC01187.webp', title: t('galleryPage.static.t4'), category: 'teachers' },
  { _id: 't5', src: '/assets/Ustozlar/DSC01199.webp', title: t('galleryPage.static.t5'), category: 'teachers' },
];

const GalleryPage = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('students');
  const [items, setItems] = useState(STATIC_ITEMS(t));
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/settings').then(r => { if (r.data.data) setSettings(r.data.data); }).catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('galleryPage.meta.title')}</title>
        <meta name="description" content={t('galleryPage.meta.description')} />
        <meta name="keywords" content={t('galleryPage.meta.keywords')} />
        <link rel="canonical" href="https://topex-texnikumi.vercel.app/gallery" />
        <meta property="og:title" content={t('galleryPage.meta.ogTitle')} />
        <meta property="og:description" content={t('galleryPage.meta.ogDescription')} />
        <meta property="og:url" content="https://topex-texnikumi.vercel.app/gallery" />
        <meta property="og:image" content="https://topex-texnikumi.vercel.app/assets/logos/topex-logo.png" />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${settings?.galleryHeroImage || '/assets/images/DSC01036.jpg'}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/70 to-navy/90" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-coral/10 rounded-full blur-[100px]" />
        <div className="wrap relative z-10">
          <motion.div {...up(0)} className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 backdrop-blur-md
                            border border-white/15 rounded-full px-4 py-2 text-sm font-semibold mb-6">
              <Camera size={15} /> {settings?.galleryHeroBadge || 'Bizning Galereya'}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-6 drop-shadow-lg">
              {settings?.galleryHeroTitle || 'Topex hayoti kadrlarda'}
            </h1>
            <p className="text-white/65 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              {settings?.galleryHeroSubtitle || "Ta'lim jarayoni, tadbirlar va talabalarimizning muvaffaqiyatlaridan eng yorqin lavhalar."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Photos Section ── */}
      <section className="sec bg-white">
        <div className="wrap">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div className="text-center md:text-left">
              <span className="lbl">{settings?.galleryPhotosLabel || "FOTO LAVHALAR"}</span>
              <h2 className="h2">{settings?.galleryPhotosTitle || (<>Rasmlar <span className="text-blue">galereyasi</span></>)}</h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex p-1.5 bg-gray-100 rounded-2xl overflow-x-auto max-w-full">
              {[
                { id: 'students', label: settings?.galleryStudentsTab || "O'quvchilar" },
                { id: 'teachers', label: settings?.galleryTeachersTab || "O'qituvchilar" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-5 md:px-6 py-2.5 md:py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    filter === tab.id
                      ? 'bg-white text-blue shadow-md'
                      : 'text-gray-500 hover:text-navy'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATIC_ITEMS.filter(i => filter === 'all' || i.category === filter).map((item, i) => (
              <div
                key={item._id}
                onClick={() => setSelected(item)}
                className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-blue/20 transition-all duration-500"
              >
                <img 
                  src={item.src} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white font-bold text-sm">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── Lightbox ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelected(null)}
          >
            <button 
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
              onClick={() => setSelected(null)}
            >
              <X size={24} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-6xl w-full max-h-full flex flex-col items-center gap-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl bg-black">
                <img src={selected.src} alt={selected.title} className="w-full max-h-[80vh] object-contain mx-auto" />
              </div>
              <h2 className="text-white text-2xl font-bold">{selected.title}</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GalleryPage;
