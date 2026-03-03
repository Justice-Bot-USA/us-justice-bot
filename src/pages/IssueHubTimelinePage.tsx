import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useIssueHub } from '@/hooks/useIssueHub';

export default function IssueHubTimelinePage() {
  const { jurisdiction, category, issue } = useParams<{ jurisdiction: string; category: string; issue: string }>();
  const hubKey = `${jurisdiction || 'ca'}/${category || 'family-law'}/${issue || ''}`;
  const { hub, sections, isLoading } = useIssueHub(hubKey);
  const upperJur = (jurisdiction || '').toUpperCase();
  const [selectedState] = useState(upperJur.length === 2 ? upperJur : 'CA');

  const timelineSections = sections.filter(s => s.section_type === 'timeline' && (!s.jurisdiction_code || s.jurisdiction_code === selectedState));
  const basePath = `/${jurisdiction || 'ca'}/${category || 'family-law'}/${issue || ''}`;

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header language="en" onLanguageChange={() => {}} />
        <div className="flex-1 container mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-10 w-1/3" /><Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <Helmet>
        <title>Timeline — {hub?.title || 'Issue Hub'} | Justice-Bot™</title>
      </Helmet>
      <Header language="en" onLanguageChange={() => {}} />

      <div className="border-b bg-card/50 shrink-0">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link to={basePath}><ArrowLeft className="h-4 w-4" /> Hub</Link>
          </Button>
          <Badge variant="outline" className="uppercase">{selectedState}</Badge>
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h1 className="text-sm font-bold text-foreground">Timeline & Steps</h1>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6 sm:py-8 max-w-3xl">
        {timelineSections.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Timeline coming soon.</p>
        ) : (
          <div className="space-y-4">
            {timelineSections.map((s, i) => (
              <div key={s.id} className="flex gap-3 sm:gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{i + 1}</div>
                  {i < timelineSections.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                </div>
                <Card className="flex-1 mb-2 min-w-0">
                  <CardHeader className="pb-2"><CardTitle className="text-base">{s.title}</CardTitle></CardHeader>
                  <CardContent><div className="text-sm text-muted-foreground whitespace-pre-wrap">{s.content_md}</div></CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}