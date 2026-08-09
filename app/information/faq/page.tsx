import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Accordion from "@/components/Accordion";
import { store } from "@/lib/commerce";
import { getI18n } from "@/lib/i18n-server";
import { fmt } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Veelgestelde vragen",
  description: "Veelgestelde vragen aan Ferganza.",
  alternates: { canonical: "/information/faq/" },
};

export default async function FaqPage() {
  const { dict } = await getI18n();
  const vars = {
    email: store.contact.email,
    street: store.contact.address.street,
    city: store.contact.address.city,
    carriers: store.shipping.carriers.join(" / "),
    days: store.shipping.euDeliveryDays,
  };
  return (
    <PageShell eyebrow={dict.info.eyebrow} title={dict.info.faqTitle}>
      <Accordion
        items={[
          { title: dict.info.faqQ1, content: <p>{fmt(dict.info.faqA1, vars)}</p> },
          {
            title: dict.info.faqQ2,
            content: (
              <p>
                {fmt(dict.info.faqA2, vars)}{" "}
                <Link href="/information/verzending/" className="link-underline">
                  {dict.info.seeShipping}
                </Link>
                .
              </p>
            ),
          },
          {
            title: dict.info.faqQ3,
            content: (
              <p>
                {fmt(dict.info.faqA3, vars)}{" "}
                <Link href="/information/returns/" className="link-underline">
                  {dict.info.faqA3link}
                </Link>
                .
              </p>
            ),
          },
          { title: dict.info.faqQ4, content: <p>{fmt(dict.info.faqA4, vars)}</p> },
        ]}
      />
    </PageShell>
  );
}
