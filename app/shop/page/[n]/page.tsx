import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShopIndex from "@/components/ShopIndex";
import { getI18n } from "@/lib/i18n-server";
import { fmt } from "@/lib/locale";

interface Props {
  params: Promise<{ n: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  const { dict } = await getI18n();
  return {
    title: fmt(dict.shop.pageTitle, { n }),
    alternates: { canonical: `/shop/page/${n}/` },
  };
}

export default async function ShopPaged({ params }: Props) {
  const { n } = await params;
  const page = parseInt(n, 10);
  if (!Number.isFinite(page) || page < 1) notFound();
  return <ShopIndex page={page} />;
}
