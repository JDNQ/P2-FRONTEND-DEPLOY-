import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["var(--font-body)", "Be Vietnam Pro", "sans-serif"],
        heading: ["var(--font-heading)", "Sora", "sans-serif"],
        sora: ["Sora", "sans-serif"],
        "be-vietnam": ["Be Vietnam Pro", "sans-serif"],
      },
      colors: {
        // Brand Primary & Gradients
        primary: {
          50: "#fff4ed",
          100: "#ffe6d5",
          200: "#fecba8",
          300: "#fda86b",
          400: "#fb8c3a",
          500: "#f97316", // Core Brand Orange
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          DEFAULT: "#f97316",
        },
        "brand-orange": "#f97316",
        "brand-blue": "#1e4cfd", // Secondary Brand Color from Design System
        "flash-sale": "#ff2d2d",
        gold: "#f59e0b",

        // UI Colors (Material Design 3 based)
        surface: "#fcf8ff",
        "on-surface": "#08006c",
        "on-surface-variant": "#444656",
        "surface-container": "#eeecff",
        "surface-container-low": "#f5f2ff",
        "surface-container-high": "#e8e6ff",
        "surface-container-highest": "#e1dfff",
        "surface-container-lowest": "#ffffff",
        outline: "#747688",
        "outline-variant": "#c4c5d9",
        error: "#ba1a1a",
        success: "#22c55e",
        warning: "#f59e0b",
        info: "#1e4cfd",

        // Legacy/Compatibility Aliases
        secondary: "#4958a9",
        tertiary: "#3432c8",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "12px",
        "2xl": "16px",
      },
      spacing: {
        gutter: "1.5rem",
        "section-gap": "4rem",
        "stack-sm": "0.5rem",
        "stack-md": "1rem",
        "stack-lg": "1.5rem",
      },
      animation: {
        shimmer: "shimmer 1.5s infinite",
        "fade-in": "fadeIn 0.3s ease",
        "slide-up": "slideUp 0.3s ease",
        "countdown-flip": "flip 0.5s ease",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        flip: {
          "0%": { transform: "rotateX(0)" },
          "50%": { transform: "rotateX(-90deg)" },
          "100%": { transform: "rotateX(0)" },
        },
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
          "100%": { transform: "translateY(0px)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
