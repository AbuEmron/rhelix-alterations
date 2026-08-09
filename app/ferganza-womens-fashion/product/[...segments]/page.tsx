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
import { buyTarget, store } from "@/lib/commerce";
import { categoryLabel, getI18n } from "@/lib/i18n-server";
import { fmt } from "@/lib/locale";
import Gallery from "@/components/Gallery";
import BuyPanel from "@/components/BuyPanel";
import Accordion from "@/components/Accordion";
import ProductGrid from "@/components/ProductGrid";
import Reveal from "@/components/Reveal";

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
  const { locale, dict } = await getI18n();

  const images = variant.images.length ? variant.images : product.images;
  const price = variant.price ?? product.price;
  const priceLabel = formatPrice(price);
  const compareAtLabel = formatPrice(product.compareAtPrice);
  const category = product.categoryIds
    .map((id) => getCategoryById(id))
    .find((c) => c && c.id !== "337");
  const related = getRelatedProducts(product);

  const shippingVars = {
    carriers: store.shipping.carriers.join(" / "),
    days: store.shipping.euDeliveryDays,
  };
  const addressVars = {
    street: store.contact.address.street,
    city: store.contact.address.city,
  };

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
      <nav aria-label={dict.common.breadcrumb} className="mb-8 text-xs text-taupe">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-ink">{dict.common.home}</Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/shop/" className="hover:text-ink">{dict.nav.shop}</Link>
          </li>
          {category && (
            <>
              <li aria-hidden>/</li>
              <li>
                <Link href={category.path} className="hover:text-ink">
                  {categoryLabel(dict, locale, category)}
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
            {category && (
              <p className="eyebrow">{categoryLabel(dict, locale, category)}</p>
            )}
            <h1 className="headline mt-3 text-4xl md:text-5xl">{product.name}</h1>
            {variant.color && (
              <p className="mt-2 text-sm text-ink-soft">{variant.color}</p>
            )}
            {priceLabel ? (
              <p className="mt-5 text-lg">
                {compareAtLabel && (
                  <span className="me-3 text-clay line-through">{compareAtLabel}</span>
                )}
                {priceLabel}
              </p>
            ) : (
              <p className="mt-5 text-sm italic text-taupe">
                {dict.product.priceOnCheckout}
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
                    ? [{ title: dict.product.accDescription, content: <p>{product.description}</p> }]
                    : []),
                  {
                    title: dict.product.accShipping,
                    content: (
                      <p>
                        {fmt(dict.product.accShippingBody, shippingVars)}{" "}
                        <Link href="/information/verzending/" className="link-underline">
                          {dict.product.accShippingLink}
                        </Link>
                      </p>
                    ),
                  },
                  {
                    title: dict.product.accReturns,
                    content: (
                      <p>
                        <Link href="/information/returns/" className="link-underline">
                          {dict.product.accReturnsLink}
                        </Link>{" "}
                        {dict.product.accReturnsOr}{" "}
                        <a href={`mailto:${store.contact.email}`} className="link-underline">
                          {store.contact.email}
                        </a>
                        .
                      </p>
                    ),
                  },
                  {
                    title: dict.product.accBoutique,
                    content: <p>{fmt(dict.product.accBoutiqueBody, addressVars)}</p>,
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
              {dict.product.relatedPre}
              <em className="italic text-taupe">{dict.product.relatedEm}</em>
              {dict.product.relatedPost}
            </h2>
          </Reveal>
          <ProductGrid products={related.slice(0, 4)} />
        </section>
      )}
    </article>
  );
}
