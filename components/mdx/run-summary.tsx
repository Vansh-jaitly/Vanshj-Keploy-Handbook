import { CircleCheck, CircleX } from "lucide-react";

import { cn } from "@/lib/utils";

type Run = {
  title: string;
  description?: string;
  total: number;
  passed: number;
  failed: number;
  mocks?: number;
};

function RunRow({ run }: { run: Run }) {
  const ok = run.failed === 0;
  const stats: [string, number | string, string?][] = [
    ["Total", run.total],
    ["Passed", run.passed, "text-success"],
    ["Failed", run.failed, run.failed > 0 ? "text-destructive" : undefined],
    ["Mocks consumed", run.mocks ?? "not logged"],
  ];

  return (
    <div className="border-border border-b py-4 last:border-b-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-foreground text-sm font-semibold tracking-[-0.01em]">
          {run.title}
          {run.description ? (
            <span className="text-muted-foreground ml-2 font-mono text-xs font-normal">
              {run.description}
            </span>
          ) : null}
        </p>
        <p
          className={cn(
            "flex items-center gap-1.5 font-mono text-xs",
            ok ? "text-success" : "text-destructive",
          )}
        >
          {ok ? (
            <CircleCheck aria-hidden="true" className="size-3.5" />
          ) : (
            <CircleX aria-hidden="true" className="size-3.5" />
          )}
          {ok ? "all passed" : `${run.failed} failed`}
        </p>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-y-3 sm:grid-cols-4">
        {stats.map(([label, value, tone]) => (
          <div
            key={label}
            className="sm:border-border sm:border-l sm:pl-4 sm:first:border-l-0 sm:first:pl-0"
          >
            <dt className="eyebrow">{label}</dt>
            <dd
              className={cn(
                "mt-1 font-mono text-xl tracking-tight tabular-nums",
                typeof value === "string"
                  ? "text-muted-foreground pt-1 text-sm"
                  : "text-foreground",
                tone,
              )}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Replay results, one row per run. Numbers come straight from the run log. */
export function RunSummary({ runs }: { runs: Run[] }) {
  return (
    <div className="border-border my-7 border-y">
      {runs.map((run) => (
        <RunRow key={run.title} run={run} />
      ))}
    </div>
  );
}
