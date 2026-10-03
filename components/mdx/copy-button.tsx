"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/** Pass `text` from server components, or `getText` to read it lazily on the client. */
export function CopyButton({
  text,
  getText,
  label = "Copy code",
  className,
}: {
  text?: string;
  getText?: () => string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(getText ? getText() : (text ?? ""));
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : label}
      className={cn(
        "text-muted-foreground hover:text-foreground hover:bg-surface-2 -mr-1.5 inline-flex h-6 items-center gap-1.5 rounded px-1.5 font-sans text-xs transition-colors",
        className,
      )}
    >
      {copied ? (
        <Check className="text-success size-3.5" aria-hidden="true" />
      ) : (
        <Copy className="size-3.5" aria-hidden="true" />
      )}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
