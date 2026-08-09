import type { Product, Variant } from "./types";

/**
 * URL contract with the existing Ferganza store (AWINK platform).
 *
 * Product:  /ferganza-womens-fashion/product/{slug}/{productId}/{variantSlug}/{variantId}/{listingId}/{categoryIds}/
 * Group:    /ferganza-womens-fashion/groups/{slugs}/{id[+id...]}/[page/{n}/]
 *
 * The platform treats the slug segments as decorative — the numeric IDs are
 * canonical (the same category resolves under "eid", "abaya", "abayas", ...).
 * We honour the exact same contract: any indexed/bookmarked/shared URL keeps
 * resolving, because resolution here is by ID, never by slug text.
 */

export interface ParsedProductPath {
  productId: string;
  variantId: string | null;
}

export interface ParsedGroupPath {
  categoryIds: string[];
  page: number;
}

const NUMERIC = /^\d+$/;

/** Segments after /ferganza-womens-fashion/product/ */
export function parseProductSegments(segments: string[]): ParsedProductPath | null {
  const numeric = segments.filter((s) => NUMERIC.test(s));
  if (numeric.length === 0) return null;
  return { productId: numeric[0], variantId: numeric[1] ?? null };
}

/** Segments after /ferganza-womens-fashion/groups/ */
export function parseGroupSegments(segments: string[]): ParsedGroupPath | null {
  let page = 1;
  let segs = [...segments];
  // trailing .../page/{n}
  const pageIdx = segs.lastIndexOf("page");
  if (pageIdx !== -1 && pageIdx === segs.length - 2 && NUMERIC.test(segs[segs.length - 1])) {
    page = parseInt(segs[segs.length - 1], 10);
    segs = segs.slice(0, pageIdx);
  }
  // The ID segment joins IDs with "+", e.g. "848+337" (may arrive encoded as %2B or as a space).
  for (let i = segs.length - 1; i >= 0; i--) {
    const raw = decodeURIComponent(segs[i]).replace(/\s+/g, "+");
    const parts = raw.split("+");
    if (parts.length > 0 && parts.every((p) => NUMERIC.test(p))) {
      return { categoryIds: parts, page };
    }
  }
  return null;
}

/** Canonical (existing, public) URL for a variant — verbatim from the audit/sync. */
export function productPath(product: Product, variant?: Variant): string {
  const v = variant ?? product.variants[0];
  return v?.path ?? "/shop/";
}

export function shopPagePath(page: number): string {
  return page <= 1 ? "/shop/" : `/shop/page/${page}/`;
}

export function groupPagePath(basePath: string, page: number): string {
  const clean = basePath.endsWith("/") ? basePath : `${basePath}/`;
  return page <= 1 ? clean : `${clean}page/${page}/`;
}
