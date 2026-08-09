/**
 * Locale plumbing shared by server and client code.
 *
 * The language choice lives in a cookie, never in the URL — the preserved
 * Ferganza URL contract stays byte-identical in every language. Product
 * data (names, descriptions, prices) is merchandise content and is never
 * machine-translated; only UI chrome and editorial copy switch language.
 */

export const LOCALES = ["nl", "en", "es", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "nl";
export const LOCALE_COOKIE = "ferganza_locale";

export const LOCALE_META: Record<Locale, { native: string; short: string; dir: "ltr" | "rtl" }> = {
  nl: { native: "Nederlands", short: "NL", dir: "ltr" },
  en: { native: "English", short: "EN", dir: "ltr" },
  es: { native: "Español", short: "ES", dir: "ltr" },
  ar: { native: "العربية", short: "ع", dir: "rtl" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Tiny interpolation: fmt("EU {days}", { days: "3–6" }) */
export function fmt(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}
