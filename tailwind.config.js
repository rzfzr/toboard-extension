/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  important: '#root',
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}

