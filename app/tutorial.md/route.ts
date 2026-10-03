import { tutorialMarkdown } from "@/lib/markdown";

// Rendered once at build time and written to out/tutorial.md by the static export.
export const dynamic = "force-static";

export function GET() {
  return new Response(tutorialMarkdown(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
