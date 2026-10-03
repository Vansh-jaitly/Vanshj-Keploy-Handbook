"use client";

import { RotateCcw, SkipForward } from "lucide-react";
import { useEffect, useReducer, useRef } from "react";

import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

type Tone = "plain" | "pass" | "fail" | "dim";
type Line = { kind: "cmd" | "out" | "note"; text: string; tone?: Tone };
type Scene = { label: string; summary: string; section: string; lines: Line[] };

const keployTest =
  'sudo env "PATH=$PATH" keploy test -c "./echo-psql-url-shortener" --test-sets test-set-1 --delay 10';

// Every output line below is copied (and trimmed) from my real run log.
// Lines starting with "#" are my own annotations, not program output.
const scenes: Scene[] = [
  {
    label: "Record",
    summary: "Record: 7 curl calls and one browser visit become 8 test cases.",
    section: "record-real-traffic",
    lines: [
      { kind: "cmd", text: 'sudo env "PATH=$PATH" keploy record -c "./echo-psql-url-shortener"' },
      { kind: "out", text: "INFO    Keploy agent is ready to record test cases and mocks." },
      { kind: "out", text: "⇨ http server started on [::]:43635" },
      {
        kind: "out",
        text: 'INFO    Started ingress forwarding  {"orig_port": 8082, "new_port": 43635}',
      },
      { kind: "note", text: "# 7 curl calls and 1 browser visit later:" },
      ...[
        "post-url-1",
        "get-4kepjktt-1",
        "post-url-2",
        "post-url-3",
        "get-4kepjktt-2",
        "get-doesnotexist-1",
        "put-4kepjktt-1",
        "delete-4kepjktt-1",
      ].map((name): Line => ({ kind: "out", text: `INFO 🟠 ... "testcase name": "${name}"` })),
      { kind: "note", text: "# 8 test cases captured", tone: "pass" },
    ],
  },
  {
    label: "Replay",
    summary: "Replay with Postgres running: 8 of 8 tests passed.",
    section: "replay-the-tests",
    lines: [
      { kind: "cmd", text: keployTest },
      {
        kind: "out",
        text: 'INFO result  {"testcase id": "post-url-1", "testset id": "test-set-1", "passed": "true"}',
        tone: "pass",
      },
      { kind: "out", text: "... (same for all 8) ...", tone: "dim" },
      { kind: "out", text: 'TESTRUN SUMMARY. For test-set: "test-set-1"' },
      { kind: "out", text: "      Total tests:        8" },
      { kind: "out", text: "      Total test passed:  8", tone: "pass" },
      { kind: "out", text: "      Total test failed:  0", tone: "pass" },
    ],
  },
  {
    label: "Database off",
    summary: "Postgres stopped with docker compose down: still 8 of 8 passed.",
    section: "the-a-ha-database-off-still-green",
    lines: [
      { kind: "cmd", text: "docker compose down" },
      { kind: "out", text: " ✔ Container postgresDb       Removed" },
      { kind: "cmd", text: "docker ps" },
      {
        kind: "out",
        text: "CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES",
      },
      { kind: "note", text: "# no containers. Same replay command:" },
      { kind: "cmd", text: keployTest },
      { kind: "out", text: "      Total tests:        8" },
      { kind: "out", text: "      Total test passed:  8", tone: "pass" },
      { kind: "out", text: "      Total test failed:  0", tone: "pass" },
      { kind: "out", text: '{"testsRan": 8, "mocksConsumed": 11, ...}', tone: "dim" },
    ],
  },
  {
    label: "Break it",
    summary: "Change 308 to 307: exactly the two redirect tests fail, 6 pass.",
    section: "break-it-on-purpose",
    lines: [
      { kind: "note", text: "# handler.go: StatusPermanentRedirect → StatusTemporaryRedirect" },
      { kind: "cmd", text: "go build -o echo-psql-url-shortener" },
      { kind: "cmd", text: keployTest },
      { kind: "out", text: 'Testrun failed for testcase with id: "get-4kepjktt-1"', tone: "fail" },
      { kind: "out", text: "│  EXPECT STATUS  │  ACTUAL STATUS  │" },
      { kind: "out", text: "│       308       │       307       │", tone: "fail" },
      { kind: "out", text: 'Testrun failed for testcase with id: "get-4kepjktt-2"', tone: "fail" },
      { kind: "out", text: "      Total tests: 8" },
      { kind: "out", text: "      Total test passed: 6", tone: "pass" },
      { kind: "out", text: "      Total test failed: 2", tone: "fail" },
    ],
  },
];

type State = { scene: number; line: number; chars: number; playing: boolean };
type Action =
  | { type: "tick" }
  | { type: "goto"; scene: number; final: boolean }
  | { type: "finish" }
  | { type: "restart"; final: boolean };

const sceneEnd = (scene: number): State => ({
  scene,
  line: scenes[scene].lines.length,
  chars: 0,
  playing: false,
});

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "goto":
      return action.final
        ? sceneEnd(action.scene)
        : { scene: action.scene, line: 0, chars: 0, playing: true };
    case "restart":
      return action.final ? sceneEnd(0) : { scene: 0, line: 0, chars: 0, playing: true };
    case "finish":
      return sceneEnd(state.scene);
    case "tick": {
      const lines = scenes[state.scene].lines;
      if (state.line >= lines.length) {
        // Scene done: move on, or stop after the last scene.
        if (state.scene < scenes.length - 1)
          return { scene: state.scene + 1, line: 0, chars: 0, playing: true };
        return { ...state, playing: false };
      }
      const current = lines[state.line];
      if (current.kind === "cmd" && state.chars < current.text.length) {
        return { ...state, chars: state.chars + 2 };
      }
      return { ...state, line: state.line + 1, chars: 0 };
    }
  }
}

function delayFor(state: State): number {
  const lines = scenes[state.scene].lines;
  if (state.line >= lines.length) return 2600;
  const current = lines[state.line];
  if (current.kind === "cmd") return state.chars < current.text.length ? 28 : 420;
  return current.kind === "note" ? 520 : 150;
}

const toneClass: Record<Tone, string> = {
  plain: "text-term-fg",
  pass: "text-success",
  fail: "text-destructive",
  dim: "text-term-dim",
};

export function HeroTerminal() {
  const reduced = useReducedMotion();
  const [state, dispatch] = useReducer(reducer, { scene: 0, line: 0, chars: 0, playing: true });

  const playing = state.playing && !reduced;
  // With reduced motion, every scene is shown in its final state.
  const view = reduced ? sceneEnd(state.scene) : state;

  // Keep the newest line in view, like a real terminal.
  const screen = useRef<HTMLPreElement>(null);
  useEffect(() => {
    const el = screen.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [view.scene, view.line, view.chars]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => dispatch({ type: "tick" }), delayFor(state));
    return () => window.clearTimeout(id);
  }, [state, playing]);

  const scene = scenes[view.scene];
  const visible = scene.lines.slice(0, view.line + 1);
  const sceneDone = view.line >= scene.lines.length;

  return (
    <section aria-label="My run in four scenes" className="my-10">
      <div className="bg-term-bg overflow-hidden rounded-lg border">
        <div className="flex h-9 items-center gap-3 border-b px-4">
          <span className="eyebrow normal-case">terminal</span>
          <span className="text-muted-foreground min-w-0 flex-1 truncate font-mono text-xs">
            vansh@Vansh-PL: ~/samples-go/echo-sql
          </span>
          <span className="text-muted-foreground font-mono text-xs">
            {view.scene + 1}/{scenes.length}
          </span>
        </div>

        <pre
          ref={screen}
          aria-hidden="true"
          className="h-[22rem] overflow-hidden px-4 py-4 font-mono text-[0.75rem] leading-relaxed break-words whitespace-pre-wrap sm:h-[19.5rem] sm:text-[0.8rem]"
        >
          {visible.map((line, i) => {
            const isCurrent = i === view.line;
            if (isCurrent && sceneDone) return null;
            if (line.kind === "cmd") {
              const text = isCurrent ? line.text.slice(0, view.chars) : line.text;
              return (
                <div key={i} className="text-term-fg">
                  <span className="text-term-prompt select-none">$ </span>
                  {text}
                  {isCurrent ? (
                    <span className="caret bg-term-prompt ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em]" />
                  ) : null}
                </div>
              );
            }
            if (isCurrent) return null;
            return (
              <div
                key={i}
                className={cn(
                  "line-in",
                  line.kind === "note" ? "text-term-dim italic" : toneClass[line.tone ?? "plain"],
                  line.kind === "note" &&
                    line.tone === "pass" &&
                    "text-success font-semibold not-italic",
                )}
              >
                {line.text}
              </div>
            );
          })}
          {sceneDone ? (
            <div className="text-term-fg">
              <span className="text-term-prompt">$ </span>
              <span className="caret bg-term-prompt inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em]" />
            </div>
          ) : null}
        </pre>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-2 py-1.5">
          <ol className="flex flex-wrap items-center gap-1" aria-label="Scenes">
            {scenes.map((s, i) => (
              <li key={s.label}>
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: "goto", scene: i, final: true });
                    document
                      .getElementById(s.section)
                      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
                  }}
                  aria-current={view.scene === i ? "step" : undefined}
                  aria-label={`Scene ${i + 1}: ${s.label}. Show it and jump to that section.`}
                  className="group text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-xs"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-2 rounded-full transition-colors",
                      i === view.scene
                        ? "bg-primary"
                        : i < view.scene
                          ? "bg-primary/45"
                          : "bg-term-dim/35",
                    )}
                  />
                  <span className={cn(i === view.scene && "text-foreground font-medium")}>
                    {s.label}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className="flex gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
              onClick={() => dispatch({ type: "restart", final: reduced })}
              aria-label="Replay the animation from the first scene"
            >
              <RotateCcw aria-hidden="true" /> Replay
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
              onClick={() =>
                sceneDone
                  ? dispatch({
                      type: "goto",
                      scene: (view.scene + 1) % scenes.length,
                      final: reduced,
                    })
                  : dispatch({ type: "finish" })
              }
              aria-label={sceneDone ? "Next scene" : "Skip to the end of this scene"}
            >
              <SkipForward aria-hidden="true" /> Skip
            </Button>
          </div>
        </div>
      </div>
      <p aria-live="polite" className="sr-only">
        Scene {view.scene + 1} of {scenes.length}. {scene.summary}
      </p>
      <p className="text-muted-foreground mt-3 text-[0.8125rem]">
        The whole run in four scenes, using real lines from my terminal (trimmed). Lines starting
        with # are my notes.
      </p>
    </section>
  );
}
