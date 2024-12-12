/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", './public/index.html'],
  theme: {
    extend: {
      boxShadow: {
        neumorphism: "6px 6px 12px #c5ced9, -6px -6px 12px #ffffff",
      },
      colors: {
        primary: "#f0f3f7",
        accent: "#e0e5ec",
      },
    },
  },
  plugins: [typography],
};
