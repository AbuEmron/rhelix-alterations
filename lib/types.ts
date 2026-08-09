export interface CatalogMeta {
  source: string;
  origin: string;
  syncedAt: string | null;
  bootstrappedAt: string;
  verified: boolean;
  note: string;
  currency: string;
}

export interface Category {
  id: string;
  slugs: string[];
  name: string;
  nameNl: string;
  parentId: string | null;
  path: string;
  /** Editorial hero image captured from the live store by sync, if any. */
  image?: string | null;
  description?: string | null;
}

export interface Variant {
  id: string;
  slug: string;
  name: string;
  color: string | null;
  sizes: string[] | null;
  images: string[];
  available: boolean | null;
  /** Verbatim public path on ferganza.com — the URL contract we preserve. */
  path: string;
  price?: number | null;
  /** Add-to-cart form action on the existing platform, captured by sync. */
  cartAction?: string | null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number | null;
  compareAtPrice: number | null;
  priceSource: string | null;
  categoryIds: string[];
  images: string[];
  variants: Variant[];
}

export interface Catalog {
  meta: CatalogMeta;
  categories: Category[];
  pendingCategoryIds: string[];
  knownUnmappedCategoryNames: string[];
  products: Product[];
}
