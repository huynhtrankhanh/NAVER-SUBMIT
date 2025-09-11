/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4f46e5', // Indigo-600
        'primary-dark': '#4338ca', // Indigo-700
        'background': '#f9fafb', // Gray-50
        'surface': '#ffffff', // White
        'text-main': '#111827', // Gray-900
        'text-light': '#6b7280', // Gray-500
      }
    },
  },
  plugins: [],
}