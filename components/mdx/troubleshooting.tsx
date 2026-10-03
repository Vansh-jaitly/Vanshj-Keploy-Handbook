"use client";

import { Search } from "lucide-react";
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useId,
  useState,
  type ReactNode,
} from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ProblemProps = { title: string; error: string; children: ReactNode };

const QueryContext = createContext("");

function matches(query: string, p: Pick<ProblemProps, "title" | "error">) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return `${p.title}\n${p.error}`.toLowerCase().includes(q);
}

/**
 * Accordion of real problems. The filter box matches against the title and
 * the exact error text, so pasting an error message finds its fix.
 */
export function Troubleshooting({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const items = Children.toArray(children).filter(isValidElement<ProblemProps>);
  const visible = items.filter((el) => matches(query, el.props)).length;

  return (
    <div className="border-border my-7 rounded-lg border">
      <div className="bg-surface rounded-t-lg border-b p-3">
        <label htmlFor={inputId} className="sr-only">
          Filter problems by error text
        </label>
        <div className="relative">
          <Search
            aria-hidden="true"
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
          />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Paste an error message to filter…"
            className="bg-background placeholder:text-muted-foreground focus-visible:ring-ring/50 h-9 w-full rounded-md border pr-3 pl-8 text-sm outline-none focus-visible:ring-[3px]"
          />
        </div>
        <p aria-live="polite" className="eyebrow mt-2.5 tracking-normal normal-case">
          {query.trim()
            ? `${visible} of ${items.length} problems match`
            : `${items.length} problems`}
        </p>
      </div>
      <QueryContext.Provider value={query}>
        <Accordion type="multiple" className="px-4">
          {children}
        </Accordion>
      </QueryContext.Provider>
      {visible === 0 ? (
        <p className="text-muted-foreground px-4 pb-4 text-sm">
          No match. Try a shorter piece of the error.
        </p>
      ) : null}
    </div>
  );
}

export function Problem({ title, error, children }: ProblemProps) {
  const query = useContext(QueryContext);
  if (!matches(query, { title, error })) return null;

  return (
    <AccordionItem value={title}>
      <AccordionTrigger className="text-[0.9375rem] hover:no-underline">{title}</AccordionTrigger>
      <AccordionContent className="space-y-3 text-[0.95rem] leading-relaxed">
        <div>
          <p className="eyebrow mb-1.5">What I saw</p>
          <pre className="bg-surface text-destructive border-l-destructive overflow-x-auto rounded-r-md border border-l-2 px-3 py-2 font-mono text-[0.8rem] leading-relaxed">
            <code>{error}</code>
          </pre>
        </div>
        <div className="problem-body space-y-2">{children}</div>
      </AccordionContent>
    </AccordionItem>
  );
}
