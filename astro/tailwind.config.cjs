const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  plugins: [require("@tailwindcss/forms")],
  theme: {
    extend: {
      colors: {
        'mygray': {
          '50': '#f6f7f8',
          '100': '#ebecee',
          '200': '#dfe1e5',
          '300': '#c2c7ce',
          '400': '#a5aab5',
          '500': '#8f94a2',
          '600': '#7d8293',
          '700': '#717484',
          '800': '#5f606e',
          '900': '#4e505a',
          '950': '#323339',
        },
      },
    },
  },
}
