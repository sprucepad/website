import { defineCollection, reference } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";

const topics = defineCollection({
  loader: file("./content/topics.yml"),
  schema: z.object({
    translations: z.record(z.string(), z.string()),
  }),
});

const images = defineCollection({
  loader: glob({
    pattern: "**/*.{yml,yaml,json,toml}",
    base: "./content/images",
  }),
  schema: ({ image }) =>
    z.object({
      file: image(),
      altTexts: z.record(z.string(), z.string()),
      albums: z.array(reference("albums")).default([]),
      license: z.string().default("All Rights Reserved"),
      optimize: z.boolean().default(true),
    }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      desc: z.string(),
      image: image().optional(),
      topics: z.array(reference("topics")).default([]),
      created: z.date(),
      updated: z.date(),
      license: z.string().default("All Rights Reserved"),
    }),
});

const albums = defineCollection({
  loader: glob({
    pattern: "**/*.{yml,yaml,json,toml}",
    base: "./content/albums",
  }),
  schema: z.object({
    title: z.record(z.string(), z.string()),
    coverImages: z.array(
      z.object({
        id: reference("images"),
        conditions: z.string().optional(),
      }),
    ),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      desc: z.string(),
      image: image().optional(),
      topics: z.array(reference("topics")).default([]),
      created: z.date(),
      updated: z.date(),

      license: z.string().default("All Rights Reserved"),
      github: z.string().optional(),
      itchio: z.string().optional(),
    }),
});

export const collections = { topics, posts, projects, albums, images };
