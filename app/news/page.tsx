import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "News",
  description: "Nieuws en nieuwe binnenkomers bij Ferganza, Amsterdam.",
  alternates: { canonical: "/news/" },
};

export default function NewsPage() {
  const latest = getProducts().slice(0, 8);
  return (
    <>
      <PageShell
        eyebrow="Journal"
        title={
          <>
            Nieuw in de <em className="italic text-taupe">boutique</em>
          </>
        }
      >
        <p>
          Warme tinten, comfortabele stoffen en stijlvolle modest fashion voor
          het seizoen — de etalage aan de Kinkerstraat wisselt, hier lees je wat
          er net is binnengekomen.
        </p>
        <p>
          <Link href="/shop/" className="link-underline">
            Bekijk alle nieuwe items in de shop
          </Link>
        </p>
      </PageShell>
      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <ProductGrid products={latest} />
      </section>
    </>
  );
}
