import React, { useState } from 'react';
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
  AlertTriangle, MapPin, CheckCircle2, BookOpen, Lock, Info,
} from 'lucide-react';
import FOIARequestGenerator from '@/components/FOIARequestGenerator';
import { stateAbbreviations } from '@/lib/states';

export default function StateToolLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = React.useState<'en' | 'es'>('en');
  const [showFOIA, setShowFOIA] = useState(false);

  const match = slug ? parseStateToolSlug(slug) : null;
  if (!match) return null; // StateFunnelPage will handle or 404

  const seo = getStateToolSeo(match);
  const { stateName, stateCode, toolType } = match;
  const isWarrant = toolType === 'warrant-lookup';
  const isArrestRecords = toolType === 'arrest-records';
  const stateSlug = stateName.toLowerCase().replace(/\s+/g, '-');

  // Get state abbreviation for FOIA generator
  const stateAbbrLower = stateCode?.toLowerCase() || '';

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
            {isArrestRecords ? (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setShowFOIA(true)}
                className="text-lg px-8"
              >
                <FileText className="h-5 w-5 mr-2" /> Generate Request — $9.99
              </Button>
            ) : (
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
            )}
          </div>
        </section>

        <main className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Arrest Records specific content */}
          {isArrestRecords && (
            <>
              {/* Intro — Trust + Intent Match */}
              <section className="mb-12">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Arrest records and related court documents may be available to the public under {stateName} public records law. If you need official paperwork for personal, legal, or informational reasons, you can request it directly from the appropriate agency.
                </p>
                <p className="text-sm text-muted-foreground mt-3">
                  This page explains what you can request, how to request it, and how to prepare a proper public records request — without legal advice.
                </p>
              </section>

              {/* What's available */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">What Arrest-Related Records May Be Available</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Depending on the situation, you may be able to request:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Arrest reports',
                    'Warrant return records',
                    'Booking or jail intake records',
                    'Incident reports',
                    'Court administrative records',
                    'Probable cause affidavits (if unsealed)',
                  ].map(r => (
                    <li key={r} className="flex items-center gap-2 text-sm">
                      <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-3 italic">
                  Some records may be sealed or partially redacted under law.
                </p>
              </section>

              {/* Who holds records */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Who Holds Arrest Records in {stateName}</h2>
                <p className="text-sm text-muted-foreground mb-3">
                  Records are typically maintained by:
                </p>
                <ul className="space-y-2">
                  {[
                    'Local police departments',
                    'County sheriff\'s offices',
                    'County jails',
                    'Court clerks',
                  ].map(a => (
                    <li key={a} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mt-3 font-medium">
                  Choosing the correct agency matters.
                </p>
              </section>

              {/* How to request */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">How to Request Arrest Records in {stateName}</h2>
                <div className="grid gap-4">
                  {[
                    { n: 1, title: 'Identify the correct agency', desc: `Determine which ${stateName} agency holds the records you need.` },
                    { n: 2, title: 'Submit a written public records request', desc: 'Use proper statutory language and identify the records clearly.' },
                    { n: 3, title: 'Wait for response or clarification', desc: 'Agencies must respond within the timeframe prescribed by law.' },
                    { n: 4, title: 'Review or appeal if denied', desc: 'If denied, you may have the right to appeal or request redacted copies.' },
                  ].map(step => (
                    <Card key={step.n}>
                      <CardContent className="flex items-start gap-4 pt-4 pb-4">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          {step.n}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{step.title}</h3>
                          <p className="text-xs text-muted-foreground">{step.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Important limitations */}
              <Alert className="mb-12 border-destructive/50 bg-destructive/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="space-y-1">
                  <p className="font-medium">⚠️ Important Limitations</p>
                  <p className="text-xs">• This process does not check for active warrants</p>
                  <p className="text-xs">• Some records may be sealed</p>
                  <p className="text-xs">• Agencies may charge fees</p>
                  <p className="text-xs">• This tool does not provide legal advice</p>
                  <p className="text-xs">• We do not access law enforcement databases</p>
                  <p className="text-xs">• Users submit requests themselves</p>
                </AlertDescription>
              </Alert>

              {/* Conversion CTA */}
              <Card className="mb-12 border-primary/30 bg-primary/5 p-6 md:p-8 text-center">
                <h2 className="text-xl font-bold mb-2">Prepare a Public Records Request in Minutes</h2>
                <p className="text-muted-foreground mb-4 text-sm">
                  Generate a properly worded request letter for {stateName}, including:
                </p>
                <ul className="text-sm text-muted-foreground mb-6 space-y-1">
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Correct statutory language
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Agency contact details
                  </li>
                  <li className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Ready-to-send PDF
                  </li>
                </ul>
                <Button size="lg" onClick={() => setShowFOIA(true)}>
                  Generate Request — $9.99 <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Single request — $9.99
                  </span>
                  <span>|</span>
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Bundle — $29.99
                  </span>
                </div>
              </Card>

              {/* Disclaimer */}
              <div className="mb-12 text-center border rounded-lg p-4 bg-muted/30">
                <p className="text-xs text-muted-foreground">
                  This tool provides self-help information only and does not offer legal advice. Users submit requests themselves.
                </p>
              </div>
            </>
          )}

          {/* Non-arrest-records content (warrant-lookup and court-forms) */}
          {!isArrestRecords && (
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
          )}

          {/* Disclaimer for non-arrest-records */}
          {!isArrestRecords && (
            <Alert className="mb-12 border-destructive/50 bg-destructive/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This is legal information, not legal advice. {isWarrant
                  ? `Always verify warrant information with official ${stateName} law enforcement or court sources.`
                  : `Verify all forms are current with the ${stateName} court clerk before filing.`
                } For complex legal matters, consult a licensed {stateName} attorney.
              </AlertDescription>
            </Alert>
          )}

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
              {!isArrestRecords && (
                <LinkCard to={`/${stateSlug}-arrest-records`} icon={<BookOpen />} title={`Request ${stateName} Arrest Records`} desc="Generate a public records request" />
              )}
              {isArrestRecords && (
                <LinkCard to={`/${stateSlug}-warrant-lookup`} icon={<Search />} title={`${stateName} Warrant Lookup`} desc="Search public warrant records free" />
              )}
              <LinkCard to={`/states/${stateCode.toLowerCase()}`} icon={<MapPin />} title={`${stateName} Legal Help`} desc="All legal resources for your state" />
              <LinkCard to="/case-analysis" icon={<Scale />} title="Free Case Analysis" desc="AI-powered legal case review" />
              <LinkCard to="/court-records" icon={<ExternalLink />} title="Court Records Lookup" desc="Search case dockets nationwide" />
            </div>
          </section>

          {/* Bottom CTA */}
          {!isArrestRecords && (
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
          )}
        </main>

        <Footer />
      </div>

      {/* FOIA Request Generator Dialog */}
      <FOIARequestGenerator
        open={showFOIA}
        onOpenChange={setShowFOIA}
        defaultState={stateAbbrLower}
        defaultName=""
      />
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
