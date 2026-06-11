const UZ = {
  justNow: 'hozirgina',
  minuteAgo: '1 daqiqa oldin',
  minutesAgo: (n) => `${n} daqiqa oldin`,
  hourAgo: '1 soat oldin',
  hoursAgo: (n) => `${n} soat oldin`,
  yesterday: 'kecha',
  daysAgo: (n) => `${n} kun oldin`,
  weeksAgo: (n) => `${n} hafta oldin`,
  monthsAgo: (n) => `${n} oy oldin`,
  yearsAgo: (n) => `${n} yil oldin`,
};

export const timeAgo = (date) => {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '—';

  const diffMs   = Date.now() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHrs  = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs  / 24);
  const diffWks  = Math.floor(diffDays / 7);
  const diffMons = Math.floor(diffDays / 30);
  const diffYrs  = Math.floor(diffDays / 365);

  if (diffSecs < 60)   return UZ.justNow;
  if (diffMins === 1)  return UZ.minuteAgo;
  if (diffMins < 60)   return UZ.minutesAgo(diffMins);
  if (diffHrs  === 1)  return UZ.hourAgo;
  if (diffHrs  < 24)   return UZ.hoursAgo(diffHrs);
  if (diffDays === 1)  return UZ.yesterday;
  if (diffDays < 7)    return UZ.daysAgo(diffDays);
  if (diffWks  < 5)    return UZ.weeksAgo(diffWks);
  if (diffMons < 12)   return UZ.monthsAgo(diffMons);
  return UZ.yearsAgo(diffYrs);
};

export const formatDate = (date, locale = 'uz-UZ') => {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
};
