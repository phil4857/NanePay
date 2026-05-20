/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:   '#6C63FF',
        secondary: '#00D4AA',
        accent:    '#FF6B35',
        gold:      '#FFD700',
        surface:   '#12121A',
        input:     '#1A1A26',
        border:    '#2A2A3E',
        soft:      '#8888AA',
        muted:     '#44445A',
        success:   '#00D4AA',
        danger:    '#FF4560',
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body:    ['Space Grotesk', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      backgroundImage: {
        'gradient-primary':   'linear-gradient(135deg, #6C63FF, #9C92FF)',
        'gradient-secondary': 'linear-gradient(135deg, #00D4AA, #00F5C3)',
        'gradient-accent':    'linear-gradient(135deg, #FF6B35, #FF9F1C)',
        'gradient-gold':      'linear-gradient(135deg, #FFD700, #FFA500)',
        'gradient-dark':      'linear-gradient(135deg, #12121A, #1A1A26)',
      },
    },
  },
  plugins: [],
}
