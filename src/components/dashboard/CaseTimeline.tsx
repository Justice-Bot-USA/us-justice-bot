import { useEffect, useState } from 'react';
import { CaseTimelineEvent } from '@/hooks/useCases';
import { format } from 'date-fns';
import { 
  FileText, 
  CheckCircle, 
  Archive, 
  RotateCcw, 
  AlertCircle,
  FileCheck,
  Clock,
  Edit,
  Upload
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CaseTimelineProps {
  events: CaseTimelineEvent[];
  loading?: boolean;
}

const eventIcons: Record<string, React.ReactNode> = {
  created: <FileText className="h-4 w-4 text-primary" />,
  status_change: <CheckCircle className="h-4 w-4 text-blue-500" />,
  archived: <Archive className="h-4 w-4 text-muted-foreground" />,
  restored: <RotateCcw className="h-4 w-4 text-green-500" />,
  note_added: <Edit className="h-4 w-4 text-amber-500" />,
  document_uploaded: <Upload className="h-4 w-4 text-purple-500" />,
  filed: <FileCheck className="h-4 w-4 text-purple-500" />,
  deadline: <Clock className="h-4 w-4 text-red-500" />,
  default: <AlertCircle className="h-4 w-4 text-muted-foreground" />
};

export function CaseTimeline({ events, loading }: CaseTimelineProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-pulse text-muted-foreground">Loading timeline...</div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <Clock className="h-8 w-8 mb-2 opacity-50" />
        <p className="text-sm">No timeline events yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />
        
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={event.id} className="relative flex gap-3">
              {/* Icon */}
              <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border">
                {eventIcons[event.event_type] || eventIcons.default}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 pb-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground truncate">
                    {event.title}
                  </p>
                </div>
                {event.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {event.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground/70 mt-1">
                  {format(new Date(event.created_at), 'MMM d, yyyy • h:mm a')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
