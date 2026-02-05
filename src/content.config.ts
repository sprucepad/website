import { file, glob } from "astro/loaders";
import { defineCollection, reference, z } from "astro:content";

const art = defineCollection({
  loader: glob({ pattern: "**/*.{yml,yaml,json,toml}", base: "./content/art" }),
  schema: ({ image }) =>
    z.object({
      title: z.record(z.string()),
      images: z.array(
        z.object({
          img: image(),
          alt: z.string(),
          license: z.string().default("All Rights Reserved"),
        }),
      ),
    }),
});

const topics = defineCollection({
  loader: file("./content/topics.yml"),
  schema: z.record(z.string()),
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

export const collections = { art, topics, posts, projects };
