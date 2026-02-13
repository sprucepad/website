// @ts-check
import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import rehypeExternalLinks from "rehype-external-links";

// https://astro.build/config
export default defineConfig({
  site: "https://sprucepad.net/",
  adapter: vercel(),
  integrations: [sitemap(), mdx(), svelte()],

  i18n: {
    defaultLocale: "pt",
    locales: ["en", "pt"],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  markdown: {
    shikiConfig: { theme: "catppuccin-mocha" },
    rehypePlugins: [
      [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }],
    ],
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
        "@content": "/content",
      },
    },
  },
});
