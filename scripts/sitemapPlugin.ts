import type { Plugin } from "vite";
import { writeFileSync } from "fs";
import { resolve } from "path";
import {
  BASE_URL,
  allSitemapRoutes,
  type SitemapRoute,
} from "../src/lib/sitemapRoutes";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function generateSitemapXml(routes: SitemapRoute[], buildDate: string): string {
  const entries = routes
    .map((route) => {
      const loc = `${BASE_URL}${route.path}`;
      const lastmod = route.lastmod ?? buildDate;
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${route.changefreq}</changefreq>`,
        `    <priority>${route.priority.toFixed(1)}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    entries,
    "</urlset>",
    "",
  ].join("\n");
}

export function sitemapPlugin(): Plugin {
  return {
    name: "vite-plugin-sitemap",
    // Runs after the bundle is written so the file lands in /public (dist)
    closeBundle() {
      const buildDate = formatDate(new Date());
      const xml = generateSitemapXml(allSitemapRoutes, buildDate);
      const outPath = resolve(__dirname, "../public/sitemap.xml");
      writeFileSync(outPath, xml, "utf-8");
      console.log(
        `\n✅ sitemap.xml generated — ${allSitemapRoutes.length} URLs (lastmod: ${buildDate})\n`
      );
    },
  };
}
