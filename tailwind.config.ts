import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#2d6a4f", // Forest Green
          light: "#40916c",
          dark: "#1b4332",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#f59e0b", // Amber / Campfire Orange
          light: "#fbbf24",
          dark: "#d97706",
          foreground: "#1a1a2e",
        },
        earth: {
          900: "#1a1a2e", // Deep Earth (Background)
          800: "#16213e",
          700: "#1f3a2e",
          600: "#2d6a4f",
          500: "#40916c",
          400: "#52b788",
          300: "#74c69d",
          200: "#b7e4c7",
          100: "#d8f3dc",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
