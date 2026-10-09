import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { writeFileSync } from "fs";

// ─── Inline sitemap plugin ────────────────────────────────────────────────────
// Route config lives in src/lib/sitemapRoutes.ts — the single source of truth.
// To add pages: edit that file only. No manual XML editing needed.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = "https://justicebot-usa.com";

// Replicate route data inline (vite.config runs in Node, can't import TS src)
const TIER1_SLUGS = ["florida", "texas", "california", "new-york", "arizona"];
const TIER2_SLUGS = ["georgia", "ohio", "pennsylvania", "illinois", "north-carolina"];
const TIER3_SLUGS = ["new-jersey", "washington", "colorado", "michigan", "virginia"];

const ALL_STATE_SLUGS = [
  "alabama", "alaska", "arizona", "arkansas", "california", "colorado",
  "connecticut", "delaware", "florida", "georgia", "hawaii", "idaho",
  "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana",
  "maine", "maryland", "massachusetts", "michigan", "minnesota", "mississippi",
  "missouri", "montana", "nebraska", "nevada", "new-hampshire", "new-jersey",
  "new-mexico", "new-york", "north-carolina", "north-dakota", "ohio",
  "oklahoma", "oregon", "pennsylvania", "rhode-island", "south-carolina",
  "south-dakota", "tennessee", "texas", "utah", "vermont", "virginia",
  "washington", "west-virginia", "wisconsin", "wyoming",
];

const STATE_CODES = [
  "al","ak","az","ar","ca","co","ct","de","fl","ga",
  "hi","id","il","in","ia","ks","ky","la","me","md",
  "ma","mi","mn","ms","mo","mt","ne","nv","nh","nj",
  "nm","ny","nc","nd","oh","ok","or","pa","ri","sc",
  "sd","tn","tx","ut","vt","va","wa","wv","wi","wy",
];

function stateToolPriority(slug: string): number {
  if (TIER1_SLUGS.includes(slug)) return 0.9;
  if (TIER2_SLUGS.includes(slug)) return 0.8;
  if (TIER3_SLUGS.includes(slug)) return 0.7;
  return 0.6;
}

interface RouteEntry {
  path: string;
  priority: number;
  changefreq: string;
  lastmod?: string;
}

const ROUTES: RouteEntry[] = [
  // ─── Core ───────────────────────────────────────────────────────────────────
  { path: "/",                              priority: 1.0, changefreq: "daily" },
  { path: "/case-analysis",                 priority: 0.9, changefreq: "weekly" },
  { path: "/forms-library",                 priority: 0.9, changefreq: "weekly" },
  { path: "/ai-tools",                      priority: 0.9, changefreq: "weekly" },
  { path: "/ai-tools/use",                  priority: 0.8, changefreq: "weekly" },
  { path: "/pricing",                       priority: 0.9, changefreq: "monthly" },
  { path: "/start",                         priority: 0.8, changefreq: "weekly" },
  { path: "/courses",                       priority: 0.8, changefreq: "weekly" },
  { path: "/justice-bot",                   priority: 0.8, changefreq: "monthly" },
  // ─── Tools ──────────────────────────────────────────────────────────────────
  { path: "/injury-settlement-calculator",  priority: 0.8, changefreq: "monthly" },
  { path: "/personal-injury-calculator",    priority: 0.7, changefreq: "monthly" },
  { path: "/case-law-search",               priority: 0.8, changefreq: "weekly" },
  { path: "/sex-offender-registry",         priority: 0.7, changefreq: "weekly" },
  { path: "/court-records",                 priority: 0.8, changefreq: "weekly" },
  { path: "/foia-request-generator",        priority: 0.8, changefreq: "monthly" },
  { path: "/public-records-request",        priority: 0.7, changefreq: "monthly" },
  { path: "/criminal-defense-guide",        priority: 0.7, changefreq: "monthly" },
  { path: "/book-of-documents",             priority: 0.7, changefreq: "monthly" },
  { path: "/usa-forms",                     priority: 0.7, changefreq: "weekly" },
  // ─── Legal areas ────────────────────────────────────────────────────────────
  { path: "/legal-areas/immigration",       priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/family-law",        priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/employment",        priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/housing",           priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/civil-rights",      priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/criminal-defense",  priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/small-claims",      priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/workers-comp",      priority: 0.7, changefreq: "monthly" },
  { path: "/legal-areas/consumer-rights",   priority: 0.7, changefreq: "monthly" },
  { path: "/legal-areas/human-rights",      priority: 0.7, changefreq: "monthly" },
  // ─── State landing pages ────────────────────────────────────────────────────
  ...STATE_CODES.map((code) => ({
    path: `/states/${code}`,
    priority: 0.6,
    changefreq: "monthly",
  })),
  // ─── State funnels ──────────────────────────────────────────────────────────
  { path: "/california-legal-help",         priority: 0.7, changefreq: "monthly" },
  { path: "/texas-legal-help",              priority: 0.7, changefreq: "monthly" },
  { path: "/new-york-legal-help",           priority: 0.7, changefreq: "monthly" },
  { path: "/florida-legal-help",            priority: 0.7, changefreq: "monthly" },
  { path: "/ohio-cps-help",                 priority: 0.6, changefreq: "monthly" },
  { path: "/illinois-legal-help",           priority: 0.6, changefreq: "monthly" },
  { path: "/georgia-legal-help",            priority: 0.6, changefreq: "monthly" },
  { path: "/pennsylvania-legal-help",       priority: 0.6, changefreq: "monthly" },
  // ─── State tool landing pages (court-forms + arrest-records × 50 states) ──
  ...ALL_STATE_SLUGS.flatMap((slug) => [
    { path: `/${slug}-court-forms`,      priority: stateToolPriority(slug), changefreq: "weekly" },
    { path: `/${slug}-arrest-records`,   priority: stateToolPriority(slug), changefreq: "monthly" },
  ]),
  // ─── Info ───────────────────────────────────────────────────────────────────
  { path: "/support",                       priority: 0.6, changefreq: "monthly" },
  { path: "/faq",                           priority: 0.6, changefreq: "monthly" },
  { path: "/privacy",                       priority: 0.5, changefreq: "yearly" },
  { path: "/terms",                         priority: 0.5, changefreq: "yearly" },
  { path: "/disclaimer",                    priority: 0.5, changefreq: "yearly" },
];

function buildSitemap(buildDate: string): string {
  const entries = ROUTES.map(({ path, priority, changefreq, lastmod }) =>
    [
      "  <url>",
      `    <loc>${BASE_URL}${path}</loc>`,
      `    <lastmod>${lastmod ?? buildDate}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority.toFixed(1)}</priority>`,
      "  </url>",
    ].join("\n")
  ).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    "</urlset>",
    "",
  ].join("\n");
}

function sitemapPlugin() {
  return {
    name: "vite-plugin-sitemap",
    closeBundle() {
      const buildDate = new Date().toISOString().split("T")[0];
      const xml = buildSitemap(buildDate);
      const outPath = path.resolve(__dirname, "public/sitemap.xml");
      writeFileSync(outPath, xml, "utf-8");
      console.log(`\n✅ sitemap.xml — ${ROUTES.length} URLs (lastmod: ${buildDate})\n`);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    sitemapPlugin(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
