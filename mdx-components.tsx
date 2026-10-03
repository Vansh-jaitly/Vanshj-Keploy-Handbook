import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";

import { Callout } from "@/components/mdx/callout";
import { ArchitectureDiagram } from "@/components/mdx/architecture-diagram";
import { CodeBlock } from "@/components/mdx/code-block";
import { FileTree } from "@/components/mdx/file-tree";
import { HeroTerminal } from "@/components/mdx/hero-terminal";
import { Screenshot } from "@/components/mdx/misc";
import { RunSummary } from "@/components/mdx/run-summary";
import { Step, Steps } from "@/components/mdx/steps";
import { CompareTable, EndpointTable } from "@/components/mdx/tables";
import { Tab, Tabs } from "@/components/mdx/tabs";
import { Terminal } from "@/components/mdx/terminal";
import { Problem, Troubleshooting } from "@/components/mdx/troubleshooting";

const components: MDXComponents = {
  figure: (props: ComponentProps<"figure"> & { "data-rehype-pretty-code-figure"?: string }) =>
    "data-rehype-pretty-code-figure" in props ? <CodeBlock {...props} /> : <figure {...props} />,
  table: (props: ComponentProps<"table">) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),
  a: ({ href = "", ...props }: ComponentProps<"a">) =>
    href.startsWith("http") ? (
      <a href={href} target="_blank" rel="noreferrer" {...props} />
    ) : (
      <a href={href} {...props} />
    ),
  ArchitectureDiagram,
  Callout,
  CompareTable,
  EndpointTable,
  FileTree,
  HeroTerminal,
  Problem,
  RunSummary,
  Screenshot,
  Step,
  Steps,
  Tab,
  Tabs,
  Terminal,
  Troubleshooting,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
