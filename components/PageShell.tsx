import Reveal from "./Reveal";

export default function PageShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 md:px-8 md:pt-36">
      <Reveal>
        <p className="eyebrow">{eyebrow}</p>
      </Reveal>
      <Reveal delay={100}>
        <h1 className="headline mt-4 max-w-3xl text-5xl md:text-7xl">{title}</h1>
      </Reveal>
      <Reveal delay={200}>
        <div className="mt-12 max-w-2xl space-y-6 leading-relaxed text-ink-soft md:mt-16">
          {children}
        </div>
      </Reveal>
    </div>
  );
}
