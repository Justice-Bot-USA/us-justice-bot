import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock, Pause } from 'lucide-react';

interface JourneyProgressProps {
  currentStep: number;
  totalSteps: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  completedSteps: number;
}

export function JourneyProgress({ currentStep, totalSteps, status, completedSteps }: JourneyProgressProps) {
  const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const statusConfig = {
    not_started: { label: 'Not Started', variant: 'secondary' as const, icon: Circle },
    in_progress: { label: 'In Progress', variant: 'default' as const, icon: Clock },
    completed: { label: 'Completed', variant: 'default' as const, icon: CheckCircle2 },
    on_hold: { label: 'On Hold', variant: 'outline' as const, icon: Pause }
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusIcon className={`h-5 w-5 ${status === 'completed' ? 'text-green-500' : 'text-primary'}`} />
          <Badge variant={config.variant} className={status === 'completed' ? 'bg-green-500' : ''}>
            {config.label}
          </Badge>
        </div>
        <span className="text-sm text-muted-foreground">
          {completedSteps} of {totalSteps} steps completed
        </span>
      </div>

      <div className="space-y-2">
        <Progress value={progressPercent} className="h-3" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step {currentStep > totalSteps ? totalSteps : currentStep}</span>
          <span>{Math.round(progressPercent)}% complete</span>
        </div>
      </div>

      {status === 'completed' && (
        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">
            Congratulations! You've completed all steps in this legal journey.
          </span>
        </div>
      )}
    </div>
  );
}
