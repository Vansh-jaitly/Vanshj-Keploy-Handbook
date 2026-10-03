"use client";

import type { NavSection } from "@/lib/content";
import { useActiveHeading } from "@/lib/use-active-heading";
import { cn } from "@/lib/utils";

/** Grouped section navigation. The active section expands to show its subsections. */
export function DocsSidebar({ nav, onNavigate }: { nav: NavSection[]; onNavigate?: () => void }) {
  const { section, sub } = useActiveHeading();

  return (
    <div className="space-y-8 text-[0.875rem]">
      {nav.map((group) => (
        <div key={group.title}>
          <p className="eyebrow mb-2.5 px-3">{group.title}</p>
          <ul className="space-y-px">
            {group.items.map((item) => {
              const isActive = section === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={onNavigate}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "group flex items-baseline gap-2.5 rounded-md border px-3 py-[0.4rem] leading-snug transition-colors",
                      isActive
                        ? "border-border-strong bg-ink-soft text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground border-transparent",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "font-mono text-[0.625rem] tabular-nums",
                        isActive ? "text-foreground" : "text-faint",
                      )}
                    >
                      {String(item.index).padStart(2, "0")}
                    </span>
                    {item.label}
                  </a>
                  {isActive && item.children.length > 0 ? (
                    <ul className="border-border mt-1.5 mb-2 ml-[1.35rem] space-y-px border-l pl-3">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <a
                            href={`#${child.id}`}
                            onClick={onNavigate}
                            aria-current={sub === child.id ? "location" : undefined}
                            className={cn(
                              "block rounded-sm py-[0.25rem] text-[0.8125rem] leading-snug transition-colors",
                              sub === child.id
                                ? "text-ink font-medium"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {child.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
