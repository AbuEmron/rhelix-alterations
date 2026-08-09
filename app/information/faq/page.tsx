import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Accordion from "@/components/Accordion";
import { store } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Veelgestelde vragen",
  description: "Veelgestelde vragen aan Ferganza.",
  alternates: { canonical: "/information/faq/" },
};

export default function FaqPage() {
  return (
    <PageShell eyebrow="Service" title="Veelgestelde vragen">
      <Accordion
        items={[
          {
            title: "Hoe kan ik jullie bereiken?",
            content: (
              <p>
                Mail{" "}
                <a href={`mailto:${store.contact.email}`} className="link-underline">
                  {store.contact.email}
                </a>{" "}
                of stuur een privébericht via Facebook. Je kunt ook langskomen
                in de boutique: {store.contact.address.street},{" "}
                {store.contact.address.city}.
              </p>
            ),
          },
          {
            title: "Wanneer ontvang ik mijn bestelling?",
            content: (
              <p>
                Na je bestelling ontvang je een bevestiging per e-mail. We
                verzenden met {store.shipping.carriers.join(" of ")}; levering
                binnen de EU duurt {store.shipping.euDeliveryDays}. Zie{" "}
                <Link href="/information/verzending/" className="link-underline">
                  verzending
                </Link>
                .
              </p>
            ),
          },
          {
            title: "Hoe retourneer ik een item?",
            content: (
              <p>
                Meld je retour aan per e-mail met je ordernummer. Zie{" "}
                <Link href="/information/returns/" className="link-underline">
                  retourneren
                </Link>{" "}
                voor de stappen.
              </p>
            ),
          },
          {
            title: "Kan ik in de winkel passen?",
            content: (
              <p>
                Zeker — je bent welkom in onze boutique aan de{" "}
                {store.contact.address.street} in {store.contact.address.city}.
              </p>
            ),
          },
        ]}
      />
    </PageShell>
  );
}
