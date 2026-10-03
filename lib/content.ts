import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";

import { navGroups } from "@/lib/site";

export type TocItem = { id: string; text: string; depth: 2 | 3 };

const tutorialPath = path.join(process.cwd(), "content", "tutorial.mdx");

/** Lines of the tutorial that are prose, i.e. outside fenced code blocks. */
function proseLines(source: string): string[] {
  const out: string[] = [];
  let inFence = false;
  for (const line of source.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence) out.push(line);
  }
  return out;
}

function plainHeading(raw: string): string {
  return raw
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}

/**
 * Builds the table of contents at build time with the same slugger that
 * rehype-slug uses, so ids always match the rendered headings.
 */
export function getToc(): TocItem[] {
  const source = fs.readFileSync(tutorialPath, "utf8");
  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];
  for (const line of proseLines(source)) {
    const match = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const depth = match[1].length;
    const text = plainHeading(match[2]);
    const id = slugger.slug(text);
    if (depth === 2 || depth === 3) toc.push({ id, text, depth });
  }
  return toc;
}

export type NavSection = {
  title: string;
  items: { id: string; label: string; index: number; children: TocItem[] }[];
};

/**
 * Sidebar model: the groups from lib/site.ts, numbered in page order, with
 * each section's h3s nested under it. Fails the build if a group points at
 * a heading that no longer exists, so navigation can't silently drift.
 */
export function getNav(): NavSection[] {
  const toc = getToc();
  const h2s = toc.filter((t) => t.depth === 2);
  const childrenOf = (id: string) => {
    const start = toc.findIndex((t) => t.id === id);
    const out: TocItem[] = [];
    for (const t of toc.slice(start + 1)) {
      if (t.depth === 2) break;
      out.push(t);
    }
    return out;
  };
  return navGroups.map((group) => ({
    title: group.title,
    items: group.items.map((item) => {
      const index = h2s.findIndex((h) => h.id === item.id);
      if (index === -1) throw new Error(`navGroups: no h2 with id "${item.id}" in tutorial.mdx`);
      return { ...item, index: index + 1, children: childrenOf(item.id) };
    }),
  }));
}

const countWords = (text: string) => text.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w)).length;

/**
 * Reading time, estimated at build time:
 * - prose at 250 words per minute,
 * - tables, trees, data-driven components and the collapsed troubleshooting
 *   answers at half that weight,
 * - code and terminal output at about two lines per second, since readers
 *   skim output rather than read it word by word.
 */
export function getReadingMinutes(): number {
  const raw = fs.readFileSync(tutorialPath, "utf8").replace(/\{\/\*[\s\S]*?\*\/\}/g, " ");

  // Terminal output passed to components as template literals counts as code.
  const literal = /\{`(?:\\`|[^`])*`\}/g;
  const literalLines = (raw.match(literal) ?? []).reduce((n, m) => n + m.split("\n").length, 0);
  let source = raw.replace(literal, " ");

  // Self-closing components that carry data in props (tables, trees, cards).
  const dataComponent = /<[A-Z][A-Za-z]*\s[^>]*\/>/g;
  const dataWords = (source.match(dataComponent) ?? []).reduce((n, m) => n + countWords(m), 0);
  source = source.replace(dataComponent, " ");

  // Troubleshooting answers sit in collapsed accordions: read on demand.
  const collapsed = /<Troubleshooting>[\s\S]*?<\/Troubleshooting>/g;
  const collapsedWords = (source.match(collapsed) ?? []).reduce((n, m) => n + countWords(m), 0);
  source = source.replace(collapsed, " ");

  const prose = proseLines(source)
    .join(" ")
    .replace(/<[^>]+>/g, " ");
  const codeLines = source.split("\n").length - proseLines(source).length + literalLines;

  return Math.max(
    1,
    Math.round(countWords(prose) / 250 + (dataWords + collapsedWords) / 500 + codeLines / 120),
  );
}
