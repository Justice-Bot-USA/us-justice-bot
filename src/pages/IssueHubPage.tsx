import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, BookOpen, Zap, FileText, Clock, HelpCircle, ChevronRight, AlertTriangle, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { IssueHubSideRail } from '@/components/issues/IssueHubSideRail';
import { SourceCard } from '@/components/issues/SourceCard';
import { ResourceCard } from '@/components/issues/ResourceCard';
import { TriageWizard } from '@/components/issues/TriageWizard';
import { useIssueHub } from '@/hooks/useIssueHub';
import { US_STATES } from '@/lib/states';

export default function IssueHubPage() {
  const { jurisdiction, category, issue } = useParams<{ jurisdiction: string; category: string; issue: string }>();
  const hubKey = `${jurisdiction || 'ca'}/${category || 'family-law'}/${issue || ''}`;
  const { hub, sections, resources, triageFlow, formPackages, tracks, isLoading, error } = useIssueHub(hubKey);

  const [activeSection, setActiveSection] = useState('learn');
  const upperJur = (jurisdiction || '').toUpperCase();
  const isStateCode = US_STATES.some(s => s.value === upperJur);
  const [selectedState, setSelectedState] = useState(isStateCode ? upperJur : 'CA');

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const target = sectionId === 'wizard' ? 'do' : sectionId;
    sectionRefs.current[target]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const learnSections = sections.filter(s => s.section_type === 'learn' && (!s.jurisdiction_code || s.jurisdiction_code === selectedState));
  const doSections = sections.filter(s => s.section_type === 'do' && (!s.jurisdiction_code || s.jurisdiction_code === selectedState));
  const timelineSections = sections.filter(s => s.section_type === 'timeline' && (!s.jurisdiction_code || s.jurisdiction_code === selectedState));
  const helpSections = sections.filter(s => s.section_type === 'help' && (!s.jurisdiction_code || s.jurisdiction_code === selectedState));

  const filteredForms = formPackages.filter(f => f.jurisdiction_code === selectedState);
  const filteredResources = resources.filter(r => !r.jurisdiction_code || r.jurisdiction_code === selectedState);

  const triageSchema = triageFlow?.flow_schema as any;
  const basePath = `/${jurisdiction || 'ca'}/${category || 'family-law'}/${issue || ''}`;

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header language="en" onLanguageChange={() => {}} />
        <div className="flex-1 container mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-6 w-1/2" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <Skeleton className="h-64" />
            <div className="md:col-span-3 space-y-4">
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hub) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header language="en" onLanguageChange={() => {}} />
        <div className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Issue Hub Not Found</h1>
          <p className="text-muted-foreground">This topic hasn't been set up yet.</p>
          <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <Helmet>
        <title>{hub.title} | A.I. ANAL – A.I. ANAL</title>
        <meta name="description" content={hub.summary || `Learn about ${hub.title}, find forms, get help.`} />
      </Helmet>
      <Header language="en" onLanguageChange={() => {}} />

      {/* Header block */}
      <div className="border-b bg-card/50 shrink-0">
        <div className="container mx-auto px-4 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Badge variant="outline" className="capitalize shrink-0">{hub.category}</Badge>
              <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">{hub.title}</h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <MapPin className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-[140px] sm:w-[180px] h-8 text-sm">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {hub.summary && (
            <p className="text-muted-foreground text-sm max-w-2xl mb-2 sm:mb-3">{hub.summary}</p>
          )}
          {triageSchema && (
            <Button size="sm" onClick={() => scrollToSection('wizard')} className="gap-1">
              Start Now <ChevronRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-8">
          {/* Side rail */}
          <div className="hidden lg:block">
            <IssueHubSideRail
              activeSection={activeSection}
              onSectionChange={scrollToSection}
              hasWizard={!!triageSchema}
            />
          </div>

          {/* Main content — 3 lanes */}
          <div className="space-y-8 sm:space-y-10 min-w-0">
            {/* ═══ LEARN ═══ */}
            <section ref={(el: HTMLDivElement | null) => { sectionRefs.current['learn'] = el; }}>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-lg sm:text-xl font-bold text-foreground">Learn</h2>
              </div>
              {learnSections.length === 0 ? (
                <Card><CardContent className="pt-6 text-center text-muted-foreground">No content yet for this state.</CardContent></Card>
              ) : (
                <div className="space-y-4">
                  {learnSections.map(s => (
                    <Card key={s.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{s.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap">{s.content_md}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* ═══ DO (Tracks + Wizard) ═══ */}
            <section ref={(el: HTMLDivElement | null) => { sectionRefs.current['do'] = el; }}>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-primary" />
                <h2 className="text-lg sm:text-xl font-bold text-foreground">Do</h2>
              </div>

              {/* Track action buttons */}
              {tracks.length > 0 && (
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 mb-6">
                  {tracks.map(t => (
                    <Link key={t.id} to={`${basePath}/track/${t.track_key}`}>
                      <Card className={`border hover:shadow-md transition-all cursor-pointer ${
                        t.track_key === 'emergency' ? 'border-destructive/30 hover:border-destructive/60' : 'hover:border-primary/40'
                      }`}>
                        <CardContent className="p-3 sm:p-4 flex items-start gap-3">
                          {t.track_key === 'emergency' ? (
                            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                          ) : (
                            <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm text-foreground">{t.title}</h3>
                            {t.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              {/* Wizard */}
              {triageSchema && (
                <div className="mb-6">
                  <TriageWizard flowSchema={triageSchema} />
                </div>
              )}

              {doSections.length > 0 && (
                <div className="space-y-4">
                  {doSections.map(s => (
                    <Card key={s.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{s.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap">{s.content_md}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* ═══ FORMS ═══ */}
            <section ref={(el: HTMLDivElement | null) => { sectionRefs.current['forms'] = el; }}>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-lg sm:text-xl font-bold text-foreground">Forms & Documents</h2>
                <Badge variant="outline" className="ml-auto">{selectedState}</Badge>
              </div>
              {/* Always-visible official directory + latest changes */}
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 mb-3">
                <SourceCard
                  formNumber="CA FORMS"
                  title="California Courts — Court Forms Directory (Official)"
                  description="Search official Judicial Council forms by form number, title, topic, or browse by category."
                  officialDirectoryUrl="https://courts.ca.gov/rules-forms/court-forms"
                  url="https://courts.ca.gov/rules-forms/court-forms"
                  category="official"
                  isRequired={false}
                />
                <SourceCard
                  formNumber="UPDATES"
                  title="Latest Changes to California Court Forms"
                  description="New and revised Judicial Council forms — stay current on changes that affect your case."
                  officialDirectoryUrl="https://courts.ca.gov/forms-rules/court-forms/latest-changes"
                  url="https://courts.ca.gov/forms-rules/court-forms/latest-changes"
                  category="official"
                  isRequired={false}
                />
              </div>
              {filteredForms.length === 0 ? (
                <Card><CardContent className="pt-6 text-center text-muted-foreground">No specific forms loaded for {selectedState} yet.</CardContent></Card>
              ) : (
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  {filteredForms.map(f => (
                    <SourceCard
                      key={f.id}
                      formNumber={f.form_number}
                      title={f.form_name}
                      description={f.description || undefined}
                      url={f.url || undefined}
                      officialFormPageUrl={f.official_form_page_url}
                      officialPdfUrl={f.official_pdf_url}
                      officialDirectoryUrl={f.official_directory_url}
                      category={f.category || 'general'}
                      isRequired={f.is_required}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* ═══ TIMELINE ═══ */}
            <section ref={(el: HTMLDivElement | null) => { sectionRefs.current['timeline'] = el; }}>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="text-lg sm:text-xl font-bold text-foreground">Timeline & Steps</h2>
              </div>
              {timelineSections.length === 0 ? (
                <Card><CardContent className="pt-6 text-center text-muted-foreground">Timeline coming soon.</CardContent></Card>
              ) : (
                <div className="space-y-4">
                  {timelineSections.map((s, i) => (
                    <div key={s.id} className="flex gap-3 sm:gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {i + 1}
                        </div>
                        {i < timelineSections.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                      </div>
                      <Card className="flex-1 mb-2 min-w-0">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{s.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-muted-foreground whitespace-pre-wrap">{s.content_md}</div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ═══ GET HELP ═══ */}
            <section ref={(el: HTMLDivElement | null) => { sectionRefs.current['help'] = el; }}>
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h2 className="text-lg sm:text-xl font-bold text-foreground">Get Help</h2>
              </div>
              {filteredResources.length === 0 && helpSections.length === 0 ? (
                <Card><CardContent className="pt-6 text-center text-muted-foreground">No help resources loaded yet.</CardContent></Card>
              ) : (
                <div className="space-y-4">
                  {helpSections.map(s => (
                    <Card key={s.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{s.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap">{s.content_md}</div>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    {filteredResources.map(r => (
                      <ResourceCard
                        key={r.id}
                        label={r.label}
                        url={r.url}
                        description={r.description || undefined}
                        category={r.category}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Bottom CTA */}
            {triageSchema && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 sm:p-6 text-center">
                <h3 className="text-lg font-bold text-foreground mb-2">Ready to take the next step?</h3>
                <p className="text-sm text-muted-foreground mb-4">Use our guided wizard to find the right path for your situation.</p>
                <Button onClick={() => scrollToSection('wizard')}>
                  Start Your Plan
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}