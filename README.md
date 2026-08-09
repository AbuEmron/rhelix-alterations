# FERGANZA — redesigned storefront

An entirely new digital experience for **Ferganza Womens Fashion**
(Amsterdam), built as a new shell around the **existing** merchandise
ecosystem: same products, same public URLs, same photography, same prices,
same secure checkout. Only the website around them changes.

Design & build: **The Quiet Few Collective**. Brand: **FERGANZA**.

## What this is

- **Next.js 15 (App Router)** storefront, server-rendered, trailing-slash URLs
  matching the existing AWINK platform exactly.
- **Every existing customer-facing URL keeps resolving in place** — product,
  collection, pagination and information routes are parsed by numeric ID
  (slugs are decorative, as on the current platform), so indexed links,
  bookmarks, ads and social posts hit HTTP 200 with **no redirects**.
  See [`docs/ROUTE-INVENTORY.md`](docs/ROUTE-INVENTORY.md).
- **Dynamic catalog** — nothing merchandise-related is hard-coded in
  components. Everything renders from `data/catalog.json`, which
  `npm run sync` refreshes from the live store: new items, price changes,
  sold-out states, new photography and new categories flow through without
  touching code.
- **Real photography only** — product/collection images are the store's own
  assets, referenced at their original URLs and optimized in transit
  (AVIF/WebP, responsive `srcset`, lazy-loading, priority above the fold).
  Sources are never altered. Until sync has captured image URLs, a neutral
  monogram tile renders — never stock, AI or substitute merchandise imagery.
- **Checkout safety** — no payment code exists here. "In de winkeltas" posts
  to the platform's own captured cart endpoint when available, otherwise it
  hands the customer to the variant's proven product URL on the store origin
  (`NEXT_PUBLIC_LEGACY_ORIGIN`). The secure platform cart/checkout/account
  flow is untouched.

## Languages

The storefront speaks **Dutch (default), English, Spanish and Arabic** — the
switcher lives in the header (globe menu) and in the mobile drawer. Arabic
renders fully right-to-left with the Amiri serif for display type. The choice
is stored in a cookie, so **every preserved URL is byte-identical in every
language** — no `/en/` prefixes, no duplicate routes, no redirects. UI chrome,
editorial copy and service pages are translated; merchandise data (product
names, descriptions, prices) is preserved store content and is never
machine-translated. Dictionaries live in `lib/dictionaries.ts`.

## The experience

New homepage, navigation (desktop mega-menu + mobile drawer), editorial
collection pages (hero, color filters, sorting, pagination in the legacy URL
shape), premium product pages (gallery with zoom & swipe, colorway switcher
whose swatches are the variants' own preserved URLs, size selection, sticky
purchase bar, shipping/returns disclosure, related items), search, wishlist,
journal/news, service pages, typography system (Cormorant + Manrope),
reveal-on-scroll motion (reduced-motion-safe, no-JS-safe), JSON-LD product
metadata, generated sitemap.

## Getting started

```bash
npm install
npm run dev        # develop
npm run build      # production build
npm run typecheck
```

## Connecting the real catalog (required before launch)

This repository ships with a **bootstrap catalog**: 33 real products, 12 real
categories and 9 top-level routes recorded verbatim from the live store's
search index (`data/catalog.json`, `meta.verified: false` — a small preview
ribbon renders until sync runs). The build environment used to produce this
code had no network route to ferganza.com, so the full pull must be run from
a machine that does:

```bash
npm run sync                                   # crawl live store → data/catalog.json
TARGET=https://www.ferganza.com npm run sync:verify   # URL contract still current?
npm run build && npm start
TARGET=http://localhost:3000 npm run sync:verify      # every URL resolves here?
```

Missing optional data degrades gracefully (a product without a synced price
shows "Actuele prijs in de winkeltas" and still hands off to the secure
store; unnamed categories stay out of navigation). **No data is ever
invented** — prices in the bootstrap carry `priceSource:
"search-index-2026-08-09"` and are overwritten by sync.

## Layout

```
app/                          routes (existing URL contract + /search, /wishlist)
  ferganza-womens-fashion/
    product/[...segments]/    product detail — ID-based resolution
    groups/[...segments]/     collections — ID-based, slug-tolerant, /page/n/
  shop/ · about/ · news/ · contact/ · information/…
components/                   header, footer, gallery, buy panel, grids, …
lib/                          catalog access, URL grammar, commerce handoff, wishlist
data/catalog.json             the catalog (sync-managed)
data/store.json               verified store facts (address, shipping, contact)
scripts/sync-catalog.mjs      live-store crawler/merger
scripts/verify-routes.mjs     zero-broken-links check
docs/ROUTE-INVENTORY.md       URL preservation audit
```
