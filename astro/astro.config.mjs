import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
//import { SentryInit } from './src/utils/Sentry';
import { loadEnv } from "vite";
import astroI18next from "astro-i18next";

import vue from "@astrojs/vue";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import node from "@astrojs/node";

// https://astro.build/config

const {
  PUBLIC_PORT
} = loadEnv(import.meta.env.PUBLIC_PORT, process.cwd(), "");

//SentryInit();

// https://astro.build/config
export default defineConfig({
  integrations: [astroI18next(), vue(), tailwind(), mdx()],
  site: 'https://gone.bike',
  output: "server",
  adapter: node({
    mode: "middleware"
  }),
  server: {
    port: parseInt(PUBLIC_PORT) || 3000
  }
});