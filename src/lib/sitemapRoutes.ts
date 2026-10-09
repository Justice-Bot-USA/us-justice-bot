/**
 * Centralized sitemap route config.
 * This file is the single source of truth for all public URLs.
 * The Vite plugin reads this at build time to generate public/sitemap.xml.
 *
 * Priority guide:
 *   1.0 — homepage
 *   0.9 — high-traffic conversion pages
 *   0.8 — feature / tool pages
 *   0.7 — legal area landing pages
 *   0.6 — state landing pages & funnels
 *   0.5 — utility / informational pages
 *
 * changefreq guide:
 *   daily    — frequently updated content
 *   weekly   — tools / features that evolve
 *   monthly  — stable reference pages
 */

export const BASE_URL = "https://justicebot-usa.com";

export interface SitemapRoute {
  path: string;
  priority: number;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  lastmod?: string;
}

// ─── Core pages ───────────────────────────────────────────────────────────────
export const coreRoutes: SitemapRoute[] = [
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
];

// ─── Tool / lookup pages ───────────────────────────────────────────────────────
export const toolRoutes: SitemapRoute[] = [
  { path: "/court-records",                 priority: 0.8, changefreq: "weekly" },
  { path: "/foia-request-generator",        priority: 0.8, changefreq: "monthly" },
  { path: "/public-records-request",        priority: 0.7, changefreq: "monthly" },
  { path: "/criminal-defense-guide",        priority: 0.7, changefreq: "monthly" },
  { path: "/book-of-documents",             priority: 0.7, changefreq: "monthly" },
  { path: "/usa-forms",                     priority: 0.7, changefreq: "weekly" },
];

// ─── Legal area pages ──────────────────────────────────────────────────────────
export const legalAreaRoutes: SitemapRoute[] = [
  { path: "/legal-areas",                   priority: 0.9, changefreq: "weekly" },
  { path: "/legal-areas/immigration",       priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/family-law",        priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/employment",        priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/housing",           priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/civil-rights",      priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/criminal-defense",  priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/small-claims",      priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/workers-comp",      priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/consumer-rights",   priority: 0.8, changefreq: "weekly" },
  { path: "/legal-areas/human-rights",      priority: 0.7, changefreq: "monthly" },
];

// ─── State landing pages ───────────────────────────────────────────────────────
// Live only in California and New York. The other 48 states are "coming soon"
// and stay out of the sitemap until they launch.
const STATE_CODES = ["ca", "ny"];

export const stateRoutes: SitemapRoute[] = STATE_CODES.map((code) => ({
  path: `/states/${code}`,
  priority: 0.6,
  changefreq: "monthly" as const,
}));

// ─── State funnel slugs ────────────────────────────────────────────────────────
export const funnelRoutes: SitemapRoute[] = [
  { path: "/california-legal-help",          priority: 0.7, changefreq: "monthly" },
  { path: "/new-york-legal-help",            priority: 0.7, changefreq: "monthly" },
];

// ─── State tool landing pages ─────────────────────────────────────────────────
// California and New York only (the live states).

const LIVE_STATE_SLUGS = ["california", "new-york"];

export const stateToolRoutes: SitemapRoute[] = LIVE_STATE_SLUGS.flatMap((slug) => [
  {
    path: `/${slug}-court-forms`,
    priority: 0.9,
    changefreq: "weekly" as const,
  },
  {
    path: `/${slug}-arrest-records`,
    priority: 0.9,
    changefreq: "monthly" as const,
  },
]);

// ─── Issue Hub routes ──────────────────────────────────────────────────────────
export const issueHubRoutes: SitemapRoute[] = [
  { path: "/issues",                                          priority: 0.8, changefreq: "weekly" },
  { path: "/ca/family-law/custody-visitation",                    priority: 0.9, changefreq: "weekly" },
  { path: "/ca/family-law/custody-visitation/start",              priority: 0.8, changefreq: "weekly" },
  { path: "/ca/family-law/custody-visitation/forms",              priority: 0.9, changefreq: "weekly" },
  { path: "/ca/family-law/custody-visitation/timeline",           priority: 0.7, changefreq: "weekly" },
  { path: "/ca/family-law/custody-visitation/help",               priority: 0.7, changefreq: "monthly" },
  { path: "/ca/family-law/custody-visitation/track/rfo",          priority: 0.8, changefreq: "monthly" },
  { path: "/ca/family-law/custody-visitation/track/respond",      priority: 0.8, changefreq: "monthly" },
  { path: "/ca/family-law/custody-visitation/track/emergency",    priority: 0.8, changefreq: "monthly" },
  { path: "/ca/family-law/custody-visitation/track/modify",       priority: 0.7, changefreq: "monthly" },
  { path: "/ca/family-law/custody-visitation/track/enforce",      priority: 0.7, changefreq: "monthly" },
];

// ─── Legal Help Library (SEO content pages) ──────────────────────────────────
export const legalHelpRoutes: SitemapRoute[] = [
  { path: "/legal-help",                                priority: 0.9, changefreq: "weekly" },
  { path: "/legal-help/eviction",                       priority: 0.9, changefreq: "weekly" },
  { path: "/legal-help/eviction-process",               priority: 0.8, changefreq: "monthly" },
  { path: "/legal-help/how-to-fight-an-eviction",       priority: 0.9, changefreq: "monthly" },
  { path: "/legal-help/tenant-rights",                  priority: 0.9, changefreq: "monthly" },
  { path: "/legal-help/eviction-notice-what-to-do",     priority: 0.8, changefreq: "monthly" },
  { path: "/legal-help/small-claims-court",             priority: 0.9, changefreq: "weekly" },
  { path: "/legal-help/how-to-file-small-claims",       priority: 0.8, changefreq: "monthly" },
  { path: "/legal-help/how-to-defend-small-claims",     priority: 0.8, changefreq: "monthly" },
  { path: "/legal-help/small-claims-evidence",          priority: 0.7, changefreq: "monthly" },
  { path: "/legal-help/child-custody",                  priority: 0.9, changefreq: "weekly" },
  { path: "/legal-help/divorce-process",                priority: 0.9, changefreq: "monthly" },
  { path: "/legal-help/child-support",                  priority: 0.8, changefreq: "monthly" },
  { path: "/legal-help/protective-orders",              priority: 0.8, changefreq: "monthly" },
  { path: "/legal-help/discrimination-law",             priority: 0.8, changefreq: "monthly" },
  { path: "/legal-help/how-to-file-civil-rights-complaint", priority: 0.8, changefreq: "monthly" },
  { path: "/legal-help/workplace-discrimination",       priority: 0.8, changefreq: "monthly" },
  { path: "/legal-help/housing-discrimination",         priority: 0.8, changefreq: "monthly" },
  { path: "/legal-help/criminal-court-process",         priority: 0.8, changefreq: "monthly" },
  { path: "/legal-help/what-to-do-after-arrest",        priority: 0.8, changefreq: "monthly" },
  { path: "/legal-help/how-to-prepare-for-court",       priority: 0.8, changefreq: "monthly" },
  { path: "/legal-help/defense-evidence",               priority: 0.7, changefreq: "monthly" },
  { path: "/legal-help/workers-compensation",           priority: 0.8, changefreq: "monthly" },
  { path: "/legal-help/workplace-injury-claim",         priority: 0.7, changefreq: "monthly" },
  { path: "/legal-help/workers-comp-denied",            priority: 0.7, changefreq: "monthly" },
  { path: "/legal-help/native-american-rights",         priority: 0.8, changefreq: "monthly" },
  { path: "/legal-help/tribal-court",                   priority: 0.7, changefreq: "monthly" },
  { path: "/legal-help/tribal-jurisdiction",            priority: 0.7, changefreq: "monthly" },
  { path: "/legal-help/tribal-jurisdiction-check",      priority: 0.8, changefreq: "monthly" },
  // State-specific legal help pages (California and New York only; other states are coming soon)
  { path: "/legal-help/california-eviction-process",    priority: 0.9, changefreq: "monthly" },
  { path: "/legal-help/new-york-eviction-process",      priority: 0.9, changefreq: "monthly" },
  { path: "/legal-help/california-child-custody",       priority: 0.9, changefreq: "monthly" },
  { path: "/legal-help/california-workplace-discrimination", priority: 0.8, changefreq: "monthly" },
  { path: "/legal-help/new-york-small-claims-court",    priority: 0.9, changefreq: "monthly" },
];

// ─── Tool-led landing pages (SEO conversion pages) ───────────────────────────
export const toolLandingRoutes: SitemapRoute[] = [
  { path: "/free-eviction-defense-tool",                priority: 0.9, changefreq: "monthly" },
  { path: "/free-small-claims-case-builder",            priority: 0.9, changefreq: "monthly" },
  { path: "/free-custody-case-organizer",               priority: 0.9, changefreq: "monthly" },
  { path: "/free-discrimination-complaint-helper",      priority: 0.9, changefreq: "monthly" },
];

// ─── Info / legal pages ────────────────────────────────────────────────────────
export const infoRoutes: SitemapRoute[] = [
  { path: "/support",                        priority: 0.6, changefreq: "monthly" },
  { path: "/faq",                            priority: 0.6, changefreq: "monthly" },
  { path: "/legal-glossary",                 priority: 0.8, changefreq: "monthly" },
  { path: "/self-help",                      priority: 0.7, changefreq: "monthly" },
  { path: "/courtroom-prep",                 priority: 0.7, changefreq: "monthly" },
  { path: "/privacy",                        priority: 0.5, changefreq: "yearly" },
  { path: "/terms",                          priority: 0.5, changefreq: "yearly" },
  { path: "/disclaimer",                     priority: 0.5, changefreq: "yearly" },
];

// ─── All routes combined (used by the Vite plugin) ────────────────────────────
export const allSitemapRoutes: SitemapRoute[] = [
  ...coreRoutes,
  ...toolRoutes,
  ...legalAreaRoutes,
  ...legalHelpRoutes,
  ...toolLandingRoutes,
  ...issueHubRoutes,
  ...stateRoutes,
  ...funnelRoutes,
  ...stateToolRoutes,
  ...infoRoutes,
];
