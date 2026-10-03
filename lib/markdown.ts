import fs from "node:fs";
import path from "node:path";

import type { Code, Heading, PhrasingContent, Root, RootContent, Table, TableCell } from "mdast";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";

import { diagramMarkdown } from "@/components/mdx/architecture-diagram";
import type { TreeNode } from "@/components/mdx/file-tree";
import { site, siteUrl } from "@/lib/site";

/*
 * Turns content/tutorial.mdx into plain Markdown at build time. Every custom
 * MDX component is mapped to a Markdown equivalent, so the copyable page and
 * the rendered page come from the same source file.
 */

type JsxNode = {
  type: "mdxJsxFlowElement" | "mdxJsxTextElement";
  name: string | null;
  attributes: { type: string; name: string; value: unknown }[];
  children: RootContent[];
};

const text = (value: string) => ({ type: "text", value }) as const;
const paragraph = (...children: PhrasingContent[]): RootContent => ({
  type: "paragraph",
  children,
});
const strong = (value: string): PhrasingContent => ({ type: "strong", children: [text(value)] });
const code = (value: string, lang = "text"): Code => ({ type: "code", lang, value });
const heading = (depth: Heading["depth"], value: string): RootContent => ({
  type: "heading",
  depth,
  children: [text(value)],
});

function cell(value: string): TableCell {
  return { type: "tableCell", children: value ? [text(value)] : [] };
}
function table(header: string[], rows: string[][]): Table {
  return {
    type: "table",
    children: [header, ...rows].map((r) => ({ type: "tableRow", children: r.map(cell) })),
  };
}

/** Attribute values are either strings or JS expressions written in our own content. */
function props(node: JsxNode): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const attr of node.attributes) {
    if (attr.type !== "mdxJsxAttribute") continue;
    const v = attr.value as string | { value: string } | null;
    out[attr.name] =
      v && typeof v === "object" ? new Function(`return (${v.value});`)() : (v ?? true);
  }
  return out;
}

/** Text passed as {`...`} children, e.g. terminal output. */
function literalChildren(node: JsxNode): string {
  return node.children
    .map((child) => {
      const value = (child as { value?: string }).value;
      if (child.type === ("mdxFlowExpression" as string) && value) {
        return String(new Function(`return (${value});`)());
      }
      return "";
    })
    .join("")
    .replace(/^\n+|\s+$/g, "");
}

function renderTree(nodes: TreeNode[], prefix = ""): string[] {
  return nodes.flatMap((node, i) => {
    const last = i === nodes.length - 1;
    const notes = [node.badge, node.note].filter(Boolean).join(", ");
    const line = `${prefix}${last ? "└── " : "├── "}${node.name}${notes ? `   <- ${notes}` : ""}`;
    const children = node.children
      ? renderTree(node.children, prefix + (last ? "    " : "│   "))
      : [];
    return [line, ...children];
  });
}

function absolute(src: string): string {
  return src.startsWith("/") ? `${siteUrl}${src}` : src;
}

function transformJsx(node: JsxNode): RootContent[] {
  const p = props(node);
  const inner = () => transformAll(node.children);

  switch (node.name) {
    case "HeroTerminal":
      return [];
    case "Callout":
      return [
        {
          type: "blockquote",
          children: [paragraph(strong(String(p.title ?? "Note"))), ...inner()],
        } as RootContent,
      ];
    case "Terminal": {
      const title = String(p.title ?? "");
      return [
        ...(title ? [paragraph({ type: "emphasis", children: [text(title)] })] : []),
        code(literalChildren(node), "console"),
      ];
    }
    case "Tabs": {
      const labels = (p.labels as string[]) ?? [];
      const tabs = node.children.filter((c) => (c as unknown as JsxNode).name === "Tab");
      return tabs.flatMap((tab, i) => [
        paragraph(strong(labels[i] ?? `Option ${i + 1}`)),
        ...transformAll((tab as unknown as JsxNode).children),
      ]);
    }
    case "Steps": {
      let n = 0;
      return node.children.flatMap((child) => {
        const step = child as unknown as JsxNode;
        if (step.name !== "Step") return [];
        n += 1;
        return [heading(3, `${n}. ${String(props(step).title)}`), ...transformAll(step.children)];
      });
    }
    case "EndpointTable": {
      const rows = p.rows as { method: string; path: string; response: string; quirk?: string }[];
      return [
        table(
          ["Request", "Response", "Worth knowing"],
          rows.map((r) => [`${r.method} ${r.path}`, r.response, r.quirk ?? ""]),
        ),
      ];
    }
    case "CompareTable": {
      const rows = p.rows as { topic: string; docs: string; mine: string }[];
      return [
        table(
          ["", "Quickstart says", "What I found"],
          rows.map((r) => [r.topic, r.docs, r.mine]),
        ),
      ];
    }
    case "FileTree": {
      const items = p.items as TreeNode[];
      const [root] = items;
      return [code([root.name, ...renderTree(root.children ?? [])].join("\n"))];
    }
    case "ArchitectureDiagram":
      return (unified().use(remarkParse).parse(diagramMarkdown) as Root).children;
    case "RunSummary": {
      const runs = p.runs as {
        title: string;
        total: number;
        passed: number;
        failed: number;
        mocks?: number;
      }[];
      return [
        table(
          ["Run", "Total", "Passed", "Failed", "Mocks consumed"],
          runs.map((r) => [
            r.title,
            String(r.total),
            String(r.passed),
            String(r.failed),
            r.mocks === undefined ? "not logged" : String(r.mocks),
          ]),
        ),
      ];
    }
    case "Screenshot":
      return [
        paragraph({ type: "image", url: absolute(String(p.src)), alt: String(p.alt) }),
        paragraph({ type: "emphasis", children: [text(String(p.caption))] }),
      ];
    case "Troubleshooting":
      return inner();
    case "Problem":
      return [heading(3, String(p.title)), code(String(p.error)), ...inner()];
    default:
      return inner();
  }
}

function transformAll(nodes: RootContent[]): RootContent[] {
  return nodes.flatMap((node): RootContent[] => {
    const type = node.type as string;
    if (type === "mdxFlowExpression" || type === "mdxjsEsm" || type === "mdxTextExpression") {
      return [];
    }
    if (type === "mdxJsxFlowElement" || type === "mdxJsxTextElement") {
      return transformJsx(node as unknown as JsxNode);
    }
    if (node.type === "code") {
      // Keep the language; turn a file-path title into a caption line.
      const title = /title="([^"]+)"/.exec(node.meta ?? "")?.[1];
      const clean: Code = { type: "code", lang: node.lang, value: node.value };
      return title && /[./]/.test(title)
        ? [paragraph({ type: "inlineCode", value: title }), clean]
        : [clean];
    }
    if ("children" in node && Array.isArray(node.children)) {
      return [{ ...node, children: transformAll(node.children as RootContent[]) } as RootContent];
    }
    return [node];
  });
}

export function tutorialMarkdown(): string {
  const source = fs.readFileSync(path.join(process.cwd(), "content", "tutorial.mdx"), "utf8");
  const tree = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).parse(source) as Root;
  // Stringify without the MDX extension so braces and angle brackets are not escaped.
  const processor = unified().use(remarkGfm).use(remarkStringify, {
    bullet: "-",
    fence: "`",
    fences: true,
    emphasis: "_",
    rule: "-",
    listItemIndent: "one",
  });

  const body: Root = { type: "root", children: transformAll(tree.children) };

  const front = [
    `# ${site.title}`,
    "",
    `_${site.tagline}_`,
    "",
    `> ${site.description}`,
    "",
    `By ${site.author} · ${site.date} · Tested with ${site.testedWith.join(", ")}`,
    "",
  ].join("\n");

  return `${front}\n${processor.stringify(body).trim()}\n`;
}
