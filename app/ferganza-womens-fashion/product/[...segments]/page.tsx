import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  formatPrice,
  getCategoryById,
  getProductById,
  getProducts,
  getRelatedProducts,
  getVariant,
} from "@/lib/catalog";
import { parseProductSegments } from "@/lib/urls";
import { buyTarget } from "@/lib/commerce";
import Gallery from "@/components/Gallery";
import BuyPanel from "@/components/BuyPanel";
import Accordion from "@/components/Accordion";
import ProductGrid from "@/components/ProductGrid";
import Reveal from "@/components/Reveal";
import { store } from "@/lib/commerce";

/**
 * Existing product URL contract, preserved verbatim:
 *   /ferganza-womens-fashion/product/{slug}/{productId}/{variantSlug}/{variantId}/{listingId}/{categoryIds}/
 * Resolution is by numeric ID (slugs are decorative on the platform), so every
 * historical permutation of a product link keeps resolving — no redirects.
 */

interface Props {
  params: Promise<{ segments: string[] }>;
}

function resolve(segments: string[]) {
  const parsed = parseProductSegments(segments);
  if (!parsed) return null;
  const product = getProductById(parsed.productId);
  if (!product) return null;
  const variant = getVariant(product, parsed.variantId ?? undefined);
  return { product, variant };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segments } = await params;
  const res = resolve(segments);
  if (!res) return {};
  const { product, variant } = res;
  return {
    title: `${variant.name || product.name}`,
    description:
      product.description ??
      `${product.name} — Ferganza Womens Fashion, Amsterdam.`,
    alternates: { canonical: variant.path },
    openGraph: variant.images[0] ? { images: [variant.images[0]] } : undefined,
  };
}

export function generateStaticParams() {
  return getProducts().flatMap((p) =>
    p.variants.map((v) => ({
      segments: v.path.split("/").filter(Boolean).slice(2),
    })),
  );
}

export default async function ProductPage({ params }: Props) {
  const { segments } = await params;
  const res = resolve(segments);
  if (!res) notFound();
  const { product, variant } = res;

  const images = variant.images.length ? variant.images : product.images;
  const price = variant.price ?? product.price;
  const priceLabel = formatPrice(price);
  const compareAtLabel = formatPrice(product.compareAtPrice);
  const category = product.categoryIds
    .map((id) => getCategoryById(id))
    .find((c) => c && c.id !== "337");
  const related = getRelatedProducts(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(product.description ? { description: product.description } : {}),
    ...(images.length ? { image: images } : {}),
    ...(price != null
      ? {
          offers: {
            "@type": "Offer",
            price: price.toFixed(2),
            priceCurrency: "EUR",
            availability:
              variant.available === false
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock",
            url: `https://www.ferganza.com${variant.path}`,
          },
        }
      : {}),
  };

  return (
    <article className="mx-auto max-w-7xl px-4 pb-24 pt-24 md:px-8 md:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* breadcrumb */}
      <nav aria-label="Kruimelpad" className="mb-8 text-xs text-taupe">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-ink">Home</Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/shop/" className="hover:text-ink">Shop</Link>
          </li>
          {category && (
            <>
              <li aria-hidden>/</li>
              <li>
                <Link href={category.path} className="hover:text-ink">
                  {category.nameNl}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-ink">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-10 md:grid-cols-12 md:gap-14">
        <div className="md:col-span-7">
          <Gallery images={images} alt={variant.name || product.name} />
        </div>

        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            {category && <p className="eyebrow">{category.nameNl}</p>}
            <h1 className="headline mt-3 text-4xl md:text-5xl">{product.name}</h1>
            {variant.color && (
              <p className="mt-2 text-sm text-ink-soft">{variant.color}</p>
            )}
            {priceLabel ? (
              <p className="mt-5 text-lg">
                {compareAtLabel && (
                  <span className="mr-3 text-clay line-through">{compareAtLabel}</span>
                )}
                {priceLabel}
              </p>
            ) : (
              <p className="mt-5 text-sm italic text-taupe">
                Actuele prijs in de winkeltas
              </p>
            )}

            <BuyPanel
              product={product}
              variant={variant}
              buy={buyTarget(product, variant)}
              priceLabel={priceLabel}
              compareAtLabel={compareAtLabel}
            />

            <div className="mt-10">
              <Accordion
                items={[
                  ...(product.description
                    ? [{ title: "Beschrijving", content: <p>{product.description}</p> }]
                    : []),
                  {
                    title: "Verzending",
                    content: (
                      <p>
                        Bestellingen worden verzonden met{" "}
                        {store.shipping.carriers.join(" of ")}. Levering binnen de
                        EU duurt {store.shipping.euDeliveryDays}.{" "}
                        <Link href="/information/verzending/" className="link-underline">
                          Meer over verzending
                        </Link>
                      </p>
                    ),
                  },
                  {
                    title: "Retourneren",
                    content: (
                      <p>
                        <Link href="/information/returns/" className="link-underline">
                          Bekijk het retourbeleid
                        </Link>{" "}
                        — of mail{" "}
                        <a href={`mailto:${store.contact.email}`} className="link-underline">
                          {store.contact.email}
                        </a>
                        .
                      </p>
                    ),
                  },
                  {
                    title: "De boutique",
                    content: (
                      <p>
                        Ook te passen in onze winkel: {store.contact.address.street},{" "}
                        {store.contact.address.city}.
                      </p>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24 md:mt-32">
          <Reveal>
            <h2 className="headline mb-10 text-3xl md:text-4xl">
              Combineert <em className="italic text-taupe">mooi</em> met
            </h2>
          </Reveal>
          <ProductGrid products={related.slice(0, 4)} />
        </section>
      )}
    </article>
  );
}
