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

        /* Landing page tokens — mirrors the custom properties in landing.css.
           Surfaces step up visibly from black so cards read as raised. */
        s1: "#0D0D0D",
        s2: "#131313",
        s3: "#1A1A1A",

        line: {
          DEFAULT: "#232323",
          strong: "#333333",
          loud: "#4D4D4D",
        },

        fg: {
          DEFAULT: "#FFFFFF",
          body: "#ADADAD",
          muted: "#808080",
          faint: "#5C5C5C",
        },
      },
      fontFamily: {
        sans: ["Geist", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        shell: "1120px",
      },
    },
  },
  plugins: [],
};
