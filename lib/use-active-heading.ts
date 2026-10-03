"use client";

import { useEffect, useState } from "react";

export type ActiveHeading = { section: string | null; sub: string | null };

/**
 * Scroll-spy for the article. Returns the h2 the reader is in and, if any,
 * the h3 inside it. Uses one rAF-throttled scroll listener.
 */
export function useActiveHeading(): ActiveHeading {
  const [active, setActive] = useState<ActiveHeading>({ section: null, sub: null });

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(".prose h2[id], .prose h3[id]"),
    );
    if (headings.length === 0) return;

    const update = () => {
      const line = 140;
      // Before the first heading is reached, the first section counts as active.
      let section: string | null = headings.find((h) => h.tagName === "H2")?.id ?? null;
      let sub: string | null = null;
      for (const el of headings) {
        if (el.getBoundingClientRect().top - line > 0) break;
        if (el.tagName === "H2") {
          section = el.id;
          sub = null;
        } else {
          sub = el.id;
        }
      }
      setActive((prev) => (prev.section === section && prev.sub === sub ? prev : { section, sub }));
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return active;
}
