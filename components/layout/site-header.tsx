import type { NavSection } from "@/lib/content";
import { site } from "@/lib/site";

import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

/** An original mark: a prompt chevron over a baseline, nothing borrowed. */
function Mark() {
  return (
    <svg viewBox="0 0 20 20" className="size-[1.1rem]" aria-hidden="true">
      <rect x="0.5" y="0.5" width="19" height="19" rx="4" className="fill-foreground" />
      <path
        d="M5.5 6.5 L9 10 L5.5 13.5"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="square"
        className="stroke-background"
      />
      <path d="M10.5 14 H14.5" strokeWidth="1.8" className="stroke-background" />
    </svg>
  );
}

export function SiteHeader({ nav }: { nav: NavSection[] }) {
  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/65 sticky top-0 z-40 h-[var(--header-h)] border-b backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[90rem] items-center gap-3 px-4 sm:px-6">
        <MobileNav nav={nav} />
        <a href="#top" className="flex min-w-0 items-center gap-2.5 rounded-sm">
          <Mark />
          <span className="text-[0.9375rem] font-semibold tracking-[-0.02em]">Keploy + Go</span>
          <span className="eyebrow border-border-strong rounded border px-1.5 py-px text-[0.625rem]">
            tutorial
          </span>
        </a>
        <nav aria-label="Primary" className="ml-4 hidden items-center gap-1 md:flex">
          <a
            href="#top"
            aria-current="page"
            className="bg-surface-2 text-foreground rounded-md px-3 py-1.5 text-[0.875rem] font-semibold"
          >
            Docs
          </a>
          <a
            href={site.quickstartUrl}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-[0.875rem] transition-colors"
          >
            Official quickstart<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a
            href={site.sampleRepoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground rounded-md px-3 py-1.5 text-[0.875rem] transition-colors"
          >
            Sample app<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <a
            href={site.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-foreground text-background inline-flex h-8 items-center rounded-md px-3 text-[0.8125rem] font-semibold transition-opacity hover:opacity-85"
          >
            GitHub<span className="sr-only"> repository (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </header>
  );
}
