/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#1a4731",
          medium: "#2d7a4f",
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}