import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        'brand-bg': '#080B12',
        'brand-surface': '#0F1320',
        'brand-card': '#141A2E',
        'brand-border': '#1C2540',
        'brand-green': '#00E5A0',
        'brand-gold': '#FFB830',
        'brand-blue': '#3B82F6',
        'brand-purple': '#8B5CF6',
        'brand-red': '#EF4444',
        'brand-orange': '#F97316',
        'brand-pink': '#EC4899',
        'brand-text': '#EEF2FF',
        'brand-muted': '#5A6A8A',
        'brand-light': '#9AA5C0',
        'brand-dark': '#141A2E',
      },

      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      backgroundImage: {
        'gradient-brand':
          'linear-gradient(135deg, #00E5A0, #3B82F6)',

        'gradient-gold':
          'linear-gradient(135deg, #FFB830, #F97316)',

        'gradient-purple':
          'linear-gradient(135deg, #8B5CF6, #EC4899)',

        'hero-glow':
          'radial-gradient(ellipse at 50% 0%, rgba(0,229,160,0.08) 0%, transparent 60%)',
      },

      animation: {
        'fade-in': 'fadeIn 0.4s ease both',
        'slide-up': 'slideUp 0.35s ease both',
        float: 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulseSlow 2s ease-in-out infinite',
        glow: 'glow 2s ease infinite',
      },

      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },

        slideUp: {
          from: {
            opacity: '0',
            transform: 'translateY(18px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },

        float: {
          '0%,100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-8px)',
          },
        },

        pulseSlow: {
          '0%,100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.6',
          },
        },

        glow: {
          '0%,100%': {
            boxShadow: '0 0 12px rgba(0,229,160,.3)',
          },
          '50%': {
            boxShadow: '0 0 28px rgba(0,229,160,.6)',
          },
        },
      },
    },
  },

  plugins: [],
}

export default config
