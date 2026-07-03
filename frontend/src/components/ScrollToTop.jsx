import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/* easeInOutCubic — sekin boshlanadi, o'rtada tezlashadi, sekin tugaydi (silliq) */
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Belgilangan davomiylikda (ms) silliq, nazorat qilinadigan scroll */
const smoothScrollTo = (targetY, duration = 700) => {
  const startY = window.scrollY || window.pageYOffset;
  const diff = targetY - startY;
  if (Math.abs(diff) < 4) return; // allaqachon joyida — sakramaymiz

  // Foydalanuvchi "kam harakat" rejimini tanlagan bo'lsa — darhol o'tkazamiz
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo({ top: targetY, behavior: 'auto' });
    return;
  }

  let startTime = null;
  const step = (now) => {
    if (startTime === null) startTime = now;
    const progress = Math.min((now - startTime) / duration, 1);
    // behavior:'auto' — global CSS `scroll-behavior:smooth` bilan urishmaslik uchun
    window.scrollTo({ top: startY + diff * easeInOutCubic(progress), behavior: 'auto' });
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

/**
 * Har bir route o'zgarganda sahifani silliq yuqoriga ko'taradi.
 * Hash (#anchor) bo'lsa — o'sha elementga silliq scroll qiladi.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Yangi sahifa (lazy) render bo'lib bo'lgach scroll qilamiz
    const id = requestAnimationFrame(() => {
      if (hash) {
        const el = document.getElementById(hash.slice(1));
        if (el) {
          smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - 90, 700);
          return;
        }
      }
      smoothScrollTo(0, 700);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
