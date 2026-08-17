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

        /* Landing page — monochrome surface + edge + foreground scale.
           No brand hue: contrast and rules carry the whole design. */
        surface: {
          0: "#000000",
          1: "#0A0A0A",
          2: "#101010",
          3: "#161616",
        },
        edge: {
          soft: "#141414",
          DEFAULT: "#1F1F1F",
          strong: "#2E2E2E",
          loud: "#454545",
        },
        fg: {
          DEFAULT: "#EDEDED",
          muted: "#A1A1A1",
          subtle: "#6E6E6E",
          faint: "#4A4A4A",
        },
      },
      fontFamily: {
        sans: ["Geist", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        shell: "1180px",
      },
    },
  },
  plugins: [],
};
