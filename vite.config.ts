import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { existsSync, writeFileSync } from "fs";

// ─── Inline sitemap plugin ────────────────────────────────────────────────────
// Route config lives in src/lib/sitemapRoutes.ts — the single source of truth.
// To add pages: edit that file only. No manual XML editing needed.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = "https://justicebot-usa.com";

// Replicate route data inline (keep in sync with src/lib/sitemapRoutes.ts).
// Live only in California and New York; the other 48 states are "coming soon"
// and stay out of the sitemap until they launch.
const LIVE_STATE_SLUGS = ["california", "new-york"];
const LIVE_STATE_CODES = ["ca", "ny"];

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
  { path: "/ca/legal-center",               priority: 0.9, changefreq: "weekly" },
  { path: "/ny/legal-center",               priority: 0.9, changefreq: "weekly" },
  // ─── Tools ──────────────────────────────────────────────────────────────────
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
  ...LIVE_STATE_CODES.map((code) => ({
    path: `/states/${code}`,
    priority: 0.6,
    changefreq: "monthly",
  })),
  // ─── State funnels ──────────────────────────────────────────────────────────
  { path: "/california-legal-help",         priority: 0.7, changefreq: "monthly" },
  { path: "/new-york-legal-help",           priority: 0.7, changefreq: "monthly" },
  // ─── State tool landing pages (court-forms + arrest-records, CA and NY) ────
  ...LIVE_STATE_SLUGS.flatMap((slug) => [
    { path: `/${slug}-court-forms`,      priority: 0.9, changefreq: "weekly" },
    { path: `/${slug}-arrest-records`,   priority: 0.9, changefreq: "monthly" },
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

function sitemapPlugin(): Plugin {
  let outDir: string | null = null;
  return {
    name: "vite-plugin-sitemap",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const buildDate = new Date().toISOString().split("T")[0];
      const xml = buildSitemap(buildDate);
      writeFileSync(path.resolve(__dirname, "public/sitemap.xml"), xml, "utf-8");
      // Vite copies public/ into the build output before closeBundle runs, so
      // also write the fresh sitemap into the output; otherwise the deployed
      // sitemap is the one left over from the previous build.
      if (outDir && existsSync(outDir)) {
        writeFileSync(path.join(outDir, "sitemap.xml"), xml, "utf-8");
      }
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
