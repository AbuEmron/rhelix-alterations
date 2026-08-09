import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/catalog";
import { productPath } from "@/lib/urls";
import SmartImage from "./SmartImage";

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const variant = product.variants[0];
  const primary = variant?.images[0] ?? product.images[0] ?? null;
  const secondary = variant?.images[1] ?? product.images[1] ?? null;
  const price = formatPrice(product.price ?? variant?.price);
  const compareAt = formatPrice(product.compareAtPrice);
  const colorCount = product.variants.filter((v) => v.color).length;
  const soldOut =
    product.variants.length > 0 && product.variants.every((v) => v.available === false);

  return (
    <Link
      href={productPath(product)}
      className="group/card block"
      aria-label={product.name}
    >
      <div className="img-frame aspect-[3/4]">
        <SmartImage src={primary} alt={product.name} priority={priority} />
        {secondary && (
          <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100">
            <SmartImage src={secondary} alt="" />
          </div>
        )}
        {compareAt && (
          <span className="absolute left-3 top-3 bg-ink px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-ivory">
            Sale
          </span>
        )}
        {soldOut && (
          <span className="absolute left-3 top-3 bg-ivory/90 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-ink">
            Uitverkocht
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-[1.05rem] leading-snug">{product.name}</h3>
        {price && (
          <p className="shrink-0 text-sm text-ink-soft">
            {compareAt && (
              <span className="mr-2 text-clay line-through">{compareAt}</span>
            )}
            {price}
          </p>
        )}
      </div>
      {colorCount > 1 && (
        <p className="mt-0.5 text-xs text-taupe">{colorCount} kleuren</p>
      )}
    </Link>
  );
}
