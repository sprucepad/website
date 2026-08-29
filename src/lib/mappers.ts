import type { Album } from "@/components/Gallery.svelte";
import { getEntry, type CollectionEntry } from "astro:content";
import type { Card } from "@/components/Cards.svelte";
import { getImage } from "astro:assets";

export interface ProcessedImage {
  src: string;
  width?: number;
  height?: number;
}

export interface ProcessedWithAlt {
  img: ProcessedImage;
  alt: string;
}

export function album(
  locale: string,
): (a: CollectionEntry<"gallery">) => Promise<Album> {
  return async (a) => ({
    title: a.data.title[locale],
    cover: a.data.images.findIndex((image) => image.isCover),
    images: await Promise.all(
      a.data.images.map(async (image): Promise<ProcessedWithAlt> => ({
        alt: image.alt[locale],
        img: image.img,
      })),
    ),
  });
}

export function card(
  locale: string,
): (a: CollectionEntry<"posts" | "projects">) => Promise<Card> {
  return async (c) => ({
    id: c.id,
    title: c.data.title,
    desc: c.data.desc,
    topics: await Promise.all(
      c.data.topics.map(async (t) => {
        const topic = await getEntry(t.collection, t.id)!;
        return {
          id: topic.id,
          name: topic.data.translations[locale],
        };
      }),
    ),
    image: c.data.image ? await processImage(c.data.image) : null,
  });
}

async function processImage(image: ImageMetadata): Promise<ProcessedImage> {
  const result = await getImage({ src: image });
  return {
    src: result.src,
    width: result.options.width,
    height: result.options.height,
  };
}
