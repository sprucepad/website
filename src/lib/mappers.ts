import type { Image } from "@/components/Gallery.svelte";
import type { CollectionEntry } from "./custom-collection";
import type { Card, Topic } from "@/components/Cards.svelte";

export function album(
  locale: string,
): (a: CollectionEntry<"gallery">) => Image[] {
  return (a) =>
    a.data.images.map((i) => ({
      album: a.data.title[locale],
      albumId: a.id,
      src: i.img.src,
      alt: i.alt[locale],
      license: i.license,
    }));
}

export function card(): (
  a: CollectionEntry<"artPosts" | "codePosts" | "projects">,
) => Card {
  return (c) => ({
    id: c.id,
    title: c.data.title,
    desc: c.data.desc,
    topics: c.data.topics.map((t) => t.id),
    image: c.image
      ? {
          src: c.image.src,
          width: c.image.options.width!,
          height: c.image.options.height!,
        }
      : null,
  });
}

export function topic(locale: string): (t: CollectionEntry<"topics">) => Topic {
  return (t) => ({
    id: t.id,
    name: t.data.translations[locale],
  });
}
