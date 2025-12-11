import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import type { JourneyStep } from '@/hooks/useLegalJourney';

interface DeadlineTrackerProps {
  steps: JourneyStep[];
}

export function DeadlineTracker({ steps }: DeadlineTrackerProps) {
  const stepsWithDeadlines = steps
    .filter(s => s.due_date && s.status !== 'completed' && s.status !== 'skipped')
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime());

  const completedWithDeadlines = steps.filter(s => s.due_date && s.status === 'completed');

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const getDeadlineStatus = (dueDate: string) => {
    const due = new Date(dueDate);
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const diffDays = Math.ceil((dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'Overdue', color: 'destructive', icon: AlertTriangle };
    if (diffDays === 0) return { label: 'Due Today', color: 'destructive', icon: AlertTriangle };
    if (diffDays <= 3) return { label: `${diffDays} day${diffDays > 1 ? 's' : ''} left`, color: 'default', icon: Clock };
    if (diffDays <= 7) return { label: `${diffDays} days left`, color: 'secondary', icon: Calendar };
    return { label: formatDate(dueDate), color: 'outline', icon: Calendar };
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (stepsWithDeadlines.length === 0 && completedWithDeadlines.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {stepsWithDeadlines.length === 0 ? (
          <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="text-sm text-green-700 dark:text-green-400">
              All deadlines met! Great work.
            </span>
          </div>
        ) : (
          stepsWithDeadlines.map(step => {
            const status = getDeadlineStatus(step.due_date!);
            const StatusIcon = status.icon;
            
            return (
              <div 
                key={step.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  status.label === 'Overdue' || status.label === 'Due Today'
                    ? 'bg-destructive/10 border-destructive/30'
                    : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <StatusIcon className={`h-4 w-4 ${
                    status.label === 'Overdue' || status.label === 'Due Today'
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground">Step {step.step_number}</p>
                  </div>
                </div>
                <Badge variant={status.color as 'default' | 'destructive' | 'secondary' | 'outline'}>
                  {status.label}
                </Badge>
              </div>
            );
          })
        )}

        {completedWithDeadlines.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">
              {completedWithDeadlines.length} deadline{completedWithDeadlines.length > 1 ? 's' : ''} completed
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
