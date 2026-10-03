type Variant = "app" | "keploy" | "file" | "off" | "result";

type Box = {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  variant?: Variant;
};

type Arrow = { from: [number, number]; to: [number, number]; dashed?: boolean; label?: string };

type Lane = { index: string; title: string; caption: string; x: number; y: number };

type Layout = { viewBox: string; lanes: Lane[]; boxes: Box[]; arrows: Arrow[]; rules: number[] };

const styles: Record<
  Variant,
  { fill: string; stroke: string; text: string; sub: string; dash?: string }
> = {
  app: {
    fill: "var(--background)",
    stroke: "var(--border-strong)",
    text: "var(--foreground)",
    sub: "var(--muted-foreground)",
  },
  keploy: {
    fill: "var(--foreground)",
    stroke: "var(--foreground)",
    text: "var(--background)",
    sub: "color-mix(in oklab, var(--background) 70%, var(--foreground))",
  },
  file: {
    fill: "var(--surface)",
    stroke: "var(--faint)",
    text: "var(--foreground)",
    sub: "var(--muted-foreground)",
    dash: "3 3",
  },
  off: {
    fill: "transparent",
    stroke: "var(--faint)",
    text: "var(--faint)",
    sub: "var(--faint)",
    dash: "3 4",
  },
  result: {
    fill: "var(--surface)",
    stroke: "var(--success)",
    text: "var(--foreground)",
    sub: "var(--success)",
  },
};

/* ---------------- wide layout: two horizontal lanes ---------------- */
const W = 136;
const H = 52;
const col = (i: number) => 16 + i * 156;
const mid = (i: number) => col(i) + W / 2;

const wide: Layout = {
  viewBox: "0 0 800 420",
  rules: [204],
  lanes: [
    { index: "01", title: "RECORD", caption: "you use the app, Keploy listens", x: 16, y: 22 },
    { index: "02", title: "REPLAY", caption: "Keploy plays it back, no database", x: 16, y: 232 },
  ],
  boxes: [
    { x: col(0), y: 42, w: W, h: H, label: "Developer", sub: "curl / browser" },
    { x: col(1), y: 42, w: W, h: H, label: "Keploy", sub: "port 8082 → 43635", variant: "keploy" },
    { x: col(2), y: 42, w: W, h: H, label: "Echo Go API", sub: "no Keploy SDK" },
    {
      x: col(3),
      y: 42,
      w: W,
      h: H,
      label: "Keploy proxy",
      sub: "DNS + port 16789",
      variant: "keploy",
    },
    { x: col(4), y: 42, w: W, h: H, label: "PostgreSQL", sub: "Docker, port 5432" },
    { x: col(1), y: 128, w: W, h: 44, label: "tests/*.yaml", sub: "8 test cases", variant: "file" },
    { x: col(3), y: 128, w: W, h: 44, label: "mocks.yaml", sub: "22 mocks", variant: "file" },

    {
      x: col(0),
      y: 252,
      w: W,
      h: H,
      label: "tests/*.yaml",
      sub: "recorded requests",
      variant: "file",
    },
    { x: col(1), y: 252, w: W, h: H, label: "Keploy", sub: "sends + compares", variant: "keploy" },
    { x: col(2), y: 252, w: W, h: H, label: "Echo Go API", sub: "same binary" },
    {
      x: col(3),
      y: 252,
      w: W,
      h: H,
      label: "Keploy proxy",
      sub: "answers from mocks",
      variant: "keploy",
    },
    { x: col(4), y: 252, w: W, h: H, label: "PostgreSQL", sub: "not needed", variant: "off" },
    {
      x: col(1),
      y: 340,
      w: W,
      h: 48,
      label: "Verdict",
      sub: "pass or fail",
      variant: "result",
    },
    {
      x: col(3),
      y: 340,
      w: W,
      h: 48,
      label: "mocks.yaml",
      sub: "recorded replies",
      variant: "file",
    },
  ],
  arrows: [
    { from: [col(0) + W, 68], to: [col(1), 68] },
    { from: [col(1) + W, 68], to: [col(2), 68] },
    { from: [col(2) + W, 68], to: [col(3), 68] },
    { from: [col(3) + W, 68], to: [col(4), 68] },
    { from: [mid(1), 94], to: [mid(1), 128] },
    { from: [mid(3), 94], to: [mid(3), 128] },

    { from: [col(0) + W, 278], to: [col(1), 278] },
    { from: [col(1) + W, 278], to: [col(2), 278] },
    { from: [col(2) + W, 278], to: [col(3), 278] },
    { from: [col(3) + W, 278], to: [col(4), 278], dashed: true },
    { from: [mid(1), 304], to: [mid(1), 340] },
    { from: [mid(3), 340], to: [mid(3), 304] },
  ],
};

/* ---------------- narrow layout: two vertical lanes ---------------- */
const NW = 148;
const NH = 48;
const row = (i: number) => 58 + i * 70;
const nx = (lane: 0 | 1) => (lane === 0 ? 8 : 178);
const ncx = (lane: 0 | 1) => nx(lane) + NW / 2;

const narrowBoxes = (lane: 0 | 1, items: Omit<Box, "x" | "y" | "w" | "h">[]): Box[] =>
  items.map((b, i) => ({ ...b, x: nx(lane), y: row(i), w: NW, h: NH }));

const narrow: Layout = {
  viewBox: "0 0 340 480",
  rules: [],
  lanes: [
    { index: "01", title: "RECORD", caption: "Keploy listens", x: 8, y: 22 },
    { index: "02", title: "REPLAY", caption: "no database", x: 178, y: 22 },
  ],
  boxes: [
    ...narrowBoxes(0, [
      { label: "Developer", sub: "curl / browser" },
      { label: "Keploy", sub: "writes 8 tests", variant: "keploy" },
      { label: "Echo Go API", sub: "no Keploy SDK" },
      { label: "Keploy proxy", sub: "writes 22 mocks", variant: "keploy" },
      { label: "PostgreSQL", sub: "Docker" },
    ]),
    ...narrowBoxes(1, [
      { label: "tests/*.yaml", sub: "recorded requests", variant: "file" },
      { label: "Keploy", sub: "sends + compares", variant: "keploy" },
      { label: "Echo Go API", sub: "same binary" },
      { label: "Keploy proxy", sub: "answers from mocks", variant: "keploy" },
      { label: "PostgreSQL", sub: "not needed", variant: "off" },
      { label: "Verdict", sub: "pass / fail", variant: "result" },
    ]),
  ],
  arrows: [
    ...[0, 1, 2, 3].map((i): Arrow => ({ from: [ncx(0), row(i) + NH], to: [ncx(0), row(i + 1)] })),
    ...[0, 1, 2].map((i): Arrow => ({ from: [ncx(1), row(i) + NH], to: [ncx(1), row(i + 1)] })),
    { from: [ncx(1), row(3) + NH], to: [ncx(1), row(4)], dashed: true },
    // verdict comes from Keploy's comparison, routed around the right edge
  ],
};

function Diagram({ layout, id, className }: { layout: Layout; id: string; className: string }) {
  const marker = `${id}-arrow`;
  const isNarrow = id.includes("narrow");
  return (
    <svg
      viewBox={layout.viewBox}
      className={className}
      aria-hidden="true"
      focusable="false"
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      <defs>
        <marker
          id={marker}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M0,1 L9,5 L0,9"
            fill="none"
            strokeWidth={1.6}
            style={{ stroke: "var(--muted-foreground)" }}
          />
        </marker>
      </defs>

      {layout.rules.map((y) => (
        <line
          key={y}
          x1={0}
          x2={800}
          y1={y}
          y2={y}
          strokeDasharray="2 4"
          style={{ stroke: "var(--border-strong)" }}
        />
      ))}

      {layout.lanes.map((lane) => (
        <text
          key={lane.title}
          x={lane.x}
          y={lane.y}
          fontSize={isNarrow ? 10.5 : 12}
          letterSpacing="0.08em"
        >
          <tspan style={{ fill: "var(--faint)", fontFamily: "var(--font-geist-mono), monospace" }}>
            {lane.index}
          </tspan>
          <tspan
            dx={8}
            fontWeight={600}
            style={{ fill: "var(--foreground)", fontFamily: "var(--font-geist-mono), monospace" }}
          >
            {lane.title}
          </tspan>
          {isNarrow ? null : (
            <tspan
              dx={10}
              letterSpacing="0"
              fontSize={13}
              style={{ fill: "var(--muted-foreground)" }}
            >
              {lane.caption}
            </tspan>
          )}
        </text>
      ))}

      {layout.arrows.map((a, i) => (
        <line
          key={i}
          x1={a.from[0]}
          y1={a.from[1]}
          x2={a.to[0]}
          y2={a.to[1]}
          strokeWidth={1.25}
          strokeDasharray={a.dashed ? "2 4" : undefined}
          markerEnd={a.dashed ? undefined : `url(#${marker})`}
          style={{ stroke: "var(--muted-foreground)" }}
        />
      ))}

      {isNarrow ? (
        <path
          d={`M ${nx(1) + NW} ${row(1) + NH / 2} h 10 V ${row(5) + NH / 2} h -10`}
          fill="none"
          strokeWidth={1.25}
          markerEnd={`url(#${marker})`}
          style={{ stroke: "var(--muted-foreground)" }}
        />
      ) : null}

      {layout.boxes.map((b, i) => {
        const s = styles[b.variant ?? "app"];
        const cx = b.x + b.w / 2;
        const labelY = b.sub ? b.y + b.h / 2 - 3 : b.y + b.h / 2 + 4;
        return (
          <g key={i}>
            <rect
              x={b.x + 0.5}
              y={b.y + 0.5}
              width={b.w - 1}
              height={b.h - 1}
              rx={6}
              strokeWidth={1}
              strokeDasharray={s.dash}
              style={{ fill: s.fill, stroke: s.stroke }}
            />
            <text
              x={cx}
              y={labelY}
              fontSize={isNarrow ? 12.5 : 14}
              fontWeight={600}
              textAnchor="middle"
              style={{ fill: s.text }}
            >
              {b.label}
            </text>
            {b.sub ? (
              <text
                x={cx}
                y={b.y + b.h / 2 + 14}
                fontSize={isNarrow ? 10 : 11}
                textAnchor="middle"
                style={{ fill: s.sub, fontFamily: "var(--font-geist-mono), monospace" }}
              >
                {b.sub}
              </text>
            ) : null}
            {b.variant === "off" ? (
              <line
                x1={cx - 38}
                x2={cx + 38}
                y1={labelY - 4}
                y2={labelY - 4}
                strokeWidth={1.25}
                style={{ stroke: "var(--destructive)" }}
              />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

/** Markdown version of the diagram, used by "Copy page as Markdown". */
export const diagramMarkdown = `**Record** (you use the app, Keploy listens)

1. You send requests with curl or a browser to port 8082.
2. Keploy forwards them to the Echo Go API (port 43635, no Keploy SDK) and writes each request and response as a test in \`tests/*.yaml\`.
3. The app's PostgreSQL traffic goes through the Keploy proxy, which writes each exchange to \`mocks.yaml\`.

**Replay** (Keploy plays it back, no database)

1. Keploy sends the recorded requests to the same binary and compares each response with the recorded one.
2. The Keploy proxy answers every database call from \`mocks.yaml\`, so PostgreSQL is not needed.
3. Each test gets a pass or fail verdict.`;

/** Plain-text version of the diagram, used for the accessible label. */
export const diagramSummary =
  "Record: a developer sends requests with curl or a browser to port 8082. Keploy forwards them to the Echo Go API (which has no Keploy SDK) and writes each request and response as a test in tests/*.yaml. The app's PostgreSQL traffic passes through the Keploy proxy, which writes each exchange to mocks.yaml. Replay: Keploy sends the recorded requests to the same binary and compares the responses, while the Keploy proxy answers every database call from mocks.yaml, so PostgreSQL is not needed. Each test gets a pass or fail verdict.";

export function ArchitectureDiagram() {
  return (
    <figure className="my-10">
      <div role="img" aria-label={diagramSummary} className="border-border border-y py-6">
        <Diagram layout={wide} id="arch-wide" className="hidden h-auto w-full sm:block" />
        <Diagram
          layout={narrow}
          id="arch-narrow"
          className="mx-auto block h-auto w-full max-w-sm sm:hidden"
        />
      </div>
      <figcaption className="text-muted-foreground mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[0.8125rem]">
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="bg-foreground inline-block size-2.5 rounded-[2px]" />
          Keploy
        </span>
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="border-faint inline-block size-2.5 rounded-[2px] border border-dashed"
          />
          files Keploy writes
        </span>
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="border-border-strong inline-block size-2.5 rounded-[2px] border"
          />
          your stack
        </span>
      </figcaption>
    </figure>
  );
}
