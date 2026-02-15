import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ExternalLink, ShieldAlert, AlertTriangle, Globe, MapIcon } from 'lucide-react';
import SexOffenderMap from '@/components/SexOffenderMap';
import { trackUSLookupStarted, trackUSLookupCompleted } from '@/hooks/useAnalytics';
import LookupActionCTA from '@/components/LookupActionCTA';
import PrepareFilingModal from '@/components/PrepareFilingModal';

interface SearchResult {
  url?: string;
  title?: string;
  description?: string;
  markdown?: string;
  lat?: number;
  lng?: number;
}

export default function SexOffenderRegistry() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [registries, setRegistries] = useState<SearchResult[]>([]);
  const [disclaimer, setDisclaimer] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const handleResultsUpdate = (newResults: SearchResult[], newRegistries: SearchResult[], newDisclaimer: string) => {
    if (!hasSearched) {
      trackUSLookupStarted('sex_offender', '');
    }
    setResults(newResults);
    setRegistries(newRegistries);
    setDisclaimer(newDisclaimer);
    setHasSearched(true);
    trackUSLookupCompleted('sex_offender', '', newResults.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Sex Offender Registry Map Search - Veritas Path"
        description="Free interactive map-based sex offender registry search. Find registered offenders in your community across all 50 US states. Powered by Veritas Path."
        keywords="sex offender registry, sex offender map, sex offender search, NSOPW, registered sex offenders, community safety, Megan's Law"
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
              <p className="text-primary-foreground/80">Interactive map search — find offenders in your community</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Alert className="mb-6 border-destructive/50 bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Legal Disclaimer</AlertTitle>
          <AlertDescription>
            This is legal information, not legal advice. Data is sourced from public registries.
            Map pins show <strong>approximate locations only</strong>. Always verify through the{' '}
            <a href="https://www.nsopw.gov/" target="_blank" rel="noopener noreferrer" className="underline font-medium">
              National Sex Offender Public Website (NSOPW)
            </a>{' '}
            or your state's official registry.
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

        {/* Map Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <MapIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Community Map Search</h2>
          </div>
          <SexOffenderMap onResultsUpdate={handleResultsUpdate} />
        </div>

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

        {/* Search Results List */}
        {hasSearched && results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Search Results ({results.length})</h2>
            {results.map((r, i) => (
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
            ))}
          </div>
        )}

        {hasSearched && results.length === 0 && (
          <Card className="p-8 text-center">
            <ShieldAlert className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
            <p className="text-muted-foreground">
              No registry records found in this area. Try zooming out or searching a different location.
            </p>
          </Card>
        )}

        {disclaimer && hasSearched && (
          <p className="text-xs text-muted-foreground mt-6 text-center italic">{disclaimer}</p>
        )}

        {/* Action CTA after results */}
        {hasSearched && (
          <LookupActionCTA
            onPrepareClick={() => setShowPaywall(true)}
          />
        )}

        <PrepareFilingModal
          open={showPaywall}
          onOpenChange={setShowPaywall}
          source="sex_offender_lookup"
        />
      </main>
    </div>
  );
}
