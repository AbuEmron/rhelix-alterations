import Link from "next/link";
import Reveal from "@/components/Reveal";
import ProductGrid from "@/components/ProductGrid";
import SmartImage from "@/components/SmartImage";
import { getCategoryById, getProducts, getProductsByCategory } from "@/lib/catalog";
import { store } from "@/lib/commerce";
import { categoryLabel, getI18n } from "@/lib/i18n-server";
import { fmt } from "@/lib/locale";

const TILE_IDS = ["385", "848", "43501", "401"];

export default async function HomePage() {
  const { locale, dict } = await getI18n();
  const newIn = getProducts().slice(0, 8);
  const eid = getCategoryById("43501");
  const eidProducts = getProductsByCategory("43501").slice(0, 4);
  const tiles = TILE_IDS.map((id) => getCategoryById(id)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c),
  );

  return (
    <>
      {/* ——— hero ——— */}
      <section className="relative flex min-h-[92svh] flex-col justify-end overflow-hidden bg-bone">
        {eid?.image && (
          <div className="absolute inset-0">
            <SmartImage src={eid.image} alt="" sizes="100vw" priority className="opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/40 to-transparent" />
          </div>
        )}
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-40 md:px-8 md:pb-24">
          <Reveal>
            <p className="eyebrow">{dict.home.eyebrow}</p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="headline mt-5 max-w-4xl text-[clamp(3rem,9vw,7.5rem)]">
              {dict.home.heroPre}
              <br />
              <em className="italic text-taupe">{dict.home.heroEm}</em>
              {dict.home.heroPost}
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-ink-soft">
              {dict.home.heroSub}
            </p>
          </Reveal>
          <Reveal delay={340}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/shop/"
                className="bg-ink px-9 py-4 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-umber"
              >
                {dict.home.shopNow}
              </Link>
              {eid && (
                <Link
                  href={eid.path}
                  className="border border-ink px-9 py-4 text-[0.7rem] font-bold uppercase tracking-[0.22em] transition-colors hover:bg-ink hover:text-ivory"
                >
                  {dict.home.eidCollection}
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— category tiles ——— */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <Reveal>
          <div className="mb-10 flex items-end justify-between">
            <h2 className="headline text-4xl md:text-5xl">{dict.home.discover}</h2>
            <Link href="/shop/" className="link-underline eyebrow !text-ink">
              {dict.home.viewAll}
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {tiles.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 90}>
              <Link href={cat.path} className="group/card block">
                <div className="img-frame aspect-[3/4]">
                  <SmartImage src={cat.image ?? null} alt={categoryLabel(dict, locale, cat)} />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/50 to-transparent p-5 pt-16">
                    <p className="font-display text-xl text-ivory md:text-2xl">
                      {categoryLabel(dict, locale, cat)}
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— new in ——— */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8 md:pb-28">
        <Reveal>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="eyebrow">{dict.home.newInEyebrow}</p>
              <h2 className="headline mt-3 text-4xl md:text-5xl">{dict.home.newIn}</h2>
            </div>
          </div>
        </Reveal>
        <ProductGrid products={newIn} priorityCount={4} />
      </section>

      {/* ——— editorial: EID ——— */}
      {eid && (
        <section className="bg-ink text-ivory">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:grid-cols-2 md:items-center md:px-8 md:py-32">
            <Reveal>
              <div>
                <p className="eyebrow !text-clay">{dict.home.eidEyebrow}</p>
                <h2 className="headline mt-4 text-5xl md:text-6xl">
                  {dict.home.eidPre}
                  <em className="italic">{dict.home.eidEm}</em>
                  {dict.home.eidPost}
                </h2>
                <p className="mt-6 max-w-md leading-relaxed text-ivory/70">
                  {dict.home.eidBody}
                </p>
                <Link
                  href={eid.path}
                  className="mt-9 inline-block border border-ivory/40 px-9 py-4 text-[0.7rem] font-bold uppercase tracking-[0.22em] transition-colors hover:bg-ivory hover:text-ink"
                >
                  {dict.home.viewCollection}
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-4">
              {eidProducts.map((p, i) => (
                <Reveal key={p.id} delay={i * 100}>
                  <Link href={p.variants[0]?.path ?? "/shop/"} className="group/card block">
                    <div className="img-frame aspect-[3/4]">
                      <SmartImage
                        src={p.variants[0]?.images[0] ?? p.images[0] ?? null}
                        alt={p.name}
                      />
                    </div>
                    <p className="mt-2.5 font-display text-base text-ivory/90">
                      {p.name}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ——— boutique values ——— */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
        <div className="grid gap-10 border-y border-sand py-12 md:grid-cols-3">
          {[
            {
              title: dict.home.value1Title,
              body: fmt(dict.home.value1Body, {
                street: store.contact.address.street,
                city: store.contact.address.city,
              }),
            },
            {
              title: dict.home.value2Title,
              body: fmt(dict.home.value2Body, {
                carriers: store.shipping.carriers.join(" / "),
                days: store.shipping.euDeliveryDays,
              }),
            },
            {
              title: dict.home.value3Title,
              body: fmt(dict.home.value3Body, { email: store.contact.email }),
            },
          ].map((v, i) => (
            <Reveal key={v.title} delay={i * 100}>
              <div className="px-2 text-center md:px-6">
                <h3 className="font-display text-2xl">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
