import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MapPin, FileText, FolderOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SourceCard } from '@/components/issues/SourceCard';
import { useIssueHub } from '@/hooks/useIssueHub';
import { US_STATES } from '@/lib/states';

export default function IssueHubFormsPage() {
  const { jurisdiction, category, issue } = useParams<{ jurisdiction: string; category: string; issue: string }>();
  const slug = issue || '';
  const { hub, formPackages, isLoading } = useIssueHub(slug);
  const [selectedState, setSelectedState] = useState(jurisdiction?.toUpperCase() || 'CA');

  const filteredForms = formPackages.filter(f => f.jurisdiction_code === selectedState);
  const basePath = `/${jurisdiction}/${category}/${issue}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header language="en" onLanguageChange={() => {}} />
        <div className="container mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <div className="grid gap-3 sm:grid-cols-2"><Skeleton className="h-24" /><Skeleton className="h-24" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Forms — {hub?.title || 'Issue Hub'} | Justice-Bot™</title>
      </Helmet>
      <Header language="en" onLanguageChange={() => {}} />

      <div className="border-b bg-card/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link to={basePath}><ArrowLeft className="h-4 w-4" /> Hub</Link>
          </Button>
          <Badge variant="outline" className="uppercase">{selectedState}</Badge>
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h1 className="text-sm font-bold text-foreground">Forms & Documents</h1>
          <div className="ml-auto flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-[160px] h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {US_STATES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">{hub?.title} — Forms</h2>
          <Button variant="outline" size="sm" asChild className="gap-1">
            <a href="https://www.courts.ca.gov/rules-forms/court-forms" target="_blank" rel="noopener noreferrer">
              <FolderOpen className="h-3 w-3" /> Official Directory
            </a>
          </Button>
        </div>

        {filteredForms.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No forms loaded for {selectedState} yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
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
      </div>
      <Footer />
    </div>
  );
}
