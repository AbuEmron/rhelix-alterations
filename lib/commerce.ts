import storeData from "@/data/store.json";
import type { Product, Variant } from "./types";

/**
 * Checkout safety: the secure cart/checkout/payment flow stays on the existing
 * Ferganza platform (AWINK). This storefront never re-implements payments.
 *
 * Modes:
 *  - "platform": the buy action posts to the per-variant `cartAction` endpoint
 *    captured from the live store by `npm run sync`. Used automatically when a
 *    variant carries one.
 *  - "handoff": the buy action sends the customer to the variant's own public
 *    product URL on the existing store origin (LEGACY_ORIGIN), where the
 *    proven add-to-cart → checkout flow completes. This is the safe default
 *    until sync has captured cart endpoints.
 *
 * LEGACY_ORIGIN is where the current platform storefront remains reachable
 * once www.ferganza.com points at this app (e.g. https://store.ferganza.com).
 * Until then it defaults to the current live origin.
 */
export const LEGACY_ORIGIN =
  process.env.NEXT_PUBLIC_LEGACY_ORIGIN ?? storeData.origin;

export function buyTarget(product: Product, variant?: Variant): {
  mode: "platform" | "handoff";
  url: string;
} {
  const v = variant ?? product.variants[0];
  if (v?.cartAction) {
    return { mode: "platform", url: v.cartAction };
  }
  return { mode: "handoff", url: `${LEGACY_ORIGIN}${v?.path ?? "/shop/"}` };
}

export const store = storeData;
