#!/usr/bin/env node
/**
 * verify-routes — the zero-broken-links check.
 *
 * For every public URL recorded in the catalog (product variants, categories,
 * top-level pages), request it against a target origin and report status.
 *
 *   TARGET=http://localhost:3000 node scripts/verify-routes.mjs   # the redesign
 *   TARGET=https://www.ferganza.com node scripts/verify-routes.mjs # the live store
 *
 * Run against the live store to confirm the catalog's URL contract is current,
 * and against the redesigned app to prove every preserved URL resolves (200).
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = (process.env.TARGET ?? "http://localhost:3000").replace(/\/$/, "");

const TOP_LEVEL = [
  "/", "/shop/", "/about/", "/news/", "/contact/",
  "/information/", "/information/faq/", "/information/verzending/", "/information/returns/",
];

async function main() {
  const catalog = JSON.parse(await readFile(path.join(ROOT, "data", "catalog.json"), "utf8"));
  const paths = [
    ...TOP_LEVEL,
    ...catalog.categories.map((c) => c.path),
    ...catalog.products.flatMap((p) => p.variants.map((v) => v.path)),
  ].filter(Boolean);

  let ok = 0, redirect = 0, broken = [];
  for (const p of paths) {
    try {
      const res = await fetch(`${TARGET}${p}`, { redirect: "manual" });
      if (res.status >= 200 && res.status < 300) ok++;
      else if (res.status >= 300 && res.status < 400) { redirect++; console.warn(`REDIRECT ${res.status} ${p} → ${res.headers.get("location")}`); }
      else broken.push(`${res.status} ${p}`);
    } catch (e) {
      broken.push(`ERR ${p} (${e.message})`);
    }
  }

  console.log(`\n${TARGET}: ${ok} ok, ${redirect} redirects, ${broken.length} broken of ${paths.length} routes`);
  if (broken.length) {
    console.log(broken.join("\n"));
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
