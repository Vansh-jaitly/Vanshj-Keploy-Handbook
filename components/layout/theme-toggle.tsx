"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMounted } from "@/lib/use-mounted";

const order = ["light", "dark", "system"] as const;
type Mode = (typeof order)[number];

const meta: Record<Mode, { label: string; Icon: typeof Sun }> = {
  light: { label: "Light", Icon: Sun },
  dark: { label: "Dark", Icon: Moon },
  system: { label: "System", Icon: Monitor },
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const current: Mode = mounted && order.includes(theme as Mode) ? (theme as Mode) : "system";
  const next = order[(order.indexOf(current) + 1) % order.length];
  const { Icon, label } = meta[current];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground size-8"
          onClick={() => setTheme(next)}
          aria-label={`Theme: ${label}. Switch to ${meta[next].label}.`}
        >
          <Icon aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Theme: {label} (click for {meta[next].label.toLowerCase()})
      </TooltipContent>
    </Tooltip>
  );
}
