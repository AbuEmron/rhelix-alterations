import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { store } from "@/lib/commerce";
import { getI18n } from "@/lib/i18n-server";
import { fmt } from "@/lib/locale";

export const metadata: Metadata = {
  title: "About us",
  description: "Ferganza — womens fashion boutique in Amsterdam.",
  alternates: { canonical: "/about/" },
};

export default async function AboutPage() {
  const { dict } = await getI18n();
  return (
    <PageShell
      eyebrow={dict.about.eyebrow}
      title={
        <>
          {dict.about.titlePre}
          <em className="italic text-taupe">{dict.about.titleEm}</em>
          {dict.about.titlePost}
        </>
      }
    >
      <p>{fmt(dict.about.p1, { street: store.contact.address.street })}</p>
      <p>{dict.about.p2}</p>
      <p>
        {dict.about.p3pre}
        <a
          href={store.social.snapchat}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline"
        >
          Snapchat
        </a>
        {dict.about.p3post}
      </p>
      <p>
        <Link
          href="/shop/"
          className="mt-4 inline-block bg-ink px-9 py-4 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-umber"
        >
          {dict.about.cta}
        </Link>
      </p>
    </PageShell>
  );
}
