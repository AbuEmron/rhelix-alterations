import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { store } from "@/lib/commerce";
import { getI18n } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Ferganza — Kinkerstraat 237, Amsterdam.",
  alternates: { canonical: "/contact/" },
};

export default async function ContactPage() {
  const { dict } = await getI18n();
  const { address, email } = store.contact;
  return (
    <PageShell eyebrow={dict.contact.eyebrow} title={dict.contact.title}>
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="eyebrow !text-ink">{dict.contact.visit}</h2>
          <address className="mt-4 not-italic leading-relaxed">
            Ferganza Womens Fashion
            <br />
            {address.street}
            <br />
            {address.postalCode} {address.city}
            <br />
            {address.country}
          </address>
        </div>
        <div>
          <h2 className="eyebrow !text-ink">{dict.contact.write}</h2>
          <p className="mt-4">
            <a href={`mailto:${email}`} className="link-underline text-lg">
              {email}
            </a>
          </p>
          <p className="mt-4 text-sm">
            {dict.contact.alsoVia}
            <a
              href={store.social.snapchat}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline"
            >
              Snapchat
            </a>
            .
          </p>
        </div>
      </div>
    </PageShell>
  );
}
