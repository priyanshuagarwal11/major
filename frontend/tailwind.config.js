/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030712",
        surface: "#101726",
        "surface-alt": "#162035",
        primary: {
          DEFAULT: "#38bdf8",
          dark: "#0284c7"
        },
        secondary: {
          DEFAULT: "#a855f7",
          dark: "#8b5cf6"
        },
        accent: {
          DEFAULT: "#10b981",
          light: "#34d399"
        },
        border: "rgba(148, 163, 184, 0.1)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        glow: "0 0 30px rgba(56, 189, 248, 0.15)",
        "glow-purple": "0 0 30px rgba(168, 85, 247, 0.2)",
      }
    },
  },
  plugins: [],
}
