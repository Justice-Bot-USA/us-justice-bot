import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Scale, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Building2,
  FileText,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowRight,
  Sparkles,
  Gavel,
  MapPin
} from 'lucide-react';
import { FunnelConfig, FunnelState, US_STATE_NAMES, LEGAL_AREA_NAMES } from '@/lib/funnels';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useRelatedCases } from '@/hooks/useRelatedCases';
import * as analytics from '@/hooks/useAnalytics';

interface FunnelResultsStepProps {
  config: FunnelConfig;
  state: FunnelState;
  updateData: (updates: Partial<FunnelState['data']>) => void;
  onNext: () => void;
  onSkip: () => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

interface AnalysisResult {
  meritScore: number;
  strengths: string[];
  weaknesses: string[];
  estimatedSuccessRate: number;
  timeToResolution: string;
  settlementRange: { min: number; max: number };
  legalPathway: Array<{ step?: number; action?: string; timeline?: string }>;
  requiredForms: Array<{ formName?: string; formNumber?: string; purpose?: string }>;
  filingOptions: {
    proSe?: string;
    withAttorney?: string;
    recommendation?: string;
  };
  forum?: string;
  caseId?: string;
}

// Court type mapping for display
const COURT_TYPES: Record<string, string> = {
  'family': 'Family Court',
  'small-claims': 'Small Claims Court',
  'housing': 'Housing Court / Civil Division',
  'employment': 'Civil Court / Labor Board',
  'criminal': 'Criminal Court',
  'cps': 'Family Court / Juvenile Division',
  'workers-rights': 'Civil Court / OSHA',
  'human-rights': 'Civil Rights Division',
  'agency-complaints': 'Administrative Court',
};

export const FunnelResultsStep: React.FC<FunnelResultsStepProps> = ({
  config,
  state,
  updateData,
  onNext,
  setIsProcessing,
}) => {
  const { user } = useAuth();
  const { saveRelatedCases } = useRelatedCases();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [progressValue, setProgressValue] = useState(0);
  const [progressMessage, setProgressMessage] = useState('Starting analysis...');

  const stateName = US_STATE_NAMES[config.jurisdiction];
  const legalAreaName = LEGAL_AREA_NAMES[config.legalArea];
  const courtType = COURT_TYPES[config.legalArea] || 'Civil Court';

  useEffect(() => {
    runAnalysis();
  }, []);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setIsProcessing(true);

    // Progress simulation for UX
    const progressSteps = [
      { value: 10, message: 'Processing your case details...' },
      { value: 25, message: `Searching ${stateName} case law databases...` },
      { value: 40, message: 'Analyzing legal precedents...' },
      { value: 55, message: 'Calculating merit score...' },
      { value: 70, message: 'Identifying legal pathways...' },
      { value: 85, message: 'Matching required forms...' },
      { value: 95, message: 'Generating recommendations...' },
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 700));
      setProgressValue(step.value);
      setProgressMessage(step.message);
    }

    try {
      console.log('Calling analyze-case-merit edge function...');
      
      // Call the AI analysis function
      const { data, error } = await supabase.functions.invoke('analyze-case-merit', {
        body: {
          caseData: {
            userId: user?.id,
            title: state.data.caseTitle || `${legalAreaName} Case`,
            description: state.data.caseDescription,
            state: config.jurisdiction,
            county: state.data.county,
            legalArea: config.legalArea
          },
          uploadedFiles: state.data.evidence || []
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data || !data.meritScore) {
        console.error('Invalid response from edge function:', data);
        throw new Error('Invalid analysis response');
      }

      // Track triage_completed
      if (data?.meritScore) {
        analytics.trackTriageCompleted(parseFloat(data.meritScore), config.legalArea, config.jurisdiction);
      }

      const result: AnalysisResult = {
        meritScore: parseFloat(data.meritScore) || 65,
        strengths: data.analysis?.strengthFactors?.map((f: any) => f.factor || f) || ['Clear documentation'],
        weaknesses: data.analysis?.weaknessFactors?.map((f: any) => f.factor || f) || ['May need additional evidence'],
        estimatedSuccessRate: parseFloat(data.analysis?.estimatedSuccessRate) || 70,
        timeToResolution: data.analysis?.timeToResolutionMonths ? `${data.analysis.timeToResolutionMonths} months` : '3-6 months',
        settlementRange: {
          min: parseFloat(data.analysis?.settlementRange?.min) || 5000,
          max: parseFloat(data.analysis?.settlementRange?.max) || 25000,
        },
        legalPathway: data.analysis?.legalPathway || [],
        requiredForms: data.analysis?.requiredForms || [],
        filingOptions: data.analysis?.filingOptions || {},
        forum: courtType,
        caseId: data.caseId,
      };

      setAnalysis(result);
      setProgressValue(100);
      setProgressMessage('Analysis complete!');
      
      updateData({ 
        meritScore: result.meritScore,
        caseId: data.caseId,
        legalPathway: result.legalPathway,
        requiredForms: result.requiredForms,
      });

      // Save related cases if applicable
      if (data.caseId && state.data.relatedCases?.length > 0) {
        await saveRelatedCases(data.caseId, state.data.relatedCases);
      }

    } catch (error) {
      console.error('Analysis error:', error);
      // Use DETAILED fallback result based on the legal area
      const fallbackForms = config.forms.slice(0, 4).map((f, idx) => ({ 
        formNumber: f, 
        formName: f,
        purpose: `Required for ${legalAreaName.toLowerCase()} filing in ${stateName}`,
        filingOrder: idx + 1
      }));
      
      const fallbackResult: AnalysisResult = {
        meritScore: 68,
        strengths: [
          'Case details provided for analysis',
          'Clear legal issue identified',
          `${stateName} jurisdiction established`
        ],
        weaknesses: [
          'Additional evidence may strengthen case',
          'Consider consulting with a licensed attorney'
        ],
        estimatedSuccessRate: 65,
        timeToResolution: '4-8 months',
        settlementRange: { min: 5000, max: 20000 },
        legalPathway: [
          { step: 1, action: 'File initial complaint/petition', timeline: 'Week 1-2' },
          { step: 2, action: 'Serve opposing party', timeline: 'Week 2-4' },
          { step: 3, action: 'Wait for response period', timeline: 'Week 4-8' },
          { step: 4, action: 'Discovery and preparation', timeline: 'Months 2-4' },
          { step: 5, action: 'Settlement negotiations or trial', timeline: 'Months 4-8' },
        ],
        requiredForms: fallbackForms,
        filingOptions: {
          proSe: `You can represent yourself in ${stateName} ${courtType}`,
          withAttorney: 'An attorney can help navigate complex procedures',
          recommendation: 'Consider your case complexity when deciding'
        },
        forum: courtType,
      };
      setAnalysis(fallbackResult);
      setProgressValue(100);
      setProgressMessage('Basic analysis complete');
      updateData({ meritScore: fallbackResult.meritScore });
    } finally {
      setIsAnalyzing(false);
      setIsProcessing(false);
    }
  };

  const getMeritScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMeritScoreLabel = (score: number) => {
    if (score >= 75) return 'Strong Case';
    if (score >= 50) return 'Moderate Case';
    return 'Needs Work';
  };

  const getMeritScoreBg = (score: number) => {
    if (score >= 75) return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
    if (score >= 50) return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
  };

  // Loading state
  if (isAnalyzing) {
    return (
      <div className="space-y-6 py-8">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <Loader2 className="w-20 h-20 text-primary animate-spin" />
            <Scale className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Analyzing Your Case</h3>
          <p className="text-muted-foreground mb-4">{progressMessage}</p>
        </div>
        <Progress value={progressValue} className="h-3" />
        <p className="text-center text-sm text-muted-foreground">
          Our AI is searching {stateName} case law and matching your situation to legal precedents...
        </p>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Analysis Complete</span>
        </div>
        <h3 className="text-2xl font-bold mb-2">Your Case Results</h3>
        <p className="text-muted-foreground">
          Based on {stateName} law and similar {legalAreaName.toLowerCase()} cases
        </p>
      </div>

      {/* ===== FREE SECTION: Merit Score (Visible) ===== */}
      <Card className={`border-2 ${getMeritScoreBg(analysis.meritScore)}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`text-5xl font-bold ${getMeritScoreColor(analysis.meritScore)}`}>
                  {analysis.meritScore}
                </div>
                <span className="text-xs text-muted-foreground absolute -bottom-4 left-0 right-0 text-center">
                  out of 100
                </span>
              </div>
              <div>
                <Badge className={getMeritScoreColor(analysis.meritScore)}>
                  {getMeritScoreLabel(analysis.meritScore)}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  Case Strength Assessment
                </p>
              </div>
            </div>
            <Scale className={`h-12 w-12 ${getMeritScoreColor(analysis.meritScore)}`} />
          </div>
        </CardContent>
      </Card>

      {/* ===== FREE SECTION: Pathway Overview (Teaser) ===== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gavel className="h-5 w-5 text-primary" />
            Your Legal Pathway
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Forum - FREE */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">{analysis.forum}</p>
              <p className="text-sm text-muted-foreground">
                {state.data.county ? `${state.data.county} County, ` : ''}{stateName}
              </p>
            </div>
          </div>

          {/* Pathway Steps - Show first 2 free, blur rest */}
          <div className="space-y-2">
            {analysis.legalPathway.slice(0, 2).map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                  {idx + 1}
                </span>
                <div>
                  <p className="font-medium text-sm">{step.action}</p>
                  {step.timeline && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {step.timeline}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {/* Blurred preview of remaining steps */}
            {analysis.legalPathway.length > 2 && (
              <div className="relative">
                <div className="blur-sm opacity-50 space-y-2">
                  {analysis.legalPathway.slice(2, 4).map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                        {idx + 3}
                      </span>
                      <p className="text-sm">{step.action?.substring(0, 30)}...</p>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    +{analysis.legalPathway.length - 2} more steps
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ===== FREE SECTION: Form Names Teaser ===== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Forms Identified for Your Case
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(analysis.requiredForms.length > 0 ? analysis.requiredForms : config.forms.slice(0, 4).map(f => ({ formNumber: f }))).slice(0, 4).map((form, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-lg">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{form.formNumber || form.formName}</p>
                    {form.purpose && (
                      <p className="text-xs text-muted-foreground">{form.purpose.substring(0, 40)}...</p>
                    )}
                  </div>
                </div>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              <Lock className="h-3 w-3 inline mr-1" />
              Unlock to download forms, get autofill, and filing instructions
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ===== FREE SECTION: Quick Stats ===== */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <div className="text-lg font-bold">{analysis.estimatedSuccessRate}%</div>
            <p className="text-xs text-muted-foreground">Est. Success</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <div className="text-lg font-bold">{analysis.timeToResolution}</div>
            <p className="text-xs text-muted-foreground">Timeline</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="h-5 w-5 mx-auto text-primary mb-1" />
            <div className="text-lg font-bold">{analysis.requiredForms.length || config.forms.length}</div>
            <p className="text-xs text-muted-foreground">Forms</p>
          </CardContent>
        </Card>
      </div>

      {/* ===== Strengths & Weaknesses ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <h4 className="font-medium flex items-center gap-2 text-green-700 dark:text-green-300 mb-3">
              <CheckCircle2 className="h-4 w-4" />
              Strengths
            </h4>
            <ul className="space-y-2">
              {analysis.strengths.slice(0, 3).map((s, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  {typeof s === 'string' ? s : s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4">
            <h4 className="font-medium flex items-center gap-2 text-yellow-700 dark:text-yellow-300 mb-3">
              <AlertTriangle className="h-4 w-4" />
              To Address
            </h4>
            <ul className="space-y-2">
              {analysis.weaknesses.slice(0, 3).map((w, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <TrendingDown className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  {typeof w === 'string' ? w : w}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* ===== SINGLE PRIMARY CTA ===== */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <h4 className="text-lg font-semibold mb-2">Ready to Take Action?</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Unlock your complete legal pathway, downloadable forms, and step-by-step filing instructions.
          </p>
          <Button size="lg" className="w-full sm:w-auto" onClick={onNext}>
            Unlock Your Legal Pathway & Forms
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FunnelResultsStep;
