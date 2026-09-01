import type { Album } from "@/components/Gallery.svelte";
import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import type { Card } from "@/components/Cards.svelte";
import { getImage } from "astro:assets";

export interface ProcessedImage {
  src: string;
  width?: number;
  height?: number;
}

export interface ProcessedWithData {
  file: ProcessedImage;
  alt: string;
  license: string;
}

/** @lintignore TODO */
export function createImageMapper(
  locale: string,
): (a: CollectionEntry<"images">) => Promise<ProcessedWithData> {
  return async (a) => ({
    file: a.data.optimize ? await processImage(a.data.file) : a.data.file,
    alt: a.data.altTexts[locale],
    license: a.data.license,
  });
}

export function createAlbumMapper(
  locale: string,
  maxImages = Infinity,
): (a: CollectionEntry<"albums">) => Promise<Album> {
  const imageMapper = createImageMapper(locale);
  return async (a) => {
    const images = await getCollection("images", (image) =>
      image.data.albums.some((album) => album.id === a.id),
    );

    return {
      id: a.id,
      title: a.data.title[locale],
      desc: a.data.desc[locale],
      covers: await Promise.all(
        sort(
          await Promise.all(
            a.data.coverImages.map(
              async (ref) => await getEntry(ref.collection, ref.id)!,
            ),
          ),
          "updatedAt",
        )
          .slice(0, maxImages)
          .map(imageMapper),
      ),
      images: (
        await Promise.all(sort(images, "updatedAt").map(imageMapper))
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

export function sort<T extends { data: { createdAt: Date; updatedAt: Date } }>(
  array: T[],
  by: "createdAt" | "updatedAt" = "createdAt",
): T[] {
  return by === "updatedAt"
    ? array.sort(
        (a, b) => b.data.updatedAt.getTime() - a.data.updatedAt.getTime(),
      )
    : array.sort(
        (a, b) => b.data.createdAt.getTime() - a.data.createdAt.getTime(),
      );
}

async function processImage(image: ImageMetadata): Promise<ProcessedImage> {
  const result = await getImage({ src: image });
  return {
    src: result.src,
    width: result.options.width,
    height: result.options.height,
  };
}
