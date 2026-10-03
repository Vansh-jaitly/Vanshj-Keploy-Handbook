/**
 * Marks added/removed lines inside ```diff code blocks so CSS can tint them.
 * Runs after rehype-pretty-code, which wraps every line in <span data-line>.
 */
function textOf(node) {
  if (node.type === "text") return node.value;
  return (node.children ?? []).map(textOf).join("");
}

function walk(node, inDiff) {
  if (node.type !== "element" && node.type !== "root") return;
  const isDiffCode =
    node.type === "element" &&
    node.tagName === "code" &&
    (node.properties?.dataLanguage ?? node.properties?.["data-language"]) === "diff";
  const diff = inDiff || isDiffCode;
  // rehype-pretty-code writes attributes with their HTML names ("data-line").
  const props = node.properties;
  if (diff && node.type === "element" && props && ("data-line" in props || "dataLine" in props)) {
    const first = textOf(node).charAt(0);
    if (first === "+") props["data-diff"] = "add";
    if (first === "-") props["data-diff"] = "remove";
  }
  for (const child of node.children ?? []) walk(child, diff);
}

export default function rehypeDiffLines() {
  return (tree) => walk(tree, false);
}
