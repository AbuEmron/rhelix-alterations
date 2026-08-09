import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

export default function ProductGrid({
  products,
  emptyMessage = "Nieuwe items volgen binnenkort.",
  priorityCount = 0,
}: {
  products: Product[];
  emptyMessage?: string;
  priorityCount?: number;
}) {
  if (products.length === 0) {
    return (
      <div className="border border-sand px-6 py-24 text-center">
        <p className="font-display text-2xl italic text-taupe">{emptyMessage}</p>
      </div>
    );
  }
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
      {products.map((product, i) => (
        <Reveal as="li" key={product.id} delay={(i % 4) * 70}>
          <ProductCard product={product} priority={i < priorityCount} />
        </Reveal>
      ))}
    </ul>
  );
}
