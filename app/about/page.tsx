import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { store } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "About us",
  description: "Ferganza — womens fashion boutique in Amsterdam.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="Het huis"
      title={
        <>
          Funky, fresh &{" "}
          <em className="italic text-taupe">stylish</em> — sinds de
          Kinkerstraat.
        </>
      }
    >
      <p>
        Ferganza is een womenswear boutique in Amsterdam. In onze winkel aan de{" "}
        {store.contact.address.street} stellen we een collectie samen die
        trendy en tijdloos tegelijk is — van jurken, sets en tunieken tot
        abayas, tassen en schoenen.
      </p>
      <p>
        Elegant en draagbaar, met oog voor modest fashion: silhouetten die
        kleden zonder in te leveren op stijl. De collectie wisselt met de
        seizoenen; de smaak blijft.
      </p>
      <p>
        Kom langs in de boutique of shop de collectie online — en volg ons op{" "}
        <a
          href={store.social.snapchat}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline"
        >
          Snapchat
        </a>{" "}
        voor het laatste nieuws.
      </p>
      <p>
        <Link
          href="/shop/"
          className="mt-4 inline-block bg-ink px-9 py-4 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-umber"
        >
          Naar de collectie
        </Link>
      </p>
    </PageShell>
  );
}
