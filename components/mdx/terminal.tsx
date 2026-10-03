import { cn } from "@/lib/utils";

import { CodeFrame } from "./code-frame";

type Tone = "command" | "success" | "error" | "dim" | "plain";

const errorPattern =
  /\bERROR\b|"level":"(?:error|fatal)"|Testrun failed|"passed": "false"|Total test failed:\s*[1-9]|fatal error|permission denied|No such file|syntax error|is disabled|command not found|not supported/;
const successPattern =
  /"passed": "true"|Total test failed:\s*0\b|Total test passed:\s*8\b|✔|Ping successful|ready to accept connections|HTTP\/1\.1 2\d\d|HTTP\/1\.1 3\d\d/;

function toneOf(line: string): Tone {
  if (line.startsWith("$ ")) return "command";
  if (/^\s*(#|\.\.\.|\[)/.test(line)) return "dim";
  if (errorPattern.test(line)) return "error";
  if (successPattern.test(line)) return "success";
  return "plain";
}

const toneClass: Record<Tone, string> = {
  command: "text-foreground",
  success: "text-success border-l-success bg-success/[0.06]",
  error: "text-destructive border-l-destructive bg-destructive/[0.06]",
  dim: "text-term-dim italic",
  plain: "text-term-fg",
};

/**
 * Real command output. Lines starting with "$ " are commands (the copy button
 * copies only those); output lines are tinted when they report a pass or a
 * failure.
 */
export function Terminal({ title, children }: { title?: string; children: string }) {
  const text = children.replace(/^\n+|\s+$/g, "");
  const lines = text.split("\n");
  const commands = lines.filter((l) => l.startsWith("$ ")).map((l) => l.slice(2));
  const hasCommands = commands.length > 0;

  return (
    <CodeFrame
      language="terminal"
      title={title}
      copyText={hasCommands ? commands.join("\n") : text}
      copyLabel={hasCommands ? "Copy commands" : "Copy output"}
    >
      <pre>
        <code>
          {lines.map((line, i) => {
            const tone = toneOf(line);
            return (
              <span
                key={i}
                className={cn("block border-l-2 border-transparent px-4", toneClass[tone])}
              >
                {tone === "command" ? (
                  <>
                    <span aria-hidden="true" className="text-faint select-none">
                      ${" "}
                    </span>
                    {line.slice(2)}
                  </>
                ) : (
                  line || " "
                )}
              </span>
            );
          })}
        </code>
      </pre>
    </CodeFrame>
  );
}
