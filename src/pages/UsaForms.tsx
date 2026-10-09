import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SEOHead } from '@/components/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft, Search, ExternalLink, Download, FileText,
  Scale, Info, Building2, RefreshCw, CheckCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAdminAccess } from '@/hooks/useAdminAccess';

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'general', label: 'General' },
  { value: 'family', label: 'Family Law' },
  { value: 'small-claims', label: 'Small Claims' },
  { value: 'criminal', label: 'Criminal' },
  { value: 'employment', label: 'Employment' },
  { value: 'immigration', label: 'Immigration' },
  { value: 'workers-rights', label: 'Workers Rights' },
  { value: 'housing', label: 'Housing' },
];

// CA and NY have verified catalogs and form filling in their own legal centers.
const STATE_CENTERS: Record<string, { name: string; center: string; fill?: string }> = {
  'US-CA': { name: 'California', center: '/ca/legal-center', fill: '/fill/ca' },
  'US-NY': { name: 'New York', center: '/ny/legal-center', fill: '/fill/ny' },
};

const LAUNCH_STATES = ['US-FED', 'US-CA', 'US-NY', 'US-TX', 'US-FL', 'US-IL', 'US-WA', 'US-MA', 'US-PA', 'US-GA', 'US-NJ'];

export default function UsaForms() {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('US-FED');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  // Syncing scrapes court sites and writes with the service role; the function only accepts admins.
  const { isAdmin } = useAdminAccess();

  // Fetch jurisdictions
  const { data: jurisdictions, isLoading: loadingJurisdictions } = useQuery({
    queryKey: ['us-jurisdictions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jurisdictions')
        .select('*')
        .eq('country', 'US')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch forms for selected jurisdiction
  const { data: forms, isLoading: loadingForms, refetch: refetchForms } = useQuery({
    queryKey: ['us-forms', selectedJurisdiction, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('forms')
        .select('*')
        .eq('country', 'US')
        .eq('jurisdiction_code', selectedJurisdiction)
        .eq('is_active', true)
        .order('title');

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch form sources for current jurisdiction
  const { data: sources } = useQuery({
    queryKey: ['us-form-sources', selectedJurisdiction],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_sources')
        .select('*')
        .eq('country', 'US')
        .eq('jurisdiction_code', selectedJurisdiction)
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
  });

  const filteredForms = useMemo(() => {
    if (!forms) return [];
    if (!searchQuery.trim()) return forms;
    const q = searchQuery.toLowerCase();
    return forms.filter(f =>
      f.title?.toLowerCase().includes(q) ||
      f.form_number?.toLowerCase().includes(q) ||
      f.description?.toLowerCase().includes(q) ||
      f.category?.toLowerCase().includes(q)
    );
  }, [forms, searchQuery]);

  const currentJurisdiction = jurisdictions?.find(j => j.code === selectedJurisdiction);
  const isLaunchState = LAUNCH_STATES.includes(selectedJurisdiction);

  // Auto-sync: trigger sync on first load if no forms exist for the jurisdiction
  const autoSyncDone = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (
      isAdmin &&
      isLaunchState &&
      forms !== undefined &&
      forms.length === 0 &&
      !autoSyncDone.current.has(selectedJurisdiction)
    ) {
      autoSyncDone.current.add(selectedJurisdiction);
      (async () => {
        try {
          toast({ title: 'Auto-syncing forms', description: 'Fetching forms from official sources...' });
          const { data, error } = await supabase.functions.invoke('sync-us-forms');
          if (error) throw error;
          toast({ title: 'Sync complete', description: data?.message || 'Forms updated.' });
          refetchForms();
        } catch (err) {
          console.error('Auto-sync failed:', err);
        }
      })();
    }
  }, [forms, selectedJurisdiction, isLaunchState, isAdmin, refetchForms]);

  const stateCenter = STATE_CENTERS[selectedJurisdiction];

  const handleSync = async () => {
    toast({ title: 'Sync started', description: 'Fetching forms from official sources...' });
    try {
      const { data, error } = await supabase.functions.invoke('sync-us-forms');
      if (error) throw error;
      toast({ title: 'Sync complete', description: data?.message || 'Forms updated.' });
      refetchForms();
    } catch (err) {
      toast({ title: 'Sync failed', description: String(err), variant: 'destructive' });
    }
  };

  // Sort jurisdictions: launch states first, then alphabetical
  const sortedJurisdictions = useMemo(() => {
    if (!jurisdictions) return [];
    return [...jurisdictions].sort((a, b) => {
      const aLaunch = LAUNCH_STATES.includes(a.code);
      const bLaunch = LAUNCH_STATES.includes(b.code);
      if (aLaunch && !bLaunch) return -1;
      if (!aLaunch && bLaunch) return 1;
      if (a.code === 'US-FED') return -1;
      if (b.code === 'US-FED') return 1;
      return a.name.localeCompare(b.name);
    });
  }, [jurisdictions]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${currentJurisdiction?.name || 'US'} Court Forms - Justice Bot USA`}
        description={`Access official court forms for ${currentJurisdiction?.name || 'the United States'}. Federal, state family law, immigration, workers rights, and more.`}
        keywords="US court forms, federal forms, immigration forms, fight ICE, workers rights forms, legal forms USA"
        url="https://justicebot-usa.com/usa-forms"
      />

      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Scale className="h-10 w-10" />
            <div>
              <h1 className="text-3xl font-bold">US Court Forms Catalog</h1>
              <p className="text-primary-foreground/80">Official forms from federal &amp; state courts — synced from government sources</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Jurisdiction</label>
                {loadingJurisdictions ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose jurisdiction" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {sortedJurisdictions.map((j) => (
                        <SelectItem key={j.code} value={j.code}>
                          {j.name} {LAUNCH_STATES.includes(j.code) ? '✓' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by form name, number, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jurisdiction Info Banner */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold">
                    {currentJurisdiction?.name || 'Federal'} Courts
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {forms && forms.length > 0
                      ? 'Official forms listed from government court websites'
                      : 'Forms for this jurisdiction are not listed here yet'}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {sources?.map(s => (
                  <Button key={s.id} variant="outline" size="sm" asChild>
                    <a href={s.source_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {s.source_name}
                    </a>
                  </Button>
                ))}
                {isAdmin && (
                  <Button variant="outline" size="sm" onClick={handleSync}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Forms
                  </Button>
                )}
              </div>
            </div>

            {!isLaunchState && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">
                  <strong>Coming Soon:</strong> This jurisdiction is not yet in our launch phase.
                  Currently syncing: Federal + CA, NY, TX, FL, IL, WA, MA, PA, GA, NJ.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Forms Grid */}
        {loadingForms ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-5 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredForms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredForms.map((form) => (
              <Card key={form.id} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {form.form_number && (
                        <Badge variant="outline" className="mb-2 text-xs">
                          {form.form_number}
                        </Badge>
                      )}
                      <CardTitle className="text-base leading-tight">{form.title}</CardTitle>
                    </div>
                  </div>
                  {form.description && (
                    <CardDescription className="text-sm">{form.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {form.category && (
                      <Badge variant="secondary" className="text-xs">{form.category}</Badge>
                    )}
                    {form.file_type && (
                      <Badge variant="outline" className="text-xs uppercase">{form.file_type}</Badge>
                    )}
                    {form.fee_amount && (
                      <Badge variant={form.fee_amount === 'Free' ? 'default' : 'outline'} className="text-xs">
                        {form.fee_amount}
                      </Badge>
                    )}
                    {form.fee_waiver_available && (
                      <Badge variant="outline" className="text-xs text-primary border-primary">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Fee Waiver
                      </Badge>
                    )}
                  </div>

                  {form.url ? (
                    <Button variant="default" size="sm" className="w-full" asChild>
                      <a href={form.url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download Form
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </a>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      <FileText className="h-4 w-4 mr-2" />
                      URL Not Available
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            {stateCenter ? (
              <>
                <h3 className="text-lg font-semibold mb-2">{stateCenter.name} forms are in the {stateCenter.name} Legal Center</h3>
                <p className="text-muted-foreground mb-4">
                  The {stateCenter.name} forms list{stateCenter.fill ? ', filing steps, and form filling are' : ' and filing steps are'} on their own page.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button asChild><Link to={stateCenter.center}>Open {stateCenter.name} Legal Center</Link></Button>
                  {stateCenter.fill && (
                    <Button variant="outline" asChild><Link to={stateCenter.fill}>Fill {stateCenter.name} forms</Link></Button>
                  )}
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-2">No forms listed here yet</h3>
                <p className="text-muted-foreground mb-4">
                  {sources && sources.length > 0
                    ? 'Use the official court links above to find the forms for this jurisdiction.'
                    : 'Check this jurisdiction\'s official court website for its forms. Federal forms are available now.'}
                </p>
              </>
            )}
            {isAdmin && isLaunchState && (
              <Button variant="outline" className="mt-4" onClick={handleSync}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now (admin)
              </Button>
            )}
          </Card>
        )}

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Need Help With Your Forms?
            </CardTitle>
            <CardDescription>
              Our tools link to official forms, explain what each one is for, and help you fill in the forms you choose.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/case-analysis">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="font-medium">Case Analysis</span>
                  <span className="text-xs text-muted-foreground">Get form recommendations</span>
                </Button>
              </Link>
              <Link to="/forms-library">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                  <Scale className="h-6 w-6" />
                  <span className="font-medium">Static Forms Library</span>
                  <span className="text-xs text-muted-foreground">Browse curated form lists</span>
                </Button>
              </Link>
              <Link to="/support">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2">
                  <Info className="h-6 w-6" />
                  <span className="font-medium">Get Support</span>
                  <span className="text-xs text-muted-foreground">Contact our team</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
