import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Search, ExternalLink, ShieldAlert, AlertTriangle, Loader2, Globe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { US_STATES } from '@/lib/states';

interface SearchResult {
  url?: string;
  title?: string;
  description?: string;
  markdown?: string;
}

export default function SexOffenderRegistry() {
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [registries, setRegistries] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [disclaimer, setDisclaimer] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state) {
      toast({ title: 'Missing field', description: 'Please select a state.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const { data, error } = await supabase.functions.invoke('sex-offender-search', {
        body: { name: name.trim(), state, zipCode: zipCode.trim() },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error);

      setResults(data.results || []);
      setRegistries(data.officialRegistries || []);
      setDisclaimer(data.disclaimer || '');
      toast({ title: 'Search complete', description: `Found ${(data.results || []).length} results.` });
    } catch (err) {
      toast({ title: 'Search failed', description: String(err), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Sex Offender Registry Search - Veritas Path"
        description="Free sex offender registry search across all 50 US states. Access NSOPW and state registries powered by Veritas Path — A Justice-Bot Technologies Platform."
        keywords="sex offender registry, sex offender search, NSOPW, registered sex offenders, public safety, Megan's Law"
        url="https://justicebot-usa.com/sex-offender-registry"
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
            <ShieldAlert className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-bold">Sex Offender Registry</h1>
              <p className="text-primary-foreground/80">Free public safety search — all 50 states + NSOPW</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert className="mb-6 border-destructive/50 bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Legal Disclaimer</AlertTitle>
          <AlertDescription>
            This is legal information, not legal advice. Data is sourced from public registries.
            Always verify through the <a href="https://www.nsopw.gov/" target="_blank" rel="noopener noreferrer" className="underline font-medium">National Sex Offender Public Website (NSOPW)</a> or your state's official registry.
          </AlertDescription>
        </Alert>

        {/* NSOPW Banner */}
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Globe className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="font-semibold">National Sex Offender Public Website</h2>
                  <p className="text-sm text-muted-foreground">Official US DOJ nationwide registry search</p>
                </div>
              </div>
              <Button asChild>
                <a href="https://www.nsopw.gov/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Search NSOPW.gov
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Registry
            </CardTitle>
            <CardDescription>
              Search by name, state, or zip code. State is required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name (optional)</label>
                  <Input
                    placeholder="e.g. John Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                  <label className="text-sm font-medium mb-2 block">Zip Code (optional)</label>
                  <Input
                    placeholder="e.g. 90210"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    maxLength={5}
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
                    Search Registry
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Official Registries */}
        {registries.length > 0 && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Official State Registries</CardTitle>
              <CardDescription>Direct links to your state's official sex offender registry</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {registries.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 mt-1 shrink-0 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{r.title || r.url}</p>
                      {r.description && <p className="text-xs text-muted-foreground mt-1">{r.description}</p>}
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
                <ShieldAlert className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                <p className="text-muted-foreground">
                  No registry records found for this search. Use the official portals above for the most comprehensive results.
                </p>
              </Card>
            )}
          </div>
        )}

        {disclaimer && hasSearched && (
          <p className="text-xs text-muted-foreground mt-6 text-center italic">{disclaimer}</p>
        )}
      </main>
    </div>
  );
}
