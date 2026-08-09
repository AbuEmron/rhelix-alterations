import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Klantenservice",
  description: "Klantenservice van Ferganza — verzending, retourneren en veelgestelde vragen.",
  alternates: { canonical: "/information/" },
};

const SECTIONS = [
  { title: "Veelgestelde vragen", href: "/information/faq/", body: "Antwoorden op de meest gestelde vragen." },
  { title: "Verzending", href: "/information/verzending/", body: "Verzendmethoden, levertijden en tracking." },
  { title: "Retourneren", href: "/information/returns/", body: "Zo meld je een retour aan." },
  { title: "Contact", href: "/contact/", body: "De boutique, e-mail en social kanalen." },
];

export default function InformationPage() {
  return (
    <PageShell eyebrow="Service" title="Klantenservice">
      <ul className="grid gap-4 md:grid-cols-2">
        {SECTIONS.map((s) => (
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
