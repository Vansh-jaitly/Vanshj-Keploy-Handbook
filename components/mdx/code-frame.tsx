"use client";

import { useRef, type ReactNode } from "react";

import { CopyButton } from "./copy-button";

/**
 * Shared chrome for code blocks: a slim header with a language label, an
 * optional file title, and a copy button that copies exactly what is shown.
 */
export function CodeFrame({
  language,
  title,
  copyText,
  copyLabel,
  children,
}: {
  language?: string;
  title?: string;
  /** Fixed text to copy (e.g. only the commands of a terminal session). */
  copyText?: string;
  copyLabel?: string;
  children: ReactNode;
}) {
  const body = useRef<HTMLDivElement>(null);

  return (
    <div className="code-block">
      <div className="border-border flex h-9 items-center gap-3 border-b px-4">
        {language ? <span className="eyebrow shrink-0 normal-case">{language}</span> : null}
        {title ? (
          <span className="text-muted-foreground min-w-0 flex-1 truncate font-mono text-xs">
            {title}
          </span>
        ) : (
          <span className="flex-1" />
        )}
        <CopyButton
          label={copyLabel}
          getText={() => {
            if (copyText !== undefined) return copyText;
            const lines = body.current?.querySelectorAll("code [data-line]");
            if (!lines || lines.length === 0) return body.current?.textContent ?? "";
            return Array.from(lines, (line) => line.textContent ?? "").join("\n");
          }}
        />
      </div>
      <div ref={body}>{children}</div>
    </div>
  );
}
