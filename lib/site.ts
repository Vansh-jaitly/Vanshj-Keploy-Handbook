export const site = {
  title: "Test a Go API with Keploy: Automated Tests & PostgreSQL Mocks",
  tagline: "My Own Handbook!",
  shortTitle: "Keploy + Echo + Postgres",
  description:
    "A first-hand, beginner-friendly walkthrough: record real API traffic from a Go URL shortener with Keploy, replay it as tests, and keep them green with the database switched off.",
  author: "Vansh Jaitly",
  date: "October 2026",
  testedWith: ["Keploy 3.8.58", "Go 1.26", "Echo v4.9.0", "Postgres 10.5", "Windows + WSL2"],
  repoUrl: "https://github.com/Vansh-jaitly/Vanshj-Keploy-Handbook",
  quickstartUrl: "https://keploy.io/docs/quickstart/samples-echo/",
  sampleRepoUrl: "https://github.com/keploy/samples-go",
};

/**
 * Vercel exposes the production domain at build time, so Open Graph URLs
 * resolve correctly without hardcoding a domain.
 */
export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

/**
 * Sidebar groups. Each entry is the id of an h2 in content/tutorial.mdx
 * (rehype-slug ids) plus the short label shown in navigation.
 */
export const navGroups: { title: string; items: { id: string; label: string }[] }[] = [
  {
    title: "Overview",
    items: [
      { id: "tldr", label: "TL;DR" },
      { id: "why-keploy", label: "Why Keploy" },
      { id: "how-it-works", label: "How it works" },
    ],
  },
  {
    title: "Getting started",
    items: [
      { id: "meet-the-sample-app", label: "The sample app" },
      { id: "prerequisites", label: "Prerequisites" },
      { id: "set-up-the-app", label: "Set up the app" },
    ],
  },
  {
    title: "Using Keploy",
    items: [
      { id: "record-real-traffic", label: "Record traffic" },
      { id: "what-happens-when-you-stop-recording", label: "After recording" },
      { id: "inside-keploy", label: "Tests and mocks" },
      { id: "replay-the-tests", label: "Replay" },
    ],
  },
  {
    title: "Results",
    items: [
      { id: "the-a-ha-database-off-still-green", label: "Database off" },
      { id: "break-it-on-purpose", label: "Catch a regression" },
    ],
  },
  {
    title: "My Experience",
    items: [
      { id: "troubleshooting", label: "Troubleshooting" },
      { id: "docs-gaps-id-fix", label: "Docs gaps" },
      { id: "honest-notes", label: "Honest notes" },
      { id: "recap-and-next-steps", label: "Recap" },
    ],
  },
];
