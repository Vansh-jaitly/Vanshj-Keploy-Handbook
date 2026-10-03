import Image from "next/image";
import type { ReactNode } from "react";

/** A real screenshot from my run, with a caption. */
export function Screenshot({
  src,
  alt,
  width,
  height,
  caption,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: ReactNode;
}) {
  return (
    <figure className="my-8">
      <a
        href={src}
        target="_blank"
        rel="noreferrer"
        className="border-border block overflow-x-auto rounded-lg border bg-[#0c0c0c] transition-opacity hover:opacity-95"
      >
        <span className="sr-only">Open the full-size screenshot in a new tab. </span>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full min-w-[540px]"
          sizes="(min-width: 1024px) 720px, 100vw"
        />
      </a>
      <figcaption className="text-muted-foreground mt-3 flex gap-3 text-[0.8125rem] leading-relaxed">
        <span className="eyebrow shrink-0 pt-px">Fig.</span>
        <span>
          {caption} <span className="text-faint whitespace-nowrap">Click to enlarge.</span>
        </span>
      </figcaption>
    </figure>
  );
}
