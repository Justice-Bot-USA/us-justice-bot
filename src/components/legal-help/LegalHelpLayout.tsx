import { ReactNode, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText, Clock, Shield, Scale, ChevronRight, Home } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

interface LegalHelpStep {
  title: string;
  description: string;
}

interface LegalHelpCTA {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface LegalHelpLayoutProps {
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalPath: string;
  quickAnswer: string;
  steps: LegalHelpStep[];
  evidenceItems: string[];
  commonMistakes: string[];
  ctas: LegalHelpCTA[];
  children?: ReactNode;
  breadcrumbLabel: string;
  relatedPages?: { label: string; href: string }[];
  faqItems?: { question: string; answer: string }[];
}

const LegalHelpLayout = ({
  title,
  metaTitle,
  metaDescription,
  keywords,
  canonicalPath,
  quickAnswer,
  steps,
  evidenceItems,
  commonMistakes,
  ctas,
  children,
  breadcrumbLabel,
  relatedPages = [],
  faqItems = [],
}: LegalHelpLayoutProps) => {
  const [language, setLanguage] = useState<"en" | "es">("en");
  const canonicalUrl = `https://justicebot-usa.com${canonicalPath}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: metaTitle,
    description: metaDescription,
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "Justice Bot USA",
      url: "https://justicebot-usa.com",
    },
    mainEntityOfPage: canonicalUrl,
    datePublished: "2025-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://justicebot-usa.com" },
      { "@type": "ListItem", position: 2, name: "Legal Help", item: "https://justicebot-usa.com/legal-help" },
      { "@type": "ListItem", position: 3, name: breadcrumbLabel, item: canonicalUrl },
    ],
  };

  const faqSchema = faqItems.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  const howToSchema = steps.length
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: title,
        description: quickAnswer,
        step: steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.title,
          text: s.description,
        })),
      }
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en" href={canonicalUrl} />
        <link rel="alternate" hrefLang="es" href={canonicalUrl} />
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
        {howToSchema && <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>}
      </Helmet>

      <Header language={language} onLanguageChange={setLanguage} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground flex items-center gap-1">
            <Home className="h-3.5 w-3.5" />
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/legal-help" className="hover:text-foreground">Legal Help</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{breadcrumbLabel}</span>
        </nav>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">{title}</h1>

        {/* Quick Answer */}
        <Card className="mb-8 border-l-4 border-l-primary bg-primary/5">
          <CardContent className="p-5">
            <Badge variant="secondary" className="mb-2">Quick Answer</Badge>
            <p className="text-foreground/90 leading-relaxed">{quickAnswer}</p>
          </CardContent>
        </Card>

        {/* Step-by-Step Guide */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground mb-5 flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Step-by-Step Guide
          </h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Evidence Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground mb-5 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Evidence &amp; Documents You Need
          </h2>
          <Card>
            <CardContent className="p-5">
              <ul className="space-y-2">
                {evidenceItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                    <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Common Mistakes */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-foreground mb-5 flex items-center gap-2">
            <Clock className="h-5 w-5 text-destructive" />
            Common Mistakes to Avoid
          </h2>
          <Card className="border-destructive/20">
            <CardContent className="p-5">
              <ul className="space-y-2">
                {commonMistakes.map((mistake, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                    <span className="text-destructive font-bold">✕</span>
                    {mistake}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Custom Content */}
        {children}

        {/* FAQ Section */}
        {faqItems.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-foreground mb-5">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((faq, i) => (
                <Card key={i}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="mb-10 bg-primary/5 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">Need Help Preparing Your Case?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Use Justice Bot USA to organize evidence, generate documents, and prepare your timeline — all in one place.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {ctas.map((cta, i) => (
              <Button key={i} asChild variant={i === 0 ? "default" : "outline"} size="lg" onClick={() => {
                if (typeof window !== "undefined" && (window as any).gtag) {
                  (window as any).gtag("event", "cta_click", { event_category: "seo_content", cta_label: cta.label, page_path: canonicalPath });
                }
              }}>
                <Link to={cta.href}>
                  {cta.label} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ))}
          </div>
        </section>

        {/* Related Pages */}
        {relatedPages.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-foreground mb-4">Related Legal Help</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedPages.map((page, i) => (
                <Link
                  key={i}
                  to={page.href}
                  className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent/50 transition-colors text-sm text-foreground"
                >
                  <ArrowRight className="h-4 w-4 text-primary" />
                  {page.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <div className="text-xs text-muted-foreground border-t pt-6 mt-10">
          <p><strong>Disclaimer:</strong> This is legal information, not legal advice. Justice Bot USA provides procedural guidance to help you understand legal processes. For advice specific to your situation, consult a licensed attorney.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalHelpLayout;
