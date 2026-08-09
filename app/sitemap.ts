import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog";

const BASE = "https://www.ferganza.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const catalog = getCatalog();
  const top = [
    "/", "/shop/", "/about/", "/news/", "/contact/",
    "/information/", "/information/faq/", "/information/verzending/", "/information/returns/",
  ];
  return [
    ...top.map((p) => ({ url: `${BASE}${p}` })),
    ...catalog.categories.map((c) => ({ url: `${BASE}${c.path}` })),
    ...catalog.products.flatMap((p) =>
      p.variants.map((v) => ({ url: `${BASE}${v.path}` })),
    ),
  ];
}
