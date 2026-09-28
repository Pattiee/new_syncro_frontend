/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Gotham', 'sans-serif'],
      },
      colors: {
        primary: '#ff6600',
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        slide: 'slide 20s linear infinite',
        'slide-in': 'slide-in 1s ease-out forwards',
        'fade-in': 'fade-in 1s ease-in forwards',
      },
      transitionProperty: {
        'bg-color': 'background-color, color',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};