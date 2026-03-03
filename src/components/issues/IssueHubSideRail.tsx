import { BookOpen, Zap, FileText, Clock, HelpCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface IssueHubSideRailProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  hasWizard?: boolean;
}

const sections = [
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'do', label: 'Do', icon: Zap },
  { id: 'forms', label: 'Forms', icon: FileText },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'help', label: 'Get Help', icon: HelpCircle },
];

export function IssueHubSideRail({ activeSection, onSectionChange, hasWizard }: IssueHubSideRailProps) {
  return (
    <nav className="sticky top-20 space-y-1">
      {hasWizard && (
        <Button
          variant="default"
          size="sm"
          className="w-full justify-start gap-2 mb-3"
          onClick={() => onSectionChange('wizard')}
        >
          <Play className="h-4 w-4" />
          Start Wizard
        </Button>
      )}
      {sections.map((s) => {
        const Icon = s.icon;
        return (
          <button
            key={s.id}
            onClick={() => onSectionChange(s.id)}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left',
              activeSection === s.id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {s.label}
          </button>
        );
      })}
    </nav>
  );
}
