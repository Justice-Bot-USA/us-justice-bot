import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ResourceCard } from '@/components/issues/ResourceCard';
import { useIssueHub } from '@/hooks/useIssueHub';

export default function IssueHubHelpPage() {
  const { jurisdiction, category, issue } = useParams<{ jurisdiction: string; category: string; issue: string }>();
  const hubKey = `${jurisdiction || 'ca'}/${category || 'family-law'}/${issue || ''}`;
  const { hub, sections, resources, isLoading } = useIssueHub(hubKey);
  const upperJur = (jurisdiction || '').toUpperCase();
  const [selectedState] = useState(upperJur.length === 2 ? upperJur : 'CA');

  const helpSections = sections.filter(s => s.section_type === 'help' && (!s.jurisdiction_code || s.jurisdiction_code === selectedState));
  const filteredResources = resources.filter(r => !r.jurisdiction_code || r.jurisdiction_code === selectedState);
  const basePath = `/${jurisdiction || 'ca'}/${category || 'family-law'}/${issue || ''}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header language="en" onLanguageChange={() => {}} />
        <div className="container mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-10 w-1/3" /><Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Get Help — {hub?.title || 'Issue Hub'} | Justice-Bot™</title>
      </Helmet>
      <Header language="en" onLanguageChange={() => {}} />

      <div className="border-b bg-card/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link to={basePath}><ArrowLeft className="h-4 w-4" /> Hub</Link>
          </Button>
          <Badge variant="outline" className="uppercase">{selectedState}</Badge>
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          <h1 className="text-sm font-bold text-foreground">Get Help</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        {helpSections.map(s => (
          <Card key={s.id}>
            <CardHeader className="pb-2"><CardTitle className="text-base">{s.title}</CardTitle></CardHeader>
            <CardContent><div className="text-sm text-muted-foreground whitespace-pre-wrap">{s.content_md}</div></CardContent>
          </Card>
        ))}
        {filteredResources.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredResources.map(r => (
              <ResourceCard key={r.id} label={r.label} url={r.url} description={r.description || undefined} category={r.category} />
            ))}
          </div>
        )}
        {helpSections.length === 0 && filteredResources.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No help resources loaded yet.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}
