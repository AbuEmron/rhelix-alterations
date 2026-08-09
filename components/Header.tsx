"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useWishlist } from "@/lib/wishlist";

export interface NavCategory {
  id: string;
  name: string;
  nameNl: string;
  path: string;
  children: { id: string; name: string; nameNl: string; path: string }[];
}

const NAV_LINKS = [
  { label: "Shop", href: "/shop/" },
  { label: "News", href: "/news/" },
  { label: "About", href: "/about/" },
];

/** Short desktop-nav labels so the rail never crowds the wordmark. */
const SHORT_LABELS: Record<string, string> = { "43501": "EID" };

export default function Header({ categories }: { categories: NavCategory[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { items } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    if (searchOpen) searchRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    router.push(`/search/?q=${encodeURIComponent(query.trim())}`);
  }

  const solid = scrolled || menuOpen || searchOpen || pathname !== "/";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid
            ? "bg-ivory/95 shadow-[0_1px_0_0_var(--color-sand)] backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
          {/* left: burger (mobile) + primary nav (desktop) */}
          <div className="flex flex-1 items-center gap-6">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Sluit menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
            >
              <span
                className={`h-px w-5 bg-current transition-transform duration-300 ${menuOpen ? "translate-y-[3px] rotate-45" : ""}`}
              />
              <span
                className={`h-px w-5 bg-current transition-transform duration-300 ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""}`}
              />
            </button>
            <nav className="hidden items-center gap-6 lg:flex" aria-label="Hoofdmenu">
              <Link
                href="/shop/"
                aria-current={pathname === "/shop/" ? "page" : undefined}
                className="link-underline whitespace-nowrap text-[0.72rem] font-semibold uppercase tracking-[0.16em]"
              >
                Shop
              </Link>
              {categories.map((cat) => (
                <div key={cat.id} className="group relative">
                  <Link
                    href={cat.path}
                    className="link-underline whitespace-nowrap text-[0.72rem] font-semibold uppercase tracking-[0.16em]"
                  >
                    {SHORT_LABELS[cat.id] ?? cat.name}
                  </Link>
                  {cat.children.length > 0 && (
                    <div className="invisible absolute left-1/2 top-full -translate-x-1/2 pt-5 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                      <div className="min-w-48 border border-sand bg-ivory px-7 py-6 shadow-xl shadow-ink/5">
                        <ul className="space-y-3">
                          {cat.children.map((child) => (
                            <li key={child.id}>
                              <Link
                                href={child.path}
                                className="link-underline whitespace-nowrap text-sm text-ink-soft hover:text-ink"
                              >
                                {child.nameNl}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* center: wordmark */}
          <Link
            href="/"
            aria-label="FERGANZA — home"
            className="font-display text-2xl font-semibold tracking-[0.28em] md:text-[1.7rem]"
          >
            FERGANZA
          </Link>

          {/* right: secondary nav + search + wishlist */}
          <div className="flex flex-1 items-center justify-end gap-2 md:gap-3">
            <nav className="mr-3 hidden items-center gap-6 xl:flex" aria-label="Secundair menu">
              {NAV_LINKS.slice(1).map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={pathname === l.href ? "page" : undefined}
                  className="link-underline whitespace-nowrap text-[0.72rem] font-semibold uppercase tracking-[0.16em]"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Zoeken"
              className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-60"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
            <Link
              href="/wishlist/"
              aria-label={`Wishlist (${items.length})`}
              className="relative flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-60"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M12 21C7 16.5 3 13.3 3 9.5A4.5 4.5 0 0 1 7.5 5c1.8 0 3.4 1 4.5 2.5C13.1 6 14.7 5 16.5 5A4.5 4.5 0 0 1 21 9.5c0 3.8-4 7-9 11.5Z" />
              </svg>
              {items.length > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[0.6rem] font-bold text-ivory">
                  {items.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* search overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ${
          searchOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        />
        <div
          className={`relative bg-ivory px-4 pb-10 pt-28 transition-transform duration-500 md:px-8 ${
            searchOpen ? "translate-y-0" : "-translate-y-6"
          }`}
        >
          <form onSubmit={submitSearch} className="mx-auto max-w-3xl">
            <label htmlFor="site-search" className="eyebrow">
              Zoeken
            </label>
            <div className="mt-3 flex items-center gap-4 border-b border-ink pb-3">
              <input
                ref={searchRef}
                id="site-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Abaya, jurk, tas…"
                className="w-full bg-transparent font-display text-3xl italic outline-none placeholder:text-clay md:text-4xl"
              />
              <button type="submit" className="eyebrow shrink-0 hover:text-ink">
                Zoek
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${menuOpen ? "visible" : "invisible"}`}
        aria-hidden={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-ink/30 transition-opacity duration-400 ${menuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMenuOpen(false)}
        />
        <nav
          aria-label="Mobiel menu"
          className={`absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col overflow-y-auto bg-ivory px-7 pb-10 pt-24 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <ul className="space-y-6">
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link href={cat.path} className="font-display text-2xl">
                  {cat.name}
                </Link>
                {cat.children.length > 0 && (
                  <ul className="mt-3 space-y-2.5 border-l border-sand pl-4">
                    {cat.children.map((child) => (
                      <li key={child.id}>
                        <Link href={child.path} className="text-sm text-ink-soft">
                          {child.nameNl}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-10 space-y-4 border-t border-sand pt-8">
            {NAV_LINKS.concat([
              { label: "Contact", href: "/contact/" },
              { label: "Wishlist", href: "/wishlist/" },
            ]).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block text-[0.75rem] font-semibold uppercase tracking-[0.18em]"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
