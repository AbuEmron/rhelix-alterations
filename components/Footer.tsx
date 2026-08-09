import Link from "next/link";
import { store } from "@/lib/commerce";
import { getI18n } from "@/lib/i18n-server";
import { fmt } from "@/lib/locale";

export default async function Footer() {
  const { dict } = await getI18n();

  const shopLinks = [
    { label: dict.footer.linkAll, href: "/shop/" },
    { label: dict.categories["337"], href: "/ferganza-womens-fashion/groups/clothing/337/" },
    { label: dict.categories["43501"], href: "/ferganza-womens-fashion/groups/eid+collection/43501+337/" },
    { label: dict.categories["400"], href: "/ferganza-womens-fashion/groups/accessories/400/" },
    { label: dict.categories["696"], href: "/ferganza-womens-fashion/groups/shoes/696/" },
  ];
  const serviceLinks = [
    { label: dict.footer.linkFaq, href: "/information/faq/" },
    { label: dict.footer.linkShipping, href: "/information/verzending/" },
    { label: dict.footer.linkReturns, href: "/information/returns/" },
    { label: dict.nav.contact, href: "/contact/" },
  ];
  const houseLinks = [
    { label: dict.nav.about, href: "/about/" },
    { label: dict.nav.news, href: "/news/" },
    { label: dict.nav.wishlist, href: "/wishlist/" },
  ];

  return (
    <footer className="mt-24 bg-ink text-ivory">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-3xl tracking-[0.28em]">FERGANZA</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/60">
              {dict.footer.tagline}
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
              [dict.footer.shopHeading, shopLinks],
              [dict.footer.serviceHeading, serviceLinks],
              [dict.footer.houseHeading, houseLinks],
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
          <p>
            © {new Date().getFullYear()} FERGANZA. {dict.footer.rights}
          </p>
          <p>
            {fmt(dict.footer.shippingLine, {
              carriers: store.shipping.carriers.join(" & "),
              days: store.shipping.euDeliveryDays,
            })}
          </p>
          <p>{fmt(dict.footer.credit, { studio: store.credits.studio })}</p>
        </div>
      </div>
    </footer>
  );
}
