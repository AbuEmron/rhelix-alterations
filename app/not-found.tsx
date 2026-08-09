import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-start justify-center px-4 pt-20 md:px-8">
      <p className="eyebrow">404</p>
      <h1 className="headline mt-4 text-5xl md:text-7xl">
        Deze pagina is <em className="italic text-taupe">verhuisd</em> of
        bestaat niet.
      </h1>
      <p className="mt-6 max-w-md leading-relaxed text-ink-soft">
        Het item dat je zoekt staat mogelijk elders in de collectie — of de
        catalogus is nog niet gesynchroniseerd met de winkel.
      </p>
      <div className="mt-10 flex gap-4">
        <Link
          href="/shop/"
          className="bg-ink px-9 py-4 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-umber"
        >
          Naar de shop
        </Link>
        <Link
          href="/search/"
          className="border border-ink px-9 py-4 text-[0.7rem] font-bold uppercase tracking-[0.22em] transition-colors hover:bg-ink hover:text-ivory"
        >
          Zoeken
        </Link>
      </div>
    </div>
  );
}
