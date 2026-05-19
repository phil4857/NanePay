// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        brand: {
          green:  '#00C853',
          dark:   '#0A0F1E',
          card:   '#111827',
          border: '#1F2937',
          muted:  '#6B7280',
          light:  '#F9FAFB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #00C853 0%, #00897B 100%)',
        'gradient-dark':  'linear-gradient(135deg, #0A0F1E 0%, #111827 100%)',
        'gradient-card':  'linear-gradient(145deg, #111827 0%, #1F2937 100%)',
        'hero-glow':      'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,200,83,0.25) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow-green': '0 0 40px rgba(0,200,83,0.2)',
        'glow-sm':    '0 0 15px rgba(0,200,83,0.15)',
        'card':       '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in':     'fadeIn 0.5s ease-out',
        'slide-up':    'slideUp 0.5s ease-out',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':       'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' },                          '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float:   { '0%,100%': { transform: 'translateY(0px)' },     '50%': { transform: 'translateY(-10px)' } },
      },
    },
  },
  plugins: [],
}
