import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { store } from "@/lib/commerce";
import { getI18n } from "@/lib/i18n-server";
import { fmt } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Returns",
  description: "Retourneren bij Ferganza.",
  alternates: { canonical: "/information/returns/" },
};

export default async function ReturnsPage() {
  const { dict } = await getI18n();
  return (
    <PageShell eyebrow={dict.info.eyebrow} title={dict.info.returnsTitle}>
      <p>{fmt(dict.info.retP1, { email: store.contact.email })}</p>
      <p>{dict.info.retP2}</p>
    </PageShell>
  );
}
