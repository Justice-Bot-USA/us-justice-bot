import { Link } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import {
  Scale,
  Briefcase,
  Shield,
  Users,
  DollarSign,
  Home,
  Gavel,
  Heart,
  ArrowRight,
  Search,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

// ─── Category data (mirrors legalAreaData keys & LegalSections entries) ───────
const LEGAL_CATEGORIES = [
  {
    id: "immigration",
    title: "Immigration",
    description:
      "Deportation defense, asylum applications, visa petitions, citizenship, and ICE encounter guidance.",
    icon: Gavel,
    badge: { label: "Urgent", variant: "destructive" as const },
    keywords: ["deportation", "asylum", "visa", "citizenship", "ICE"],
    relatedTools: [
      { label: "FOIA Records Request", href: "/foia-request-generator" },
      { label: "Case Analysis", href: "/case-analysis" },
    ],
    href: "/legal-areas/immigration",
  },
  {
    id: "family-law",
    title: "Family Law",
    description:
      "Divorce, child custody & support, domestic violence restraining orders, and adoption proceedings.",
    icon: Heart,
    badge: { label: "Popular", variant: "default" as const },
    keywords: ["divorce", "custody", "child support", "domestic violence", "adoption"],
    relatedTools: [
      { label: "State Forms Library", href: "/forms-library" },
      { label: "Case Analysis", href: "/case-analysis" },
    ],
    href: "/legal-areas/family-law",
  },
  {
    id: "employment",
    title: "Employment & Workplace",
    description:
      "Wrongful termination, wage theft, workplace discrimination, harassment, and FMLA violations.",
    icon: Briefcase,
    badge: { label: "Popular", variant: "default" as const },
    keywords: ["wrongful termination", "wage theft", "discrimination", "harassment", "FMLA"],
    relatedTools: [
      { label: "Case Analysis", href: "/case-analysis" },
    ],
    href: "/legal-areas/employment",
  },
  {
    id: "housing",
    title: "Housing & Tenant Rights",
    description:
      "Evictions, security deposit disputes, habitability issues, rent control, and landlord retaliation.",
    icon: Home,
    badge: { label: "Popular", variant: "default" as const },
    keywords: ["eviction", "security deposit", "habitability", "rent control", "landlord"],
    relatedTools: [
      { label: "Court Records Lookup", href: "/court-records" },
      { label: "Case Analysis", href: "/case-analysis" },
    ],
    href: "/legal-areas/housing",
  },
  {
    id: "civil-rights",
    title: "Civil Rights",
    description:
      "Police misconduct, constitutional violations, discrimination, and government accountability.",
    icon: Users,
    badge: { label: "Important", variant: "secondary" as const },
    keywords: ["police misconduct", "discrimination", "constitutional rights", "§1983"],
    relatedTools: [
      { label: "FOIA Records Request", href: "/foia-request-generator" },
      { label: "Case Analysis", href: "/case-analysis" },
    ],
    href: "/legal-areas/civil-rights",
  },
  {
    id: "criminal-defense",
    title: "Criminal Defense",
    description:
      "DUI defense, expungement, record sealing, bail hearings, and understanding your rights.",
    icon: Shield,
    badge: { label: "Urgent", variant: "destructive" as const },
    keywords: ["DUI", "expungement", "record sealing", "bail", "criminal record"],
    relatedTools: [
      { label: "Criminal Defense Guide", href: "/criminal-defense-guide" },
    ],
    href: "/legal-areas/criminal-defense",
  },
  {
    id: "small-claims",
    title: "Small Claims Court",
    description:
      "Disputes up to $10,000 — landlord deposits, unpaid debts, property damage, and contractor issues.",
    icon: DollarSign,
    badge: { label: "Popular", variant: "default" as const },
    keywords: ["small claims", "landlord dispute", "unpaid debt", "property damage"],
    relatedTools: [
      { label: "State Forms Library", href: "/forms-library" },
      { label: "Case Analysis", href: "/case-analysis" },
    ],
    href: "/legal-areas/small-claims",
  },
  {
    id: "workers-comp",
    title: "Workers' Compensation",
    description:
      "On-the-job injuries, occupational diseases, employer disputes, and disability benefit claims.",
    icon: Briefcase,
    badge: null,
    keywords: ["workers comp", "work injury", "occupational disease", "disability benefits"],
    relatedTools: [
      { label: "Case Analysis", href: "/case-analysis" },
    ],
    href: "/legal-areas/workers-comp",
  },
  {
    id: "consumer-rights",
    title: "Consumer Protection",
    description:
      "Fraud, scams, predatory lending, debt collection harassment, warranty disputes, and FCRA violations.",
    icon: Scale,
    badge: { label: "Popular", variant: "default" as const },
    keywords: ["consumer fraud", "debt collection", "predatory lending", "warranty", "FCRA"],
    relatedTools: [
      { label: "Case Analysis", href: "/case-analysis" },
    ],
    href: "/legal-areas/consumer-rights",
  },
  {
    id: "human-rights",
    title: "Human Rights & Federal Courts",
    description:
      "Federal agency accountability, Title IX, ADA violations, and international human rights law.",
    icon: Users,
    badge: { label: "Important", variant: "secondary" as const },
    keywords: ["ADA", "Title IX", "federal court", "human rights", "agency accountability"],
    relatedTools: [
      { label: "FOIA Records Request", href: "/foia-request-generator" },
      { label: "Case Analysis", href: "/case-analysis" },
    ],
    href: "/legal-areas/human-rights",
  },
];

// ─── JSON-LD structured data ──────────────────────────────────────────────────
const structuredData = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Legal Areas — JusticeBot USA",
  description:
    "Browse all 10 legal practice areas. Get AI-powered legal guidance, state-specific court forms, and step-by-step help for civil legal issues. Live in California and New York; other states coming soon.",
  url: "https://justicebot-usa.com/legal-areas",
  publisher: {
    "@type": "Organization",
    name: "JusticeBot USA",
    url: "https://justicebot-usa.com",
  },
  hasPart: LEGAL_CATEGORIES.map((c) => ({
    "@type": "WebPage",
    name: c.title,
    url: `https://justicebot-usa.com${c.href}`,
    description: c.description,
  })),
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function LegalAreasHub() {
  const [language, setLanguage] = useState<"en" | "es">("en");

  return (
    <HelmetProvider>
      <Helmet>
        <title>All Legal Areas — Free US Legal Help | JusticeBot USA</title>
        <meta
          name="description"
          content="Browse 10 legal practice areas: immigration, family law, employment, housing, civil rights, criminal defense, small claims, workers comp, consumer protection, and human rights. Live in California and New York; other states coming soon."
        />
        <meta
          name="keywords"
          content="legal help USA, immigration lawyer, family law, employment rights, tenant rights, civil rights attorney, criminal defense, small claims court, workers compensation, consumer protection"
        />
        <link rel="canonical" href="https://justicebot-usa.com/legal-areas" />
        {/* Open Graph */}
        <meta property="og:title" content="All Legal Areas — JusticeBot USA" />
        <meta
          property="og:description"
          content="Legal information for 10 practice areas. Live in California and New York; other states coming soon."
        />
        <meta property="og:url" content="https://justicebot-usa.com/legal-areas" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header language={language} onLanguageChange={setLanguage} />

        {/* ─── Breadcrumb ─────────────────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="container mx-auto px-4 pt-6 pb-2 text-sm text-muted-foreground flex items-center gap-1"
        >
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium">Legal Areas</span>
        </nav>

        <main className="container mx-auto px-4 pb-20">
          {/* ─── Hero ─────────────────────────────────────────────────────── */}
          <section className="py-10 md:py-14 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-5">
              <Scale className="w-4 h-4" />
              All Legal Practice Areas
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Find the Right Legal Area
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Legal information for civil legal issues, live in California and New York with the other 48 states coming soon. Select
              your practice area below to access state-specific forms, deadlines, and step-by-step
              case analysis.
            </p>

            {/* Quick-action bar */}
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/case-analysis">
                  <Search className="w-4 h-4 mr-2" />
                  Analyze My Case
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/forms-library">
                  <FileText className="w-4 h-4 mr-2" />
                  Browse Forms Library
                </Link>
              </Button>
            </div>
          </section>

          {/* ─── Category grid ────────────────────────────────────────────── */}
          <section aria-labelledby="categories-heading">
            <h2 id="categories-heading" className="sr-only">
              Legal Practice Areas
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {LEGAL_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <article key={cat.id}>
                    <Link to={cat.href} className="group block h-full">
                      <Card className="h-full border hover:border-primary/50 hover:shadow-lg transition-all duration-200 group-hover:bg-primary/[0.02]">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between mb-3">
                            <div className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            {cat.badge && (
                              <Badge variant={cat.badge.variant} className="text-xs">
                                {cat.badge.label}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors">
                            {cat.title}
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed">
                            {cat.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-0 space-y-4">
                          {/* Keyword tags — crawlable anchor text */}
                          <div className="flex flex-wrap gap-1.5" aria-label="Key topics">
                            {cat.keywords.map((kw) => (
                              <span
                                key={kw}
                                className="inline-block bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>

                          {/* Related tool links */}
                          <div className="border-t pt-3 space-y-1.5">
                            {cat.relatedTools.map((tool) => (
                              <Link
                                key={tool.href}
                                to={tool.href}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                              >
                                <ArrowRight className="w-3 h-3 flex-shrink-0" />
                                {tool.label}
                              </Link>
                            ))}
                          </div>

                          {/* CTA row */}
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs text-muted-foreground">CA & NY live · more coming</span>
                            <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                              Get Help <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>

          {/* ─── Internal link block (SEO pillar links) ───────────────────── */}
          <section className="mt-16 bg-muted/40 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-2">Popular Starting Points</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Not sure where to begin? Try one of our most-used tools.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[
                { label: "AI Case Analysis", href: "/case-analysis" },
                { label: "Forms Library", href: "/forms-library" },
                          { label: "Court Records", href: "/court-records" },
                { label: "FOIA Generator", href: "/foia-request-generator" },
                { label: "Criminal Defense Guide", href: "/criminal-defense-guide" },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary bg-background rounded-lg px-4 py-3 border hover:border-primary/40 transition-all"
                >
                  <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
                  {link.label}
                </Link>
              ))}
            </div>
          </section>

          {/* ─── CTA banner ───────────────────────────────────────────────── */}
          <section className="mt-10 bg-primary rounded-2xl p-8 text-center text-primary-foreground">
            <h2 className="text-2xl font-bold mb-2">Not Sure Which Area Applies to You?</h2>
            <p className="opacity-90 mb-6 max-w-xl mx-auto">
              Describe your situation and our AI will identify the right legal category, forms, and
              next steps — in plain English.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/case-analysis">Start Free Case Analysis</Link>
            </Button>
          </section>
        </main>

        <Footer />
      </div>
    </HelmetProvider>
  );
}
