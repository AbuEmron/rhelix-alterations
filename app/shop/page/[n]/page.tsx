import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShopIndex from "@/components/ShopIndex";

interface Props {
  params: Promise<{ n: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  return {
    title: `Shop — pagina ${n}`,
    alternates: { canonical: `/shop/page/${n}/` },
  };
}

export default async function ShopPaged({ params }: Props) {
  const { n } = await params;
  const page = parseInt(n, 10);
  if (!Number.isFinite(page) || page < 1) notFound();
  return <ShopIndex page={page} />;
}
