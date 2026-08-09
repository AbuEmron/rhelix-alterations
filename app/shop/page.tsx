import type { Metadata } from "next";
import ShopIndex from "@/components/ShopIndex";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "De volledige Ferganza collectie — jurken, sets, abayas, tassen en schoenen.",
  alternates: { canonical: "/shop/" },
};

export default function ShopPage() {
  return <ShopIndex page={1} />;
}
