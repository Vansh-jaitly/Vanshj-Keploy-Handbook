"use client";

import { Children, isValidElement, type ReactNode } from "react";

import { Tabs as TabsRoot, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * MDX-friendly tabs: <Tabs labels={["A", "B"]}><Tab>…</Tab><Tab>…</Tab></Tabs>.
 * Arrow keys move between tabs (Radix handles roving focus).
 */
export function Tabs({
  labels,
  label,
  children,
}: {
  labels: string[];
  label?: string;
  children: ReactNode;
}) {
  const panels = Children.toArray(children).filter(isValidElement);
  const value = (i: number) => `tab-${i}`;

  return (
    <TabsRoot defaultValue={value(0)} className="my-6">
      <TabsList aria-label={label}>
        {labels.map((l, i) => (
          <TabsTrigger key={l} value={value(i)}>
            {l}
          </TabsTrigger>
        ))}
      </TabsList>
      {panels.map((panel, i) => (
        <TabsContent
          key={i}
          value={value(i)}
          className="tab-panel mt-4 space-y-3 [&>*:first-child]:mt-0"
        >
          {panel}
        </TabsContent>
      ))}
    </TabsRoot>
  );
}

export function Tab({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
