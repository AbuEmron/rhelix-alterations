import Link from "next/link";
import { store } from "@/lib/commerce";

const SHOP_LINKS = [
  { label: "Alles", href: "/shop/" },
  { label: "Kleding", href: "/ferganza-womens-fashion/groups/clothing/337/" },
  { label: "EID Collectie", href: "/ferganza-womens-fashion/groups/eid+collection/43501+337/" },
  { label: "Accessoires", href: "/ferganza-womens-fashion/groups/accessories/400/" },
  { label: "Schoenen", href: "/ferganza-womens-fashion/groups/shoes/696/" },
];

const SERVICE_LINKS = [
  { label: "Veelgestelde vragen", href: "/information/faq/" },
  { label: "Verzending", href: "/information/verzending/" },
  { label: "Retourneren", href: "/information/returns/" },
  { label: "Contact", href: "/contact/" },
];

const HOUSE_LINKS = [
  { label: "About us", href: "/about/" },
  { label: "News", href: "/news/" },
  { label: "Wishlist", href: "/wishlist/" },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-ivory">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-3xl tracking-[0.28em]">FERGANZA</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/60">
              Womens fashion boutique — Amsterdam.
            </p>
            <address className="mt-6 text-sm not-italic leading-relaxed text-ivory/60">
              {store.contact.address.street}
              <br />
              {store.contact.address.postalCode} {store.contact.address.city},{" "}
              {store.contact.address.country}
              <br />
              <a
                href={`mailto:${store.contact.email}`}
                className="link-underline mt-1 inline-block text-ivory/80"
              >
                {store.contact.email}
              </a>
            </address>
            <div className="mt-6">
              <a
                href={store.social.snapchat}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ivory/80"
              >
                Snapchat — @ferganza
              </a>
            </div>
          </div>

          {(
            [
              ["Shop", SHOP_LINKS],
              ["Klantenservice", SERVICE_LINKS],
              ["Het huis", HOUSE_LINKS],
            ] as const
          ).map(([title, links]) => (
            <nav key={title} aria-label={title} className="md:col-span-2">
              <p className="eyebrow !text-ivory/40">{title}</p>
              <ul className="mt-5 space-y-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="link-underline text-sm text-ivory/75 hover:text-ivory"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-ivory/10 pt-8 text-xs text-ivory/40 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} FERGANZA. Alle rechten voorbehouden.</p>
          <p>
            Verzending met {store.shipping.carriers.join(" & ")} · EU levering{" "}
            {store.shipping.euDeliveryDays}
          </p>
          <p>Digital experience — {store.credits.studio}</p>
        </div>
      </div>
    </footer>
  );
}
