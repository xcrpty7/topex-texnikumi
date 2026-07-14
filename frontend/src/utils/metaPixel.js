/** Meta (Facebook) Pixel event helpers. Base pixel is loaded in index.html. */

export const fbTrack = (event, params) => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('track', event, params);
};

export const fbTrackCustom = (event, params) => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('trackCustom', event, params);
};
