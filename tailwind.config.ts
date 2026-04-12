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
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#f59e0b", // Campfire Orange
          foreground: "#ffffff",
        },
        earth: {
          dark: "#1a1a2e",
          slate: "#16213e",
        }
      },
    },
  },
  plugins: [],
};
export default config;
