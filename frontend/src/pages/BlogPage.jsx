import SeoHelmet from '../components/common/SeoHelmet';
import { useTranslation } from 'react-i18next';
import NotFoundPage from './NotFoundPage';

const BlogPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <SeoHelmet
        title={t('blogPage.meta.title')}
        description={t('blogPage.meta.description')}
        keywords={t('blogPage.meta.keywords')}
        canonical="https://topextexnikum.uz/blog"
        ogImage="https://topextexnikum.uz/assets/images/DSC01036.webp"
        ogType="blog"
      >
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Bosh sahifa", "item": "https://topextexnikum.uz/" },
            { "@type": "ListItem", "position": 2, "name": "Yangiliklar", "item": "https://topextexnikum.uz/blog" }
          ]
        })}</script>
      </SeoHelmet>

      <NotFoundPage
        variant="soon"
        title={t('blogPage.soonTitle')}
        subtitle={t('blogPage.soonText')}
      />
    </>
  );
};

export default BlogPage;
