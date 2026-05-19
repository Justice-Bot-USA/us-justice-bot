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
  const hubKey = `${jurisdiction || 'ca'}/${category || 'family-law'}/${issue || ''}`;
  const { hub, formPackages, isLoading } = useIssueHub(hubKey);
  const upperJur = (jurisdiction || '').toUpperCase();
  const isStateCode = US_STATES.some(s => s.value === upperJur);
  const [selectedState, setSelectedState] = useState(isStateCode ? upperJur : 'CA');

  const filteredForms = formPackages.filter(f => f.jurisdiction_code === selectedState);
  const basePath = `/${jurisdiction || 'ca'}/${category || 'family-law'}/${issue || ''}`;

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header language="en" onLanguageChange={() => {}} />
        <div className="flex-1 container mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <div className="grid gap-3 sm:grid-cols-2"><Skeleton className="h-24" /><Skeleton className="h-24" /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <Helmet>
        <title>Forms — {hub?.title || 'Issue Hub'} | A.I. ANAL</title>
      </Helmet>
      <Header language="en" onLanguageChange={() => {}} />

      <div className="border-b bg-card/50 shrink-0">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link to={basePath}><ArrowLeft className="h-4 w-4" /> Hub</Link>
          </Button>
          <Badge variant="outline" className="uppercase">{selectedState}</Badge>
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h1 className="text-sm font-bold text-foreground">Forms & Documents</h1>
          <div className="ml-auto flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-[140px] sm:w-[160px] h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {US_STATES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6 sm:py-8 max-w-3xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <h2 className="text-lg font-bold text-foreground">{hub?.title} — Forms</h2>
          <Button variant="outline" size="sm" asChild className="gap-1 shrink-0">
            <a href="https://www.courts.ca.gov/rules-forms/court-forms" target="_blank" rel="noopener noreferrer">
              <FolderOpen className="h-3 w-3" /> Official Directory
            </a>
          </Button>
        </div>

        {/* Always-visible official directory + latest changes */}
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 mb-4">
          <SourceCard
            formNumber="CA FORMS"
            title="California Courts — Court Forms Directory (Official)"
            description="Search official Judicial Council forms by form number, title, topic, or browse by category."
            officialDirectoryUrl="https://courts.ca.gov/rules-forms/court-forms"
            url="https://courts.ca.gov/rules-forms/court-forms"
            category="official"
            isRequired={false}
          />
          <SourceCard
            formNumber="UPDATES"
            title="Latest Changes to California Court Forms"
            description="New and revised Judicial Council forms — stay current on changes that affect your case."
            officialDirectoryUrl="https://courts.ca.gov/forms-rules/court-forms/latest-changes"
            url="https://courts.ca.gov/forms-rules/court-forms/latest-changes"
            category="official"
            isRequired={false}
          />
        </div>

        {filteredForms.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No specific forms loaded for {selectedState} yet. Use the directory above to search.</p>
        ) : (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
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