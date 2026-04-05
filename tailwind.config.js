

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- IMPORTANT: Ensure this says 'class'
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}