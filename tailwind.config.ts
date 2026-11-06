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
        noir: "#050505",
        carbon: "#0B0B0B",
        humo: "#141414",
        selva: "#0B2A6B",
        selvaProfunda: "#061633",
        oro: "#D4AF37",
        oroClaro: "#F0D67E",
        oroSombra: "#8A6D1F",
        hueso: "#E9E4D6",
      },
      fontFamily: {
        display: ['"Bebas Neue"', "sans-serif"],
        head: ["Oswald", "sans-serif"],
        body: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

