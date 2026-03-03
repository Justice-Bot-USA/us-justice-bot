import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Shield, AlertTriangle, Building2, Scale, Phone, Search, FileText } from 'lucide-react';
import { warrantLookupConfig, type WarrantStateConfig } from '@/lib/warrantLookupConfig';

export default function StateWarrantLookup() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  // Extract state name from slug like "california-warrant-lookup" → "california"
  const stateName = (slug || '').replace(/-warrant-lookup$/, '');
  const config: WarrantStateConfig | undefined = warrantLookupConfig[stateName];

  if (!config) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header language={language} onLanguageChange={setLanguage} />
        <div className="flex-1 container mx-auto px-4 py-16 text-center">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">State Not Found</h1>
          <p className="text-muted-foreground mb-6">We couldn't find warrant lookup information for that state.</p>
          <Button onClick={() => navigate('/warrant-lookup')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Warrant Navigator
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <SEOHead
        title={`${config.stateName} Warrant Lookup Guide — Veritas Path`}
        description={`How to search for warrants in ${config.stateName}. Find your county sheriff, court case search, and know-your-rights resources. No database — real guidance.`}
        keywords={`${config.stateName} warrant lookup, ${config.stateCode} warrant search, ${config.stateName} active warrants, ${config.stateName} sheriff warrant list`}
        url={`https://justicebot-usa.com/${stateName}-warrant-lookup`}
      />

      <Header language={language} onLanguageChange={setLanguage} />

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-8 sm:py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/warrant-lookup">
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> All States
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Shield className="h-10 w-10 shrink-0" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{config.stateName} Warrant Lookup Guide</h1>
              <p className="text-primary-foreground/80 text-sm sm:text-base mt-1">
                How to check for warrants in {config.stateName} — official resources only
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8 max-w-4xl space-y-6">
        {/* Reality check */}
        <Alert className="border-destructive/50 bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Important</AlertTitle>
          <AlertDescription className="text-sm space-y-1">
            <p>There is no public online warrant database for {config.stateName}. Most warrants are managed at the county level by sheriff offices and courts.</p>
            <p className="text-xs">This page provides official starting points — not warrant results.</p>
          </AlertDescription>
        </Alert>

        {config.notes && config.notes.length > 0 && (
          <Alert>
            <AlertDescription className="text-sm">
              {config.notes.map((n, i) => <p key={i}>{n}</p>)}
            </AlertDescription>
          </Alert>
        )}

        {/* A) Sheriff Lookup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-primary" />
              Find Your County Sheriff
            </CardTitle>
            <CardDescription>
              County sheriffs maintain active warrant lists. Contact your local sheriff's office or check their website for "active warrant search" or "warrant list."
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-between" asChild>
              <a href={config.sheriffDirectory} target="_blank" rel="noopener noreferrer">
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {config.sheriffLabel}
                </span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <div className="bg-muted rounded-lg p-3 text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">What to do:</p>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>Visit the link above and find your county</li>
                <li>Go to the county sheriff's website</li>
                <li>Look for "Warrant Search," "Active Warrants," or "Most Wanted"</li>
                <li>Some offices require an in-person or phone inquiry</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* B) Court Case Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Scale className="h-5 w-5 text-primary" />
              {config.stateName} Court Case Search
            </CardTitle>
            <CardDescription>
              Some bench warrants appear in open criminal case dockets. Search the state court system for case records.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-between" asChild>
              <a href={config.courtSearchInfo} target="_blank" rel="noopener noreferrer">
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  {config.courtSearchLabel}
                </span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <p className="text-sm text-muted-foreground">
              Search by name or case number. Bench warrants issued for failure to appear may show up in criminal case records.
            </p>
          </CardContent>
        </Card>

        {/* C) Federal Section */}
        <Card className="border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-muted-foreground" />
              Federal Case Records
              <Badge variant="outline" className="text-xs">Not a Warrant Database</Badge>
            </CardTitle>
            <CardDescription>
              PACER allows federal case lookup but does NOT provide a warrant database.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-between" asChild>
              <a href="https://pacer.uscourts.gov/" target="_blank" rel="noopener noreferrer">
                <span className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  PACER — Public Access to Court Electronic Records
                </span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <div className="bg-muted rounded-lg p-3 text-sm text-muted-foreground space-y-1">
              <p>• Requires a free PACER account to search</p>
              <p>• Charges $0.10 per page viewed</p>
              <p>• Shows federal case filings — not active warrants</p>
              <p>• Federal warrants are sealed and not publicly searchable</p>
            </div>
          </CardContent>
        </Card>

        {/* D) Safer Alternatives */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="h-5 w-5 text-primary" />
              If You Think You Have a Warrant
            </CardTitle>
            <CardDescription>
              Don't ignore it. Here are your safest options.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="bg-background rounded-lg p-4 border">
                <h4 className="font-medium text-sm mb-1">Consult a Criminal Defense Attorney</h4>
                <p className="text-xs text-muted-foreground">An attorney can check warrant status confidentially and advise you on voluntary surrender or quashing the warrant.</p>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <h4 className="font-medium text-sm mb-1">Contact a Public Defender</h4>
                <p className="text-xs text-muted-foreground">If you cannot afford an attorney, contact your county's public defender office for assistance.</p>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <h4 className="font-medium text-sm mb-1">Call the Court Clerk</h4>
                <p className="text-xs text-muted-foreground">The court that issued the warrant can confirm its existence. Ask about options to resolve it.</p>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <h4 className="font-medium text-sm mb-1">Know Your Rights</h4>
                <p className="text-xs text-muted-foreground">You have the right to remain silent and the right to an attorney. Don't discuss your case without legal counsel.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center italic px-4">
          This page provides general information and links to official resources. It is not legal advice.
          Veritas Path does not access law enforcement databases and cannot confirm or deny the existence of warrants.
        </p>
      </main>

      <Footer />
    </div>
  );
}
