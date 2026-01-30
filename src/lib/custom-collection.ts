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
  collection: C,
  opts?: {
    locale?: string;
    imageKey?: K | (Omit<UnresolvedImageTransform, "src"> & { key?: K });
  },
) {
  const { locale, imageKey } = opts ?? {};
  const entries = await getAstroCollection(collection);

  return Promise.all(
    entries
      .filter((entry) => (locale ? entry.id.split("/")[0] === locale : true))
      .map(async (entry) => {
        const data = entry.data as unknown as Record<K, ImageMetadata>;
        const resolvedKey =
          typeof imageKey === "object" ? imageKey.key : undefined;

        return {
          ...entry,
          id: locale ? entry.id.split("/").slice(1).join("/") : entry.id,
          image:
            imageKey && resolvedKey && data[resolvedKey]
              ? await getImage({
                  ...(typeof imageKey === "object" ? imageKey : {}),
                  src: data[resolvedKey],
                })
              : undefined,
        };
      }),
  ) as unknown as CollectionEntry<C, K>[];
}
