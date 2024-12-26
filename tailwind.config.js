import tailwindcssAnimated from "tailwindcss-animated";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindScrollbar from "tailwind-scrollbar";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        striped:
          "repeating-linear-gradient(45deg, #3B3A3D, #3B3A3D 5px, transparent 5px, transparent 20px)",
      },
      colors: {
        c1: "#4c8aff",
        c2: "#52F988",
      },
      boxShadow: {
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
      },
      keyframes: {
        shine: {
          "0%": { transform: "translateX(-150%)" },
          "100%": { transform: "translateX(150%)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideOutRight: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideOutLeft: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(-100%)", opacity: "0" },
        },
        "blink-red": {
          "0%, 100%": {
            backgroundColor: "rgba(239, 68, 68, 0.7)",
            boxShadow: "0 0 30px 10px rgba(239, 68, 68, 0.5)",
          },
          "50%": {
            backgroundColor: "rgba(239, 68, 68, 0.5)",
            boxShadow: "0 0 30px 10px rgba(239, 68, 68, 1)",
          },
        },
        "jump-in": {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        shine: "shine 1.5s infinite linear",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
        "slide-out-right": "slideOutRight 0.5s ease-in forwards",
        "slide-in-left": "slideInLeft 0.5s ease-out forwards",
        "slide-out-left": "slideOutLeft 0.5s ease-in forwards",
        "blink-red": "blink-red 2s infinite linear",
        "jump-in": "jump-in 0.8s ease-out forwards",
      },
    },
  },
  plugins: [
    tailwindcssAnimated,
    tailwindcssAnimate,
    tailwindScrollbar,
  ],
};
