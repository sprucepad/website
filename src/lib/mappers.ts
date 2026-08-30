import type { Album } from "@/components/Gallery.svelte";
import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import type { Card } from "@/components/Cards.svelte";
import { getImage } from "astro:assets";

export interface ProcessedImage {
  src: string;
  width?: number;
  height?: number;
}

export interface ProcessedWithAlt {
  file: ProcessedImage;
  alt: string;
}

export function createImageMapper(
  locale: string,
): (a: CollectionEntry<"images">) => Promise<ProcessedWithAlt> {
  return async (a) => ({
    file: a.data.optimize ? await processImage(a.data.file) : a.data.file,
    alt: a.data.altTexts[locale],
  });
}

export function createAlbumMapper(
  locale: string,
  maxImages = Infinity,
): (a: CollectionEntry<"albums">) => Promise<Album> {
  return async (a) => {
    const images = await getCollection("images", (image) =>
      image.data.albums.some((album) => album.id === a.id),
    );

    return {
      title: a.data.title[locale],
      covers: (
        await Promise.all(
          a.data.coverImages.map(
            async ({ id: ref }): Promise<ProcessedWithAlt> => {
              const coverImage = await getEntry(ref.collection, ref.id)!;
              return {
                file: coverImage.data.optimize
                  ? await processImage(coverImage.data.file)
                  : coverImage.data.file,
                alt: coverImage.data.altTexts[locale],
              };
            },
          ),
        )
      ).slice(0, maxImages),
      images: (
        await Promise.all(
          images.map(async (image) => ({
            file: image.data.optimize
              ? await processImage(image.data.file)
              : image.data.file,
            alt: image.data.altTexts[locale],
          })),
        )
      ).slice(0, maxImages),
    };
  };
}

export function createCardMapper(
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
