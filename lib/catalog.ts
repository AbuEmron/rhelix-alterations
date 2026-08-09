import catalogData from "@/data/catalog.json";
import type { Catalog, Category, Product, Variant } from "./types";

const catalog = catalogData as unknown as Catalog;

export function getCatalog(): Catalog {
  return catalog;
}

export function getCategories(): Category[] {
  return catalog.categories;
}

export function getCategoryById(id: string): Category | undefined {
  return catalog.categories.find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  const s = slug.toLowerCase();
  return catalog.categories.find((c) => c.slugs.includes(s));
}

export function getChildCategories(parentId: string): Category[] {
  return catalog.categories.filter((c) => c.parentId === parentId);
}

export function getProducts(): Product[] {
  return catalog.products;
}

export function getProductById(id: string): Product | undefined {
  return catalog.products.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  const ids = new Set([
    categoryId,
    ...catalog.categories.filter((c) => c.parentId === categoryId).map((c) => c.id),
  ]);
  return catalog.products.filter((p) => p.categoryIds.some((c) => ids.has(c)));
}

export function getVariant(product: Product, variantId?: string): Variant {
  if (variantId) {
    const v = product.variants.find((v) => v.id === variantId);
    if (v) return v;
  }
  return product.variants[0];
}

/** All distinct color variants of a product (for swatch UI). */
export function getColorways(product: Product): Variant[] {
  return product.variants;
}

export function getRelatedProducts(product: Product, limit = 8): Product[] {
  const primary = product.categoryIds[0];
  return getProductsByCategory(primary)
    .filter((p) => p.id !== product.id)
    .slice(0, limit);
}

/** EUR price in the store's Dutch locale convention (€ 69,99). */
export function formatPrice(value: number | null | undefined): string | null {
  if (value == null) return null;
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: catalog.meta.currency || "EUR",
  }).format(value);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return catalog.products.filter((p) => {
    const hay = [
      p.name,
      p.slug,
      p.description ?? "",
      ...p.variants.map((v) => `${v.name} ${v.color ?? ""}`),
      ...p.categoryIds.map((id) => getCategoryById(id)?.name ?? ""),
    ]
      .join(" ")
      .toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}
