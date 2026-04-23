import type {
  ImageMetadata,
  GetImageResult,
  UnresolvedImageTransform,
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
> = undefined extends DataEntryMap[C][string]["data"][K]
  ? GetImageResult | undefined
  : GetImageResult;

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
    imageKey?: K;
    imageProps?: Omit<UnresolvedImageTransform, "src">;
  },
) {
  const { locale, imageKey, imageProps } = opts ?? {};
  const entries = await getAstroCollection(collection);

  return Promise.all(
    entries
      .filter((entry) => (locale ? entry.id.split("/")[0] === locale : true))
      .map(async (entry) => {
        const data = entry.data as unknown as Record<K, ImageMetadata>;
        return {
          ...entry,
          id: locale ? entry.id.split("/").slice(1).join("/") : entry.id,
          image:
            imageKey && data[imageKey as keyof typeof data]
              ? await getImage({
                  ...(imageProps ?? {}),
                  src: data[imageKey as keyof typeof data],
                })
              : undefined,
        };
      }),
  ) as unknown as CollectionEntry<C, K>[];
}
