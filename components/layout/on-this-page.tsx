"use client";

import { ArrowUp, FileText } from "lucide-react";

import type { NavSection } from "@/lib/content";
import { useActiveHeading } from "@/lib/use-active-heading";
import { cn } from "@/lib/utils";

import { CopyPageButton } from "./copy-page-button";

/** Right rail: the active section's subsections plus page-level actions. */
export function OnThisPage({ nav }: { nav: NavSection[] }) {
  const { section, sub } = useActiveHeading();
  const items = nav.flatMap((g) => g.items);
  const current = items.find((i) => i.id === section) ?? items[0];

  return (
    <div className="space-y-8 text-[0.84rem]">
      <div>
        <p className="eyebrow mb-3">On this page</p>
        <a
          href={`#${current.id}`}
          className={cn(
            "flex items-baseline gap-2 leading-snug font-medium",
            sub ? "text-foreground" : "text-ink",
          )}
        >
          <span className="text-faint font-mono text-[0.625rem]">
            {String(current.index).padStart(2, "0")}
          </span>
          {current.label}
        </a>
        {current.children.length > 0 ? (
          <ul className="border-border mt-2.5 space-y-0.5 border-l">
            {current.children.map((child) => (
              <li key={child.id}>
                <a
                  href={`#${child.id}`}
                  aria-current={sub === child.id ? "location" : undefined}
                  className={cn(
                    "-ml-px block border-l py-1 pl-3 leading-snug transition-colors",
                    sub === child.id
                      ? "border-ink text-ink font-medium"
                      : "text-muted-foreground hover:text-foreground border-transparent",
                  )}
                >
                  {child.text}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-faint mt-2 leading-snug">No subsections.</p>
        )}
      </div>

      <div className="border-border space-y-1 border-t pt-6">
        <CopyPageButton compact className="mb-2 w-full justify-start" />
        <a
          href="/tutorial.md"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 py-1 transition-colors"
        >
          <FileText aria-hidden="true" className="size-3.5" />
          View as Markdown
        </a>
        <a
          href="#top"
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 py-1 transition-colors"
        >
          <ArrowUp aria-hidden="true" className="size-3.5" />
          Back to top
        </a>
      </div>
    </div>
  );
}
