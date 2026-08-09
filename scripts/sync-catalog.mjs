#!/usr/bin/env node
/**
 * sync-catalog — pulls the REAL Ferganza catalog from the live store into
 * data/catalog.json. The live store (AWINK platform) is the single source of
 * truth: names, prices, variants, sizes, availability, photography and the
 * public URLs themselves all come from it. Nothing is ever invented here.
 *
 * Run from any machine with normal outbound network access:
 *   npm run sync                  # crawl + merge into data/catalog.json
 *   ORIGIN=https://store.ferganza.com npm run sync   # after DNS cutover
 *
 * Strategy:
 *   1. Discover product/group URLs via sitemap.xml when available, falling
 *      back to crawling /shop/ pagination and group pages.
 *   2. Parse each product page: og: metadata, price, gallery images, variant
 *      links, availability, and the add-to-cart form action (which powers
 *      "platform" buy mode — see lib/commerce.ts).
 *   3. Merge into the existing catalog by numeric ID, preserving the verbatim
 *      public path of every entry. New products appear, delisted products are
 *      marked unavailable (kept so old links still resolve), price/stock
 *      changes flow through. meta.verified flips to true.
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CATALOG_PATH = path.join(ROOT, "data", "catalog.json");
const ORIGIN = (process.env.ORIGIN ?? "https://www.ferganza.com").replace(/\/$/, "");
const UA = "FerganzaRedesignSync/1.0 (catalog sync for ferganza.com redesign; contact: info@ferganza.com)";
const DELAY_MS = Number(process.env.CRAWL_DELAY_MS ?? 500);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  await sleep(DELAY_MS);
  const res = await fetch(url, { headers: { "user-agent": UA, accept: "text/html,application/xml" }, redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

const attr = (tag, name) => tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i"))?.[1];

function metaContent(html, key) {
  const re = new RegExp(`<meta[^>]+(?:property|name|itemprop)\\s*=\\s*["']${key}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0];
  return tag ? attr(tag, "content") : undefined;
}

function absolute(url) {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  return `${ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}

function pathOf(url) {
  try {
    const u = new URL(url, ORIGIN);
    return u.pathname.endsWith("/") ? u.pathname : `${u.pathname}/`;
  } catch {
    return null;
  }
}

/** €69,99 / EUR 69.99 / itemprop=price content=69.99 */
function parsePrice(html) {
  const meta = metaContent(html, "product:price:amount") ?? metaContent(html, "price");
  if (meta) {
    const n = Number(meta.replace(",", "."));
    if (Number.isFinite(n)) return n;
  }
  const m = html.match(/(?:€|EUR)\s*([\d.]{1,6},\d{2}|\d+(?:\.\d{2})?)/);
  if (m) {
    const n = Number(m[1].replace(/\.(?=\d{3})/g, "").replace(",", "."));
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function extractLinks(html) {
  return [...html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"'#]+)["']/gi)].map((m) => m[1]);
}

function extractImages(html) {
  const imgs = new Set();
  const og = metaContent(html, "og:image");
  if (og) imgs.add(absolute(og));
  for (const m of html.matchAll(/<img\b[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi)) {
    const src = m[1];
    // keep merchandise photography, skip chrome (logos, icons, payment badges)
    if (/logo|icon|payment|ideal|visa|mastercard|flag|sprite/i.test(src)) continue;
    if (/\.(jpe?g|png|webp|avif)(\?|$)/i.test(src)) imgs.add(absolute(src));
  }
  return [...imgs].filter(Boolean);
}

function extractCartAction(html) {
  for (const m of html.matchAll(/<form\b[^>]*>/gi)) {
    const action = attr(m[0], "action");
    if (action && /cart|basket|winkelwagen|order|add/i.test(action)) return absolute(action);
  }
  return null;
}

function extractSizes(html) {
  const sizes = new Set();
  for (const sel of html.matchAll(/<select\b[^>]*>([\s\S]*?)<\/select>/gi)) {
    if (!/maat|size/i.test(sel[0])) continue;
    for (const opt of sel[1].matchAll(/<option\b[^>]*>([^<]+)<\/option>/gi)) {
      const t = opt[1].trim();
      if (t && !/kies|choose|select/i.test(t)) sizes.add(t);
    }
  }
  return sizes.size ? [...sizes] : null;
}

const PRODUCT_RE = /\/ferganza-womens-fashion\/product\/[^"'\s]+/g;
const GROUP_RE = /\/ferganza-womens-fashion\/groups\/[^"'\s]+/g;
const NUM = /^\d+$/;

function parseProductPath(p) {
  const segs = p.split("/").filter(Boolean);
  const i = segs.indexOf("product");
  if (i === -1) return null;
  const rest = segs.slice(i + 1);
  const nums = rest.filter((s) => NUM.test(s));
  if (nums.length < 2) return null;
  const slug = rest[0];
  const variantSlug = rest[rest.indexOf(nums[0]) + 1] ?? slug;
  return { slug, productId: nums[0], variantSlug, variantId: nums[1], listingId: nums[2] ?? null };
}

async function discoverUrls() {
  const productPaths = new Set();
  const groupPaths = new Set();

  // 1) sitemap
  for (const sm of ["/sitemap.xml", "/sitemap_index.xml"]) {
    try {
      const xml = await get(`${ORIGIN}${sm}`);
      for (const loc of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
        const p = pathOf(loc[1]);
        if (!p) continue;
        if (p.includes("/product/")) productPaths.add(p);
        else if (p.includes("/groups/")) groupPaths.add(p);
      }
      if (productPaths.size) {
        console.log(`sitemap: ${productPaths.size} products, ${groupPaths.size} groups`);
        return { productPaths, groupPaths };
      }
    } catch {
      /* no sitemap — fall through to crawl */
    }
  }

  // 2) crawl /shop/ pagination
  for (let page = 1; page <= 200; page++) {
    const url = page === 1 ? `${ORIGIN}/shop/` : `${ORIGIN}/shop/page/${page}/`;
    let html;
    try {
      html = await get(url);
    } catch {
      break;
    }
    const before = productPaths.size;
    for (const m of html.matchAll(PRODUCT_RE)) productPaths.add(pathOf(m[0]));
    for (const m of html.matchAll(GROUP_RE)) groupPaths.add(pathOf(m[0]));
    console.log(`shop page ${page}: ${productPaths.size} products so far`);
    if (productPaths.size === before && page > 1) break;
  }
  return { productPaths, groupPaths };
}

async function main() {
  const catalog = JSON.parse(await readFile(CATALOG_PATH, "utf8"));
  const { productPaths, groupPaths } = await discoverUrls();

  if (productPaths.size === 0) {
    console.error("No product URLs discovered — is the origin reachable? Catalog left untouched.");
    process.exit(1);
  }

  // Group crawl: capture category names + hero image per group id
  for (const gp of groupPaths) {
    const segs = gp.split("/").filter(Boolean);
    const idSeg = [...segs].reverse().find((s) => s.split("+").every((x) => NUM.test(x)));
    if (!idSeg) continue;
    const ids = idSeg.split("+");
    let cat = catalog.categories.find((c) => c.id === ids[0]);
    const slug = segs[segs.indexOf("groups") + 1]?.split("+")[0] ?? ids[0];
    if (!cat) {
      cat = { id: ids[0], slugs: [slug], name: null, nameNl: null, parentId: ids[1] ?? null, path: gp };
      catalog.categories.push(cat);
    } else if (!cat.slugs.includes(slug)) {
      cat.slugs.push(slug);
    }
    try {
      const html = await get(`${ORIGIN}${gp}`);
      const title = metaContent(html, "og:title") ?? html.match(/<h1[^>]*>([^<]+)<\/h1>/i)?.[1];
      if (title && !cat.name) cat.name = title.split("|").pop().trim();
      const img = metaContent(html, "og:image");
      if (img) cat.image = absolute(img);
    } catch (e) {
      console.warn(`group ${gp}: ${e.message}`);
    }
  }
  catalog.pendingCategoryIds = (catalog.pendingCategoryIds ?? []).filter(
    (id) => !catalog.categories.some((c) => c.id === id && c.name),
  );

  // Product crawl
  const seenVariantIds = new Set();
  let done = 0;
  for (const pp of productPaths) {
    const parsed = parseProductPath(pp);
    if (!parsed) continue;
    let html;
    try {
      html = await get(`${ORIGIN}${pp}`);
    } catch (e) {
      console.warn(`product ${pp}: ${e.message}`);
      continue;
    }

    const name =
      (metaContent(html, "og:title") ?? "").split("|").map((s) => s.trim()).filter(Boolean)[2] ??
      html.match(/<h1[^>]*>([^<]+)<\/h1>/i)?.[1]?.trim() ??
      null;
    const description = metaContent(html, "og:description") ?? metaContent(html, "description") ?? null;
    const price = parsePrice(html);
    const images = extractImages(html);
    const cartAction = extractCartAction(html);
    const sizes = extractSizes(html);
    const soldOut = /uitverkocht|sold\s*out|niet\s*op\s*voorraad/i.test(html);
    const catIds = [...html.matchAll(GROUP_RE)]
      .map((m) => m[0].split("/").filter(Boolean).pop())
      .filter((s) => s && s.split("+").every((x) => NUM.test(x)))
      .flatMap((s) => s.split("+"));

    let product = catalog.products.find((p) => p.id === parsed.productId);
    if (!product) {
      product = {
        id: parsed.productId, slug: parsed.slug, name, description,
        price, compareAtPrice: null, priceSource: `live-sync`,
        categoryIds: [...new Set(catIds)], images: [], variants: [],
      };
      catalog.products.push(product);
    } else {
      if (name) product.name = name;
      product.description = description ?? product.description;
      if (price != null) { product.price = price; product.priceSource = "live-sync"; }
      if (catIds.length) product.categoryIds = [...new Set(catIds)];
    }

    let variant = product.variants.find((v) => v.id === parsed.variantId);
    if (!variant) {
      variant = { id: parsed.variantId, slug: parsed.variantSlug, name: name ?? parsed.variantSlug, color: null, sizes: null, images: [], available: null, path: pp };
      product.variants.push(variant);
    }
    variant.name = name ?? variant.name;
    variant.color = variant.color ?? variant.slug.match(/---(.+)$/)?.[1]?.replace(/-/g, " ") ?? null;
    variant.sizes = sizes ?? variant.sizes;
    variant.images = images.length ? images : variant.images;
    variant.available = !soldOut;
    variant.price = price ?? variant.price ?? null;
    variant.cartAction = cartAction ?? variant.cartAction ?? null;
    variant.path = pp; // verbatim public URL — the preservation contract
    seenVariantIds.add(parsed.variantId);

    if (!product.images.length && images.length) product.images = images;
    done++;
    if (done % 25 === 0) console.log(`${done}/${productPaths.size} product pages parsed`);
  }

  // Delisted variants: keep them (old links must still resolve) but mark unavailable.
  for (const p of catalog.products) {
    for (const v of p.variants) {
      if (!seenVariantIds.has(v.id)) v.available = false;
    }
  }

  catalog.meta.syncedAt = new Date().toISOString();
  catalog.meta.verified = true;
  catalog.meta.source = `live-sync:${ORIGIN}`;

  await writeFile(CATALOG_PATH, JSON.stringify(catalog, null, 2));
  console.log(`Catalog synced: ${catalog.products.length} products, ${catalog.categories.length} categories → data/catalog.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
