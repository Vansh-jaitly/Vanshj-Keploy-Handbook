# Test a Go API with Keploy: Automated Tests & PostgreSQL Mocks

_My Own Handbook!_

A single-page, documentation-style tutorial based on my own run of Keploy's
[Echo + Postgres quickstart](https://keploy.io/docs/quickstart/samples-echo/) on Windows + WSL2.
I record real API traffic from a Go URL shortener, replay it as tests, keep the suite green with
Postgres switched off, and then break one status code on purpose to watch Keploy catch it.

## Features

- Docs-style layout: grouped section sidebar with scroll-spy, an "On this page" rail, and a
  drawer on mobile
- **Copy page as Markdown**: the whole tutorial, generated at build time from the same MDX
  source and served as a static file at `/tutorial.md`
- Code blocks with language labels, file titles, highlighted lines, diff tinting and copy buttons
- A monochrome custom cursor (arrow, hand, I-beam, not-allowed, move, resize) that only turns on
  for a real mouse; touch, pen and no-JS visitors keep the native cursor
- Light, dark and system themes; respects `prefers-reduced-motion`

## Tech stack

- [Next.js](https://nextjs.org) (App Router, TypeScript strict), statically exported
- MDX via `@next/mdx`, with `remark-gfm`, `rehype-slug`, `rehype-autolink-headings` and
  `rehype-pretty-code` (Shiki, dual light/dark themes)
- `unified` + `remark-mdx` to turn the MDX into plain Markdown for the copy feature
- [Tailwind CSS](https://tailwindcss.com) v4
- [shadcn/ui](https://ui.shadcn.com) components on Radix UI: Tabs, Accordion, Tooltip, Button
- `next-themes`, `lucide-react` icons; Plus Jakarta Sans (self-hosted from `@fontsource`) and
  Geist Mono via `next/font`

## Project structure

```text
app/
  layout.tsx            fonts, theme provider, metadata, custom cursor
  page.tsx              docs shell: header, sidebar, article, "On this page" rail
  tutorial.md/route.ts  static route that serves the tutorial as Markdown
  globals.css           design tokens for both themes, article and code styles
components/
  custom-cursor.tsx     the cursor system
  layout/               header, sidebar, mobile drawer, on-this-page rail, copy-page button,
                        theme toggle, reading progress, back to top
  mdx/                  components used in the tutorial (Callout, Steps, Tabs, Terminal,
                        CodeBlock, FileTree, ArchitectureDiagram, RunSummary, tables,
                        Troubleshooting, HeroTerminal)
  ui/                   shadcn/ui components
content/
  tutorial.mdx          the tutorial itself (single source of truth)
lib/
  content.ts            build-time headings, sidebar model and reading time
  markdown.ts           MDX to Markdown conversion for "Copy page as Markdown"
  rehype-diff-lines.mjs marks added/removed lines in diff code blocks
  site.ts               title, author, links, sidebar groups
mdx-components.tsx      maps MDX elements to the components above
public/
  og.png                Open Graph image
  screenshots/          real screenshots from my run
```

## Run it locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to out/
```

Other scripts: `npm run lint`, `npm run format`, `npm run format:check`.

## Deploy

The site is fully static (`output: "export"`). Import the repository in Vercel and deploy with
the default settings; no configuration is needed.

## Credits

- The sample app is Keploy's [`samples-go/echo-sql`](https://github.com/keploy/samples-go).
- [Keploy](https://keploy.io) is an open-source API testing tool. This tutorial is an
  independent write-up of my own run and is not affiliated with Keploy.

## License

[MIT](LICENSE) © 2026 Vansh Jaitly
