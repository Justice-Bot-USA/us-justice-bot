import React from 'react';
import StateNextSteps from '@/components/StateNextSteps';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, ArrowRight, Calendar, Building2, FileText, Phone,
  ExternalLink, BookOpen, Scale, AlertCircle,
} from 'lucide-react';
import { FunnelConfig, FunnelState, US_STATE_NAMES, LEGAL_AREA_NAMES } from '@/lib/funnels';
import { trackConversion } from '@/lib/funnels/analytics';
import { stateRouteFor } from '@/lib/stateRouting';
import { stateCourtWebsites } from '@/lib/formsLibraryData';
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
  /** In-app route. */
  link?: string;
  /** Outside website, opened in a new tab. */
  href?: string;
}

// Statewide legal aid directories for the live states; LawHelp.org lists the others.
const LEGAL_AID_SITE: Record<string, string> = {
  CA: 'https://www.lawhelpca.org/',
  NY: 'https://www.lawhelpny.org/',
};
const NATIONAL_LEGAL_AID_SITE = 'https://www.lawhelp.org';
const CA_FIND_COURT = 'https://www.courts.ca.gov/find-my-court.htm';

// State-specific text for the live states (checked against CCP §1167, CA small claims
// service rules, NYC Civil Court Act §1803 and RPAPL 732/743). Other states get general text.
const FAMILY_DISCLOSURE: Record<string, { description: string; link: string }> = {
  CA: { description: 'In a California divorce, both spouses must exchange financial disclosure forms (FL-140, FL-142 and FL-150), even if you agree on everything.', link: '/ca/legal-center?area=divorce' },
  NY: { description: 'In a New York divorce, a contested case needs a sworn Statement of Net Worth, and a case with children usually needs the child support worksheet (UD-8(3)).', link: '/ny/legal-center?area=divorce' },
};
const SMALL_CLAIMS_SERVICE: Record<string, { title: string; description: string }> = {
  CA: { title: 'Serve the Defendant', description: 'An adult who is not you, or the court clerk by certified mail (for a fee), must serve the defendant at least 15 days before the court date (20 days if they live outside the county). Then file the proof of service (SC-104) at least 5 days before the hearing.' },
  NY: { title: 'Notice to the Defendant', description: 'In New York small claims, the court clerk mails the notice of claim to the defendant by first-class and certified mail. You do not serve it yourself.' },
};
const EVICTION_DEADLINE: Record<string, string> = {
  CA: 'If you were served with an eviction Summons and Complaint, you generally have 10 court days to file an Answer (UD-105). Weekends and court holidays don\'t count, and service that was not in person can move the deadline.',
  NY: 'Read your notice of petition. In a nonpayment case in NYC Housing Court (and other courts that use RPAPL 732) it tells you to answer within 10 days of being served. Otherwise, and in holdover cases, you answer at the court date on your papers, orally or in writing (RPAPL 743).',
};

const getNextSteps = (config: FunnelConfig): NextStep[] => {
  const code = (config.jurisdiction || '').toUpperCase();
  const stateName = US_STATE_NAMES[config.jurisdiction] ?? config.jurisdiction;
  const legalArea = config.legalArea;
  // California and New York have our own legal centers; other states are coming soon,
  // so their steps point to the state courts' self-help website instead.
  const route = stateRouteFor(code, legalArea);
  const courts = stateCourtWebsites[code];
  const rules: Pick<NextStep, 'link' | 'href'> = route
    ? { link: route.centerPath }
    : courts ? { href: courts.selfHelp } : {};
  const rulesName = route ? `${stateName} filing steps` : `${stateName} courts' self-help website`;
  const findCourt: Pick<NextStep, 'link' | 'href'> = code === 'CA'
    ? { href: CA_FIND_COURT }
    : route ? { link: route.centerPath } : courts ? { href: courts.website } : {};

  const commonSteps: NextStep[] = [
    {
      id: 'review-docs',
      title: 'Review Your Forms',
      description: 'Check every form you filled in for accuracy before you file it. You file the forms yourself.',
      icon: <FileText className="h-5 w-5" />,
      action: 'Open My Cases',
      priority: 'high',
      link: '/my-cases',
    },
    {
      id: 'court-filing',
      title: 'File with the Court',
      description: route
        ? `File your forms with the ${stateName} court clerk. The ${rulesName} explain where to file and the fees.`
        : `File your forms with the ${stateName} court clerk. ${stateName} is coming soon on Justice Bot USA, so check the ${rulesName} for where to file.`,
      icon: <Building2 className="h-5 w-5" />,
      action: 'Find Court',
      priority: 'high',
      ...findCourt,
    },
  ];

  const areaSpecificSteps: Record<string, NextStep[]> = {
    'family': [
      {
        id: 'serve-other-party',
        title: 'Serve the Other Party',
        description: `The papers must be served the way the court requires (usually by an adult who is not you), and proof of service filed. How and by when depends on the type of case; see the ${rulesName}.`,
        icon: <Calendar className="h-5 w-5" />,
        action: 'See Service Rules',
        priority: 'high',
        ...rules,
      },
      {
        id: 'financial-disclosure',
        title: 'Financial Disclosure',
        description: FAMILY_DISCLOSURE[code]?.description
          ?? `Your court may require income and expense forms. Check the ${rulesName}.`,
        icon: <FileText className="h-5 w-5" />,
        action: 'See the Forms',
        priority: 'medium',
        ...(FAMILY_DISCLOSURE[code] ? { link: FAMILY_DISCLOSURE[code].link } : rules),
      },
    ],
    'small-claims': [
      {
        id: 'service',
        title: SMALL_CLAIMS_SERVICE[code]?.title ?? 'Serve the Defendant',
        description: SMALL_CLAIMS_SERVICE[code]?.description
          ?? `Service rules differ by state. Check the ${rulesName}.`,
        icon: <Calendar className="h-5 w-5" />,
        action: 'See Service Rules',
        priority: 'high',
        ...rules,
      },
      {
        id: 'prepare-evidence',
        title: 'Organize Your Evidence',
        description: 'Prepare copies of all documents for court',
        icon: <FileText className="h-5 w-5" />,
        action: 'Evidence Guide',
        priority: 'medium',
        link: '/legal-help/small-claims-evidence',
      },
    ],
    'housing': [
      {
        id: 'deadline',
        title: 'Note Your Response Deadline',
        description: EVICTION_DEADLINE[code]
          ?? `Eviction deadlines are short and differ by state. Check the papers you were served and the ${rulesName} right away.`,
        icon: <Calendar className="h-5 w-5" />,
        action: 'See the Deadline Rules',
        priority: 'high',
        ...rules,
      },
    ],
    'criminal': [
      {
        id: 'court-date',
        title: 'Confirm Court Appearance',
        description: 'Your court date and courtroom are on your paperwork (such as a citation, notice to appear, or release papers). If you are unsure, call the court clerk.',
        icon: <Calendar className="h-5 w-5" />,
        action: 'Find Court Info',
        priority: 'high',
        ...(code === 'CA' ? { href: CA_FIND_COURT } : courts ? { href: courts.selfHelp } : {}),
      },
    ],
  };

  const resourceStep: NextStep = {
    id: 'resources',
    title: 'Access Legal Resources',
    description: route
      ? `See the ${stateName} filing steps, deadlines, fees and official forms`
      : `${stateName} is coming soon on Justice Bot USA. See the ${rulesName}.`,
    icon: <BookOpen className="h-5 w-5" />,
    action: 'Browse Resources',
    priority: 'low',
    ...rules,
  };

  const legalAidStep: NextStep = {
    id: 'legal-aid',
    title: 'Consider Legal Consultation',
    description: 'Connect with low-cost or free legal services in your area',
    icon: <Phone className="h-5 w-5" />,
    action: 'Find Legal Aid',
    priority: 'medium',
    href: LEGAL_AID_SITE[code] ?? NATIONAL_LEGAL_AID_SITE,
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
  const nextSteps = getNextSteps(config);
  const stateName = US_STATE_NAMES[config.jurisdiction];
  const legalAreaName = LEGAL_AREA_NAMES[config.legalArea];
  const complexityScore = Number((state.data as Record<string, unknown> | undefined)?.complexityScore ?? 0);

  React.useEffect(() => {
    trackConversion(config.id);
  }, [config.id]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive dark:bg-destructive/20';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">Your Next Steps</h3>
        <p className="text-muted-foreground">
          Here's what to do next with your {legalAreaName.toLowerCase()} case in {stateName}
        </p>
      </div>

      <StateNextSteps state={config.jurisdiction} area={config.legalArea} />

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
                  {step.href ? (
                    <Button variant="link" className="h-auto p-0 text-primary" asChild>
                      <a href={step.href} target="_blank" rel="noopener noreferrer">
                        {step.action}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  ) : step.link ? (
                    <Button
                      variant="link"
                      className="h-auto p-0 text-primary"
                      onClick={() => step.link && navigate(step.link)}
                    >
                      {step.action}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attorney Referral CTA — shown for high-complexity cases */}
      {complexityScore > 7 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold mb-1">This Case May Benefit from Legal Counsel</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Based on the complexity of your situation, speaking with a licensed attorney is strongly recommended. 
                  Free and low-cost options are available.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://www.lawhelp.org" target="_blank" rel="noopener noreferrer">
                      <Scale className="h-3.5 w-3.5 mr-1" /> Legal Aid Finder
                      <ExternalLink className="h-3 w-3 ml-1 opacity-60" />
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href="https://www.avvo.com" target="_blank" rel="noopener noreferrer">
                      <Phone className="h-3.5 w-3.5 mr-1" /> Find an Attorney
                      <ExternalLink className="h-3 w-3 ml-1 opacity-60" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
