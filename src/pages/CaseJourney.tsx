import React, { useState, useEffect } from 'react';
import StateNextSteps from '@/components/StateNextSteps';
import { signInPath } from '@/lib/signIn';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  ArrowRight, 
  Scale, 
  Upload, 
  FileText, 
  MapPin, 
  Lock,
  Unlock,
  Download,
  Printer,
  Mail,
  Building2,
  ClipboardCheck,
  Sparkles,
  AlertCircle,
  Gavel,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePaywallAccess } from '@/hooks/usePaywallAccess';
import { PLAN, startSubscriptionCheckout } from '@/lib/pricing';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { EvidenceUploader } from '@/components/EvidenceUploader';
import { RelatedCasesDisplay } from '@/components/dashboard/RelatedCasesDisplay';
import { ProceduralGuidancePanel } from '@/components/ProceduralGuidancePanel';
import { trackAddToCart, getDetectedCountry } from '@/hooks/useAnalytics';
import { isValidUUID } from '@/lib/validation';

interface CaseData {
  id: string;
  case_title: string;
  legal_area: string;
  state: string;
  county: string | null;
  case_description: string | null;
}

const JOURNEY_STEPS = [
  { id: 1, name: 'Summary', icon: Scale },
  { id: 2, name: 'Evidence', icon: Upload },
  { id: 3, name: 'Documents', icon: FileText },
  { id: 4, name: 'Filing', icon: MapPin },
  { id: 5, name: 'Complete', icon: CheckCircle2 },
];

function CantAccessCaseCard({
  description,
}: {
  description: string;
}) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Can’t access this case</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{description}</p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate('/my-cases')} className="w-full">Go to My Cases</Button>
            <Button variant="outline" onClick={() => navigate('/case-analysis')} className="w-full">Start New Case</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const CaseJourneyInner = ({ caseId }: { caseId: string }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasAccess, isAdmin, loading: accessLoading } = usePaywallAccess();

  const [currentStep, setCurrentStep] = useState(1);
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchCaseData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('case_merit_scores')
          .select('*')
          .eq('id', caseId)
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        setCaseData(data);
        setAccessDenied(false);
        
        // Fetch uploaded files count
        const { count } = await supabase
          .from('case_files')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('case_id', caseId);
        
        setUploadedFilesCount(count || 0);
      } catch (error) {
        // Friendly behavior (no raw errors, no redirect): treat as “not accessible”.
        console.warn('[case] access denied or not found');
        setCaseData(null);
        setAccessDenied(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCaseData();
  }, [caseId, user]);

  const handleUnlock = async () => {
    if (!user) {
      navigate(signInPath());
      return;
    }

    setIsUnlocking(true);
    
    trackAddToCart('Case Assessment', caseData?.state || '', getDetectedCountry(), PLAN.price);
    try {
      sessionStorage.setItem('pending_case_id', caseId || '');
      await startSubscriptionCheckout();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to start checkout. Please try again.');
      setIsUnlocking(false);
    }
  };

  const getCourtInfo = () => {
    const legalArea = caseData?.legal_area || '';
    const state = caseData?.state || '';
    const county = caseData?.county || '';
    
    // Court type based on legal area
    const courtTypes: Record<string, string> = {
      'family': 'Family Court',
      'small-claims': 'Small Claims Court',
      'housing': 'Housing Court / Civil Division',
      'employment': 'Civil Court / Labor Board',
      'criminal': 'Criminal Court',
      'cps': 'Family Court / Juvenile Division',
      'workers-rights': 'Civil Court / OSHA Regional Office',
      'human-rights': 'Civil Rights Division / State Human Rights Commission',
      'agency-complaints': 'Administrative Law Court / Professional Licensing Board',
    };
    
    return {
      courtType: courtTypes[legalArea] || 'Civil Court',
      jurisdiction: county ? `${county} County, ${state}` : `${state} State`,
      filingMethod: ['In Person', 'By Mail', 'Online (where available)'],
    };
  };

  const progressPercentage = (currentStep / JOURNEY_STEPS.length) * 100;

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Please sign in to continue your case journey.</p>
            <Button onClick={() => navigate(signInPath())} className="w-full">Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || accessLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your case...</p>
        </div>
      </div>
    );
  }

  if (accessDenied || !caseData) {
    return (
      <CantAccessCaseCard description="This case link is invalid, expired, or belongs to another account." />
    );
  }

  const courtInfo = getCourtInfo();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Header */}
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b pb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-xl">Your Case Journey</CardTitle>
                <CardDescription>{caseData.case_title}</CardDescription>
              </div>
              <Badge variant={currentStep === 5 ? 'default' : 'secondary'}>
                Step {currentStep} of {JOURNEY_STEPS.length}
              </Badge>
            </div>
            
            <Progress value={progressPercentage} className="h-2 mb-4" />
            
            {/* Step Indicators */}
            <div className="flex justify-between">
              {JOURNEY_STEPS.map((step) => {
                const Icon = step.icon;
                const isComplete = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                
                return (
                  <div 
                    key={step.id}
                    className={`flex flex-col items-center gap-1 ${
                      isCurrent ? 'text-primary' : isComplete ? 'text-green-600' : 'text-muted-foreground'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      isCurrent ? 'bg-primary text-primary-foreground' : 
                      isComplete ? 'bg-green-600 text-white' : 'bg-muted'
                    }`}>
                      {isComplete ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span className="text-xs font-medium hidden sm:block">{step.name}</span>
                  </div>
                );
              })}
            </div>
          </CardHeader>
        </Card>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* Step 1: Results */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">A Summary of Your Situation</CardTitle>
                  <CardDescription className="text-lg">
                    What you told us, and where to find official help in your state
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Case Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Legal Area</p>
                      <p className="font-semibold capitalize">{caseData.legal_area.replace('-', ' ')}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold">{caseData.county ? `${caseData.county}, ` : ''}{caseData.state}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Courts that usually hear these matters</p>
                      <p className="font-semibold">{courtInfo.courtType}</p>
                    </div>
                  </div>

                  {/* What you told us */}
                  {caseData.case_description && (
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium mb-2">What you told us</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{caseData.case_description}</p>
                    </div>
                  )}

                  <StateNextSteps state={caseData.state} area={caseData.legal_area} detail={caseData.case_title} />

                  {/* Related Cases Display */}
                  {caseId && <RelatedCasesDisplay caseId={caseId} />}

                  <p className="text-sm text-muted-foreground">
                    This is general legal information, not legal advice, and not a prediction of how your matter will turn out. Talk to a lawyer or a free legal aid organization about your situation.
                  </p>

                  {/* Procedural Guidance — contextual to case type */}
                  <ProceduralGuidancePanel
                    legalArea={caseData.legal_area}
                    currentJourneyStep={1}
                    compact
                  />

                  {/* Single Primary CTA */}
                  <Button 
                    className="w-full h-14 text-lg"
                    size="lg"
                    onClick={() => setCurrentStep(2)}
                  >
                    Continue to Prepare Your Case
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Evidence Upload */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Upload Your Evidence</CardTitle>
                  <CardDescription className="text-lg">
                    Keep your documents together in one place
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Why Evidence Matters */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Why Evidence Matters
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Courts generally ask people to back up what they say with documents. Keeping your photos, contracts, receipts
                      and written messages organized makes them easier to find when you talk to a lawyer, legal aid or the court.
                    </p>
                  </div>

                  {/* Accepted File Types */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { icon: '📷', label: 'Photos' },
                      { icon: '📄', label: 'PDFs' },
                      { icon: '✉️', label: 'Emails' },
                      { icon: '📝', label: 'Notices' },
                    ].map((type) => (
                      <div key={type.label} className="p-3 bg-muted rounded-lg text-center">
                        <span className="text-2xl">{type.icon}</span>
                        <p className="text-sm font-medium mt-1">{type.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Evidence Uploader */}
                  <EvidenceUploader 
                    caseId={caseId || undefined}
                    onFilesUploaded={async () => {
                      // Refresh total file count from database
                      const { count } = await supabase
                        .from('case_files')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', user?.id)
                        .eq('case_id', caseId);
                      setUploadedFilesCount(count || 0);
                    }}
                  />

                  {/* Uploaded Files Status */}
                  {uploadedFilesCount > 0 && (
                    <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="font-medium">{uploadedFilesCount} file(s) uploaded to this case</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/book-of-documents')}
                            className="text-green-700 dark:text-green-300 hover:text-green-800"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View All
                          </Button>
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                          All uploads are saved automatically. Add more anytime — your Book of Documents will include everything.
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Primary CTAs */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full h-14 text-lg"
                      size="lg"
                      onClick={() => setCurrentStep(3)}
                    >
                      Continue to Book of Documents
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    
                    {uploadedFilesCount > 0 && (
                      <Button 
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate('/book-of-documents')}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View & Organize Documents Now
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-center text-sm text-muted-foreground">
                    You can always add more evidence later — each upload is saved to your case
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Book of Documents (Payment Gate) */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Your Book of Documents</CardTitle>
                  <CardDescription className="text-lg">
                    Organized, numbered, and court-ready
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Warning about disorganized filings */}
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Courts Reject Disorganized Filings
                    </h4>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Your Book of Documents will be professionally organized with numbered exhibits, 
                      a table of contents, and proper formatting that courts expect.
                    </p>
                  </div>

                  {/* What's Included */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">What You'll Get:</h4>
                    <div className="grid gap-3">
                      {[
                        { icon: FileText, text: 'Court-ready PDF with all documents' },
                        { icon: ClipboardCheck, text: 'Numbered exhibits with table of contents' },
                        { icon: MapPin, text: 'General filing information for your state' },
                        { icon: Building2, text: 'How to find your court\'s self-help center' },
                        { icon: Mail, text: 'Service requirements explained' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <item.icon className="h-5 w-5 text-primary" />
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Document Preview (Locked) */}
                  {!hasAccess && !isAdmin && (
                    <Card className="border-2 border-dashed border-muted-foreground/30 bg-muted/30">
                      <CardContent className="p-8 text-center">
                        <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h4 className="font-semibold text-lg mb-2">Book of Documents - Locked</h4>
                        <p className="text-muted-foreground mb-4">
                          {uploadedFilesCount} document(s) ready to be organized
                        </p>
                        <div className="space-y-2">
                          <p className="text-2xl font-bold text-primary">{PLAN.priceLabel}</p>
                          <p className="text-sm text-muted-foreground">Included in the plan with every form and guide</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Unlock / Continue CTA */}
                  {hasAccess || isAdmin ? (
                    <Button 
                      className="w-full h-14 text-lg"
                      size="lg"
                      onClick={() => setCurrentStep(4)}
                    >
                      <Unlock className="mr-2 h-5 w-5" />
                      Continue to Filing Instructions
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <Button 
                      className="w-full h-14 text-lg bg-green-600 hover:bg-green-700"
                      size="lg"
                      onClick={handleUnlock}
                      disabled={isUnlocking}
                    >
                      {isUnlocking ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Unlock className="mr-2 h-5 w-5" />
                          Unlock Book of Documents - $7.99
                        </>
                      )}
                    </Button>
                  )}

                  <p className="text-center text-sm text-muted-foreground">
                    Secure payment via PayPal • Instant access
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Filing Instructions */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">How Filing Generally Works</CardTitle>
                  <CardDescription className="text-lg">
                    General filing information for {courtInfo.jurisdiction}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Courthouse Info */}
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Building2 className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <p className="text-sm text-muted-foreground">Courts that usually hear these matters</p>
                          <h4 className="font-semibold text-lg">{courtInfo.courtType}</h4>
                          <p className="text-muted-foreground">{courtInfo.jurisdiction}</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Check with the court clerk or self-help center which court applies to you.
                          </p>
                          <div className="mt-4 space-y-2">
                            <p className="text-sm">
                              <span className="font-medium">Filing Methods:</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {courtInfo.filingMethod.map((method, i) => (
                                <Badge key={i} variant="secondary">{method}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Filing Checklist */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Filing Checklist:</h4>
                    {[
                      'Bring original documents + 2 copies',
                      'Bring valid photo ID',
                      'Be prepared to pay filing fees (or bring fee waiver form)',
                      'Keep a copy of everything you file',
                      'Note the case number assigned to you',
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Service Requirements */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Service Requirements
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      After filing, you must serve (deliver) copies to all other parties in your case. 
                      The court clerk can explain the specific service requirements for your jurisdiction.
                    </p>
                  </div>

                  {/* Procedural Guidance — filing step */}
                  <ProceduralGuidancePanel
                    legalArea={caseData.legal_area}
                    currentJourneyStep={4}
                    compact
                  />

                  {/* Continue CTA */}
                  <Button 
                    className="w-full h-14 text-lg"
                    size="lg"
                    onClick={() => setCurrentStep(5)}
                  >
                    I Understand - Show Final Checklist
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 5: Complete */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="border-green-500 bg-green-50 dark:bg-green-950">
                <CardHeader className="text-center">
                  <div className="mx-auto p-4 bg-green-600 rounded-full w-fit mb-4">
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-green-800 dark:text-green-100">
                    Your Checklist Is Complete
                  </CardTitle>
                  <CardDescription className="text-lg text-green-700 dark:text-green-200">
                    Before you file, confirm with the court self-help center which court and forms apply to you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Completion Checklist */}
                  <div className="bg-white dark:bg-background rounded-lg p-6 space-y-4">
                    <h4 className="font-semibold text-center mb-4">Completion Checklist</h4>
                    {[
                      { label: 'Situation summarized', done: true },
                      { label: 'Evidence gathered', done: uploadedFilesCount > 0 },
                      { label: 'Documents organized', done: hasAccess || isAdmin },
                      { label: 'Courts that usually hear these matters listed', done: true },
                      { label: 'Filing steps explained', done: true },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`p-1 rounded-full ${item.done ? 'bg-green-600' : 'bg-muted'}`}>
                          <CheckCircle2 className={`h-5 w-5 ${item.done ? 'text-white' : 'text-muted-foreground'}`} />
                        </div>
                        <span className={item.done ? 'text-foreground' : 'text-muted-foreground'}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Reassurance Message */}
                  <div className="text-center p-4 bg-white dark:bg-background rounded-lg">
                    <p className="text-lg font-medium text-green-800 dark:text-green-100">
                      Keep a copy of everything you file.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      If you have questions about your situation, talk to a lawyer or a free legal aid organization.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Button 
                      variant="outline" 
                      className="h-12"
                      onClick={() => navigate('/book-of-documents')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Documents
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-12"
                      onClick={() => navigate('/courtroom-prep')}
                    >
                      <Gavel className="mr-2 h-4 w-4" />
                      Court Prep
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-12"
                      onClick={() => navigate('/legal-glossary')}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Glossary
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-12"
                      onClick={() => window.print()}
                    >
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                  </div>

                  <Button 
                    className="w-full h-14"
                    variant="default"
                    onClick={() => navigate('/my-cases')}
                  >
                    Return to My Cases
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CaseJourney = () => {
  const params = useParams<{ caseId?: string }>();
  const [searchParams] = useSearchParams();

  const caseId = params.caseId ?? searchParams.get('caseId');

  // Hard rule: do not trigger *any* Supabase-producing hooks/queries unless UUID is valid.
  if (!caseId || !isValidUUID(caseId)) {
    return <CantAccessCaseCard description="This case link is invalid." />;
  }

  return <CaseJourneyInner caseId={caseId} />;
};

export default CaseJourney;
