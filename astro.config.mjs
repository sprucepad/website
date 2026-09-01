// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";

import { unified } from "@astrojs/markdown-remark";
import rehypeExternalLinks from "rehype-external-links";

// https://astro.build/config
export default defineConfig({
  site: "https://sprucepad.net/",
  adapter: vercel(),
  integrations: [sitemap(), mdx(), svelte()],

  i18n: {
    defaultLocale: "pt",
    locales: ["pt", "en"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: { tsconfigPaths: true },
  },

  fonts: [
    {
      name: "DM Sans",
      cssVariable: "--font-dm-sans",
      provider: fontProviders.google(),
      weights: ["400", "600", "900"],
    },
    {
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      provider: fontProviders.google(),
      weights: ["400", "600", "900"],
    },
    {
      name: "Peaberry",
      cssVariable: "--font-peaberry",
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

  markdown: {
    processor: unified({
      rehypePlugins: [
        [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }],
      ],
    }),
  },
});
