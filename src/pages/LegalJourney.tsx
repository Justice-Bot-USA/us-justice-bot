import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Compass, Plus } from 'lucide-react';
import { JourneyWizard } from '@/components/journey/JourneyWizard';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const LegalJourney = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [journeys, setJourneys] = useState<Array<{
    id: string;
    status: string;
    created_at: string;
    case_merit_id: string | null;
    current_step: number;
    total_steps: number;
    case_title?: string;
    legal_area?: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const journeyId = searchParams.get('id');

  useEffect(() => {
    if (!user) return;

    const fetchJourneys = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('legal_journeys')
          .select(`
            id,
            status,
            created_at,
            case_merit_id,
            current_step,
            total_steps
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch case titles for each journey
        const journeysWithCaseInfo = await Promise.all(
          (data || []).map(async (journey) => {
            if (journey.case_merit_id) {
              const { data: caseData } = await supabase
                .from('case_merit_scores')
                .select('case_title, legal_area')
                .eq('id', journey.case_merit_id)
                .single();
              return { ...journey, ...caseData };
            }
            return journey;
          })
        );

        setJourneys(journeysWithCaseInfo);
      } catch (err) {
        console.error('Error fetching journeys:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJourneys();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please sign in to view your legal journeys
            </p>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If a journey ID is provided, show the wizard
  if (journeyId) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/legal-journey')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Journeys
          </Button>
          <JourneyWizard journeyId={journeyId} />
        </div>
      </div>
    );
  }

  // Otherwise show list of journeys
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Compass className="h-8 w-8 text-primary" />
                Legal Journeys
              </h1>
              <p className="text-muted-foreground">
                Track your progress through legal processes step-by-step
              </p>
            </div>
            <Button onClick={() => navigate('/case-analysis')}>
              <Plus className="h-4 w-4 mr-2" />
              New Case Analysis
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        ) : journeys.length === 0 ? (
          <Card className="max-w-lg mx-auto">
            <CardContent className="pt-6 text-center">
              <Compass className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Legal Journeys Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by analyzing a case to generate your personalized legal journey with step-by-step guidance.
              </p>
              <Button onClick={() => navigate('/case-analysis')}>
                <Plus className="h-4 w-4 mr-2" />
                Analyze a Case
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {journeys.map(journey => {
              const progress = journey.total_steps > 0 
                ? Math.round((journey.current_step / journey.total_steps) * 100) 
                : 0;
              
              return (
                <Card 
                  key={journey.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/legal-journey?id=${journey.id}`)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">
                        {journey.case_title || 'Untitled Journey'}
                      </CardTitle>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        journey.status === 'completed' 
                          ? 'bg-green-500/10 text-green-600' 
                          : journey.status === 'in_progress'
                          ? 'bg-blue-500/10 text-blue-600'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {journey.status.replace('_', ' ')}
                      </span>
                    </div>
                    {journey.legal_area && (
                      <p className="text-sm text-muted-foreground">{journey.legal_area}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{journey.current_step}/{journey.total_steps} steps</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Created {new Date(journey.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalJourney;
