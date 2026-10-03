"use client";

import { Check, Copy, TriangleAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const MARKDOWN_URL = "/tutorial.md";

type Status = "idle" | "copied" | "error";

let cached: Promise<string> | null = null;
function loadMarkdown(): Promise<string> {
  cached ??= fetch(MARKDOWN_URL).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  });
  cached.catch(() => {
    cached = null;
  });
  return cached;
}

async function copyMarkdown() {
  // ClipboardItem with a pending promise keeps the user gesture alive in
  // Safari while the static file loads; other browsers take the text path.
  if (typeof ClipboardItem !== "undefined" && "write" in navigator.clipboard) {
    try {
      const blob = loadMarkdown().then((t) => new Blob([t], { type: "text/plain" }));
      await navigator.clipboard.write([new ClipboardItem({ "text/plain": blob })]);
      return;
    } catch {
      // fall through to writeText
    }
  }
  await navigator.clipboard.writeText(await loadMarkdown());
}

/**
 * Copies the whole tutorial as Markdown. The Markdown is generated at build
 * time from content/tutorial.mdx and served as the static file /tutorial.md.
 */
export function CopyPageButton({
  className,
  compact = false,
}: {
  className?: string;
  /** Short label for narrow spots; the accessible name stays complete. */
  compact?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function onClick() {
    try {
      await copyMarkdown();
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  }

  const Icon = status === "copied" ? Check : status === "error" ? TriangleAlert : Copy;
  const label =
    status === "copied"
      ? "Copied!"
      : status === "error"
        ? "Copy failed"
        : compact
          ? "Copy page"
          : "Copy page as Markdown";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={compact && status === "idle" ? "Copy page as Markdown" : undefined}
      onPointerEnter={() => void loadMarkdown().catch(() => {})}
      onFocus={() => void loadMarkdown().catch(() => {})}
      className={cn(
        "border-border bg-background text-foreground hover:bg-surface-2 inline-flex h-8 items-center gap-2 rounded-md border px-3 text-[0.8125rem] font-medium transition-colors",
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          "size-3.5",
          status === "copied" && "text-success",
          status === "error" && "text-destructive",
        )}
      />
      <span aria-live="polite">{label}</span>
    </button>
  );
}
