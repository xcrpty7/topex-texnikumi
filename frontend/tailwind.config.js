/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand:     { DEFAULT: '#1d3a8a', dark: '#142a66', light: '#2949a8', deep: '#0f2563' },
        orange:    { DEFAULT: '#f97316', dark: '#ea580c', light: '#fb923c', faint: '#fff4ec' },
        blue:      { DEFAULT: '#1d3a8a', dark: '#142a66', light: '#2949a8', faint: '#e8edfa' },
        navy:      { DEFAULT: '#0f2563', light: '#1d3a8a', dark: '#0a1842' },
        teal:      { DEFAULT: '#17D1C6', dark: '#10A89E', faint: '#E8FAF9' },
        coral:     { DEFAULT: '#f97316', dark: '#ea580c', faint: '#fff4ec' },
        secondary: '#3fb950',
        accent:    '#8b949e',
        primary:   { DEFAULT: '#1C2140', dark: '#0d1117', light: '#252B52' },
        surface: {
          DEFAULT: '#F0F2F7',
          mid:     '#E6E9F2',
          dark:    '#D8DCE8',
          card:    '#ECEEF6',
        },
        gray: {
          50:  '#F8F9FC', 100: '#F0F2F8', 200: '#E2E6F0', 300: '#C4CBDE',
          400: '#9AA5CA', 500: '#6B7BAA', 600: '#4A5A8A', 700: '#303D6A',
          800: '#1E2850', 900: '#111830',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'hero-bg':    'linear-gradient(135deg, #1d3a8a 0%, #142a66 60%, #0f2563 100%)',
        'brand-grad': 'linear-gradient(135deg, #1d3a8a 0%, #2949a8 100%)',
        'blue-grad':  'linear-gradient(135deg, #1d3a8a 0%, #2949a8 100%)',
        'navy-grad':  'linear-gradient(135deg, #0f2563 0%, #1d3a8a 100%)',
        'orange-grad':'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
        'teal-grad':  'linear-gradient(135deg, #17D1C6 0%, #3DDBD0 100%)',
        'coral-grad': 'linear-gradient(135deg, #FF7D6A 0%, #FF9A8B 100%)',
        'dark-grad':  'linear-gradient(135deg, #D8DCE8 0%, #CDD2E6 100%)',
      },
      boxShadow: {
        sm:    '0 1px 8px rgba(28,33,64,0.07)',
        card:  '0 2px 20px rgba(28,33,64,0.09)',
        lg:    '0 8px 40px rgba(28,33,64,0.16)',
        xl:    '0 16px 60px rgba(28,33,64,0.22)',
        blue:  '0 4px 20px rgba(61,102,232,0.30)',
        coral: '0 4px 16px rgba(255,125,106,0.32)',
        teal:  '0 4px 16px rgba(23,209,198,0.28)',
      },
      animation: {
        'fade-up':  'fadeUp 0.55s ease-out',
        'fade-in':  'fadeIn 0.4s ease-out',
        'float':    'float 4s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:     { from: { opacity:'0', transform:'translateY(28px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        fadeIn:     { from: { opacity:'0' }, to: { opacity:'1' } },
        float:      { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-12px)' } },
        pulseSoft:  { '0%,100%': { opacity:'0.7' }, '50%': { opacity:'1' } },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
