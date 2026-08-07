/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#07090e',
          900: '#0b0f17',
          850: '#111723',
          800: '#172030',
          700: '#233047',
        },
        brand: {
          blue: '#3b82f6',
          indigo: '#6366f1',
          accent: '#60a5fa',
        }
      }
    },
  },
  plugins: [],
}
