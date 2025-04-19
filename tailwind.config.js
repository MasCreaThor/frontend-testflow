const {heroui} = require('@heroui/theme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "// 🔥 Asegura que Tailwind lea todo en `src/`",
    "./node_modules/@heroui/theme/dist/components/(navbar|popover|button|ripple|spinner).js"
  ],
  theme: {
    extend: {},
  },
  plugins: [heroui()],
};
