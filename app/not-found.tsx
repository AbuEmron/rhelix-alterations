import Link from "next/link";
import { getI18n } from "@/lib/i18n-server";

export default async function NotFound() {
  const { dict } = await getI18n();
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-start justify-center px-4 pt-20 md:px-8">
      <p className="eyebrow">{dict.notFound.eyebrow}</p>
      <h1 className="headline mt-4 text-5xl md:text-7xl">
        {dict.notFound.titlePre}
        <em className="italic text-taupe">{dict.notFound.titleEm}</em>
        {dict.notFound.titlePost}
      </h1>
      <p className="mt-6 max-w-md leading-relaxed text-ink-soft">{dict.notFound.body}</p>
      <div className="mt-10 flex gap-4">
        <Link
          href="/shop/"
          className="bg-ink px-9 py-4 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-umber"
        >
          {dict.notFound.toShop}
        </Link>
        <Link
          href="/search/"
          className="border border-ink px-9 py-4 text-[0.7rem] font-bold uppercase tracking-[0.22em] transition-colors hover:bg-ink hover:text-ivory"
        >
          {dict.notFound.toSearch}
        </Link>
      </div>
    </div>
  );
}
