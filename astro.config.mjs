// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import vercel from "@astrojs/vercel";

import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";

import tailwindcss from "@tailwindcss/vite";

import rehypeExternalLinks from "rehype-external-links";
import { unified } from "@astrojs/markdown-remark";

// https://astro.build/config
export default defineConfig({
  site: "https://sprucepad.net/",
  adapter: vercel(),
  integrations: [sitemap(), mdx(), svelte()],

  vite: {
    plugins: [tailwindcss()],
    resolve: { tsconfigPaths: true },
  },

  fonts: [
    {
      cssVariable: "--font-dm-sans",
      provider: fontProviders.google(),
      name: "DM Sans",
    },
    {
      cssVariable: "--font-dm-mono",
      provider: fontProviders.google(),
      name: "DM Mono",
    },
    {
      cssVariable: "--font-peaberry",
      name: "Peaberry",
      provider: fontProviders.local(),
      options: {
        variants: [
          {
            src: ["./content/fonts/Peaberry.ttf"],
            weight: "variable",
            style: "normal",
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
    shikiConfig: { theme: "tokyo-night" },
    processor: unified({
      rehypePlugins: [
        [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }],
      ],
    }),
  },
});
