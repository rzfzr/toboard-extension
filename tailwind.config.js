/** @type {import('tailwindcss').Config} */
export default {
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

