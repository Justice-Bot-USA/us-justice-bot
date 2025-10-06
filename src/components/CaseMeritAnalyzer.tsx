import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Scale, TrendingUp, TrendingDown, FileText, DollarSign, Calendar, Target } from 'lucide-react';
import { ComprehensiveCaseAnalysis } from './ComprehensiveCaseAnalysis';
import { MeritScoreImprovements } from './MeritScoreImprovements';

interface CaseMeritScore {
  id: string;
  case_title: string;
  merit_score: number;
  strength_factors: any;
  weakness_factors: any;
  relevant_laws: any;
  estimated_success_rate: number;
  settlement_range_min: number;
  settlement_range_max: number;
  time_to_resolution_months: number;
  complexity_score: number;
  created_at: string;
  legal_pathway?: any[];
  required_forms?: any[];
  evidence_to_gather?: any[];
  filing_options?: any;
  next_steps?: any[];
  improvement_suggestions?: any[];
  legal_area?: string;
}

export const CaseMeritAnalyzer: React.FC = () => {
  const { user } = useAuth();
  const [caseTitle, setCaseTitle] = useState('');
  const [caseDescription, setCaseDescription] = useState('');
  const [state, setState] = useState('');
  const [county, setCounty] = useState('');
  const [legalArea, setLegalArea] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [caseMeritScores, setCaseMeritScores] = useState<CaseMeritScore[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseMeritScore | null>(null);

  useEffect(() => {
    if (user) {
      fetchCaseMeritScores();
    }
  }, [user]);

  const fetchCaseMeritScores = async () => {
    try {
      const { data, error } = await supabase
        .from('case_merit_scores')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCaseMeritScores((data || []) as CaseMeritScore[]);
    } catch (error) {
      console.error('Error fetching case merit scores:', error);
    }
  };

  const analyzeCase = async () => {
    if (!caseTitle || !caseDescription || !state || !legalArea) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setAnalyzing(true);

      // Get uploaded files for this user
      const { data: files } = await supabase
        .from('case_files')
        .select('*')
        .eq('user_id', user?.id);

      const { data, error } = await supabase.functions.invoke('analyze-case-merit', {
        body: {
          caseData: {
            userId: user?.id,
            title: caseTitle,
            description: caseDescription,
            state,
            county,
            legalArea
          },
          uploadedFiles: files
        }
      });

      if (error) throw error;

      toast.success('Case analysis complete');
      await fetchCaseMeritScores();
      
      // Clear form
      setCaseTitle('');
      setCaseDescription('');
      setState('');
      setCounty('');
      setLegalArea('');
    } catch (error) {
      console.error('Error analyzing case:', error);
      toast.error('Failed to analyze case merit');
    } finally {
      setAnalyzing(false);
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
    return 'Weak Case';
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please sign in to analyze case merit</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analysis Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Case Merit Analysis
          </CardTitle>
          <CardDescription>
            Analyze your case strength based on state & county laws, evidence, and legal factors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Case Title"
              value={caseTitle}
              onChange={(e) => setCaseTitle(e.target.value)}
            />
            <Input
              placeholder="State (e.g., California)"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <Input
              placeholder="County (Optional)"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
            />
            <Input
              placeholder="Legal Area (e.g., Contract Law)"
              value={legalArea}
              onChange={(e) => setLegalArea(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Describe Your Legal Issue</label>
            <Textarea
              placeholder="Tell us your version of events in detail. Include:&#10;• What happened and when&#10;• Who was involved&#10;• What evidence you have (photos, documents, witnesses)&#10;• What outcome you're seeking&#10;• Any deadlines or time constraints&#10;&#10;The more detailed you are, the better we can analyze your case and provide guidance."
              value={caseDescription}
              onChange={(e) => setCaseDescription(e.target.value)}
              rows={8}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              This is your legal triage - describe everything relevant to help our AI understand your situation
            </p>
          </div>
          <Button onClick={analyzeCase} disabled={analyzing} className="w-full">
            {analyzing ? 'Analyzing...' : 'Analyze Case Merit'}
          </Button>
        </CardContent>
      </Card>

      {/* Previous Analyses */}
      {caseMeritScores.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Case List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Case Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {caseMeritScores.map((caseScore) => (
                  <div
                    key={caseScore.id}
                    onClick={() => setSelectedCase(caseScore)}
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                      selectedCase?.id === caseScore.id ? 'bg-accent' : ''
                    }`}
                  >
                    <h3 className="font-semibold mb-2">{caseScore.case_title}</h3>
                    <div className="flex items-center gap-4 mb-2">
                      <span className={`text-2xl font-bold ${getMeritScoreColor(caseScore.merit_score)}`}>
                        {caseScore.merit_score.toFixed(0)}
                      </span>
                      <div className="flex-1">
                        <Progress value={caseScore.merit_score} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {getMeritScoreLabel(caseScore.merit_score)}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(caseScore.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          {selectedCase && (
            <>
              {/* Merit Score Improvements - Show First */}
              <MeritScoreImprovements 
                meritScore={selectedCase.merit_score}
                improvementSuggestions={selectedCase.improvement_suggestions || []}
                evidenceCount={(selectedCase as any).supporting_evidence?.length || 0}
              />

              <Card>
                <CardHeader>
                  <CardTitle>{selectedCase.case_title}</CardTitle>
                  <div className="flex items-center gap-4">
                    <span className={`text-4xl font-bold ${getMeritScoreColor(selectedCase.merit_score)}`}>
                      {selectedCase.merit_score.toFixed(0)}
                    </span>
                    <div className="flex-1">
                      <Progress value={selectedCase.merit_score} className="h-3" />
                      <p className="text-sm text-muted-foreground mt-1">
                        {getMeritScoreLabel(selectedCase.merit_score)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                      <p className="font-semibold">{selectedCase.estimated_success_rate.toFixed(0)}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Est. Time</p>
                      <p className="font-semibold">{selectedCase.time_to_resolution_months} months</p>
                    </div>
                  </div>
                </div>

                {/* Settlement Range */}
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4" />
                    <p className="font-semibold text-sm">Settlement Range</p>
                  </div>
                  <p className="text-lg font-bold">
                    ${selectedCase.settlement_range_min.toLocaleString()} - ${selectedCase.settlement_range_max.toLocaleString()}
                  </p>
                </div>

                {/* Strengths */}
                {Array.isArray(selectedCase.strength_factors) && selectedCase.strength_factors.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <h4 className="font-semibold text-sm">Strengths</h4>
                    </div>
                    <div className="space-y-2">
                      {selectedCase.strength_factors.map((factor: any, idx: number) => (
                        <div key={idx} className="p-2 bg-green-50 border border-green-200 rounded">
                          <p className="font-medium text-sm">{factor.factor}</p>
                          <p className="text-xs text-muted-foreground">{factor.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weaknesses */}
                {Array.isArray(selectedCase.weakness_factors) && selectedCase.weakness_factors.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <h4 className="font-semibold text-sm">Weaknesses</h4>
                    </div>
                    <div className="space-y-2">
                      {selectedCase.weakness_factors.map((factor: any, idx: number) => (
                        <div key={idx} className="p-2 bg-red-50 border border-red-200 rounded">
                          <p className="font-medium text-sm">{factor.factor}</p>
                          <p className="text-xs text-muted-foreground">{factor.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Relevant Laws */}
                {Array.isArray(selectedCase.relevant_laws) && selectedCase.relevant_laws.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <h4 className="font-semibold text-sm">Relevant Laws</h4>
                    </div>
                    <div className="space-y-2">
                      {selectedCase.relevant_laws.map((law: any, idx: number) => (
                        <div key={idx} className="p-2 bg-blue-50 border border-blue-200 rounded">
                          <p className="font-medium text-sm">{law.title}</p>
                          <p className="text-xs text-muted-foreground mb-1">{law.citation}</p>
                          {law.summary && (
                            <p className="text-xs">{law.summary}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Comprehensive Analysis - New Section */}
            {(selectedCase.legal_pathway || selectedCase.required_forms || selectedCase.evidence_to_gather || selectedCase.filing_options) && (
              <ComprehensiveCaseAnalysis 
                analysis={{
                  legalCategory: selectedCase.legal_area,
                  legalPathway: selectedCase.legal_pathway,
                  requiredForms: selectedCase.required_forms,
                  evidenceToGather: selectedCase.evidence_to_gather,
                  filingOptions: selectedCase.filing_options,
                  nextSteps: selectedCase.next_steps,
                }}
              />
            )}
          </>
          )}
        </div>
      )}
    </div>
  );
};