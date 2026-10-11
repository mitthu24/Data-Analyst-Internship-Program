import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0a1128",
          950: "#050814",
          900: "#0a1128",
          800: "#101a3d",
          700: "#16235a",
          600: "#1d2f7a",
        },
        emerald: {
          DEFAULT: "#10b981",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        lime: {
          DEFAULT: "#a3e635",
          400: "#bef264",
          500: "#a3e635",
        },
        electric: {
          DEFAULT: "#38bdf8",
          400: "#60d4fb",
          500: "#38bdf8",
          600: "#0ea5e9",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
