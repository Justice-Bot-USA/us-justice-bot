import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Loader2, 
  XCircle,
  FileText,
  Search,
  Scale,
  MapPin,
  Clock,
  Gavel,
  FileCheck
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { SweepProgress } from '@/hooks/useSweepPipeline';
import { SweepName, SWEEP_DISPLAY_NAMES } from '@/lib/sweeps/types';
import { cn } from '@/lib/utils';

interface SweepProgressDisplayProps {
  progress: SweepProgress;
  compact?: boolean;
}

const SWEEP_ICONS: Record<SweepName, React.ElementType> = {
  intake: FileText,
  evidenceIndex: Search,
  classification: Scale,
  venue: MapPin,
  timeline: Clock,
  authority: Gavel,
  analysis: FileCheck
};

const SWEEP_ORDER: SweepName[] = [
  'intake',
  'evidenceIndex',
  'classification',
  'venue',
  'timeline',
  'authority',
  'analysis'
];

export const SweepProgressDisplay: React.FC<SweepProgressDisplayProps> = ({ 
  progress, 
  compact = false 
}) => {
  const getStepStatus = (sweep: SweepName) => {
    if (progress.completedSweeps.includes(sweep)) return 'completed';
    if (progress.failedSweeps.includes(sweep)) return 'failed';
    if (progress.currentSweep === sweep) return 'running';
    return 'pending';
  };

  const getStatusIcon = (status: string, Icon: React.ElementType) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'running':
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {progress.currentSweep 
              ? `${SWEEP_DISPLAY_NAMES[progress.currentSweep]}...` 
              : progress.isRunning ? 'Starting...' : 'Ready'}
          </span>
          <span className="font-medium">{progress.progress}%</span>
        </div>
        <Progress value={progress.progress} className="h-2" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overall progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Analysis Progress</h3>
          <span className="text-sm text-muted-foreground">{progress.progress}%</span>
        </div>
        <Progress value={progress.progress} className="h-2" />
      </div>

      {/* Step-by-step progress */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {SWEEP_ORDER.map((sweep, index) => {
            const status = getStepStatus(sweep);
            const Icon = SWEEP_ICONS[sweep];
            const isActive = status === 'running';
            
            return (
              <motion.div
                key={sweep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  scale: isActive ? 1.02 : 1
                }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-all",
                  isActive && "bg-primary/5 border border-primary/20",
                  status === 'completed' && "bg-green-500/5",
                  status === 'failed' && "bg-destructive/5"
                )}
              >
                <div className="flex-shrink-0">
                  {getStatusIcon(status, Icon)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon className={cn(
                      "h-4 w-4",
                      status === 'completed' && "text-green-600",
                      status === 'running' && "text-primary",
                      status === 'failed' && "text-destructive",
                      status === 'pending' && "text-muted-foreground"
                    )} />
                    <span className={cn(
                      "font-medium text-sm",
                      status === 'pending' && "text-muted-foreground"
                    )}>
                      {SWEEP_DISPLAY_NAMES[sweep]}
                    </span>
                  </div>
                  
                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-xs text-muted-foreground mt-1"
                    >
                      Processing...
                    </motion.p>
                  )}
                </div>
                
                <div className="flex-shrink-0 text-xs text-muted-foreground">
                  {status === 'completed' && '✓'}
                  {status === 'failed' && '✗'}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
