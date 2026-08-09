"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface WishlistItem {
  productId: string;
  variantId: string;
  name: string;
  color: string | null;
  price: number | null;
  image: string | null;
  path: string;
}

interface WishlistContextValue {
  items: WishlistItem[];
  has: (variantId: string) => boolean;
  toggle: (item: WishlistItem) => void;
  remove: (variantId: string) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "ferganza:wishlist:v1";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* corrupt storage — start fresh */
    }
  }, []);

  const persist = useCallback((next: WishlistItem[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* private mode */
    }
  }, []);

  const has = useCallback(
    (variantId: string) => items.some((i) => i.variantId === variantId),
    [items],
  );

  const toggle = useCallback(
    (item: WishlistItem) => {
      persist(
        items.some((i) => i.variantId === item.variantId)
          ? items.filter((i) => i.variantId !== item.variantId)
          : [...items, item],
      );
    },
    [items, persist],
  );

  const remove = useCallback(
    (variantId: string) => persist(items.filter((i) => i.variantId !== variantId)),
    [items, persist],
  );

  return (
    <WishlistContext.Provider value={{ items, has, toggle, remove }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
