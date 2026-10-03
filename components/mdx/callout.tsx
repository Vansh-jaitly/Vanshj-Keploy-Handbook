import {
  Construction,
  Info,
  Lightbulb,
  OctagonAlert,
  Sparkles,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "info" | "tip" | "warning" | "danger" | "aha" | "stuck";

const variants: Record<Variant, { Icon: LucideIcon; label: string; rule: string; icon: string }> = {
  info: { Icon: Info, label: "Note", rule: "border-l-foreground", icon: "text-foreground" },
  tip: { Icon: Lightbulb, label: "Tip", rule: "border-l-success", icon: "text-success" },
  warning: {
    Icon: TriangleAlert,
    label: "Warning",
    rule: "border-l-warning",
    icon: "text-warning",
  },
  danger: {
    Icon: OctagonAlert,
    label: "Careful",
    rule: "border-l-destructive",
    icon: "text-destructive",
  },
  aha: { Icon: Sparkles, label: "A-ha", rule: "border-l-foreground", icon: "text-foreground" },
  stuck: {
    Icon: Construction,
    label: "Where I got stuck",
    rule: "border-l-warning",
    icon: "text-warning",
  },
};

/**
 * Aside with a hairline frame and a coloured left rule. The eyebrow names the
 * kind of note; the title says what it is about.
 */
export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: Variant;
  title?: string;
  children: ReactNode;
}) {
  const { Icon, label, rule, icon } = variants[type];

  return (
    <aside
      aria-label={title ?? label}
      className={cn("bg-surface my-7 rounded-r-md border border-l-2 px-5 py-4", rule)}
    >
      <p className="eyebrow flex items-center gap-1.5">
        <Icon aria-hidden="true" className={cn("size-3.5", icon)} />
        {label}
      </p>
      {title ? (
        <p className="text-foreground mt-1.5 text-[0.9375rem] font-semibold tracking-[-0.01em]">
          {title}
        </p>
      ) : null}
      <div className="mt-1.5 space-y-2.5 text-[0.9375rem] leading-relaxed [&_.code-block]:mt-3">
        {children}
      </div>
    </aside>
  );
}
