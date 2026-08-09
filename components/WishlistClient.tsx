"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/lib/wishlist";

export default function WishlistClient() {
  const { items, remove } = useWishlist();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 md:px-8 md:pt-36">
      <p className="eyebrow">Bewaard</p>
      <h1 className="headline mt-4 text-5xl md:text-7xl">Wishlist</h1>

      {items.length === 0 ? (
        <div className="mt-14 border border-sand px-6 py-24 text-center">
          <p className="font-display text-2xl italic text-taupe">
            Nog niets bewaard.
          </p>
          <Link
            href="/shop/"
            className="mt-8 inline-block bg-ink px-9 py-4 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-umber"
          >
            Ontdek de collectie
          </Link>
        </div>
      ) : (
        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item.variantId} className="group/card">
              <Link href={item.path} className="block">
                <div className="img-frame aspect-[3/4]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="placeholder-tile">
                      <span className="font-display text-4xl italic tracking-wide select-none">
                        F.
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <h2 className="font-display text-[1.05rem] leading-snug">{item.name}</h2>
                  {item.price != null && (
                    <p className="shrink-0 text-sm text-ink-soft">
                      {new Intl.NumberFormat("nl-NL", {
                        style: "currency",
                        currency: "EUR",
                      }).format(item.price)}
                    </p>
                  )}
                </div>
                {item.color && <p className="mt-0.5 text-xs text-taupe">{item.color}</p>}
              </Link>
              <button
                onClick={() => remove(item.variantId)}
                className="link-underline mt-2 text-xs text-taupe hover:text-ink"
              >
                Verwijderen
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
