import type { Metadata } from "next";
import "@fontsource-variable/cormorant";
import "@fontsource-variable/manrope";
import "./globals.css";
import Header, { type NavCategory } from "@/components/Header";
import Footer from "@/components/Footer";
import { WishlistProvider } from "@/lib/wishlist";
import { getCatalog, getCategories, getChildCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ferganza.com"),
  title: {
    default: "FERGANZA | Womens Fashion — Amsterdam",
    template: "FERGANZA | %s",
  },
  description:
    "Ferganza Womens Fashion — boutique in Amsterdam. Jurken, sets, abayas, EID collectie, tassen en schoenen.",
};

function buildNav(): NavCategory[] {
  const featured = ["337", "43501", "400", "696"];
  return featured
    .map((id) => getCategories().find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => ({
      id: c.id,
      name: c.name,
      nameNl: c.nameNl,
      path: c.path,
      children: getChildCategories(c.id)
        .filter((child) => child.id !== c.id)
        .map((child) => ({
          id: child.id,
          name: child.name,
          nameNl: child.nameNl,
          path: child.path,
        })),
    }));
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const nav = buildNav();
  const { meta } = getCatalog();

  return (
    <html lang="nl">
      <body>
        <script
          // mark JS availability before first paint so reveal animations
          // never hide content in a no-JS context
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
        <WishlistProvider>
          {!meta.verified && (
            <div className="fixed bottom-3 left-3 z-[60] bg-ink px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-ivory/90">
              Preview — catalogus nog niet gesynchroniseerd (npm run sync)
            </div>
          )}
          <Header categories={nav} />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </WishlistProvider>
      </body>
    </html>
  );
}
