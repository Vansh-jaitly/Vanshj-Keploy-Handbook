import type { NextConfig } from "next";
import path from "node:path";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: { unoptimized: true },
  reactStrictMode: true,
  // One page, Tailwind CSS: inlining removes the render-blocking stylesheet request.
  experimental: { inlineCss: true },
};

// Plugins are passed by name with serializable options so the config
// works with both Turbopack (dev) and the production build.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      "rehype-slug",
      [
        "rehype-autolink-headings",
        {
          behavior: "append",
          properties: { className: ["heading-anchor"], ariaHidden: "true", tabIndex: -1 },
          content: { type: "text", value: "#" },
        },
      ],
      [
        "rehype-pretty-code",
        {
          theme: { light: "github-light-high-contrast", dark: "github-dark-dimmed" },
          keepBackground: false,
          defaultLang: { block: "text" },
        },
      ],
      // Local plugin, passed as an absolute path so the MDX loader can resolve it.
      path.join(process.cwd(), "lib", "rehype-diff-lines.mjs"),
    ],
  },
});

export default withMDX(nextConfig);
