import Link from "next/link";
import { getCategories, getProducts } from "@/lib/catalog";
import { shopPagePath } from "@/lib/urls";
import { categoryLabel, getI18n } from "@/lib/i18n-server";
import ProductGrid from "./ProductGrid";
import Reveal from "./Reveal";

const PAGE_SIZE = 24;

/**
 * The /shop/ index — the platform's paginated all-products listing, kept at
 * the same /shop/ and /shop/page/{n}/ URLs it has always had.
 */
export default async function ShopIndex({ page }: { page: number }) {
  const { locale, dict } = await getI18n();
  const products = getProducts();
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);
  const pageItems = products.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const featured = getCategories().filter((c) => ["337", "43501", "400", "696"].includes(c.id));

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 md:px-8 md:pt-36">
      <Reveal>
        <p className="eyebrow">{dict.shop.eyebrow}</p>
      </Reveal>
      <Reveal delay={100}>
        <h1 className="headline mt-4 text-5xl md:text-7xl">{dict.shop.title}</h1>
      </Reveal>
      <Reveal delay={200}>
        <div className="mt-8 flex flex-wrap gap-2.5">
          {featured.map((c) => (
            <Link
              key={c.id}
              href={c.path}
              className="border border-sand px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors hover:border-ink hover:bg-ink hover:text-ivory"
            >
              {categoryLabel(dict, locale, c)}
            </Link>
          ))}
        </div>
      </Reveal>

      <div className="mt-12 md:mt-16">
        <ProductGrid products={pageItems} priorityCount={4} />
      </div>

      {totalPages > 1 && (
        <nav aria-label={dict.common.pagination} className="mt-16 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={shopPagePath(n)}
              aria-current={n === current ? "page" : undefined}
              className={`flex h-10 w-10 items-center justify-center border text-sm transition-colors ${
                n === current ? "border-ink bg-ink text-ivory" : "border-sand hover:border-ink"
              }`}
            >
              {n}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
