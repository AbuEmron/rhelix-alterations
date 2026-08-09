"use client";

import { useState } from "react";
import Image from "next/image";
import SmartImage from "./SmartImage";
import { fmt, useI18n } from "@/lib/i18n-client";

export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const { dict } = useI18n();

  if (images.length === 0) {
    return (
      <div className="img-frame aspect-[3/4]">
        <SmartImage src={null} alt={alt} sizes="(max-width: 768px) 100vw, 55vw" />
      </div>
    );
  }

  return (
    <div>
      {/* mobile: swipe gallery */}
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto md:hidden">
        {images.map((src, i) => (
          <div key={src} className="img-frame aspect-[3/4] w-full shrink-0 snap-center">
            <Image
              src={src}
              alt={`${alt} — ${fmt(dict.product.imageN, { n: i + 1 })}`}
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5 md:hidden" aria-hidden>
        {images.map((_, i) => (
          <span key={i} className="h-1 w-6 bg-sand" />
        ))}
      </div>

      {/* desktop: main image + thumbnail rail */}
      <div className="hidden gap-4 md:flex">
        {images.length > 1 && (
          <div className="flex w-20 flex-col gap-3">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActive(i)}
                aria-label={fmt(dict.product.imageN, { n: i + 1 })}
                className={`img-frame aspect-[3/4] transition-opacity ${
                  i === active ? "ring-1 ring-ink" : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setZoomed(true)}
          className="img-frame aspect-[3/4] flex-1 cursor-zoom-in"
          aria-label={dict.product.zoomOpen}
        >
          <Image
            src={images[active]}
            alt={alt}
            fill
            sizes="55vw"
            priority
            className="object-cover"
          />
        </button>
      </div>

      {/* zoom overlay */}
      {zoomed && (
        <div
          className="fixed inset-0 z-[70] flex cursor-zoom-out items-center justify-center bg-ivory/98 p-4 animate-fade-in"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-label={dict.product.zoomDialog}
        >
          <div className="relative h-full w-full max-w-5xl">
            <Image src={images[active]} alt={alt} fill sizes="100vw" className="object-contain" />
          </div>
          <button
            className="absolute right-6 top-6 text-[0.7rem] font-bold uppercase tracking-[0.22em]"
            aria-label={dict.product.zoomClose}
          >
            {dict.product.zoomClose} ×
          </button>
        </div>
      )}
    </div>
  );
}
