import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Search, ExternalLink, Shield, AlertTriangle, Loader2, Scale } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { US_STATES } from '@/lib/states';
import { trackUSLookupStarted, trackUSLookupCompleted } from '@/hooks/useAnalytics';
import LookupActionCTA from '@/components/LookupActionCTA';
import PrepareFilingModal from '@/components/PrepareFilingModal';
import FOIARecordsModule from '@/components/FOIARecordsModule';
import FOIARequestGenerator from '@/components/FOIARequestGenerator';

interface SearchResult {
  url?: string;
  title?: string;
  description?: string;
  markdown?: string;
}

export default function WarrantLookup() {
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [county, setCounty] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [portals, setPortals] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [disclaimer, setDisclaimer] = useState('');
  const [showPaywall, setShowPaywall] = useState(false);
  const [showFOIA, setShowFOIA] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !state) {
      toast({ title: 'Missing fields', description: 'Please enter a name and select a state.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    trackUSLookupStarted('warrant', state);
    try {
      const { data, error } = await supabase.functions.invoke('warrant-lookup', {
        body: { name: name.trim(), state, county: county.trim() },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      const resultsList = data.results || [];
      setResults(resultsList);
      setPortals(data.officialPortals || []);
      setDisclaimer(data.disclaimer || '');
      trackUSLookupCompleted('warrant', state, resultsList.length);
      toast({ title: 'Search complete', description: `Found ${resultsList.length} results.` });
    } catch (err) {
      toast({ title: 'Search failed', description: String(err), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Free Warrant Lookup - Veritas Path"
        description="Search for active warrants across all 50 US states. Free public records search powered by Veritas Path — A Justice-Bot Technologies Platform."
        keywords="warrant lookup, active warrants, warrant search, outstanding warrants, public records search"
        url="https://justicebot-usa.com/warrant-lookup"
      />

      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Shield className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-bold">Warrant Lookup</h1>
              <p className="text-primary-foreground/80">Free public records search — all 50 states</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert className="mb-6 border-destructive/50 bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Legal Disclaimer</AlertTitle>
          <AlertDescription>
            This is legal information, not legal advice. Results are sourced from public records.
            Always verify with official court or law enforcement sources. If you have an active warrant,
            consult an attorney immediately.
          </AlertDescription>
        </Alert>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search for Warrants
            </CardTitle>
            <CardDescription>
              Enter a name and state to search public warrant records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Full Name *</label>
                  <Input
                    placeholder="e.g. John Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">State *</label>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {US_STATES.map((s) => (
                        <SelectItem key={s.value} value={s.label}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">County (optional)</label>
                  <Input
                    placeholder="e.g. Los Angeles"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search Warrants
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Official Portals */}
        {portals.length > 0 && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Official Court Portals</CardTitle>
              <CardDescription>Direct links to official warrant search resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {portals.map((p, i) => (
                  <a
                    key={i}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mt-1 shrink-0 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{p.title || p.url}</p>
                      {p.description && <p className="text-xs text-muted-foreground mt-1">{p.description}</p>}
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        {hasSearched && !isLoading && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Search Results</h2>
            {results.length > 0 ? (
              results.map((r, i) => (
                <Card key={i} className="hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base mb-1">{r.title || 'Untitled'}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{r.description}</p>
                        {r.url && (
                          <Badge variant="outline" className="text-xs">
                            {new URL(r.url).hostname}
                          </Badge>
                        )}
                      </div>
                      {r.url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={r.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </a>
                        </Button>
                      )}
                    </div>
                    {r.markdown && (
                      <div className="mt-3 p-3 bg-muted rounded-lg text-xs max-h-40 overflow-y-auto whitespace-pre-wrap">
                        {r.markdown.substring(0, 500)}
                        {r.markdown.length > 500 && '...'}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                <p className="text-muted-foreground">
                  No public warrant records were found for this search. This does not guarantee no warrants exist.
                  Check official court portals above for the most accurate information.
                </p>
              </Card>
            )}
          </div>
        )}

        {disclaimer && hasSearched && (
          <p className="text-xs text-muted-foreground mt-6 text-center italic">{disclaimer}</p>
        )}

        {/* FOIA Records Module after results */}
        {hasSearched && !isLoading && (
          <FOIARecordsModule
            onGenerateClick={() => setShowFOIA(true)}
            state={state}
          />
        )}

        {/* Action CTA after results */}
        {hasSearched && !isLoading && (
          <LookupActionCTA
            onPrepareClick={() => setShowPaywall(true)}
            state={state}
          />
        )}

        <FOIARequestGenerator
          open={showFOIA}
          onOpenChange={setShowFOIA}
          defaultState={state ? US_STATES.find(s => s.label === state)?.value || '' : ''}
          defaultName={name}
        />

        <PrepareFilingModal
          open={showPaywall}
          onOpenChange={setShowPaywall}
          defaultState={state ? US_STATES.find(s => s.label === state)?.value || '' : ''}
          source="warrant_lookup"
        />
      </main>
    </div>
  );
}
