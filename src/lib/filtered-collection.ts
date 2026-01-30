import type {
  UnresolvedImageTransform,
  ImageMetadata,
  GetImageResult,
} from "astro";
import { getImage } from "astro:assets";
import {
  getCollection as getAstroCollection,
  type CollectionEntry as AstroCollectionEntry,
  type DataEntryMap,
} from "astro:content";

type Image<
  C extends keyof DataEntryMap,
  K extends keyof DataEntryMap[C][string]["data"],
> = undefined extends K ? GetImageResult | undefined : GetImageResult;

export type CollectionEntry<
  C extends keyof DataEntryMap,
  K extends keyof DataEntryMap[C][string]["data"] =
    keyof DataEntryMap[C][string]["data"],
> = AstroCollectionEntry<C> & { image: Image<C, K> };

export async function getCollection<
  C extends keyof DataEntryMap,
  K extends keyof DataEntryMap[C][string]["data"],
>(
  locale: string,
  collection: C,
  imageKey?: K,
  opts?: Omit<UnresolvedImageTransform, "src">,
) {
  const entries = await getAstroCollection(collection);

  return Promise.all(
    entries
      .filter((entry) => entry.id.split("/")[0] === locale)
      .map(async (entry) => {
        const data = entry.data as unknown as Record<K, ImageMetadata>;

        return {
          ...entry,
          id: entry.id.split("/").slice(1).join("/"),
          image:
            imageKey && data[imageKey]
              ? await getImage({
                  ...opts,
                  src: data[imageKey],
                })
              : undefined,
        };
      }),
  ) as unknown as CollectionEntry<C, K>[];
}
