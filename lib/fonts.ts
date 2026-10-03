import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";

/**
 * Plus Jakarta Sans (OFL) for text and UI: a geometric grotesk with open
 * apertures that stays crisp at small nav sizes. Self-hosted from the
 * @fontsource package, so builds never depend on a font CDN.
 */
export const sans = localFont({
  src: [
    {
      path: "../node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2",
      style: "normal",
    },
    {
      path: "../node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-italic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-sans-face",
  weight: "200 800",
  display: "swap",
});

/** Geist Mono for code, terminal output and small technical labels. */
export const mono = GeistMono;
