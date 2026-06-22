import { defineCollection, reference } from "astro:content";
import { glob, file } from "astro/loaders";
import { z } from "astro/zod";

const topics = defineCollection({
  loader: file("./content/topics.yml"),
  schema: z.object({
    translations: z.record(z.string(), z.string()),
  }),
});

const codePosts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./content/posts/code" }),
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

const artPosts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./content/posts/art" }),
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

const gallery = defineCollection({
  loader: glob({
    pattern: "**/*.{yml,yaml,json,toml}",
    base: "./content/gallery",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.record(z.string(), z.string()),
      images: z.array(
        z.object({
          img: image(),
          alt: z.record(z.string(), z.string()),
          license: z.string().default("All Rights Reserved"),
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

export const collections = { topics, codePosts, projects, artPosts, gallery };
