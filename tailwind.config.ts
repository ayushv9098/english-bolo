import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-orange": "#FF6B35",
        "brand-purple": "#6C63FF",
        "brand-dark": "#1A1A2E",
        surface: "#FDF6F0",
        muted: "#9B9BAE",
      },
      borderRadius: {
        card: "24px",
        btn: "16px",
        pill: "50px",
        xl: "20px",
      },
      boxShadow: {
        card: "0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
        float: "0 8px 32px rgba(0,0,0,0.10)",
      },
      fontFamily: {
        hindi: ["Noto Sans Devanagari", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
