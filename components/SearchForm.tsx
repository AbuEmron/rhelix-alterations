"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/lib/i18n-client";

export default function SearchForm({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const { dict } = useI18n();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(query.trim() ? `/search/?q=${encodeURIComponent(query.trim())}` : "/search/");
      }}
      className="mt-4 max-w-3xl"
    >
      <div className="flex items-center gap-4 border-b border-ink pb-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.search.placeholder}
          aria-label={dict.search.ariaInput}
          className="w-full bg-transparent font-display text-3xl italic outline-none placeholder:text-clay md:text-5xl"
          autoFocus
        />
        <button type="submit" className="eyebrow shrink-0 hover:text-ink">
          {dict.search.submit}
        </button>
      </div>
    </form>
  );
}
