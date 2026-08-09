import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "./locale";
import { getDictionary, type Dict } from "./dictionaries";
import type { Category } from "./types";

/**
 * Server-side locale resolution. The choice lives in a cookie so the
 * preserved URL contract is identical in every language. Reading the cookie
 * makes routes dynamic — rendered per-request on the platform, which is what
 * a multi-language commerce storefront wants anyway.
 */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getI18n(): Promise<{ locale: Locale; dict: Dict }> {
  const locale = await getLocale();
  return { locale, dict: getDictionary(locale) };
}

/** Category label in the active language; catalog data is the fallback. */
export function categoryLabel(dict: Dict, locale: Locale, category: Category): string {
  return (
    dict.categories[category.id] ??
    (locale === "nl" ? category.nameNl || category.name : category.name || category.nameNl)
  );
}
