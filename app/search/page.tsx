import type { Metadata } from "next";
import { searchProducts } from "@/lib/catalog";
import ProductGrid from "@/components/ProductGrid";
import SearchForm from "@/components/SearchForm";

export const metadata: Metadata = {
  title: "Zoeken",
  robots: { index: false },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q ? searchProducts(q) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 md:px-8 md:pt-36">
      <p className="eyebrow">Zoeken</p>
      <SearchForm initialQuery={q} />
      {q && (
        <>
          <p className="mb-8 mt-12 text-xs uppercase tracking-[0.15em] text-taupe">
            {results.length} {results.length === 1 ? "resultaat" : "resultaten"} voor
            “{q}”
          </p>
          <ProductGrid
            products={results}
            emptyMessage={`Niets gevonden voor “${q}” — probeer bijvoorbeeld “abaya” of “jurk”.`}
          />
        </>
      )}
    </div>
  );
}
