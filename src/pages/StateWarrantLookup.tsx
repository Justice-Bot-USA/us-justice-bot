import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft, ExternalLink, Shield, AlertTriangle, Building2,
  Scale, Phone, Search, FileText, BookOpen,
} from 'lucide-react';
import { warrantLookupConfig, type WarrantStateConfig } from '@/lib/warrantLookupConfig';
import { supabase } from '@/integrations/supabase/client';

interface DbResource {
  id: string;
  label: string;
  url: string;
  description: string | null;
  category: string;
  sort_order: number;
}

const CATEGORY_ICONS: Record<string, typeof ExternalLink> = {
  official: FileText,
  courts: Scale,
  sheriff: Shield,
  contact: Phone,
  rights: BookOpen,
};

const CATEGORY_LABELS: Record<string, string> = {
  official: 'Official',
  courts: 'Courts',
  sheriff: 'Sheriff',
  contact: 'Contact',
  rights: 'Rights',
};

export default function StateWarrantLookup() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [dbResources, setDbResources] = useState<DbResource[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  const stateName = (slug || '').replace(/-warrant-lookup$/, '');
  const config: WarrantStateConfig | undefined = warrantLookupConfig[stateName];

  // Fetch DB resources for this state
  useEffect(() => {
    if (!stateName) return;
    setDbLoading(true);
    supabase
      .from('warrant_lookup_resources')
      .select('id, label, url, description, category, sort_order')
      .eq('state_slug', stateName)
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => {
        setDbResources((data as DbResource[]) || []);
        setDbLoading(false);
      });
  }, [stateName]);

  if (!config) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header language={language} onLanguageChange={setLanguage} />
        <div className="flex-1 container mx-auto px-4 py-16 text-center">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">State Not Configured Yet</h1>
          <p className="text-muted-foreground mb-6">
            We don't have official links configured for this state yet. Check back soon.
          </p>
          <Button onClick={() => navigate('/warrant-lookup')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Warrant Lookup
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <SEOHead
        title={`${config.stateName} Warrant Lookup (Official Options by County) — Veritas Path`}
        description={`Warrants in ${config.stateName} are usually handled by county agencies. Find official sheriff directories, court case search portals, and know-your-rights resources.`}
        keywords={`${config.stateName} warrant lookup, ${config.stateCode} warrant search, ${config.stateName} active warrants, ${config.stateName} sheriff warrant list, ${config.stateName} court records`}
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
              <h1 className="text-2xl sm:text-3xl font-bold">
                {config.stateName} Warrant Lookup (Official Options by County)
              </h1>
              <p className="text-primary-foreground/80 text-sm sm:text-base mt-1">
                Warrants in {config.stateName} are usually handled by county agencies (sheriffs/courts).
                This page gives you the official places to check.
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
            <p>
              There is no public online warrant database for {config.stateName}. Some counties provide
              online lookup tools; many do not. This page provides official starting points — not warrant results.
            </p>
          </AlertDescription>
        </Alert>

        {config.notes && config.notes.length > 0 && (
          <Alert>
            <AlertDescription className="text-sm">
              {config.notes.map((n, i) => <p key={i}>{n}</p>)}
            </AlertDescription>
          </Alert>
        )}

        {/* Section 1: Check your county sheriff site */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="h-5 w-5 text-primary" />
              Check Your County Sheriff Site
            </CardTitle>
            <CardDescription>
              Look for terms like: "warrant search," "active warrants," "most wanted," or "inmate lookup."
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
                <li>If no online tool exists, call the sheriff's office directly</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Court case search (bench warrants may appear) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Scale className="h-5 w-5 text-primary" />
              Check Court Case Search (Bench Warrants May Appear)
            </CardTitle>
            <CardDescription>
              Some warrants (especially bench warrants) can show up in case records, depending on the county and portal.
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

        {/* Section 3: Call the clerk or sheriff */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="h-5 w-5 text-primary" />
              Call the Clerk or Sheriff (Official Confirmation)
            </CardTitle>
            <CardDescription>
              If no online tool exists, the official option is contacting the appropriate office.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg p-3 text-sm text-muted-foreground space-y-1">
              <p>• Use the court directory above to find the correct county court clerk phone number</p>
              <p>• Call the county sheriff's non-emergency line and ask about warrant inquiries</p>
              <p>• Some offices will confirm over the phone; others require an in-person visit</p>
              <p className="font-medium text-foreground mt-2">Tip: Ask for the "records" or "warrants" department specifically.</p>
            </div>
          </CardContent>
        </Card>

        {/* DB-sourced additional resources */}
        {dbLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ) : dbResources.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-primary" />
                Additional Official Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {dbResources.map((r) => {
                const Icon = CATEGORY_ICONS[r.category] || ExternalLink;
                return (
                  <a
                    key={r.id}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-lg border hover:border-primary/40 hover:bg-muted/50 transition-colors group"
                  >
                    <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm group-hover:text-primary transition-colors">
                          {r.label}
                        </span>
                        <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      {r.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>
                      )}
                      <Badge variant="outline" className="mt-1 text-[10px]">
                        {CATEGORY_LABELS[r.category] || r.category}
                      </Badge>
                    </div>
                  </a>
                );
              })}
            </CardContent>
          </Card>
        ) : null}

        {/* Federal Section */}
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

        {/* What to do if you find something */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Phone className="h-5 w-5 text-primary" />
              What To Do If You Find Something
            </CardTitle>
            <CardDescription>
              Don't ignore it. Here are your safest options.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="bg-background rounded-lg p-4 border">
                <h4 className="font-medium text-sm mb-1">Don't Ignore Court Dates</h4>
                <p className="text-xs text-muted-foreground">Missing a court date can lead to additional warrants. If you've missed one, contact the court clerk immediately.</p>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <h4 className="font-medium text-sm mb-1">Get Legal Advice If Possible</h4>
                <p className="text-xs text-muted-foreground">A criminal defense attorney can check warrant status confidentially and advise on voluntary surrender or quashing.</p>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <h4 className="font-medium text-sm mb-1">Contact a Public Defender</h4>
                <p className="text-xs text-muted-foreground">If you cannot afford an attorney, contact your county's public defender office for assistance.</p>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <h4 className="font-medium text-sm mb-1">Keep Records</h4>
                <p className="text-xs text-muted-foreground">Screenshot or save any results you find, including dates and sources. This can help your attorney.</p>
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
