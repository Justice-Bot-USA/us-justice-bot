import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Loader2,
  Scale,
  FileText,
  Upload,
  DollarSign,
  ClipboardList,
  Sparkles,
  Unlock,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FunnelConfig, 
  FunnelState, 
  FunnelStep,
  US_STATE_NAMES,
  createInitialFunnelState,
  getNextStep,
  getPreviousStep,
  calculateProgress
} from '@/lib/funnels';
import { trackFunnelStart, trackStepComplete, trackStepDrop, trackStepSkip } from '@/lib/funnels/analytics';
import { StateComingSoon } from './StateComingSoon';
import { usePaywallAccess } from '@/hooks/usePaywallAccess';
import { toast } from 'sonner';

// Step Components
import { FunnelTriageStep } from './steps/FunnelTriageStep';
import { FunnelEvidenceStep } from './steps/FunnelEvidenceStep';
import { FunnelResultsStep } from './steps/FunnelResultsStep';
import { FunnelPaywallStep } from './steps/FunnelPaywallStep';
import { FunnelGenerateStep } from './steps/FunnelGenerateStep';
import { FunnelNextStepsStep } from './steps/FunnelNextStepsStep';

interface FunnelEngineProps {
  config: FunnelConfig;
  onComplete?: (data: FunnelState['data']) => void;
  onExit?: () => void;
}

const STEP_ICONS: Record<FunnelStep, React.ReactNode> = {
  triage: <Scale className="h-5 w-5" />,
  evidence: <Upload className="h-5 w-5" />,
  results: <BarChart3 className="h-5 w-5" />,
  paywall: <Unlock className="h-5 w-5" />,
  merit_score: <Sparkles className="h-5 w-5" />,
  form_recommendation: <FileText className="h-5 w-5" />,
  generate: <ClipboardList className="h-5 w-5" />,
  next_steps: <CheckCircle2 className="h-5 w-5" />,
  payment: <DollarSign className="h-5 w-5" />,
};

const STEP_LABELS: Record<FunnelStep, string> = {
  triage: 'Describe Your Case',
  evidence: 'Upload Evidence',
  results: 'Your Summary',
  paywall: 'Unlock Access',
  merit_score: 'Summary',
  form_recommendation: 'Common Forms',
  generate: 'Form Guides',
  next_steps: 'Next Steps',
  payment: 'Unlock Full Access',
};

export const FunnelEngine: React.FC<FunnelEngineProps> = ({ 
  config, 
  onComplete,
  onExit 
}) => {
  const navigate = useNavigate();
  const { hasAccess, loading: accessLoading } = usePaywallAccess();
  const [state, setState] = useState<FunnelState>(() => createInitialFunnelState(config));
  const [isProcessing, setIsProcessing] = useState(false);

  // Track funnel start on mount
  useEffect(() => {
    if (!config.enabled) return;
    trackFunnelStart(config.id, state.currentStep);
  }, [config.id, config.enabled]);

  // Track drop-off on unmount
  useEffect(() => {
    return () => {
      if (config.enabled && !state.completedSteps.includes('next_steps')) {
        trackStepDrop(config.id, state.currentStep);
      }
    };
  }, [config.id, config.enabled, state.currentStep, state.completedSteps]);

  const progress = calculateProgress(config, state.completedSteps);
  const currentStepIndex = config.steps.indexOf(state.currentStep);

  const updateData = (updates: Partial<FunnelState['data']>) => {
    setState(prev => ({
      ...prev,
      data: { ...prev.data, ...updates }
    }));
  };

  const goToNextStep = () => {
    const nextStep = getNextStep(config, state.currentStep);
    if (nextStep) {
      trackStepComplete(config.id, state.currentStep);
      setState(prev => ({
        ...prev,
        currentStep: nextStep,
        completedSteps: [...prev.completedSteps, prev.currentStep]
      }));
    } else {
      // Funnel complete
      trackStepComplete(config.id, state.currentStep);
      onComplete?.(state.data);
    }
  };

  const goToPreviousStep = () => {
    const prevStep = getPreviousStep(config, state.currentStep);
    if (prevStep) {
      setState(prev => ({
        ...prev,
        currentStep: prevStep
      }));
    }
  };

  const isPaywallStep = state.currentStep === 'paywall' || state.currentStep === 'payment';

  // The checks a step needs before the user can move past it with the shared Continue button
  // (or a step's skip link). Returns a message for the user, or null when they can go on.
  const blockReason = (): string | null => {
    if (state.currentStep === 'triage') {
      if (!state.data.caseTitle?.trim()) return 'Please give your case a short title.';
      if (!state.data.caseDescription?.trim()) return 'Please describe your situation before you continue.';
    }
    if (isPaywallStep && !hasAccess) {
      return accessLoading
        ? 'Checking your plan. Please try again in a moment.'
        : 'Forms and filling instructions are part of the monthly plan. Subscribe above to continue.';
    }
    return null;
  };

  const handleContinue = () => {
    const reason = blockReason();
    if (reason) {
      toast.error(reason);
      return;
    }
    goToNextStep();
  };

  const skipStep = () => {
    const reason = blockReason();
    if (reason) {
      toast.error(reason);
      return;
    }
    trackStepSkip(config.id, state.currentStep);
    goToNextStep();
  };

  const handleExit = () => {
    trackStepDrop(config.id, state.currentStep);
    onExit?.();
    navigate('/');
  };

  // States other than California and New York have no funnel, paywall or checkout.
  if (!config.enabled) {
    return <StateComingSoon stateName={US_STATE_NAMES[config.jurisdiction]} legalArea={config.legalArea} />;
  }

  const renderStepContent = () => {
    const stepProps = {
      config,
      state,
      updateData,
      onNext: goToNextStep,
      onSkip: skipStep,
      isProcessing,
      setIsProcessing,
    };

    switch (state.currentStep) {
      case 'triage':
        return <FunnelTriageStep {...stepProps} />;
      case 'evidence':
        return <FunnelEvidenceStep {...stepProps} />;
      case 'results':
        return <FunnelResultsStep {...stepProps} />;
      case 'paywall':
      case 'payment':
        return <FunnelPaywallStep {...stepProps} />;
      case 'generate':
        return <FunnelGenerateStep {...stepProps} />;
      case 'next_steps':
        return <FunnelNextStepsStep {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-sm">
            {config.seo.h1}
          </Badge>
          <Button variant="ghost" size="sm" onClick={handleExit}>
            Exit
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStepIndex + 1} of {config.steps.length}</span>
            <span>{progress}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mt-4 overflow-x-auto pb-2">
          {config.steps.map((step, index) => {
            const isCompleted = state.completedSteps.includes(step);
            const isCurrent = step === state.currentStep;
            const isUpcoming = index > currentStepIndex;
            
            return (
              <div 
                key={step}
                className={`flex flex-col items-center min-w-[80px] ${
                  isCurrent ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                }`}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center mb-1
                  ${isCompleted ? 'bg-green-100 dark:bg-green-900' : ''}
                  ${isCurrent ? 'bg-primary/10 ring-2 ring-primary' : ''}
                  ${isUpcoming ? 'bg-muted' : ''}
                `}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    STEP_ICONS[step]
                  )}
                </div>
                <span className="text-xs text-center whitespace-nowrap">
                  {STEP_LABELS[step]}
                </span>
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={state.currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStepIndex === 0 || isProcessing}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {isProcessing ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </Button>
          ) : isPaywallStep && !hasAccess ? (
            // Without the plan, the paywall step's own Subscribe button is the only way forward.
            null
          ) : (
            <Button onClick={handleContinue}>
              {currentStepIndex === config.steps.length - 1 ? 'Complete' : 'Continue'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FunnelEngine;
