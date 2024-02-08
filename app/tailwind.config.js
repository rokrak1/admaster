/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        cprimary: {
          50: '#dedbf5',
          100: '#bdb8eb',
          200: '#9c95e2',
          300: '#7b72d8',
          400: '#5A4FCF',
          500: '#5A4FCF',
          600: '#433b9b',
          700: '#2d2767',
          800: '#161333',
          900: '#000000',
        }
        
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

