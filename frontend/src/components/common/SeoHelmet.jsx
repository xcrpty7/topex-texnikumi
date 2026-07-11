import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'TOPEX Texnikumi';
const BASE_URL = 'https://topextexnikum.uz';
const DEFAULT_OG_IMAGE = `${BASE_URL}/assets/images/hero/hero-2.webp`;
const OG_IMAGE_W = 1200;
const OG_IMAGE_H = 630;

const LOCALE_MAP = { ru: 'ru_RU', uz: 'uz_UZ', en: 'en_US' };

const SeoHelmet = ({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  noindex = false,
  children,
}) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const lang = i18n?.language || 'ru';
  const img = ogImage || DEFAULT_OG_IMAGE;
  const locale = LOCALE_MAP[lang] || 'ru_RU';
  const pageUrl = canonical || `${BASE_URL}${location.pathname}`;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={pageUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={locale} />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={img} />
      <meta property="og:image:width" content={String(OG_IMAGE_W)} />
      <meta property="og:image:height" content={String(OG_IMAGE_H)} />

      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={img} />

      <link rel="alternate" hreflang={lang} href={pageUrl} />
      <link rel="alternate" hreflang="x-default" href={pageUrl} />

      {children}
    </Helmet>
  );
};

export default SeoHelmet;
