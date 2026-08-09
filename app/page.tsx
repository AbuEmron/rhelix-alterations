import Link from "next/link";
import Reveal from "@/components/Reveal";
import ProductGrid from "@/components/ProductGrid";
import SmartImage from "@/components/SmartImage";
import { getCategoryById, getProducts, getProductsByCategory } from "@/lib/catalog";
import { store } from "@/lib/commerce";

const TILE_IDS = ["385", "848", "43501", "401"];

export default function HomePage() {
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
            <p className="eyebrow">Boutique — Amsterdam</p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="headline mt-5 max-w-4xl text-[clamp(3rem,9vw,7.5rem)]">
              Stil, elegant,
              <br />
              <em className="italic text-taupe">tijdloos</em> gedragen.
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-ink-soft">
              Jurken, sets, abayas en accessoires — met zorg samengesteld in onze
              boutique aan de Kinkerstraat.
            </p>
          </Reveal>
          <Reveal delay={340}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/shop/"
                className="bg-ink px-9 py-4 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-umber"
              >
                Shop nu
              </Link>
              {eid && (
                <Link
                  href={eid.path}
                  className="border border-ink px-9 py-4 text-[0.7rem] font-bold uppercase tracking-[0.22em] transition-colors hover:bg-ink hover:text-ivory"
                >
                  EID Collectie
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
            <h2 className="headline text-4xl md:text-5xl">Ontdek</h2>
            <Link href="/shop/" className="link-underline eyebrow !text-ink">
              Alles bekijken
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {tiles.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 90}>
              <Link href={cat.path} className="group/card block">
                <div className="img-frame aspect-[3/4]">
                  <SmartImage src={cat.image ?? null} alt={cat.nameNl} />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/50 to-transparent p-5 pt-16">
                    <p className="font-display text-xl text-ivory md:text-2xl">
                      {cat.nameNl}
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
              <p className="eyebrow">Nu in de boutique</p>
              <h2 className="headline mt-3 text-4xl md:text-5xl">New in</h2>
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
                <p className="eyebrow !text-clay">De collectie</p>
                <h2 className="headline mt-4 text-5xl md:text-6xl">
                  EID, <em className="italic">verfijnd</em>.
                </h2>
                <p className="mt-6 max-w-md leading-relaxed text-ivory/70">
                  Abayas en feestelijke silhouetten voor de momenten die er toe
                  doen — satijn, borduursel en handgezette details.
                </p>
                <Link
                  href={eid.path}
                  className="mt-9 inline-block border border-ivory/40 px-9 py-4 text-[0.7rem] font-bold uppercase tracking-[0.22em] transition-colors hover:bg-ivory hover:text-ink"
                >
                  Bekijk de collectie
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
              title: "Boutique in Amsterdam",
              body: `${store.contact.address.street}, ${store.contact.address.city} — kom langs of shop online.`,
            },
            {
              title: "Zorgvuldig verzonden",
              body: `Met ${store.shipping.carriers.join(" of ")} — levering binnen de EU in ${store.shipping.euDeliveryDays}.`,
            },
            {
              title: "Persoonlijke service",
              body: `Vragen? Mail ${store.contact.email} — we denken graag met je mee.`,
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
