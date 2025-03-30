/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1A73E8",
        secondary: "#673AB7",
        darkbg: "#0f0f0f",
        cardbg: "#1E1E1E",
        accent: "#00e599",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
