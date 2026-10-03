import { FileText } from "lucide-react";

import Tutorial from "@/content/tutorial.mdx";
import { BackToTop } from "@/components/layout/back-to-top";
import { CopyPageButton } from "@/components/layout/copy-page-button";
import { DocsSidebar } from "@/components/layout/docs-sidebar";
import { OnThisPage } from "@/components/layout/on-this-page";
import { ReadingProgress } from "@/components/layout/reading-progress";
import { SiteHeader } from "@/components/layout/site-header";
import { getNav, getReadingMinutes } from "@/lib/content";
import { site } from "@/lib/site";

export default function Page() {
  const nav = getNav();
  const minutes = getReadingMinutes();

  return (
    <>
      <SiteHeader nav={nav} />
      <ReadingProgress />
      <div className="mx-auto grid max-w-[86rem] grid-cols-1 px-4 sm:px-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:px-5 xl:grid-cols-[14rem_minmax(0,1fr)_13rem]">
        <aside className="border-border hidden border-r lg:block">
          <nav
            aria-label="Tutorial sections"
            className="sticky top-[var(--header-h)] max-h-[calc(100dvh-var(--header-h))] [scrollbar-width:thin] overflow-y-auto py-10 pr-4"
          >
            <DocsSidebar nav={nav} />
          </nav>
        </aside>

        <main id="main" className="min-w-0 py-10 sm:py-14 lg:px-8 xl:px-10">
          <article className="mx-auto max-w-[var(--measure)]">
            <header id="top" tabIndex={-1} className="outline-none">
              <p className="eyebrow">Tutorials · Go · Echo + Postgres</p>
              <h1 className="mt-4 text-[2.15rem] leading-[1.08] font-bold tracking-[-0.032em] text-balance sm:text-[2.75rem]">
                {site.title}
              </h1>
              <p className="text-ink mt-4 flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-8 bg-current" />
                <span className="text-[1.0625rem] font-semibold tracking-[-0.01em] italic">
                  {site.tagline}
                </span>
              </p>
              <p className="text-muted-foreground mt-6 text-[1.1875rem] leading-[1.6] tracking-[-0.01em] sm:text-[1.3125rem]">
                I recorded real API calls against a Go URL shortener, replayed them as tests, and
                kept them green with the database switched off. No test code, no hand-written mocks.
              </p>

              <dl className="text-muted-foreground mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem]">
                <div className="flex gap-1.5">
                  <dt className="sr-only">Author</dt>
                  <dd className="text-foreground font-medium">{site.author}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="sr-only">Date</dt>
                  <dd>{site.date}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="sr-only">Reading time</dt>
                  <dd>{minutes} min read</dd>
                </div>
              </dl>
              <p className="text-muted-foreground mt-3 font-mono text-[0.75rem] leading-relaxed">
                <span className="text-faint">Tested with </span>
                {site.testedWith.join(" · ")}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-2">
                <CopyPageButton />
                <a
                  href="/tutorial.md"
                  className="text-muted-foreground hover:text-foreground inline-flex h-8 items-center gap-2 rounded-md px-2.5 text-[0.8125rem] transition-colors"
                >
                  <FileText aria-hidden="true" className="size-3.5" />
                  View as Markdown
                </a>
              </div>
            </header>

            <hr className="border-border mt-10" />

            <div className="prose">
              <Tutorial />
            </div>

            <footer className="border-border text-muted-foreground mt-20 flex flex-col gap-4 border-t pt-8 pb-4 text-[0.8125rem] sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <p>
                  Written by <span className="text-foreground font-medium">{site.author}</span>.
                  Built with Next.js + MDX.
                </p>
                <p className="text-faint">An independent tutorial, not an official Keploy page.</p>
              </div>
              <ul className="flex gap-5">
                <li>
                  <a
                    className="hover:text-foreground"
                    href={site.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Source
                  </a>
                </li>
                <li>
                  <a className="hover:text-foreground" href="/tutorial.md">
                    Markdown
                  </a>
                </li>
                <li>
                  <a className="hover:text-foreground" href="#top">
                    Back to top
                  </a>
                </li>
              </ul>
            </footer>
          </article>
        </main>

        <aside className="border-border hidden border-l xl:block">
          <div className="sticky top-[var(--header-h)] max-h-[calc(100dvh-var(--header-h))] overflow-y-auto py-10 pl-5">
            <OnThisPage nav={nav} />
          </div>
        </aside>
      </div>
      <BackToTop />
    </>
  );
}
