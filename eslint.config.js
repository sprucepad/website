import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

import pluginAstro from "eslint-plugin-astro";
import pluginSvelte from "eslint-plugin-svelte";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,

  pluginAstro.configs["jsx-a11y-recommended"],
  pluginSvelte.configs.recommended,
]);
