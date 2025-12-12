import { Badge } from '@/components/ui/badge';
import { CaseStatus } from '@/hooks/useCases';
import { FileText, Clock, Loader2, FileCheck, CheckCircle, Archive } from 'lucide-react';

interface CaseStatusBadgeProps {
  status: CaseStatus;
  className?: string;
}

const statusConfig: Record<CaseStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode; className: string }> = {
  draft: {
    label: 'Draft',
    variant: 'outline',
    icon: <FileText className="h-3 w-3" />,
    className: 'border-muted-foreground/50 text-muted-foreground'
  },
  pending: {
    label: 'Pending Review',
    variant: 'secondary',
    icon: <Clock className="h-3 w-3" />,
    className: 'bg-amber-500/20 text-amber-600 border-amber-500/30 hover:bg-amber-500/30'
  },
  in_progress: {
    label: 'In Progress',
    variant: 'default',
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
    className: 'bg-blue-500/20 text-blue-600 border-blue-500/30 hover:bg-blue-500/30'
  },
  filed: {
    label: 'Filed',
    variant: 'default',
    icon: <FileCheck className="h-3 w-3" />,
    className: 'bg-purple-500/20 text-purple-600 border-purple-500/30 hover:bg-purple-500/30'
  },
  resolved: {
    label: 'Resolved',
    variant: 'default',
    icon: <CheckCircle className="h-3 w-3" />,
    className: 'bg-green-500/20 text-green-600 border-green-500/30 hover:bg-green-500/30'
  },
  archived: {
    label: 'Archived',
    variant: 'outline',
    icon: <Archive className="h-3 w-3" />,
    className: 'border-muted-foreground/30 text-muted-foreground/70'
  }
};

export function CaseStatusBadge({ status, className }: CaseStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Badge 
      variant={config.variant} 
      className={`flex items-center gap-1.5 ${config.className} ${className || ''}`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}
