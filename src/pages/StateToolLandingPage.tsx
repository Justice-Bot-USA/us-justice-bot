import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { parseStateToolSlug, getStateToolSeo } from '@/lib/stateToolSeo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Search, FileText, ArrowRight, Shield, Scale, ExternalLink,
  AlertTriangle, MapPin, CheckCircle2, BookOpen
} from 'lucide-react';

export default function StateToolLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = React.useState<'en' | 'es'>('en');

  const match = slug ? parseStateToolSlug(slug) : null;
  if (!match) return null; // StateFunnelPage will handle or 404

  const seo = getStateToolSeo(match);
  const { stateName, stateCode, toolType } = match;
  const isWarrant = toolType === 'warrant-lookup';
  const stateSlug = stateName.toLowerCase().replace(/\s+/g, '-');

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords.join(', ')}
        url={seo.canonical}
      />
      <Helmet>
        <link rel="canonical" href={seo.canonical} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": seo.title,
            "description": seo.description,
            "url": seo.canonical,
            "provider": {
              "@type": "Organization",
              "name": "Veritas Path — Justice-Bot Technologies",
              "url": "https://justicebot-usa.com"
            },
            "about": {
              "@type": "State",
              "name": stateName
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": seo.faqItems.map(f => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": { "@type": "Answer", "text": f.a }
            }))
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header language={language} onLanguageChange={setLanguage} />

        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4">
              <MapPin className="h-3 w-3 mr-1" /> {stateName} ({stateCode})
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{seo.h1}</h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              {seo.description}
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate(seo.toolPath)}
              className="text-lg px-8"
            >
              {isWarrant ? (
                <><Search className="h-5 w-5 mr-2" /> Search {stateName} Warrants</>
              ) : (
                <><FileText className="h-5 w-5 mr-2" /> Browse {stateName} Forms</>
              )}
            </Button>
          </div>
        </section>

        <main className="container mx-auto px-4 py-12 max-w-4xl">
          {/* How it works */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              How {isWarrant ? 'Warrant Lookup' : 'Court Forms'} Works in {stateName}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {isWarrant ? (
                <>
                  <StepCard n={1} icon={<Search className="h-6 w-6" />} title="Enter Details" desc={`Type a name and optionally a county in ${stateName} to search public warrant records.`} />
                  <StepCard n={2} icon={<Shield className="h-6 w-6" />} title="Review Results" desc={`We search official ${stateName} court and law enforcement databases for matching records.`} />
                  <StepCard n={3} icon={<Scale className="h-6 w-6" />} title="Take Action" desc="Get links to official portals, understand your options, and prepare legal documents if needed." />
                </>
              ) : (
                <>
                  <StepCard n={1} icon={<BookOpen className="h-6 w-6" />} title="Browse Forms" desc={`Access the full ${stateName} court forms library organized by legal area.`} />
                  <StepCard n={2} icon={<FileText className="h-6 w-6" />} title="Download Free" desc={`Download official ${stateCode} forms directly from our platform at no cost.`} />
                  <StepCard n={3} icon={<CheckCircle2 className="h-6 w-6" />} title="File with Confidence" desc="Use our AI tools to help fill out forms correctly and understand filing requirements." />
                </>
              )}
            </div>
          </section>

          {/* Disclaimer */}
          <Alert className="mb-12 border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This is legal information, not legal advice. {isWarrant
                ? `Always verify warrant information with official ${stateName} law enforcement or court sources.`
                : `Verify all forms are current with the ${stateName} court clerk before filing.`
              } For complex legal matters, consult a licensed {stateName} attorney.
            </AlertDescription>
          </Alert>

          {/* FAQ Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {seo.faqItems.map((faq, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Cross-links */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">More {stateName} Legal Resources</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {!isWarrant && (
                <LinkCard to={`/${stateSlug}-warrant-lookup`} icon={<Search />} title={`${stateName} Warrant Lookup`} desc="Search active warrants for free" />
              )}
              {isWarrant && (
                <LinkCard to={`/${stateSlug}-court-forms`} icon={<FileText />} title={`${stateName} Court Forms`} desc="Browse & download official forms" />
              )}
              <LinkCard to={`/states/${stateCode.toLowerCase()}`} icon={<MapPin />} title={`${stateName} Legal Help`} desc="All legal resources for your state" />
              <LinkCard to="/case-analysis" icon={<Scale />} title="Free Case Analysis" desc="AI-powered legal case review" />
              <LinkCard to="/court-records" icon={<ExternalLink />} title="Court Records Lookup" desc="Search case dockets nationwide" />
            </div>
          </section>

          {/* CTA */}
          <Card className="border-primary/30 bg-primary/5 text-center p-8">
            <h2 className="text-xl font-bold mb-2">Ready to take action?</h2>
            <p className="text-muted-foreground mb-4">
              Use our free {isWarrant ? 'warrant search' : 'forms library'} or get a full AI-powered case analysis.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={() => navigate(seo.toolPath)}>
                {isWarrant ? 'Search Warrants' : 'Browse Forms'} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => navigate('/case-analysis')}>
                Free Case Analysis
              </Button>
            </div>
          </Card>
        </main>

        <Footer />
      </div>
    </>
  );
}

function StepCard({ n, icon, title, desc }: { n: number; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="text-center">
      <CardContent className="pt-6">
        <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
        <Badge variant="outline" className="mb-2">Step {n}</Badge>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}

function LinkCard({ to, icon, title, desc }: { to: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link to={to}>
      <Card className="hover:border-primary/50 transition-colors h-full">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="text-primary mt-0.5">{icon}</div>
          <div>
            <p className="font-medium text-sm">{title}</p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
