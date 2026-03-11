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
];

// ─── Tool / lookup pages ───────────────────────────────────────────────────────
export const toolRoutes: SitemapRoute[] = [
  { path: "/injury-settlement-calculator",  priority: 0.8, changefreq: "monthly" },
  { path: "/personal-injury-calculator",    priority: 0.7, changefreq: "monthly" },
  { path: "/case-law-search",               priority: 0.8, changefreq: "weekly" },
  { path: "/warrant-lookup",                priority: 0.8, changefreq: "weekly" },
  { path: "/sex-offender-registry",         priority: 0.7, changefreq: "weekly" },
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
const STATE_CODES = [
  "al","ak","az","ar","ca","co","ct","de","fl","ga",
  "hi","id","il","in","ia","ks","ky","la","me","md",
  "ma","mi","mn","ms","mo","mt","ne","nv","nh","nj",
  "nm","ny","nc","nd","oh","ok","or","pa","ri","sc",
  "sd","tn","tx","ut","vt","va","wa","wv","wi","wy",
];

export const stateRoutes: SitemapRoute[] = STATE_CODES.map((code) => ({
  path: `/states/${code}`,
  priority: 0.6,
  changefreq: "monthly" as const,
}));

// ─── State funnel slugs ────────────────────────────────────────────────────────
export const funnelRoutes: SitemapRoute[] = [
  { path: "/california-legal-help",          priority: 0.7, changefreq: "monthly" },
  { path: "/texas-legal-help",               priority: 0.7, changefreq: "monthly" },
  { path: "/new-york-legal-help",            priority: 0.7, changefreq: "monthly" },
  { path: "/florida-legal-help",             priority: 0.7, changefreq: "monthly" },
  { path: "/ohio-cps-help",                  priority: 0.6, changefreq: "monthly" },
  { path: "/illinois-legal-help",            priority: 0.6, changefreq: "monthly" },
  { path: "/georgia-legal-help",             priority: 0.6, changefreq: "monthly" },
  { path: "/pennsylvania-legal-help",        priority: 0.6, changefreq: "monthly" },
];

// ─── State tool landing pages ─────────────────────────────────────────────────
// Tier 1 (highest ROI): FL, TX, CA, NY, AZ → priority 0.9
// Tier 2: GA, OH, PA, IL, NC              → priority 0.8
// Tier 3: NJ, WA, CO, MI, VA             → priority 0.7
// All others                              → priority 0.6

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

function stateToolPriority(stateSlug: string): number {
  if (TIER1_SLUGS.includes(stateSlug)) return 0.9;
  if (TIER2_SLUGS.includes(stateSlug)) return 0.8;
  if (TIER3_SLUGS.includes(stateSlug)) return 0.7;
  return 0.6;
}

export const stateToolRoutes: SitemapRoute[] = ALL_STATE_SLUGS.flatMap((slug) => [
  {
    path: `/${slug}-warrant-lookup`,
    priority: stateToolPriority(slug),
    changefreq: "weekly" as const,
  },
  {
    path: `/${slug}-court-forms`,
    priority: stateToolPriority(slug),
    changefreq: "weekly" as const,
  },
  {
    path: `/${slug}-arrest-records`,
    priority: stateToolPriority(slug),
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
];

// ─── Info / legal pages ────────────────────────────────────────────────────────
export const infoRoutes: SitemapRoute[] = [
  { path: "/support",                        priority: 0.6, changefreq: "monthly" },
  { path: "/faq",                            priority: 0.6, changefreq: "monthly" },
  { path: "/privacy",                        priority: 0.5, changefreq: "yearly" },
  { path: "/terms",                          priority: 0.5, changefreq: "yearly" },
  { path: "/disclaimer",                     priority: 0.5, changefreq: "yearly" },
];

// ─── All routes combined (used by the Vite plugin) ────────────────────────────
export const allSitemapRoutes: SitemapRoute[] = [
  ...coreRoutes,
  ...toolRoutes,
  ...legalAreaRoutes,
  ...issueHubRoutes,
  ...stateRoutes,
  ...funnelRoutes,
  ...stateToolRoutes,
  ...infoRoutes,
];
