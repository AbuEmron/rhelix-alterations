export default function Accordion({
  items,
}: {
  items: { title: string; content: React.ReactNode }[];
}) {
  return (
    <div className="divide-y divide-sand border-y border-sand">
      {items.map((item) => (
        <details key={item.title} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold uppercase tracking-[0.15em] [&::-webkit-details-marker]:hidden">
            {item.title}
            <span className="text-base font-normal transition-transform duration-300 group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="pb-2 pt-3 text-sm leading-relaxed text-ink-soft">
            {item.content}
          </div>
        </details>
      ))}
    </div>
  );
}
