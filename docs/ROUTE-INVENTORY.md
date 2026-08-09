# Ferganza — URL Preservation Audit & Route Inventory

**Audited:** 2026-08-09 · **Source of truth:** the live store at `https://www.ferganza.com` (AWINK Websolutions platform)
**Objective:** effectively **zero** unintended broken customer-facing links after the redesign.

## How this audit was produced — and its limits

This build environment's network egress policy blocks direct requests to
`ferganza.com` (and to archive services), so the site could not be crawled from
here. The inventory below was assembled from **search-engine-indexed URLs of
the live store** — every route listed is a real, public Ferganza URL. It is a
verified *sample plus the complete URL grammar*, not an exhaustive list.

Completeness is delivered mechanically instead:

1. **`npm run sync`** (from any machine with normal network access) crawls the
   live store — sitemap first, `/shop/` pagination as fallback — and pulls
   *every* product, variant, price, size, availability flag, image URL and
   category into `data/catalog.json`. Nothing is hand-maintained.
2. **`npm run sync:verify`** requests every recorded URL against a target
   origin and fails on anything that is not a plain `200`.
   Run it against the live store (contract is current) and against this app
   (contract is honoured) before cutover.

## The URL grammar (preserved verbatim)

| Pattern | Page type | Redesign target | Status |
|---|---|---|---|
| `/` | Homepage | New editorial homepage | **PRESERVE EXACTLY** |
| `/shop/` | All products | New shop index template | **PRESERVE EXACTLY** |
| `/shop/page/{n}/` | Paginated products (≥19 pages live) | Same pagination URL shape | **PRESERVE EXACTLY** |
| `/ferganza-womens-fashion/product/{slug}/{productId}/{variantSlug}/{variantId}/{listingId}/{catIds}/` | Product detail | New premium product template | **PRESERVE EXACTLY** |
| `/ferganza-womens-fashion/groups/{slugs}/{id[+id…]}/[page/{n}/]` | Category / collection | New editorial collection template | **PRESERVE EXACTLY** |
| `/about/` | About | New editorial page | **PRESERVE EXACTLY** |
| `/news/` | News | New journal template | **PRESERVE EXACTLY** |
| `/contact/` | Contact | New contact page | **PRESERVE EXACTLY** |
| `/information/` | Service index | New service hub | **PRESERVE EXACTLY** |
| `/information/faq/` | FAQ | New FAQ template | **PRESERVE EXACTLY** |
| `/information/verzending/` | Shipping | New shipping page | **PRESERVE EXACTLY** |
| `/information/returns/` | Returns | New returns page | **PRESERVE EXACTLY** |

**Resolution is by numeric ID, never by slug** — exactly like the platform.
The live store serves category `43501` under `eid`, `abaya`, `abayas`,
`eid-collectie`, `eid+collectie` and more; product URLs circulate with short
(`…/4050/337/`) and long (`…/4050/30198,337,…,696/`) category tails. All
permutations resolve here with **HTTP 200 in place — no redirects, no
duplicate URLs, no slug changes** (verified against a production build of this
app for every recorded route plus wild permutations).

## Verified category/collection routes (live URLs, indexed)

| Current URL | Page type | Name | Status |
|---|---|---|---|
| `/ferganza-womens-fashion/groups/clothing/337/` | Category | Clothing / Kleding | PRESERVE EXACTLY |
| `/ferganza-womens-fashion/groups/dresses-skirts+clothing/385+337/` | Category | Jurken | PRESERVE EXACTLY |
| `/ferganza-womens-fashion/groups/sets+clothing/848+337/` | Category | Sets | PRESERVE EXACTLY |
| `/ferganza-womens-fashion/groups/tunieken+clothing/370+337/` | Category | Tunieken | PRESERVE EXACTLY |
| `/ferganza-womens-fashion/groups/jassen-blazers+clothing/379+337/` | Category | Jassen & Blazers | PRESERVE EXACTLY |
| `/ferganza-womens-fashion/groups/blazers+clothing/56020+337/` | Category | Blazers | PRESERVE EXACTLY |
| `/ferganza-womens-fashion/groups/vesten-kimono+clothing/396+337/` | Category | Vesten & Kimono's | PRESERVE EXACTLY |
| `/ferganza-womens-fashion/groups/burkini+clothing/25650+337/` | Category | Burkini | PRESERVE EXACTLY |
| `/ferganza-womens-fashion/groups/eid+collection/43501+337/` | Collection | EID Collectie | PRESERVE EXACTLY |
| `/ferganza-womens-fashion/groups/accessories/400/` | Category | Accessoires | PRESERVE EXACTLY |
| `/ferganza-womens-fashion/groups/tassen+accessories/401+400/` | Category | Tassen | PRESERVE EXACTLY |
| `/ferganza-womens-fashion/groups/shoes/696/` | Category | Schoenen | PRESERVE EXACTLY |

Category IDs observed in live listing URLs but not yet name-mapped (sync
resolves them): `30198, 50107, 4236, 361, 5172, 338, 955, 421, 415, 411` —
these cover Tops, Blouses, Broeken, Truien, Haaraccessoires, Sieraden, Riemen,
Shawls & Beanies and Sale.

## Verified product routes (33 live variant URLs, indexed)

Every variant URL in `data/catalog.json` is recorded verbatim from the live
store's index — see the `path` field per variant; all are served at HTTP 200 by
this app. Sample:

| Current URL | Page type | Product | Status |
|---|---|---|---|
| `/ferganza-womens-fashion/product/jurk-peach/61404/jurk-peach/61405/5547/337/` | Product | Jurk Peach | PRESERVE EXACTLY |
| `/ferganza-womens-fashion/product/jurk-eloise/53873/jurk-eloise/53874/4714/` | Product | Jurk Eloise | PRESERVE EXACTLY |
| `/ferganza-womens-fashion/product/set-rihanna/33506/set-rihanna---zwart/33514/3514/` | Product | Set Rihanna — Zwart | PRESERVE EXACTLY |
| `/ferganza-womens-fashion/product/abaya-zaina/52525/abaya-zaina---bruin/52526/4682/` | Product | Abaya Zaina — Bruin | PRESERVE EXACTLY |
| `/ferganza-womens-fashion/product/tas-grace/56853/tas-grace---taupe/56855/4969/401/` | Product | Tas Grace — Taupe | PRESERVE EXACTLY |
| `/ferganza-womens-fashion/product/boots-nela/41311/boots-nela---zwart/41312/3719/` | Product | Boots Nela — Zwart | PRESERVE EXACTLY |
| *(+27 more — `data/catalog.json`)* | | | PRESERVE EXACTLY |

Products known to exist but whose URLs were not indexed where we could see
them (Set Alaïa, Set Amber, Boots Haley, Heels Cassie/Coco/Giulia/Jaimy,
Bag Brandy/Lime/Polly, Tas Dina/Jenna, Blazer Coco, Jas Dakota, Babouche, …)
are captured automatically by `npm run sync`.

## New routes (additive only — nothing replaced)

| URL | Purpose |
|---|---|
| `/search/` | New search interface (`noindex`) |
| `/wishlist/` | New wishlist (`noindex`, local to the visitor) |

## Deliberately not rebuilt

- **Cart / checkout / payments / customer accounts** stay on the existing
  platform (see *Checkout safety* in the README). No payment logic exists in
  this codebase.

## Pre-launch checklist (network required)

1. `npm run sync` — pull the full live catalog (products, prices, sizes,
   availability, photography, cart endpoints).
2. `TARGET=https://www.ferganza.com npm run sync:verify` — confirm the URL
   contract is still current.
3. Build, then `TARGET=http://localhost:3000 npm run sync:verify` — confirm
   every recorded URL resolves 200 in the redesign.
4. Carry over the verbatim FAQ / shipping / returns copy from the live
   information pages (the redesigned pages currently state only
   independently-verified facts and link to `info@ferganza.com`; they invent
   no policy terms).
5. Point the buy-flow at the platform origin (`NEXT_PUBLIC_LEGACY_ORIGIN`)
   once DNS cutover is planned.
