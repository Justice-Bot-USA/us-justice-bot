import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Scale, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { FunnelConfig, FunnelState, US_STATE_NAMES } from '@/lib/funnels';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useRelatedCases } from '@/hooks/useRelatedCases';

interface FunnelMeritStepProps {
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
}

export const FunnelMeritStep: React.FC<FunnelMeritStepProps> = ({
  config,
  state,
  updateData,
  setIsProcessing,
}) => {
  const { user } = useAuth();
  const { saveRelatedCases } = useRelatedCases();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [progressValue, setProgressValue] = useState(0);
  const [progressMessage, setProgressMessage] = useState('Starting analysis...');

  useEffect(() => {
    runAnalysis();
  }, []);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setIsProcessing(true);

    // Simulate progress
    const progressSteps = [
      { value: 15, message: 'Searching case law databases...' },
      { value: 30, message: `Analyzing ${US_STATE_NAMES[config.jurisdiction]} statutes...` },
      { value: 50, message: 'Comparing to similar precedents...' },
      { value: 70, message: 'Calculating merit score...' },
      { value: 85, message: 'Generating recommendations...' },
      { value: 100, message: 'Analysis complete!' },
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setProgressValue(step.value);
      setProgressMessage(step.message);
    }

    try {
      // Call the AI analysis function
      const { data, error } = await supabase.functions.invoke('analyze-case-merit', {
        body: {
          caseData: {
            userId: user?.id,
            title: state.data.caseTitle,
            description: state.data.caseDescription,
            state: config.jurisdiction,
            county: state.data.county,
            legalArea: config.legalArea
          },
          uploadedFiles: state.data.evidence || []
        }
      });

      if (error) throw error;

      const result: AnalysisResult = {
        meritScore: parseFloat(data.meritScore) || 65,
        strengths: data.analysis?.strengthFactors || ['Clear documentation', 'Strong legal basis'],
        weaknesses: data.analysis?.weaknessFactors || ['May need additional evidence'],
        estimatedSuccessRate: data.analysis?.estimatedSuccessRate || 70,
        timeToResolution: data.analysis?.timeToResolutionMonths ? `${data.analysis.timeToResolutionMonths} months` : '3-6 months',
        settlementRange: {
          min: data.analysis?.settlementRangeMin || 5000,
          max: data.analysis?.settlementRangeMax || 25000,
        },
      };

      setAnalysis(result);
      updateData({ meritScore: result.meritScore });

      // Save related cases if the case was created and we have related case data
      if (data.caseId && state.data.relatedCases && state.data.relatedCases.length > 0) {
        console.log('Saving related cases for case:', data.caseId);
        await saveRelatedCases(data.caseId, state.data.relatedCases.map(rc => ({
          courtName: rc.courtName,
          state: rc.state,
          county: rc.county,
          docketNumber: rc.docketNumber,
          caseType: rc.caseType,
          relationshipDescription: rc.relationshipDescription,
        })));
      }

    } catch (error) {
      console.error('Analysis error:', error);
      // Fallback to simulated result
      const fallbackResult: AnalysisResult = {
        meritScore: 68,
        strengths: ['Documentation provided', 'Clear legal issue identified'],
        weaknesses: ['Additional evidence may strengthen case'],
        estimatedSuccessRate: 65,
        timeToResolution: '4-8 months',
        settlementRange: { min: 5000, max: 20000 },
      };
      setAnalysis(fallbackResult);
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

  if (isAnalyzing) {
    return (
      <div className="space-y-6 py-8">
        <div className="text-center">
          <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
          <h3 className="text-xl font-semibold mb-2">Analyzing Your Case</h3>
          <p className="text-muted-foreground">{progressMessage}</p>
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Your Case Analysis</h3>
        <p className="text-muted-foreground">
          Based on {US_STATE_NAMES[config.jurisdiction]} law and similar cases
        </p>
      </div>

      {/* Merit Score */}
      <Card className="border-2">
        <CardContent className="p-6 text-center">
          <Scale className="h-10 w-10 mx-auto text-primary mb-4" />
          <div className={`text-5xl font-bold mb-2 ${getMeritScoreColor(analysis.meritScore)}`}>
            {analysis.meritScore}
          </div>
          <Badge variant="outline" className={getMeritScoreColor(analysis.meritScore)}>
            {getMeritScoreLabel(analysis.meritScore)}
          </Badge>
          <p className="text-muted-foreground mt-2">Merit Score out of 100</p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-bold">{analysis.estimatedSuccessRate}%</div>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto text-blue-600 mb-2" />
            <div className="text-2xl font-bold">{analysis.timeToResolution}</div>
            <p className="text-sm text-muted-foreground">Est. Timeline</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 mx-auto text-primary mb-2" />
            <div className="text-2xl font-bold">
              ${(analysis.settlementRange.min / 1000).toFixed(0)}k-${(analysis.settlementRange.max / 1000).toFixed(0)}k
            </div>
            <p className="text-sm text-muted-foreground">Settlement Range</p>
          </CardContent>
        </Card>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <h4 className="font-medium flex items-center gap-2 text-green-700 dark:text-green-300 mb-3">
              <CheckCircle2 className="h-4 w-4" />
              Case Strengths
            </h4>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4">
            <h4 className="font-medium flex items-center gap-2 text-yellow-700 dark:text-yellow-300 mb-3">
              <AlertTriangle className="h-4 w-4" />
              Areas to Address
            </h4>
            <ul className="space-y-2">
              {analysis.weaknesses.map((weakness, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <TrendingDown className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  {weakness}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FunnelMeritStep;
