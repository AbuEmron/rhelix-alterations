import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { getI18n } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Klantenservice",
  description: "Klantenservice van Ferganza — verzending, retourneren en veelgestelde vragen.",
  alternates: { canonical: "/information/" },
};

export default async function InformationPage() {
  const { dict } = await getI18n();
  const sections = [
    { title: dict.info.faqTitle, href: "/information/faq/", body: dict.info.faqBody },
    { title: dict.info.shippingTitle, href: "/information/verzending/", body: dict.info.shippingBody },
    { title: dict.info.returnsTitle, href: "/information/returns/", body: dict.info.returnsBody },
    { title: dict.info.contactTitle, href: "/contact/", body: dict.info.contactBody },
  ];
  return (
    <PageShell eyebrow={dict.info.eyebrow} title={dict.info.title}>
      <ul className="grid gap-4 md:grid-cols-2">
        {sections.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="block border border-sand p-6 transition-colors hover:border-ink"
            >
              <h2 className="font-display text-2xl text-ink">{s.title}</h2>
              <p className="mt-2 text-sm">{s.body}</p>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
