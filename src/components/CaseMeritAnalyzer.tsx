import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Scale, TrendingUp, TrendingDown, FileText, DollarSign, Calendar, Target, Upload, CheckCircle2, ArrowRight, Gavel } from 'lucide-react';
import { ComprehensiveCaseAnalysis } from './ComprehensiveCaseAnalysis';
import { MeritScoreImprovements } from './MeritScoreImprovements';
import { EvidenceUploader } from './EvidenceUploader';

// All 50 US States
const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming", "District of Columbia"
];

// Legal Areas including Criminal Defense
const LEGAL_AREAS = [
  { value: "criminal-defense", label: "Criminal Defense", category: "criminal" },
  { value: "dui-dwi", label: "DUI / DWI", category: "criminal" },
  { value: "drug-crimes", label: "Drug Crimes", category: "criminal" },
  { value: "theft-crimes", label: "Theft / Property Crimes", category: "criminal" },
  { value: "assault-battery", label: "Assault & Battery", category: "criminal" },
  { value: "domestic-violence", label: "Domestic Violence", category: "criminal" },
  { value: "white-collar", label: "White Collar Crimes", category: "criminal" },
  { value: "traffic-violations", label: "Traffic Violations", category: "criminal" },
  { value: "expungement", label: "Expungement / Record Sealing", category: "criminal" },
  { value: "family-law", label: "Family Law / Divorce", category: "civil" },
  { value: "child-custody", label: "Child Custody", category: "civil" },
  { value: "child-support", label: "Child Support", category: "civil" },
  { value: "small-claims", label: "Small Claims", category: "civil" },
  { value: "housing-tenant", label: "Housing / Tenant Rights", category: "civil" },
  { value: "eviction-defense", label: "Eviction Defense", category: "civil" },
  { value: "employment", label: "Employment / Wrongful Termination", category: "civil" },
  { value: "wage-theft", label: "Wage Theft / Unpaid Wages", category: "civil" },
  { value: "discrimination", label: "Discrimination / Civil Rights", category: "civil" },
  { value: "personal-injury", label: "Personal Injury", category: "civil" },
  { value: "medical-malpractice", label: "Medical Malpractice", category: "civil" },
  { value: "contract-dispute", label: "Contract Disputes", category: "civil" },
  { value: "consumer-protection", label: "Consumer Protection", category: "civil" },
  { value: "debt-collection", label: "Debt Collection Defense", category: "civil" },
  { value: "bankruptcy", label: "Bankruptcy", category: "civil" },
  { value: "immigration", label: "Immigration", category: "civil" },
  { value: "cps-child-welfare", label: "CPS / Child Welfare", category: "civil" },
  { value: "human-rights", label: "Human Rights", category: "civil" },
  { value: "workers-comp", label: "Workers' Compensation", category: "civil" },
  { value: "social-security", label: "Social Security / Disability", category: "civil" },
  { value: "veterans-benefits", label: "Veterans Benefits", category: "civil" },
  { value: "other", label: "Other Legal Matter", category: "civil" }
];

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
  const [currentStep, setCurrentStep] = useState<'triage' | 'evidence' | 'analyze'>('triage');
  const [caseTitle, setCaseTitle] = useState('');
  const [caseDescription, setCaseDescription] = useState('');
  const [state, setState] = useState('');
  const [county, setCounty] = useState('');
  const [legalArea, setLegalArea] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [caseMeritScores, setCaseMeritScores] = useState<CaseMeritScore[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseMeritScore | null>(null);
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);

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
      {/* Step-by-Step Journey */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Build Your Legal Case
          </CardTitle>
          <CardDescription>
            Follow these steps to analyze your case and get form recommendations
          </CardDescription>
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mt-4">
            <div className={`flex items-center gap-2 ${currentStep === 'triage' ? 'text-primary' : 'text-muted-foreground'}`}>
              {currentStep !== 'triage' ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <div className="h-5 w-5 rounded-full border-2 border-primary flex items-center justify-center"><span className="text-xs">1</span></div>}
              <span className="text-sm font-medium">Legal Triage</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className={`flex items-center gap-2 ${currentStep === 'evidence' ? 'text-primary' : 'text-muted-foreground'}`}>
              {currentStep === 'analyze' ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <div className="h-5 w-5 rounded-full border-2 flex items-center justify-center"><span className="text-xs">2</span></div>}
              <span className="text-sm font-medium">Upload Evidence</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className={`flex items-center gap-2 ${currentStep === 'analyze' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className="h-5 w-5 rounded-full border-2 flex items-center justify-center"><span className="text-xs">3</span></div>
              <span className="text-sm font-medium">Analyze & Get Forms</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={currentStep} onValueChange={(value) => setCurrentStep(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="triage" disabled={false}>
                1. Describe Your Case
              </TabsTrigger>
              <TabsTrigger value="evidence" disabled={!caseTitle || !caseDescription}>
                2. Upload Evidence
              </TabsTrigger>
              <TabsTrigger value="analyze" disabled={!caseTitle || !caseDescription}>
                3. Analyze Case
              </TabsTrigger>
            </TabsList>
            
            {/* Step 1: Legal Triage */}
            <TabsContent value="triage" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Case Title *"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                />
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State *" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {US_STATES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="County (Optional)"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                />
                <Select value={legalArea} onValueChange={setLegalArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Legal Area *" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <Gavel className="h-3 w-3" /> Criminal Law
                    </div>
                    {LEGAL_AREAS.filter(a => a.category === 'criminal').map((area) => (
                      <SelectItem key={area.value} value={area.label}>{area.label}</SelectItem>
                    ))}
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground flex items-center gap-1 mt-2">
                      <Scale className="h-3 w-3" /> Civil Law
                    </div>
                    {LEGAL_AREAS.filter(a => a.category === 'civil').map((area) => (
                      <SelectItem key={area.value} value={area.label}>{area.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Describe Your Legal Issue *</label>
                <Textarea
                  placeholder={legalArea?.toLowerCase().includes('criminal') || legalArea?.toLowerCase().includes('dui') || legalArea?.toLowerCase().includes('assault') || legalArea?.toLowerCase().includes('drug') || legalArea?.toLowerCase().includes('theft') ? 
                    "Tell us about your criminal case in detail. Include:\n• What charges you're facing\n• When and where the incident occurred\n• What happened from your perspective\n• Any evidence (police reports, videos, witnesses)\n• Your arrest and bail status\n• Any prior criminal history\n• What outcome you're hoping for\n\nThe more detailed you are, the better we can analyze defenses and strategies." :
                    "Tell us your version of events in detail. Include:\n• What happened and when\n• Who was involved\n• What evidence you have (photos, documents, witnesses)\n• What outcome you're seeking\n• Any deadlines or time constraints\n\nThe more detailed you are, the better we can analyze your case and provide guidance."}
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                  rows={10}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {legalArea?.toLowerCase().includes('criminal') || legalArea?.toLowerCase().includes('dui') ? 
                    "Your information is confidential. We'll analyze potential defenses under your state's criminal laws." :
                    "This is your legal triage - describe everything relevant to help our AI understand your situation"}
                </p>
              </div>
              <Button 
                onClick={() => setCurrentStep('evidence')} 
                disabled={!caseTitle || !caseDescription || !state || !legalArea}
                className="w-full"
              >
                Continue to Evidence Upload
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </TabsContent>
            
            {/* Step 2: Evidence Upload */}
            <TabsContent value="evidence" className="space-y-4">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📁 Why Upload Evidence?</h4>
                <p className="text-sm text-blue-800">
                  Uploading evidence strengthens your case analysis. Include contracts, photos, emails, receipts, and any documents that support your claim.
                </p>
              </div>
              
              <EvidenceUploader 
                onFilesUploaded={(files) => setUploadedFilesCount(files.length)}
              />
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep('triage')} className="flex-1">
                  Back to Case Details
                </Button>
                <Button onClick={() => setCurrentStep('analyze')} className="flex-1">
                  {uploadedFilesCount > 0 ? `Continue with ${uploadedFilesCount} file(s)` : 'Skip & Analyze'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            {/* Step 3: Analyze */}
            <TabsContent value="analyze" className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">✅ Ready to Analyze</h4>
                <div className="text-sm text-green-800 space-y-1">
                  <p>• Case: {caseTitle}</p>
                  <p>• Location: {county ? `${county}, ${state}` : state}</p>
                  <p>• Legal Area: {legalArea}</p>
                  <p>• Evidence Files: {uploadedFilesCount}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">What You'll Receive:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>✓ Merit score and case strength analysis</li>
                  <li>✓ Legal pathway and jurisdiction-specific guidance</li>
                  <li>✓ Required forms for your case type</li>
                  <li>✓ Evidence collection recommendations</li>
                  <li>✓ Filing options and next steps</li>
                  <li>✓ Suggestions to improve your case</li>
                </ul>
              </div>
              
              <Button onClick={analyzeCase} disabled={analyzing} className="w-full" size="lg">
                {analyzing ? 'Analyzing Your Case...' : 'Submit for AI Analysis'}
              </Button>
              
              <Button variant="outline" onClick={() => setCurrentStep('evidence')} className="w-full">
                Back to Evidence Upload
              </Button>
            </TabsContent>
          </Tabs>
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