import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          deep:    "#8B6914",
          mid:     "#C9A96E",
          light:   "#E8D5A3",
          shimmer: "#F5ECD0",
        },
        black: {
          void:  "#080808",
          deep:  "#0D0D0D",
          card:  "#131313",
          panel: "#1A1A14",
        },
        cream: {
          primary: "#F0E6CC",
          muted:   "#8A7A5A",
          subtle:  "#3A3020",
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        arabic:  ["Cairo", "IBM Plex Sans Arabic", "sans-serif"],
        body:    ["Cormorant Garamond", "serif"],
      },
      animation: {
        "spin-slow":    "spin 8s linear infinite",
        "pulse-subtle": "pulse 3s ease-in-out infinite",
        "fade-up":      "fadeUp 0.8s ease forwards",
        "fade-in":      "fadeIn 1s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      backdropBlur: {
        xs: "4px",
      },
    },
  },
  plugins: [],
};

export default config;
