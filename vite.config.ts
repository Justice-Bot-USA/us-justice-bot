import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { writeFileSync } from "fs";

// ─── Inline sitemap plugin ────────────────────────────────────────────────────
// Reads the centralized route config from src/lib/sitemapRoutes.ts and writes
// public/sitemap.xml on every production build so it never goes stale.
// To add a new page: update src/lib/sitemapRoutes.ts — no manual XML editing.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = "https://justicebot-usa.com";

const STATE_CODES = [
  "al","ak","az","ar","ca","co","ct","de","fl","ga",
  "hi","id","il","in","ia","ks","ky","la","me","md",
  "ma","mi","mn","ms","mo","mt","ne","nv","nh","nj",
  "nm","ny","nc","nd","oh","ok","or","pa","ri","sc",
  "sd","tn","tx","ut","vt","va","wa","wv","wi","wy",
];

interface RouteEntry {
  path: string;
  priority: number;
  changefreq: string;
  lastmod?: string;
}

const ROUTES: RouteEntry[] = [
  // Core
  { path: "/",                             priority: 1.0, changefreq: "daily" },
  { path: "/case-analysis",               priority: 0.9, changefreq: "weekly" },
  { path: "/forms-library",               priority: 0.9, changefreq: "weekly" },
  { path: "/ai-tools",                    priority: 0.9, changefreq: "weekly" },
  { path: "/ai-tools/use",               priority: 0.8, changefreq: "weekly" },
  { path: "/pricing",                     priority: 0.9, changefreq: "monthly" },
  { path: "/start",                       priority: 0.8, changefreq: "weekly" },
  { path: "/courses",                     priority: 0.8, changefreq: "weekly" },
  { path: "/justice-bot",                 priority: 0.8, changefreq: "monthly" },
  // Tools
  { path: "/injury-settlement-calculator",priority: 0.8, changefreq: "monthly" },
  { path: "/personal-injury-calculator",  priority: 0.7, changefreq: "monthly" },
  { path: "/case-law-search",             priority: 0.8, changefreq: "weekly" },
  { path: "/warrant-lookup",              priority: 0.8, changefreq: "weekly" },
  { path: "/sex-offender-registry",       priority: 0.7, changefreq: "weekly" },
  { path: "/court-records",              priority: 0.8, changefreq: "weekly" },
  { path: "/foia-request-generator",     priority: 0.8, changefreq: "monthly" },
  { path: "/public-records-request",     priority: 0.7, changefreq: "monthly" },
  { path: "/criminal-defense-guide",     priority: 0.7, changefreq: "monthly" },
  { path: "/book-of-documents",          priority: 0.7, changefreq: "monthly" },
  { path: "/usa-forms",                  priority: 0.7, changefreq: "weekly" },
  // Legal areas
  { path: "/legal-areas/immigration",    priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/family-law",     priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/employment",     priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/housing",        priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/civil-rights",   priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/criminal-defense",priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/small-claims",   priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/workers-comp",   priority: 0.7, changefreq: "monthly" },
  { path: "/legal-areas/consumer-rights",priority: 0.7, changefreq: "monthly" },
  { path: "/legal-areas/human-rights",   priority: 0.7, changefreq: "monthly" },
  // State funnels
  { path: "/california-legal-help",      priority: 0.7, changefreq: "monthly" },
  { path: "/texas-legal-help",           priority: 0.7, changefreq: "monthly" },
  { path: "/new-york-legal-help",        priority: 0.7, changefreq: "monthly" },
  { path: "/florida-legal-help",         priority: 0.7, changefreq: "monthly" },
  { path: "/ohio-cps-help",              priority: 0.6, changefreq: "monthly" },
  { path: "/illinois-legal-help",        priority: 0.6, changefreq: "monthly" },
  { path: "/georgia-legal-help",         priority: 0.6, changefreq: "monthly" },
  { path: "/pennsylvania-legal-help",    priority: 0.6, changefreq: "monthly" },
  // All 50 state landing pages
  ...STATE_CODES.map((code) => ({
    path: `/states/${code}`,
    priority: 0.6,
    changefreq: "monthly",
  })),
  // Info
  { path: "/support",                    priority: 0.6, changefreq: "monthly" },
  { path: "/faq",                        priority: 0.6, changefreq: "monthly" },
  { path: "/privacy",                    priority: 0.5, changefreq: "yearly" },
  { path: "/terms",                      priority: 0.5, changefreq: "yearly" },
  { path: "/disclaimer",                 priority: 0.5, changefreq: "yearly" },
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
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
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
      // eslint-disable-next-line no-console
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

