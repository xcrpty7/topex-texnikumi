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
        <link rel="canonical" href="https://topextexnikum.uz/gallery" />
        <meta property="og:title" content={t('galleryPage.meta.title')} />
        <meta property="og:description" content={t('galleryPage.meta.description')} />
        <meta property="og:url" content="https://topextexnikum.uz/gallery" />
        <meta property="og:image" content="https://topextexnikum.uz/assets/images/hero/hero-2.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('galleryPage.meta.title')} />
        <meta name="twitter:description" content={t('galleryPage.meta.description')} />
        <meta name="twitter:image" content="https://topextexnikum.uz/assets/images/hero/hero-2.webp" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": "https://topextexnikum.uz/" },
            { "@type": "ListItem", "position": 2, "name": "Galereya", "item": "https://topextexnikum.uz/gallery" }
          ]
        })}</script>
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
