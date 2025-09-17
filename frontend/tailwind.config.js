/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'gray-bg': '#f7f7f8',
        'border-gray': '#e5e7eb',
        'brand-blue': '#0052cc',
        'text-primary': '#172b4d',
        'text-secondary': '#5e6c84',
      }
    },
  },
  plugins: [],
}