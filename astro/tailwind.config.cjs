const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/flowbite/**/*.js",
  ],
  plugins: [require("@tailwindcss/forms"), require("flowbite/plugin")],
  theme: {
    extend: {
      colors: {
        mygray: {
          50: "#f6f7f8",
          100: "#ebecee",
          200: "#dfe1e5",
          300: "#c2c7ce",
          400: "#a5aab5",
          500: "#8f94a2",
          600: "#7d8293",
          700: "#717484",
          800: "#5f606e",
          900: "#4e505a",
          950: "#323339",
        },

        customgray: {
          200: "#e5e7eb",
          600: "#6b7280",
          800: "#1f2a37",
          900: "#111928",
        },

        primary: {
          600: "#1c64f2",
          700: "#1a56DB",
        },

        "red-gradient-clr": "#F98080",
        "teal-gradient-clr": "#84E1BC",
      },

      width: {
        156: "624px",
        244: "978px",
        284: "1136px",
      },

      maxWidth: {
        156: "624px",
        244: "978px",
        284: "1136px",
      },

      borderRadius: {
        "2lg": "10px",
        "1.5xl": "14px",
      },
    },
  },
};
