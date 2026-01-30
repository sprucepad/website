// @ts-check
import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://sprucepad.net/",
  adapter: vercel(),
  integrations: [sitemap(), mdx(), svelte()],

  i18n: {
    defaultLocale: "pt-BR",
    locales: ["en-US", "pt-BR"],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  vite: {
    // @ts-expect-error this is a bug in tailwind's vite plugin
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
        "@content": "/content",
      },
    },
  },
});
