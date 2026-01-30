import en from "./en";
import pt from "./pt";

const translations = { en, pt } as const;

export type Locale = keyof typeof translations;

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

type TranslationKeys<T> = T extends object
  ? {
      [K in keyof T & (string | number)]: T[K] extends object
        ? Join<K, TranslationKeys<T[K]>>
        : K;
    }[keyof T & (string | number)]
  : never;

export type TranslationKey = TranslationKeys<(typeof translations)["pt"]>;

export default function t(key: TranslationKey, locale: string): string {
  return (
    key
      .split(".")
      // this is safe, `any` because it's the most convenient way of doing this
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- see above
      .reduce<any>((obj, k) => obj?.[k], translations[locale as Locale]) ?? key
  );
}
