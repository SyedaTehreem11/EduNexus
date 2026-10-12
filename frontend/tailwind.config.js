/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#2D4354',
        sage: '#73766A',
        cream: '#FED7A5',
        terracotta: '#9E6752',
        mauve: '#534145',
        ink: '#20212B',
      },
    },
  },
  plugins: [],
}
