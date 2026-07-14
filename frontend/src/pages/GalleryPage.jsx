import SeoHelmet from '../components/common/SeoHelmet';
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
      <SeoHelmet
        title={t('galleryPage.meta.title')}
        description={t('galleryPage.meta.description')}
        canonical="https://topextexnikum.uz/gallery"
        ogImage="https://topextexnikum.uz/assets/images/hero/hero-2.webp"
      >
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": "https://topextexnikum.uz/" },
            { "@type": "ListItem", "position": 2, "name": "Galereya", "item": "https://topextexnikum.uz/gallery" }
          ]
        })}</script>
      </SeoHelmet>

      <NotFoundPage
        variant="soon"
        title={t('galleryPage.soonTitle')}
        subtitle={t('galleryPage.soonText')}
      />
    </>
  );
};

export default GalleryPage;
