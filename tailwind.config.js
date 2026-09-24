/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
    "./App.tsx",
    "./src/**/*.{js,jsx,ts,tsx}",   // 👈 esta línea es la que probablemente falta
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
