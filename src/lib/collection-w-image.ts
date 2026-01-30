import type {
  UnresolvedImageTransform,
  ImageMetadata,
  GetImageResult,
} from "astro";
import { getImage } from "astro:assets";
import {
  getCollection,
  type CollectionEntry,
  type DataEntryMap,
} from "astro:content";

export type Image<
  C extends keyof DataEntryMap,
  K extends keyof DataEntryMap[C][string]["data"],
> = undefined extends K ? GetImageResult | undefined : GetImageResult;

export type CollectionEntryWithImage<
  C extends keyof DataEntryMap,
  K extends keyof DataEntryMap[C][string]["data"] =
    keyof DataEntryMap[C][string]["data"],
> = CollectionEntry<C> & { image: Image<C, K> };

export async function getCollectionWithImage<
  C extends keyof DataEntryMap,
  K extends keyof DataEntryMap[C][string]["data"],
>(collection: C, imageKey: K, opts?: Omit<UnresolvedImageTransform, "src">) {
  const entries = await getCollection(collection);

  return Promise.all(
    entries.map(async (entry) => {
      const data = entry.data as unknown as Record<K, ImageMetadata>;
      if (!data[imageKey]) return entry;

      return {
        ...entry,
        image: await getImage({
          ...opts,
          src: data[imageKey],
        }),
      };
    }),
  ) as unknown as CollectionEntryWithImage<C, K>[];
}
