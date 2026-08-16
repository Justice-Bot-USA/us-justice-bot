import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TriageWizard } from '@/components/issues/TriageWizard';
import { useIssueHub } from '@/hooks/useIssueHub';

export default function IssueHubStartPage() {
  const { jurisdiction, category, issue } = useParams<{ jurisdiction: string; category: string; issue: string }>();
  const hubKey = `${jurisdiction || 'ca'}/${category || 'family-law'}/${issue || ''}`;
  const { hub, triageFlow, isLoading } = useIssueHub(hubKey);
  const basePath = `/${jurisdiction || 'ca'}/${category || 'family-law'}/${issue || ''}`;
  const triageSchema = triageFlow?.flow_schema as any;

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header language="en" onLanguageChange={() => {}} />
        <div className="flex-1 container mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-10 w-1/3" /><Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <Helmet>
        <title>Start Wizard — {hub?.title || 'Issue Hub'} | Justice Bot USA</title>
      </Helmet>
      <Header language="en" onLanguageChange={() => {}} />

      <div className="border-b bg-card/50 shrink-0">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link to={basePath}><ArrowLeft className="h-4 w-4" /> Hub</Link>
          </Button>
          <Badge variant="outline" className="uppercase">{jurisdiction}</Badge>
          <Play className="h-4 w-4 text-muted-foreground" />
          <h1 className="text-sm font-bold text-foreground">Find Your Path</h1>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6 sm:py-8 max-w-2xl">
        {triageSchema ? (
          <TriageWizard flowSchema={triageSchema} />
        ) : (
          <p className="text-center text-muted-foreground py-12">Wizard not configured for this topic yet.</p>
        )}
      </div>
      <Footer />
    </div>
  );
}