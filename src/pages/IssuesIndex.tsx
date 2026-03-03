import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useIssueHubsList } from '@/hooks/useIssueHub';

export default function IssuesIndex() {
  const { data: hubs, isLoading } = useIssueHubsList();

  const grouped = (hubs || []).reduce<Record<string, typeof hubs>>((acc, hub) => {
    if (!hub) return acc;
    const cat = hub.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat]!.push(hub);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Issue Hubs | Veritas Path – Justice-Bot™</title>
        <meta name="description" content="Browse legal topics by category. Find forms, guided steps, and help resources." />
      </Helmet>
      <Header language="en" onLanguageChange={() => {}} />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Issue Hubs</h1>
        <p className="text-muted-foreground mb-8 max-w-xl">
          Choose a topic to learn, take action, find forms, and get help — all in one place.
        </p>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No issue hubs have been created yet. Check back soon.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([category, catHubs]) => (
              <div key={category}>
                <h2 className="text-lg font-semibold capitalize text-foreground mb-3">{category}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {catHubs?.map(hub => (
                    <Link key={hub.id} to={`/issues/${hub.category}/${hub.slug}`}>
                      <Card className="hover:shadow-md hover:border-primary/30 transition-all h-full">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{hub.title}</CardTitle>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">{hub.summary}</p>
                          <Badge variant="outline" className="mt-2 capitalize text-xs">{hub.category}</Badge>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
