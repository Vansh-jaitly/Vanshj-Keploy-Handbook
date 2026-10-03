import type { ReactNode } from "react";

export function Steps({ children }: { children: ReactNode }) {
  return <ol className="my-10 [counter-reset:step]">{children}</ol>;
}

/** One numbered step. The number sits on a hairline that runs to the next step. */
export function Step({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li className="after:bg-border before:bg-background before:text-foreground relative pb-10 pl-11 [counter-increment:step] before:absolute before:top-0.5 before:left-0 before:flex before:h-6 before:w-7 before:items-center before:justify-center before:rounded before:border before:font-mono before:text-[0.6875rem] before:content-[counter(step,decimal-leading-zero)] after:absolute after:top-8 after:bottom-2 after:left-3.5 after:w-px last:pb-0 last:after:hidden">
      <h3 className="text-foreground text-base leading-7 font-semibold tracking-[-0.012em]">
        {title}
      </h3>
      <div className="mt-2 space-y-3">{children}</div>
    </li>
  );
}
