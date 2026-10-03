import { FileText, Folder } from "lucide-react";

import { cn } from "@/lib/utils";

export type TreeNode = {
  name: string;
  note?: string;
  badge?: string;
  badgeTone?: "mine" | "shipped";
  children?: TreeNode[];
};

function Node({ node }: { node: TreeNode }) {
  const isDir = Array.isArray(node.children);
  const Icon = isDir ? Folder : FileText;

  return (
    <li
      role="treeitem"
      aria-expanded={isDir ? true : undefined}
      aria-selected={false}
      className="m-0"
    >
      <div className="flex min-w-max items-center gap-2 py-0.5">
        <Icon
          aria-hidden="true"
          className={isDir ? "text-foreground size-3.5 shrink-0" : "text-faint size-3.5 shrink-0"}
        />
        <span className={isDir ? "font-medium" : undefined}>{node.name}</span>
        {node.badge ? (
          <span
            className={cn(
              "rounded-sm border px-1.5 py-px text-[0.625rem] tracking-wide uppercase",
              node.badgeTone === "mine"
                ? "border-success/40 text-success"
                : "border-border-strong text-muted-foreground",
            )}
          >
            {node.badge}
          </span>
        ) : null}
        {node.note ? <span className="text-faint text-xs">— {node.note}</span> : null}
      </div>
      {isDir && node.children!.length > 0 ? (
        <ul role="group" className="border-border ml-[0.4rem] border-l pl-4">
          {node.children!.map((child) => (
            <Node key={child.name} node={child} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTree({ items, label = "Files" }: { items: TreeNode[]; label?: string }) {
  return (
    <div className="bg-surface my-6 overflow-x-auto rounded-lg border px-5 py-4 font-mono text-[0.8125rem] leading-relaxed">
      <ul role="tree" aria-label={label} className="space-y-0">
        {items.map((node) => (
          <Node key={node.name} node={node} />
        ))}
      </ul>
    </div>
  );
}
