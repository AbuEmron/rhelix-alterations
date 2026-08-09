import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCategoryById,
  getChildCategories,
  getProductsByCategory,
} from "@/lib/catalog";
import { groupPagePath, parseGroupSegments } from "@/lib/urls";
import ProductGrid from "@/components/ProductGrid";
import SmartImage from "@/components/SmartImage";
import Reveal from "@/components/Reveal";

/**
 * Existing collection/category URL contract, preserved verbatim:
 *   /ferganza-womens-fashion/groups/{slugs}/{id[+id…]}/[page/{n}/]
 * The platform serves the same group under many slug spellings ("eid",
 * "abaya", "eid-collectie", …) — resolution is by ID, so they all keep
 * working here, including indexed pagination URLs.
 */

const PAGE_SIZE = 24;

interface Props {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ sort?: string; kleur?: string }>;
}

function resolve(segments: string[]) {
  const parsed = parseGroupSegments(segments);
  if (!parsed) return null;
  const category = getCategoryById(parsed.categoryIds[0]);
  if (!category) return null;
  return { category, page: parsed.page };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segments } = await params;
  const res = resolve(segments);
  if (!res) return {};
  return {
    title: `${res.category.name} | ${res.category.nameNl}`,
    description: `${res.category.nameNl} — Ferganza Womens Fashion, Amsterdam.`,
    alternates: { canonical: res.category.path },
  };
}

export default async function GroupPage({ params, searchParams }: Props) {
  const { segments } = await params;
  const { sort, kleur } = await searchParams;
  const res = resolve(segments);
  if (!res) notFound();
  const { category, page } = res;

  const children = getChildCategories(category.id).filter((c) => c.id !== category.id);
  let products = getProductsByCategory(category.id);

  const colors = [
    ...new Set(
      products.flatMap((p) => p.variants.map((v) => v.color)).filter((c): c is string => Boolean(c)),
    ),
  ].sort();

  if (kleur) {
    products = products.filter((p) =>
      p.variants.some((v) => v.color?.toLowerCase() === kleur.toLowerCase()),
    );
  }
  if (sort === "prijs-op" || sort === "prijs-af") {
    const dir = sort === "prijs-op" ? 1 : -1;
    products = [...products].sort(
      (a, b) => ((a.price ?? Infinity) - (b.price ?? Infinity)) * dir,
    );
  } else if (sort === "naam") {
    products = [...products].sort((a, b) => a.name.localeCompare(b.name, "nl"));
  }

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);
  const pageItems = products.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const query = (over: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { sort, kleur, ...over };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `?${s}` : "";
  };

  return (
    <div className="pt-16 md:pt-20">
      {/* editorial hero */}
      <header className="relative overflow-hidden bg-bone">
        {category.image && (
          <div className="absolute inset-0">
            <SmartImage src={category.image} alt="" sizes="100vw" priority className="opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-bone via-bone/50 to-transparent" />
          </div>
        )}
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <Reveal>
            <p className="eyebrow">Collectie</p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="headline mt-4 text-5xl md:text-7xl">{category.nameNl}</h1>
          </Reveal>
          {category.description && (
            <Reveal delay={200}>
              <p className="mt-5 max-w-xl leading-relaxed text-ink-soft">
                {category.description}
              </p>
            </Reveal>
          )}
          {children.length > 0 && (
            <Reveal delay={260}>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {children.map((c) => (
                  <Link
                    key={c.id}
                    href={c.path}
                    className="border border-ink/20 bg-ivory/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] backdrop-blur transition-colors hover:border-ink hover:bg-ink hover:text-ivory"
                  >
                    {c.nameNl}
                  </Link>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </header>

      {/* toolbar: filters + sort (server-rendered links — SEO-safe, zero JS) */}
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sand py-5">
          <div className="no-scrollbar flex max-w-full gap-2 overflow-x-auto">
            <Link
              href={`${category.path}${query({ kleur: undefined })}`}
              className={`shrink-0 border px-3.5 py-1.5 text-xs transition-colors ${
                !kleur ? "border-ink bg-ink text-ivory" : "border-sand hover:border-ink"
              }`}
            >
              Alle kleuren
            </Link>
            {colors.map((c) => (
              <Link
                key={c}
                href={`${category.path}${query({ kleur: c })}`}
                className={`shrink-0 border px-3.5 py-1.5 text-xs transition-colors ${
                  kleur?.toLowerCase() === c.toLowerCase()
                    ? "border-ink bg-ink text-ivory"
                    : "border-sand hover:border-ink"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
          <nav aria-label="Sorteren" className="flex items-center gap-3 text-xs">
            <span className="text-taupe">Sorteer:</span>
            {(
              [
                ["nieuw", undefined, "Nieuw"],
                ["prijs-op", "prijs-op", "Prijs ↑"],
                ["prijs-af", "prijs-af", "Prijs ↓"],
                ["naam", "naam", "A–Z"],
              ] as const
            ).map(([key, value, label]) => (
              <Link
                key={key}
                href={`${category.path}${query({ sort: value })}`}
                className={`link-underline ${
                  (sort ?? "nieuw") === (value ?? "nieuw") ? "font-bold" : "text-ink-soft"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="py-10 md:py-14">
          <p className="mb-8 text-xs uppercase tracking-[0.15em] text-taupe">
            {products.length} {products.length === 1 ? "item" : "items"}
          </p>
          <ProductGrid products={pageItems} priorityCount={4} />
        </div>

        {/* pagination — same /page/{n}/ URL shape the platform used */}
        {totalPages > 1 && (
          <nav aria-label="Paginering" className="flex items-center justify-center gap-2 pb-16">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={`${groupPagePath(category.path, n)}${query({})}`}
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
    </div>
  );
}
