"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product, Variant } from "@/lib/types";
import { useWishlist } from "@/lib/wishlist";
import { useI18n } from "@/lib/i18n-client";

/**
 * Purchase interface. The secure cart/checkout stays on the existing Ferganza
 * platform — the buy action either posts to the platform's own captured
 * cart endpoint or hands the customer to the variant's proven product URL on
 * the store origin (see lib/commerce.ts). No payment logic lives here.
 */
export default function BuyPanel({
  product,
  variant,
  buy,
  priceLabel,
  compareAtLabel,
}: {
  product: Product;
  variant: Variant;
  buy: { mode: "platform" | "handoff"; url: string };
  priceLabel: string | null;
  compareAtLabel: string | null;
}) {
  const { has, toggle } = useWishlist();
  const { dict } = useI18n();
  const [size, setSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const wished = has(variant.id);
  const soldOut = variant.available === false;

  const needsSize = Boolean(variant.sizes?.length);

  function guardSize(e: React.MouseEvent | React.FormEvent) {
    if (needsSize && !size) {
      e.preventDefault();
      setSizeError(true);
    }
  }

  return (
    <div>
      {/* colorways — each swatch is the variant's own preserved URL */}
      {product.variants.length > 1 && (
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-soft">
            {dict.product.colorLabel}
            {variant.color ? ` — ${variant.color}` : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {product.variants.map((v) => (
              <Link
                key={v.id}
                href={v.path}
                aria-current={v.id === variant.id ? "true" : undefined}
                className={`border px-4 py-2 text-xs transition-colors ${
                  v.id === variant.id
                    ? "border-ink bg-ink text-ivory"
                    : "border-sand hover:border-ink"
                }`}
              >
                {v.color ?? v.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* sizes (captured from the live store by sync; absent = platform chooses) */}
      {needsSize && (
        <div className="mt-8">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-soft">
              {dict.product.sizeLabel}
            </p>
            {sizeError && (
              <p className="text-xs text-red-800">{dict.product.chooseSize}</p>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {variant.sizes!.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSize(s);
                  setSizeError(false);
                }}
                aria-pressed={size === s}
                className={`min-w-12 border px-4 py-2 text-xs transition-colors ${
                  size === s ? "border-ink bg-ink text-ivory" : "border-sand hover:border-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* sticky purchase bar */}
      <div className="sticky bottom-0 z-10 -mx-4 mt-10 border-t border-sand bg-ivory/95 px-4 py-4 backdrop-blur md:static md:z-auto md:mx-0 md:border-0 md:bg-transparent md:p-0">
        <div className="flex gap-3">
          {soldOut ? (
            <span className="flex-1 border border-sand bg-bone px-8 py-4 text-center text-[0.7rem] font-bold uppercase tracking-[0.22em] text-taupe">
              {dict.common.soldOut}
            </span>
          ) : (
            <a
              href={buy.url}
              onClick={guardSize}
              className="flex-1 bg-ink px-8 py-4 text-center text-[0.7rem] font-bold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-umber"
            >
              {dict.product.addToBag}
              {priceLabel && (
                <span className="ms-3 font-normal normal-case tracking-normal">
                  {compareAtLabel && (
                    <span className="me-1.5 line-through opacity-60">{compareAtLabel}</span>
                  )}
                  {priceLabel}
                </span>
              )}
            </a>
          )}
          <button
            onClick={() =>
              toggle({
                productId: product.id,
                variantId: variant.id,
                name: variant.name || product.name,
                color: variant.color,
                price: variant.price ?? product.price,
                image: variant.images[0] ?? product.images[0] ?? null,
                path: variant.path,
              })
            }
            aria-pressed={wished}
            aria-label={wished ? dict.product.wishlistRemove : dict.product.wishlistAdd}
            className={`flex w-14 items-center justify-center border transition-colors ${
              wished ? "border-ink bg-ink text-ivory" : "border-sand hover:border-ink"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M12 21C7 16.5 3 13.3 3 9.5A4.5 4.5 0 0 1 7.5 5c1.8 0 3.4 1 4.5 2.5C13.1 6 14.7 5 16.5 5A4.5 4.5 0 0 1 21 9.5c0 3.8-4 7-9 11.5Z" />
            </svg>
          </button>
        </div>
        <p className="mt-3 text-center text-[0.7rem] text-taupe md:text-start">
          {dict.product.checkoutNote}
        </p>
      </div>
    </div>
  );
}
