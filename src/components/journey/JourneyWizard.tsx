import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Scale, MapPin } from 'lucide-react';
import { JourneyProgress } from './JourneyProgress';
import { JourneyStep } from './JourneyStep';
import { DeadlineTracker } from './DeadlineTracker';
import { useLegalJourney } from '@/hooks/useLegalJourney';

interface JourneyWizardProps {
  journeyId: string;
}

export function JourneyWizard({ journeyId }: JourneyWizardProps) {
  const { 
    journey, 
    steps, 
    tasks, 
    caseData, 
    isLoading, 
    error,
    updateStepStatus,
    toggleTask,
    addTask
  } = useLegalJourney(journeyId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !journey) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">{error || 'Journey not found'}</p>
        </CardContent>
      </Card>
    );
  }

  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const currentActiveStep = steps.find(s => s.status === 'in_progress') || steps.find(s => s.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Case summary header */}
      {caseData && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">{caseData.case_title}</CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Scale className="h-4 w-4" />
                {caseData.legal_area}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {caseData.county ? `${caseData.county}, ` : ''}{caseData.state}
              </span>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Progress tracker */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <JourneyProgress 
            currentStep={journey.current_step}
            totalSteps={journey.total_steps}
            status={journey.status}
            completedSteps={completedSteps}
          />
        </CardContent>
      </Card>

      {/* Deadline tracker */}
      <DeadlineTracker steps={steps} />

      {/* Steps list */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Legal Steps</h2>
        {steps.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No steps generated for this journey yet.
            </CardContent>
          </Card>
        ) : (
          steps.map(step => (
            <JourneyStep
              key={step.id}
              step={step}
              tasks={tasks}
              isActive={currentActiveStep?.id === step.id}
              onStatusChange={updateStepStatus}
              onToggleTask={toggleTask}
              onAddTask={addTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
