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
        accent: "#5EEAD4",

        /* Landing page design tokens — dark precision surface scale */
        ink: {
          950: "#08090A",
          900: "#0B0D0E",
          850: "#101314",
          800: "#15191B",
          700: "#1D2224",
          600: "#2A3033",
        },
        mint: {
          DEFAULT: "#5EEAD4",
          soft: "#8FF3E3",
          deep: "#2DD4BF",
        },
        iris: {
          DEFAULT: "#A78BFA",
          deep: "#7C5CFA",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["Inter Tight", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};
