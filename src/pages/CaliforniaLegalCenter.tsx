import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getFillableByFormNumber } from '@/lib/formfill';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield, Heart, Scale, Baby, Briefcase, Building2, HandHeart,
  Search, ExternalLink, FileText, ListChecks, MapPin, Clock, DollarSign,
} from 'lucide-react';
import { CA_FORMS_BY_CATEGORY, type CaCategoryKey } from "@/lib/ca/forms";
import { CA_PROCEDURES } from "@/lib/ca/procedures";

const CATEGORIES: { key: CaCategoryKey; label: string; icon: React.ReactNode; blurb: string }[] = [
  { key: 'criminal', label: 'Criminal', icon: <Shield className="h-4 w-4" />, blurb: 'Dismissal (PC §1203.4) and other record-clearing options.' },
  { key: 'family', label: 'Family', icon: <Heart className="h-4 w-4" />, blurb: 'Custody, support, and domestic violence restraining orders.' },
  { key: 'divorce', label: 'Divorce', icon: <Scale className="h-4 w-4" />, blurb: 'Dissolution of marriage or domestic partnership in Superior Court.' },
  { key: 'cps', label: 'CPS / Dependency', icon: <Baby className="h-4 w-4" />, blurb: 'Parents\' rights in juvenile dependency court.' },
  { key: 'workplace', label: 'Workplace', icon: <Briefcase className="h-4 w-4" />, blurb: 'Wage claims, retaliation, workers\' comp, safety, unemployment.' },
  { key: 'civil', label: 'Civil', icon: <Building2 className="h-4 w-4" />, blurb: 'Small claims, eviction defense, harassment orders, fee waivers.' },
  { key: 'human-rights', label: 'Civil Rights', icon: <HandHeart className="h-4 w-4" />, blurb: 'Discrimination complaints at CRD and the EEOC.' },
];

export default function CaliforniaLegalCenter() {
  const [active, setActive] = useState<CaCategoryKey>('criminal');
  const [query, setQuery] = useState('');

  const forms = CA_FORMS_BY_CATEGORY[active];
  const procedure = CA_PROCEDURES[active];

  // With a search term, look in every legal area, not just the open tab.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return forms.map((f) => ({ f, area: '', key: active }));
    return CATEGORIES.flatMap((c) =>
      CA_FORMS_BY_CATEGORY[c.key].map((f) => ({ f, area: c.label, key: c.key })),
    ).filter(({ f, area }) =>
      [f.formNumber, f.name, f.description, f.category, area].join(' ').toLowerCase().includes(q),
    );
  }, [forms, query, active]);
  // While searching, results span areas, so the open tab's filing procedure would be unrelated.
  const searching = query.trim() !== '';
  const openArea = (key: CaCategoryKey) => { setActive(key); setQuery(''); };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Helmet>
        <title>California Legal Center — Forms, Procedures & Filing | Justice Bot USA</title>
        <meta name="description" content="California legal information across 7 areas: criminal record clearing, family, divorce, dependency, workplace, civil, and civil rights — with official Judicial Council forms and filing procedures." />
        <link rel="canonical" href="https://justicebot-usa.com/ca/legal-center" />
      </Helmet>
      <Header language="en" onLanguageChange={() => {}} />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-gradient-to-b from-[hsl(220,30%,8%)] to-[hsl(220,30%,6%)] text-white">
          <div className="container mx-auto px-4 py-10">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-blue-300/80 mb-3">
              <MapPin className="h-3 w-3" /> California
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">California Legal Center</h1>
            <p className="text-blue-100/80 max-w-2xl">
              Seven legal areas, official Judicial Council forms, filing procedures, and venue guidance — built for California. Sourced from the California Courts Self-Help Guide, DIR, EDD, and the Civil Rights Department.
            </p>
            <p className="text-xs text-blue-200/60 mt-4 italic">
              Legal information, not legal advice. We do not predict outcomes or recommend whether to sue.
            </p>
          </div>
        </section>

        {/* Category tabs */}
        <section className="container mx-auto px-4 py-6">
          <Tabs value={active} onValueChange={(v) => setActive(v as CaCategoryKey)}>
            <TabsList className="flex flex-wrap h-auto justify-start gap-1 bg-muted/50 p-1">
              {CATEGORIES.map((c) => (
                <TabsTrigger key={c.key} value={c.key} className="gap-1.5">
                  {c.icon}
                  <span className="text-xs sm:text-sm">{c.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {CATEGORIES.map((c) => (
              <TabsContent key={c.key} value={c.key} className="mt-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Left: Procedure */}
                  {!searching && (
                  <div className="lg:col-span-1 space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ListChecks className="h-4 w-4" /> Filing procedure
                        </div>
                        <CardTitle className="text-lg">{procedure.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div>
                          <div className="flex items-center gap-1.5 font-medium text-foreground"><MapPin className="h-3.5 w-3.5" /> Venue</div>
                          <p className="text-muted-foreground">{procedure.venue}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-medium text-foreground"><DollarSign className="h-3.5 w-3.5" /> Fees</div>
                          <p className="text-muted-foreground">{procedure.fees}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-medium text-foreground"><Clock className="h-3.5 w-3.5" /> Key deadlines</div>
                          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                            {procedure.deadlines.map((d, i) => <li key={i}>{d}</li>)}
                          </ul>
                        </div>
                        {procedure.eFilingUrl && (
                          <Button variant="outline" size="sm" asChild className="w-full">
                            <a href={procedure.eFilingUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" /> e-Filing
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-base">Step-by-step</CardTitle></CardHeader>
                      <CardContent>
                        <ol className="space-y-3 text-sm">
                          {procedure.steps.map((s, i) => (
                            <li key={i} className="flex gap-3">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">{i + 1}</span>
                              <div>
                                <div className="font-medium text-foreground">{s.title}</div>
                                <p className="text-muted-foreground">{s.detail}</p>
                                {s.ref && <a href={s.ref} target="_blank" rel="noopener noreferrer" className="text-xs text-primary inline-flex items-center gap-1 mt-1">Reference <ExternalLink className="h-3 w-3" /></a>}
                              </div>
                            </li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  </div>
                  )}

                  {/* Right: Forms */}
                  <div className={searching ? 'lg:col-span-3 space-y-4' : 'lg:col-span-2 space-y-4'}>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">{query.trim() ? <>{filtered.length} result{filtered.length !== 1 ? 's' : ''} in all areas</> : <>{c.icon}{c.label} Forms</>}</h2>
                        {searching && <p className="text-sm text-muted-foreground">Click a result's area to see that area's filing steps.</p>}
                        {!searching && <p className="text-sm text-muted-foreground">{c.blurb}</p>}
                      </div>
                      <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="Search forms…" value={query} onChange={(e) => setQuery(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {filtered.map(({ f, area, key }) => (
                        <Card key={`${area}-${f.formNumber}-${f.name}`} className="hover:border-primary/40 transition-colors">
                          <CardContent className="p-4 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-primary shrink-0" />
                                  <span className="font-mono text-xs font-semibold truncate">{f.formNumber}</span>
                                </div>
                                <h3 className="font-medium text-sm leading-snug mt-1">{f.name}</h3>
                              </div>
                              {searching ? (
                                <button type="button" onClick={() => openArea(key)} title={`See ${area} filing steps`}>
                                  <Badge variant="outline" className="text-[10px] shrink-0 hover:bg-primary/10">{area}</Badge>
                                </button>
                              ) : (
                                <Badge variant="outline" className="text-[10px] shrink-0">{f.category}</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{f.description}</p>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-xs text-muted-foreground">{f.feeAmount || '—'}{f.feeWaiverAvailable ? ' · Waiver available' : ''}</span>
                              <div className="flex items-center gap-1">
                                {getFillableByFormNumber('CA', f.formNumber) && (
                                  <Button size="sm" asChild>
                                    <Link to={`/fill/ca/${getFillableByFormNumber('CA', f.formNumber)!.id}`}>Fill this form</Link>
                                  </Button>
                                )}
                                {f.url && (
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={f.url} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-3 w-3 mr-1" /> Official
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {filtered.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-8">No forms match "{query}" in any area.</p>
                    )}

                    {!searching && (
                    <Card className="bg-muted/30">
                      <CardContent className="p-4 text-xs text-muted-foreground">
                        <strong className="text-foreground">Sources:</strong> {procedure.sources.join(' · ')}
                      </CardContent>
                    </Card>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">Need help organizing your California case?</h3>
                <p className="text-sm text-muted-foreground">Run a guided triage and organize your facts, deadlines, and evidence in one place.</p>
              </div>
              <Button asChild>
                <Link to="/start">Start your case</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
}