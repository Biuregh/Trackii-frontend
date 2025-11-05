/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        base: {
          0: "#ffffff",       // pure white
          1: "#fcfcfd",       // off-white
          2: "#f7f7fb",       // subtle panel
          3: "#efeff7",       // soft background
        },
        lavender: {
          50: "#faf7ff",
          100: "#f3eeff",
          200: "#e7deff",
          300: "#d6c7ff",
          400: "#bfa4ff",
          500: "#a883ff",      // main brand
          600: "#8a69e6",
          700: "#6f55c0",
          800: "#544295",
          900: "#443876",
        },
        violet: {
          50: "#f8f7fc",
          100: "#efecfa",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",      // accents
          600: "#7c3aed",
        },
        grape: {
          50: "#fbf9ff",
          100: "#f3edff",
          200: "#e3d7ff",
          300: "#ccb4ff",
          400: "#b18dff",
          500: "#9a6bff",
        },
        ink: {
          600: "#3b3b46",      // headings
          500: "#4b4b57",
          400: "#6b6b78",      // body
          300: "#9aa0a6",      // muted
        },
        success: { 100: "#e8fff4", 500: "#17c964" },
        warn: { 100: "#fff8e6", 500: "#f59e0b" },
        danger: { 100: "#fff1f1", 500: "#ef4444" },
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 6px 24px -12px rgba(137, 90, 255, 0.20)",   // purple soft
        card: "0 8px 30px -12px rgba(17, 12, 34, 0.12)",
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "soft-grid":
          "radial-gradient(circle at 1px 1px, rgba(168,131,255,0.18) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-sm": "16px 16px",
      },
    },
  },
  plugins: [],
}

