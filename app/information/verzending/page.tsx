import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { store } from "@/lib/commerce";
import { getI18n } from "@/lib/i18n-server";
import { fmt } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Verzending",
  description: "Verzending bij Ferganza — DHL of PostNL, levering binnen de EU in 3–6 werkdagen.",
  alternates: { canonical: "/information/verzending/" },
};

export default async function VerzendingPage() {
  const { dict } = await getI18n();
  const vars = {
    carriers: store.shipping.carriers.join(" / "),
    days: store.shipping.euDeliveryDays,
    email: store.contact.email,
  };
  return (
    <PageShell eyebrow={dict.info.eyebrow} title={dict.info.shippingTitle}>
      <p>{fmt(dict.info.shipP1, vars)}</p>
      <p>{fmt(dict.info.shipP2, vars)}</p>
      <p>{fmt(dict.info.shipP3, vars)}</p>
    </PageShell>
  );
}
