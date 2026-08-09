import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { store } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Returns",
  description: "Retourneren bij Ferganza.",
  alternates: { canonical: "/information/returns/" },
};

export default function ReturnsPage() {
  return (
    <PageShell eyebrow="Service" title="Retourneren">
      <p>
        Wil je een bestelling (deels) retourneren? Meld je retour aan per
        e-mail via{" "}
        <a href={`mailto:${store.contact.email}`} className="link-underline">
          {store.contact.email}
        </a>{" "}
        met je ordernummer, dan ontvang je van ons de retourinstructies.
      </p>
      <p>
        Het volledige retourbeleid van de winkel is en blijft van toepassing;
        neem bij twijfel altijd eerst contact op — we helpen je graag.
      </p>
    </PageShell>
  );
}
