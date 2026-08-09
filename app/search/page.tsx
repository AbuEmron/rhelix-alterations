import type { Metadata } from "next";
import { searchProducts } from "@/lib/catalog";
import { getI18n } from "@/lib/i18n-server";
import { fmt } from "@/lib/locale";
import ProductGrid from "@/components/ProductGrid";
import SearchForm from "@/components/SearchForm";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const { dict } = await getI18n();
  const results = q ? searchProducts(q) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 md:px-8 md:pt-36">
      <p className="eyebrow">{dict.search.label}</p>
      <SearchForm initialQuery={q} />
      {q && (
        <>
          <p className="mb-8 mt-12 text-xs uppercase tracking-[0.15em] text-taupe">
            {results.length === 1
              ? fmt(dict.search.one, { q })
              : fmt(dict.search.many, { n: results.length, q })}
          </p>
          <ProductGrid products={results} emptyMessage={fmt(dict.search.empty, { q })} />
        </>
      )}
    </div>
  );
}
