import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { store } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Verzending",
  description: "Verzending bij Ferganza — DHL of PostNL, levering binnen de EU in 3–6 werkdagen.",
  alternates: { canonical: "/information/verzending/" },
};

export default function VerzendingPage() {
  return (
    <PageShell eyebrow="Service" title="Verzending">
      <p>
        Zodra je een bestelling plaatst, ontvang je een bevestiging per e-mail.
        We verzenden met {store.shipping.carriers.join(" of ")}.
      </p>
      <p>
        Levering binnen de EU duurt {store.shipping.euDeliveryDays}.
      </p>
      <p>
        Vragen over je zending? Mail{" "}
        <a href={`mailto:${store.contact.email}`} className="link-underline">
          {store.contact.email}
        </a>{" "}
        met je ordernummer — we zoeken het direct voor je uit.
      </p>
    </PageShell>
  );
}
