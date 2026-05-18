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
        terra:   '#c8602a',
        gold:    '#d4a853',
        greenlt: '#52b788',
        surface: '#161210',
        input:   '#1c1714',
        border:  '#2a211a',
        soft:    '#a8917f',
        muted:   '#6b5a4e',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
