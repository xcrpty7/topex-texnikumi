import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import NotFoundPage from './NotFoundPage';

/**
 * Galereya hozircha "Tez orada" holatida — o'quv yili suratlari
 * keyinchalik shu yerga joylashtiriladi.
 */
const GalleryPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('galleryPage.meta.title')}</title>
        <meta name="description" content={t('galleryPage.meta.description')} />
        <link rel="canonical" href="https://topex-texnikumi.vercel.app/gallery" />
      </Helmet>

      <NotFoundPage
        variant="soon"
        title={t('galleryPage.soonTitle')}
        subtitle={t('galleryPage.soonText')}
      />
    </>
  );
};

export default GalleryPage;
