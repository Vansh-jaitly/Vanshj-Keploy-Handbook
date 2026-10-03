import { Children, isValidElement, type ComponentProps, type ReactNode } from "react";

import { CodeFrame } from "./code-frame";

type ElementProps = { children?: ReactNode; "data-language"?: string } & Record<string, unknown>;

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<ElementProps>(node)) return textOf(node.props.children);
  return "";
}

const languageNames: Record<string, string> = { text: "output", diff: "diff" };

/**
 * Replaces the <figure> rehype-pretty-code emits. Reads the language and the
 * title from its children at render time (on the server) and hands the
 * highlighted <pre> to CodeFrame.
 */
export function CodeBlock({ children }: ComponentProps<"figure">) {
  const parts = Children.toArray(children).filter(isValidElement<ElementProps>);
  const caption = parts.find((p) => "data-rehype-pretty-code-title" in p.props);
  const pre = parts.find((p) => p !== caption);
  const raw = pre?.props["data-language"];
  const language = raw ? (languageNames[raw] ?? raw) : undefined;

  return (
    <CodeFrame language={language} title={caption ? textOf(caption.props.children) : undefined}>
      {pre}
    </CodeFrame>
  );
}
