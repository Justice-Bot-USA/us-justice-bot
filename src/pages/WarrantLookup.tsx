import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, AlertTriangle, Search, ArrowRight, Building2 } from 'lucide-react';
import { US_STATES } from '@/lib/states';
import { stateToSlug } from '@/lib/warrantLookupConfig';

export default function WarrantLookup() {
  const [selectedState, setSelectedState] = useState('');
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const navigate = useNavigate();

  const handleGo = () => {
    if (!selectedState) return;
    const state = US_STATES.find(s => s.value === selectedState);
    if (state) {
      navigate(`/${stateToSlug(state.label)}-warrant-lookup`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <SEOHead
        title="Warrant Lookup Navigator — All 50 States | Veritas Path"
        description="Find official sheriff and court resources to check for warrants in your state. No database — real guidance to official sources."
        keywords="warrant lookup, active warrants, warrant search, outstanding warrants, public records search"
        url="https://justicebot-usa.com/warrant-lookup"
      />

      <Header language={language} onLanguageChange={(l) => setLanguage(l)} />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Shield className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">Warrant Lookup Navigator</h1>
          <p className="text-primary-foreground/80 text-sm sm:text-lg max-w-xl mx-auto">
            Find official resources to check for warrants in your state
          </p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8 max-w-3xl space-y-6">
        {/* Section 1 — Reality Check */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              What You Should Know First
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <span className="font-bold text-destructive shrink-0">✕</span>
                <p><strong>There is no national public warrant database.</strong> No website can search all warrants across all jurisdictions.</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <span className="font-bold text-destructive shrink-0">✕</span>
                <p><strong>Most warrants are handled at the county level.</strong> Sheriff offices and local courts manage warrant records individually.</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <span className="font-bold text-destructive shrink-0">✕</span>
                <p><strong>Federal warrants are sealed.</strong> They are not publicly searchable through any online system.</p>
              </div>
            </div>
            <Alert className="border-primary/30 bg-primary/5">
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>What this tool does:</strong> We connect you to the correct official sheriff directory and court case search for your state. No scraping, no fake databases.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Section 2 — State Selector */}
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Select Your State
            </CardTitle>
            <CardDescription>
              We'll show you official sheriff directories, court case search portals, and know-your-rights resources for your state.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose a state..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {US_STATES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleGo} disabled={!selectedState} className="sm:w-auto w-full">
                <Search className="h-4 w-4 mr-2" />
                Find Resources
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bottom note */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground italic">
            This is a state-based navigation tool — not a warrant database. We do not access law enforcement records.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
