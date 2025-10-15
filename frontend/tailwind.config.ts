import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Modern color palette
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        secondary: {
          50: "#fdf4ff",
          100: "#fae8ff",
          200: "#f5d0fe",
          300: "#f0abfc",
          400: "#e879f9",
          500: "#d946ef",
          600: "#c026d3",
          700: "#a21caf",
          800: "#86198f",
          900: "#701a75",
        },
        accent: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
        // Enhanced emotion palette with gradients
        emotion: {
          happy: {
            light: "#fbbf24",
            DEFAULT: "#f59e0b",
            dark: "#d97706",
          },
          sad: {
            light: "#60a5fa",
            DEFAULT: "#3b82f6",
            dark: "#2563eb",
          },
          angry: {
            light: "#f87171",
            DEFAULT: "#ef4444",
            dark: "#dc2626",
          },
          fear: {
            light: "#a78bfa",
            DEFAULT: "#8b5cf6",
            dark: "#7c3aed",
          },
          disgust: {
            light: "#4ade80",
            DEFAULT: "#22c55e",
            dark: "#16a34a",
          },
          surprise: {
            light: "#2dd4bf",
            DEFAULT: "#14b8a6",
            dark: "#0d9488",
          },
          neutral: {
            light: "#9ca3af",
            DEFAULT: "#6b7280",
            dark: "#4b5563",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "emotion-gradient":
          "linear-gradient(135deg, var(--emotion-start), var(--emotion-end))",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        glow: "0 0 20px rgba(59, 130, 246, 0.15)",
        "emotion-glow": "0 0 30px var(--emotion-glow-color)",
        "inner-soft": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "bounce-gentle": "bounceGentle 1s ease-in-out infinite",
        "emotion-pulse": "emotionPulse 0.6s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        emotionPulse: {
          "0%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 var(--emotion-glow-color)",
          },
          "50%": {
            transform: "scale(1.05)",
            boxShadow: "0 0 20px var(--emotion-glow-color)",
          },
          "100%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 var(--emotion-glow-color)",
          },
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
