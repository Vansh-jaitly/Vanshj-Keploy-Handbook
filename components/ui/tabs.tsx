"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "border-border text-muted-foreground flex h-auto w-full flex-wrap items-end justify-start gap-x-5 gap-y-1 border-b",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 data-[state=active]:border-foreground data-[state=active]:text-foreground -mb-px inline-flex items-center justify-center gap-1.5 border-b border-transparent py-2 text-[0.8125rem] font-medium whitespace-nowrap transition-colors focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "focus-visible:ring-ring/50 flex-1 rounded-md outline-none focus-visible:ring-[3px]",
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
