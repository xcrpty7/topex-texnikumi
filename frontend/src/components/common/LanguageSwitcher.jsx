import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

const LANGS = [
  { code: 'uz', label: 'UZ', flag: '🇺🇿' },
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
];

/**
 * Yagona til almashtirgich (dropdown) — sayt va admin panelda bir xil ko'rinadi.
 * dark=true — to'q fonlar uchun (oq matn).
 */
const LanguageSwitcher = ({ dark = false }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGS.find((l) => l.code === i18n.language) || LANGS[0];

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const change = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('topex_lang', code);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
          dark ? 'hover:bg-white/10' : 'hover:bg-gray-50'
        }`}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className={`text-[13px] font-semibold ${dark ? 'text-white/90' : 'text-brand'}`}>{current.label}</span>
        <ChevronDown size={13} className={dark ? 'text-white/50' : 'text-gray-400'} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-100 rounded-xl shadow-lg py-1 overflow-hidden z-50">
          {LANGS.map(({ code, label, flag }) => (
            <button
              key={code}
              type="button"
              onClick={() => change(code)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                i18n.language === code ? 'bg-orange/10 text-orange font-semibold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-base leading-none">{flag}</span> {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
