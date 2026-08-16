import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Search, ArrowRight, Building2, CheckCircle2, XCircle } from 'lucide-react';
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
        title="Warrant Lookup (State & County Guide) | Justice Bot USA"
        description="There is no free national warrant search. This tool helps you find the official places to check by state and county, and explains safer next steps."
        keywords="warrant lookup, active warrants, warrant search, outstanding warrants, county sheriff warrant list"
        url="https://justicebot-usa.com/warrant-lookup"
      />

      <Header language={language} onLanguageChange={setLanguage} />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Shield className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-2xl sm:text-4xl font-bold mb-3">Warrant Lookup (State &amp; County Guide)</h1>
          <p className="text-primary-foreground/80 text-sm sm:text-lg max-w-2xl mx-auto">
            There is no free national warrant search in the U.S. Most warrants are handled at the county level,
            and many are not published online. This tool helps you find the official places to check by state
            and county, and explains safer next steps.
          </p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8 max-w-3xl space-y-6">

        {/* State Selector — primary CTA */}
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Select Your State
            </CardTitle>
            <CardDescription>
              We'll show you official sheriff directories, court case search portals, clerk contact options, and a "what to do next" plan.
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
                See Official Options
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* What this tool does / does not do */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              What This Tool Does &amp; Does Not Do
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2 p-2.5 bg-primary/5 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p>Routes you to official county sheriff / court lookup pages (when available)</p>
            </div>
            <div className="flex items-start gap-2 p-2.5 bg-primary/5 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p>Shows court case search portals (bench warrants may appear in case dockets)</p>
            </div>
            <div className="flex items-start gap-2 p-2.5 bg-primary/5 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p>Gives phone/contact options for clerks or sheriff offices</p>
            </div>
            <div className="flex items-start gap-2 p-2.5 bg-primary/5 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p>Provides a "what to do next" plan if you think a warrant exists</p>
            </div>

            <div className="border-t border-border my-3" />

            <div className="flex items-start gap-2 p-2.5 bg-destructive/5 rounded-lg">
              <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p>Does <strong>not</strong> run a nationwide warrant search</p>
            </div>
            <div className="flex items-start gap-2 p-2.5 bg-destructive/5 rounded-lg">
              <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p>Does <strong>not</strong> access private or law-enforcement-only systems</p>
            </div>
            <div className="flex items-start gap-2 p-2.5 bg-destructive/5 rounded-lg">
              <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p>Does <strong>not</strong> guarantee results — many warrants aren't listed online</p>
            </div>
          </CardContent>
        </Card>

        {/* Safety note */}
        <Alert className="border-primary/30 bg-primary/5">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Safety note:</strong> If you think a warrant might exist, be careful about walking
            into a police station without legal advice. Consider speaking with a criminal defense lawyer
            or legal aid first.
          </AlertDescription>
        </Alert>

        {/* Cross-link */}
        <div className="text-center space-y-2 pt-2">
          <p className="text-sm text-muted-foreground">
            Need help with another legal topic?{' '}
            <Link to="/legal-areas" className="text-primary hover:underline font-medium">
              Browse Legal Areas
            </Link>
          </p>
          <p className="text-xs text-muted-foreground italic">
            This is a state-based navigation tool — not a warrant database. We do not access law enforcement records.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
