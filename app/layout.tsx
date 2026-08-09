import type { Metadata } from "next";
import "@fontsource-variable/cormorant";
import "@fontsource-variable/manrope";
import "@fontsource/amiri";
import "./globals.css";
import Header, { type NavCategory } from "@/components/Header";
import Footer from "@/components/Footer";
import { WishlistProvider } from "@/lib/wishlist";
import { I18nProvider } from "@/lib/i18n-client";
import { getI18n, categoryLabel } from "@/lib/i18n-server";
import { LOCALE_META } from "@/lib/locale";
import { getCatalog, getCategories, getChildCategories } from "@/lib/catalog";
import type { Dict } from "@/lib/dictionaries";
import type { Locale } from "@/lib/locale";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ferganza.com"),
  title: {
    default: "FERGANZA | Womens Fashion — Amsterdam",
    template: "FERGANZA | %s",
  },
  description:
    "Ferganza Womens Fashion — boutique in Amsterdam. Jurken, sets, abayas, EID collectie, tassen en schoenen.",
};

function buildNav(dict: Dict, locale: Locale): NavCategory[] {
  const featured = ["337", "43501", "400", "696"];
  return featured
    .map((id) => getCategories().find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => ({
      id: c.id,
      label: categoryLabel(dict, locale, c),
      path: c.path,
      children: getChildCategories(c.id)
        .filter((child) => child.id !== c.id)
        .map((child) => ({
          id: child.id,
          label: categoryLabel(dict, locale, child),
          path: child.path,
        })),
    }));
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { locale, dict } = await getI18n();
  const nav = buildNav(dict, locale);
  const { meta } = getCatalog();

  return (
    <html lang={locale} dir={LOCALE_META[locale].dir}>
      <body>
        <script
          // mark JS availability before first paint so reveal animations
          // never hide content in a no-JS context
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
        <I18nProvider locale={locale} dict={dict}>
          <WishlistProvider>
            {!meta.verified && (
              <div className="fixed bottom-3 start-3 z-[60] bg-ink px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-ivory/90">
                {dict.common.previewRibbon}
              </div>
            )}
            <Header categories={nav} />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </WishlistProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
