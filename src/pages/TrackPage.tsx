import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SourceCard } from '@/components/issues/SourceCard';
import { useIssueHub, useTrackByKey } from '@/hooks/useIssueHub';

export default function TrackPage() {
  const { jurisdiction, category, issue, trackKey } = useParams<{
    jurisdiction: string;
    category: string;
    issue: string;
    trackKey: string;
  }>();

  const hubKey = `${jurisdiction || 'ca'}/${category || 'family-law'}/${issue || ''}`;
  const { hub } = useIssueHub(hubKey);
  const { track, trackForms, isLoading, error } = useTrackByKey(hub?.id, trackKey || '');

  if (isLoading || !hub) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header language="en" onLanguageChange={() => {}} />
        <div className="flex-1 container mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header language="en" onLanguageChange={() => {}} />
        <div className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Track Not Found</h1>
          <p className="text-muted-foreground">This track hasn't been set up yet.</p>
          <Button className="mt-4" asChild>
            <Link to={`/${jurisdiction}/${category}/${issue}`}>Back to Hub</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const isEmergency = track.track_key === 'emergency';
  const timelineSteps = track.timeline_md?.split('\n').filter(Boolean) || [];

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <Helmet>
        <title>{track.title} | {hub.title} | Justice Bot USA – Justice Bot USA</title>
        <meta name="description" content={track.description || `${track.title} — step-by-step guide.`} />
      </Helmet>
      <Header language="en" onLanguageChange={() => {}} />

      {/* Sticky top bar */}
      <div className="border-b bg-card/50 shrink-0">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link to={`/${jurisdiction}/${category}/${issue}`}>
              <ArrowLeft className="h-4 w-4" /> Hub
            </Link>
          </Button>
          <Badge variant="outline" className="uppercase">{jurisdiction}</Badge>
          <span className="text-sm text-muted-foreground hidden sm:inline">/</span>
          <h1 className="text-sm font-bold text-foreground truncate">{track.title}</h1>
          {isEmergency && <Badge variant="destructive">Urgent</Badge>}
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6 sm:py-8 max-w-3xl space-y-8">
        {/* What this is */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            {isEmergency ? (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            )}
            <h2 className="text-xl font-bold text-foreground">What This Is</h2>
          </div>
          <p className="text-muted-foreground">{track.description}</p>
        </section>

        {/* When to use */}
        {track.when_to_use && (
          <section>
            <Card className={isEmergency ? 'border-destructive/30 bg-destructive/5' : 'border-primary/20 bg-primary/5'}>
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold text-foreground mb-1">When to use this track</h3>
                <p className="text-sm text-muted-foreground">{track.when_to_use}</p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Your packet (forms) */}
        {trackForms.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Your Packet</h2>
              <Badge variant="secondary" className="ml-auto">{trackForms.length} forms</Badge>
            </div>
            <div className="grid gap-3">
              {trackForms.map((tf: any) => {
                const fp = tf.form_packages;
                if (!fp) return null;
                return (
                  <SourceCard
                    key={tf.id}
                    formNumber={fp.form_number}
                    title={fp.form_name}
                    description={fp.description || undefined}
                    url={fp.url || undefined}
                    officialFormPageUrl={fp.official_form_page_url}
                    officialPdfUrl={fp.official_pdf_url}
                    officialDirectoryUrl={fp.official_directory_url}
                    category={fp.category || 'general'}
                    isRequired={tf.is_required}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Timeline */}
        {timelineSteps.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Your Timeline</h2>
            </div>
            <div className="space-y-3">
              {timelineSteps.map((step, i) => (
                <div key={i} className="flex gap-3 sm:gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {i + 1}
                    </div>
                    {i < timelineSteps.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="flex-1 pb-4 min-w-0">
                    <p className="text-sm text-foreground">{step.replace(/^\d+\.\s*/, '')}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom nav */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button variant="outline" asChild>
            <Link to={`/${jurisdiction}/${category}/${issue}`}>← Back to Hub</Link>
          </Button>
          <Button asChild>
            <Link to={`/${jurisdiction}/${category}/${issue}/forms`}>View All Forms</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}