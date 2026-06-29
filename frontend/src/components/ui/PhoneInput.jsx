/**
 * Telefon input — har doim +998 prefiksi bilan.
 * Foydalanuvchi faqat qolgan raqamlarni kiritadi, +998 doimiy turadi.
 * value — to'liq raqam ("+998 901234567"), onChange ham to'liq raqamni qaytaradi.
 */
// 9 ta raqamni chiroyli guruhlash: "88 131 65 67" (2-3-2-2)
const formatLocal = (digits) =>
  [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)]
    .filter(Boolean)
    .join(' ');

const PhoneInput = ({ value, onChange, className = '', placeholder = '88 131 65 67', ...rest }) => {
  // value ichidan lokal qismini ajratamiz (+998 dan keyingi raqamlar)
  const localDigits = (value || '').replace(/^\+?998\s*/, '').replace(/\D/g, '').slice(0, 9);

  const handle = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 9); // O'zbekiston: 9 ta raqam
    onChange(digits ? `+998 ${formatLocal(digits)}` : '');
  };

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand font-semibold text-[15px] pointer-events-none select-none">
        +998
      </span>
      <input
        type="tel"
        inputMode="numeric"
        value={formatLocal(localDigits)}
        onChange={handle}
        placeholder={placeholder}
        className={`pl-[66px] ${className}`}
        {...rest}
      />
    </div>
  );
};

export default PhoneInput;
