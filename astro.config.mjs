// @ts-check
import { defineConfig, fontProviders } from "astro/config";

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

  fonts: [
    {
      name: "DM Sans",
      cssVariable: "--font-dm-sans",
      provider: fontProviders.google(),
    },
    {
      name: "DM Mono",
      cssVariable: "--font-dm-mono",
      provider: fontProviders.google(),
    },
    {
      name: "Peaberry",
      cssVariable: "--font-peaberry",
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            src: ["./content/fonts/Peaberry.ttf"],
          },
        ],
      },
    },
  ],

  i18n: {
    defaultLocale: "pt",
    locales: ["en", "pt"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
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
