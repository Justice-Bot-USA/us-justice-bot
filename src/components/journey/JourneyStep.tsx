import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  FolderSearch, 
  Send, 
  Calendar, 
  Clock, 
  CheckSquare, 
  Bell,
  ChevronDown,
  ChevronUp,
  Check,
  Play,
  SkipForward
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TaskChecklist } from './TaskChecklist';
import type { JourneyStep as JourneyStepType, JourneyTask } from '@/hooks/useLegalJourney';

interface JourneyStepProps {
  step: JourneyStepType;
  tasks: JourneyTask[];
  isActive: boolean;
  onStatusChange: (stepId: string, status: JourneyStepType['status']) => void;
  onToggleTask: (taskId: string) => void;
  onAddTask: (stepId: string, title: string) => void;
}

const stepTypeIcons = {
  form: FileText,
  evidence: FolderSearch,
  filing: Send,
  appearance: Calendar,
  deadline: Clock,
  review: CheckSquare,
  notification: Bell
};

const stepTypeLabels = {
  form: 'Form',
  evidence: 'Evidence',
  filing: 'Filing',
  appearance: 'Appearance',
  deadline: 'Deadline',
  review: 'Review',
  notification: 'Notification'
};

const statusColors = {
  pending: 'bg-muted text-muted-foreground',
  in_progress: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
  completed: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30',
  skipped: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30'
};

export function JourneyStep({ 
  step, 
  tasks, 
  isActive, 
  onStatusChange, 
  onToggleTask, 
  onAddTask 
}: JourneyStepProps) {
  const [isOpen, setIsOpen] = React.useState(isActive);
  const Icon = stepTypeIcons[step.step_type];
  const stepTasks = tasks.filter(t => t.step_id === step.id);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = step.due_date && new Date(step.due_date) < new Date() && step.status !== 'completed';

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className={`transition-all ${isActive ? 'ring-2 ring-primary' : ''} ${step.status === 'completed' ? 'opacity-75' : ''}`}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${step.status === 'completed' ? 'bg-green-500/10' : 'bg-primary/10'}`}>
                  <Icon className={`h-5 w-5 ${step.status === 'completed' ? 'text-green-500' : 'text-primary'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Step {step.step_number}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {stepTypeLabels[step.step_type]}
                    </Badge>
                    <Badge variant="outline" className={statusColors[step.status]}>
                      {step.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-1">{step.title}</CardTitle>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {step.due_date && (
                  <Badge variant={isOverdue ? 'destructive' : 'outline'} className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {isOverdue ? 'Overdue: ' : 'Due: '}{formatDate(step.due_date)}
                  </Badge>
                )}
                {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {step.description && (
              <p className="text-muted-foreground">{step.description}</p>
            )}

            {/* Metadata details */}
            {step.metadata && Object.keys(step.metadata).length > 0 && (
              <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                {step.metadata.form && (
                  <div className="text-sm">
                    <span className="font-medium">Form Details: </span>
                    <span className="text-muted-foreground">
                      {(step.metadata.form as { formNumber?: string; purpose?: string }).formNumber || ''} - {(step.metadata.form as { purpose?: string }).purpose || ''}
                    </span>
                  </div>
                )}
                {step.metadata.evidence && (
                  <div className="text-sm">
                    <span className="font-medium">Evidence: </span>
                    <span className="text-muted-foreground">
                      {(step.metadata.evidence as { item?: string }).item || ''}
                    </span>
                  </div>
                )}
                {step.metadata.pathway && (
                  <div className="text-sm">
                    <span className="font-medium">Timeline: </span>
                    <span className="text-muted-foreground">
                      {(step.metadata.pathway as { timeline?: string }).timeline || 'No specific timeline'}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Tasks checklist */}
            <TaskChecklist 
              tasks={stepTasks}
              stepId={step.id}
              onToggle={onToggleTask}
              onAddTask={onAddTask}
            />

            {/* Action buttons */}
            {step.status !== 'completed' && (
              <div className="flex gap-2 pt-2">
                {step.status === 'pending' && (
                  <Button 
                    size="sm" 
                    onClick={() => onStatusChange(step.id, 'in_progress')}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Start Step
                  </Button>
                )}
                {step.status === 'in_progress' && (
                  <Button 
                    size="sm" 
                    onClick={() => onStatusChange(step.id, 'completed')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Mark Complete
                  </Button>
                )}
                {step.status !== 'skipped' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onStatusChange(step.id, 'skipped')}
                  >
                    <SkipForward className="h-4 w-4 mr-1" />
                    Skip
                  </Button>
                )}
              </div>
            )}

            {step.completed_at && (
              <p className="text-xs text-muted-foreground">
                Completed on {formatDate(step.completed_at)}
              </p>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
