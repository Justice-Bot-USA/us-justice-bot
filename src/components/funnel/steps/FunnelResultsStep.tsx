import React, { useEffect, useState } from 'react';
import StateNextSteps from '@/components/StateNextSteps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Scale, 
  Building2,
  FileText,
  Loader2,
  Sparkles,
  Info,
  ExternalLink,
  Users
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

// Plain-language summary only (founder decision, Oct 2026): no merit score,
// success rate, money or time estimate, strategy, or choosing/ordering forms.
interface AnalysisResult {
  summary: string;
  legalCategory: string;
  generalInfo: string[];
  officialSources: Array<{ name: string; url: string }>;
  caseId?: string;
}

// Courts that usually hear each kind of matter (general information only)
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
  const [analysisFailed, setAnalysisFailed] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [progressMessage, setProgressMessage] = useState('Starting...');

  const stateName = US_STATE_NAMES[config.jurisdiction];
  const legalAreaName = LEGAL_AREA_NAMES[config.legalArea];
  const courtType = COURT_TYPES[config.legalArea] || 'Civil Court';

  useEffect(() => {
    runAnalysis();
  }, []);

  const runAnalysis = async () => {
    setAnalysisFailed(false);
    setIsAnalyzing(true);
    setIsProcessing(true);

    // Progress simulation for UX
    const progressSteps = [
      { value: 15, message: 'Reading what you told us...' },
      { value: 35, message: 'Identifying the general area of law...' },
      { value: 55, message: `Gathering general information for ${stateName}...` },
      { value: 75, message: 'Finding official resources...' },
      { value: 95, message: 'Preparing your summary...' },
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

      if (!data?.success) {
        console.error('Invalid response from edge function:', data);
        throw new Error('Invalid summary response');
      }

      analytics.trackTriageCompleted(config.legalArea, config.jurisdiction);

      const result: AnalysisResult = {
        summary: typeof data.summary === 'string' ? data.summary : '',
        legalCategory: typeof data.legalCategory === 'string' && data.legalCategory ? data.legalCategory : legalAreaName,
        generalInfo: Array.isArray(data.generalInfo) ? data.generalInfo.filter((i: unknown) => typeof i === 'string') : [],
        officialSources: Array.isArray(data.officialSources)
          ? data.officialSources.filter((src: { name?: unknown; url?: unknown }) =>
              typeof src?.name === 'string' && typeof src?.url === 'string' && /^https?:\/\//.test(src.url))
          : [],
        caseId: data.caseId,
      };

      setAnalysis(result);
      setProgressValue(100);
      setProgressMessage('Your summary is ready');
      
      updateData({ 
        caseId: data.caseId,
        summary: result.summary,
      });

      // Save related cases if applicable
      if (data.caseId && state.data.relatedCases?.length > 0) {
        await saveRelatedCases(data.caseId, state.data.relatedCases);
      }

    } catch (error) {
      console.error('Analysis error:', error);
      // Never substitute placeholder text for a failed summary.
      setAnalysis(null);
      setAnalysisFailed(true);
    } finally {
      setIsAnalyzing(false);
      setIsProcessing(false);
    }
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
          <h3 className="text-xl font-semibold mb-2">Preparing Your Summary</h3>
          <p className="text-muted-foreground mb-4">{progressMessage}</p>
        </div>
        <Progress value={progressValue} className="h-3" />
        <p className="text-center text-sm text-muted-foreground">
          We are summarizing what you told us and finding official {stateName} resources...
        </p>
      </div>
    );
  }

  // Analysis failed or returned nothing: say so plainly. No placeholder results.
  if (!analysis) {
    return (
      <div className="space-y-6 py-8">
        <div className="text-center">
          <Scale className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">We couldn't summarize your story right now</h3>
          <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
            {analysisFailed
              ? 'Our summary service did not respond correctly. Nothing was charged. You can try again, or continue to the general forms and guides for your state.'
              : 'The summary did not return a result.'}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={runAnalysis}>Try again</Button>
            <Button variant="outline" onClick={onNext}>Continue to forms and guides</Button>
          </div>
        </div>
        <StateNextSteps state={config.jurisdiction} area={config.legalArea} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Summary ready</span>
        </div>
        <h3 className="text-2xl font-bold mb-2">A Summary of Your Situation</h3>
        <p className="text-muted-foreground">
          What you told us, plus general information about {legalAreaName.toLowerCase()} matters in {stateName}
        </p>
      </div>

      {/* What you told us */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            What you told us
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {analysis.summary || state.data.caseDescription}
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Scale className="h-4 w-4 text-primary" />
              <span><span className="text-muted-foreground">Legal area:</span> {analysis.legalCategory}</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Building2 className="h-4 w-4 text-primary" />
              <span>
                <span className="text-muted-foreground">Courts that usually hear these matters:</span> {courtType}
                {state.data.county ? ` (${state.data.county} County, ${stateName})` : ` (${stateName})`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* General information */}
      {(analysis.generalInfo.length > 0 || analysis.officialSources.length > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="h-5 w-5 text-primary" />
              General information for {stateName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.generalInfo.length > 0 && (
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {analysis.generalInfo.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
            {analysis.officialSources.length > 0 && (
              <div>
                <p className="font-medium text-sm mb-2">Official sources</p>
                <ul className="space-y-1 text-sm">
                  {analysis.officialSources.map((src, i) => (
                    <li key={i}>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {src.name}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lawyer / legal aid reminder */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            This is general legal information, not legal advice, and not a prediction of how your matter will turn out.
            We do not choose forms or a strategy for you. Talk to a lawyer or a free legal aid organization about your situation.
          </p>
        </CardContent>
      </Card>

      <StateNextSteps state={config.jurisdiction} area={config.legalArea} />
    </div>
  );
};

export default FunnelResultsStep;
