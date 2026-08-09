import Image from "next/image";

/**
 * Renders Ferganza's real photography (absolute URLs captured by sync)
 * through Next's image pipeline: responsive sizes, AVIF/WebP, lazy below the
 * fold. Source assets are never modified.
 *
 * When a product has no synced image yet, a quiet monogram tile renders
 * instead — deliberately abstract, never substitute merchandise imagery.
 */
export default function SmartImage({
  src,
  alt,
  sizes = "(max-width: 768px) 50vw, 25vw",
  priority = false,
  className = "",
}: {
  src: string | null | undefined;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) {
    return (
      <div className={`placeholder-tile ${className}`} role="img" aria-label={alt}>
        <span className="font-display text-4xl italic tracking-wide select-none">F.</span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
