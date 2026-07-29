/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        notion: {
          black: 'rgba(0,0,0,0.95)',
          blue: '#059669',
          'blue-hover': '#047857',
          warm: '#f6f5f4',
          dark: '#31302e',
          gray: '#615d59',
          light: '#a39e98',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'notion': '4px',
      },
      boxShadow: {
        'notion': 'rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.84688px, rgba(0,0,0,0.02) 0px 0.8px 2.925px, rgba(0,0,0,0.01) 0px 0.175px 1.04062px',
      }
    },
  },
  plugins: [],
}
