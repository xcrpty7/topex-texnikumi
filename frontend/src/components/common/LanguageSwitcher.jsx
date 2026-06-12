import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'uz', label: "O'Z" },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
];

const LanguageSwitcher = ({ compact = false }) => {
  const { i18n } = useTranslation();

  const change = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('topex_lang', code);
  };

  return (
    <div className="flex items-center gap-0.5">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => change(code)}
          className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
            compact
              ? i18n.language === code
                ? 'text-orange'
                : 'text-gray-400 hover:text-gray-700'
              : i18n.language === code
                ? 'text-orange bg-orange/10'
                : 'text-navy/50 hover:text-navy'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
