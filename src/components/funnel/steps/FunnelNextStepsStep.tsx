import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Building2, 
  FileText, 
  Phone,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { FunnelConfig, FunnelState, US_STATE_NAMES, LEGAL_AREA_NAMES } from '@/lib/funnels';
import { trackConversion } from '@/lib/funnels/analytics';
import { useNavigate } from 'react-router-dom';

interface FunnelNextStepsStepProps {
  config: FunnelConfig;
  state: FunnelState;
  updateData: (updates: Partial<FunnelState['data']>) => void;
  onNext: () => void;
  onSkip: () => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

interface NextStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  priority: 'high' | 'medium' | 'low';
  link?: string;
}

const getNextSteps = (config: FunnelConfig, state: FunnelState): NextStep[] => {
  const stateName = US_STATE_NAMES[config.jurisdiction];
  const legalArea = config.legalArea;
  
  const commonSteps: NextStep[] = [
    {
      id: 'review-docs',
      title: 'Review Your Documents',
      description: 'Carefully review all generated forms for accuracy before filing',
      icon: <FileText className="h-5 w-5" />,
      action: 'Open Documents',
      priority: 'high',
      link: '/my-cases',
    },
    {
      id: 'court-filing',
      title: 'File with the Court',
      description: `Submit your documents to the ${stateName} court clerk`,
      icon: <Building2 className="h-5 w-5" />,
      action: 'Find Court',
      priority: 'high',
    },
  ];

  const areaSpecificSteps: Record<string, NextStep[]> = {
    'family': [
      {
        id: 'serve-spouse',
        title: 'Serve Your Spouse',
        description: 'Arrange for proper service of process within 60 days',
        icon: <Calendar className="h-5 w-5" />,
        action: 'Learn More',
        priority: 'high',
      },
      {
        id: 'financial-disclosure',
        title: 'Complete Financial Disclosure',
        description: 'Prepare income and expense declarations',
        icon: <FileText className="h-5 w-5" />,
        action: 'Start Form',
        priority: 'medium',
      },
    ],
    'small-claims': [
      {
        id: 'service',
        title: 'Serve the Defendant',
        description: 'Have someone 18+ serve the claim on the defendant',
        icon: <Calendar className="h-5 w-5" />,
        action: 'Learn About Service',
        priority: 'high',
      },
      {
        id: 'prepare-evidence',
        title: 'Organize Your Evidence',
        description: 'Prepare copies of all documents for court',
        icon: <FileText className="h-5 w-5" />,
        action: 'Evidence Guide',
        priority: 'medium',
      },
    ],
    'housing': [
      {
        id: 'deadline',
        title: 'Note Your Response Deadline',
        description: 'You typically have 5 days to respond to an eviction',
        icon: <Calendar className="h-5 w-5" />,
        action: 'Set Reminder',
        priority: 'high',
      },
    ],
    'criminal': [
      {
        id: 'court-date',
        title: 'Confirm Court Appearance',
        description: 'Check your court date and time',
        icon: <Calendar className="h-5 w-5" />,
        action: 'Find Court Info',
        priority: 'high',
      },
    ],
  };

  const resourceStep: NextStep = {
    id: 'resources',
    title: 'Access Legal Resources',
    description: `View ${stateName} self-help resources and legal aid options`,
    icon: <BookOpen className="h-5 w-5" />,
    action: 'Browse Resources',
    priority: 'low',
    link: '/ai-tools',
  };

  const legalAidStep: NextStep = {
    id: 'legal-aid',
    title: 'Consider Legal Consultation',
    description: 'Connect with low-cost or free legal services in your area',
    icon: <Phone className="h-5 w-5" />,
    action: 'Find Legal Aid',
    priority: 'medium',
  };

  return [
    ...commonSteps,
    ...(areaSpecificSteps[legalArea] || []),
    legalAidStep,
    resourceStep,
  ];
};

export const FunnelNextStepsStep: React.FC<FunnelNextStepsStepProps> = ({
  config,
  state,
}) => {
  const navigate = useNavigate();
  const nextSteps = getNextSteps(config, state);
  const stateName = US_STATE_NAMES[config.jurisdiction];
  const legalAreaName = LEGAL_AREA_NAMES[config.legalArea];

  // Track conversion on mount
  React.useEffect(() => {
    trackConversion(config.id);
  }, [config.id]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">Your Case is Ready!</h3>
        <p className="text-muted-foreground">
          Here's what to do next with your {legalAreaName.toLowerCase()} case in {stateName}
        </p>
      </div>

      {/* Next Steps List */}
      <div className="space-y-3">
        {nextSteps.map((step, index) => (
          <Card key={step.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {step.icon}
                    <h4 className="font-medium">{step.title}</h4>
                    <Badge variant="outline" className={getPriorityColor(step.priority)}>
                      {step.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                  <Button 
                    variant="link" 
                    className="h-auto p-0 text-primary"
                    onClick={() => step.link && navigate(step.link)}
                  >
                    {step.action}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Case Dashboard CTA */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <h4 className="text-lg font-semibold mb-2">Track Your Progress</h4>
          <p className="text-muted-foreground mb-4">
            View your case, documents, and next steps all in one place
          </p>
          <Button onClick={() => navigate('/my-cases')} size="lg">
            Go to My Cases
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FunnelNextStepsStep;
