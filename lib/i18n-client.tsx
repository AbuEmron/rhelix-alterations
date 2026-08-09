"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_META,
  fmt,
  type Locale,
} from "./locale";
import type { Dict } from "./dictionaries";

interface I18nValue {
  locale: Locale;
  dict: Dict;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  dict,
  children,
}: I18nValue & { children: ReactNode }) {
  return (
    <I18nContext.Provider value={{ locale, dict }}>{children}</I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export { fmt };

/**
 * Language menu. Writing the cookie and refreshing re-renders the SAME URL
 * in the chosen language — links, bookmarks and shares never change.
 */
export function LanguageSwitcher({
  variant = "menu",
}: {
  variant?: "menu" | "row";
}) {
  const { locale, dict } = useI18n();
  const router = useRouter();

  function choose(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  if (variant === "row") {
    return (
      <div role="group" aria-label={dict.nav.language} className="flex flex-wrap gap-2">
        {LOCALES.map((l) => (
          <button
            key={l}
            onClick={() => choose(l)}
            aria-pressed={l === locale}
            className={`border px-3.5 py-2 text-xs transition-colors ${
              l === locale ? "border-ink bg-ink text-ivory" : "border-sand hover:border-ink"
            }`}
          >
            {LOCALE_META[l].native}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="group relative">
      <button
        aria-label={dict.nav.language}
        aria-haspopup="menu"
        className="flex h-10 items-center gap-1.5 px-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-opacity hover:opacity-60"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21m0-18C9.5 5.6 8.2 8.7 8.2 12s1.3 6.4 3.8 9" />
        </svg>
        {LOCALE_META[locale].short}
      </button>
      <div className="invisible absolute end-0 top-full pt-3 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <ul role="menu" className="min-w-40 border border-sand bg-ivory py-2 shadow-xl shadow-ink/5">
          {LOCALES.map((l) => (
            <li key={l} role="none">
              <button
                role="menuitemradio"
                aria-checked={l === locale}
                onClick={() => choose(l)}
                className={`block w-full px-5 py-2 text-start text-sm transition-colors hover:bg-bone ${
                  l === locale ? "font-bold" : "text-ink-soft"
                }`}
              >
                {LOCALE_META[l].native}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
