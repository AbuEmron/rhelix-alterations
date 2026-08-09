import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/catalog";
import { getI18n } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "News",
  description: "Nieuws en nieuwe binnenkomers bij Ferganza, Amsterdam.",
  alternates: { canonical: "/news/" },
};

export default async function NewsPage() {
  const { dict } = await getI18n();
  const latest = getProducts().slice(0, 8);
  return (
    <>
      <PageShell
        eyebrow={dict.news.eyebrow}
        title={
          <>
            {dict.news.titlePre}
            <em className="italic text-taupe">{dict.news.titleEm}</em>
            {dict.news.titlePost}
          </>
        }
      >
        <p>{dict.news.p1}</p>
        <p>
          <Link href="/shop/" className="link-underline">
            {dict.news.cta}
          </Link>
        </p>
      </PageShell>
      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <ProductGrid products={latest} />
      </section>
    </>
  );
}
