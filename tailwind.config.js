/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        notion: {
          black: 'rgba(0,0,0,0.95)',
          blue: '#16a34a',
          'blue-hover': '#15803d',
          warm: '#f8f6f3',
          dark: '#31302e',
          gray: '#525252',
          light: '#a3a3a3',
        },
        bumi: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        tanah: {
          50: '#fdf8f0',
          100: '#f5e6d0',
          200: '#e8cd9e',
          300: '#d4a86a',
          400: '#c48844',
          500: '#a66c2e',
          600: '#8a5524',
          700: '#6e411d',
          800: '#5a3518',
          900: '#3d2410',
        },
        surface: {
          white: '#ffffff',
          warm: '#f8f6f3',
          cream: '#fcfaf7',
          dark: '#0f1a0f',
          card: '#ffffff',
          hover: '#f0fdf4',
        },
        accent: {
          green: '#16a34a',
          'green-hover': '#15803d',
          'green-light': '#dcfce7',
          gold: '#c48844',
          orange: '#ea580c',
          red: '#dc2626',
        },
        text: {
          primary: '#0a0a0a',
          secondary: '#525252',
          muted: '#a3a3a3',
          ondark: '#fafafa',
        },
        border: {
          light: 'rgba(0,0,0,0.08)',
          medium: 'rgba(0,0,0,0.12)',
          dark: 'rgba(0,0,0,0.2)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '14px',
        'xl': '18px',
        'pill': '9999px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)',
        'card-hover': '0 4px 14px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)',
        'elevated': '0 10px 25px rgba(0,0,0,0.06), 0 4px 10px rgba(0,0,0,0.04)',
        'modal': '0 20px 50px rgba(0,0,0,0.1), 0 8px 20px rgba(0,0,0,0.06)',
        'nav': '0 1px 3px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
}
