import React, { useState } from 'react';
import { SignInPrompt } from '@/components/auth/SignInPrompt';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Sparkles,
  MapPin,
  FileText,
  Loader2,
  Users,
  Shield,
  Heart,
  DollarSign,
  Briefcase,
  Home,
  AlertTriangle,
  Baby,
  HandHeart,
  ClipboardList
} from 'lucide-react';
import { states, stateAbbreviations } from '@/lib/states';
import { EvidenceUploader } from './EvidenceUploader';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface TriageData {
  caseTitle: string;
  caseDescription: string;
  state: string;
  county: string;
  legalArea: string;
  urgency: string;
  hasEvidence: boolean;
}

interface SmartTriageWizardProps {
  onAnalysisComplete: (caseId: string) => void;
}

const legalAreaOptions = [
  { id: 'family', name: 'Family Law / Divorce', icon: <Heart className="h-5 w-5" /> },
  { id: 'small-claims', name: 'Small Claims / Money Disputes', icon: <DollarSign className="h-5 w-5" /> },
  { id: 'employment', name: 'Employment / Workplace Rights', icon: <Briefcase className="h-5 w-5" /> },
  { id: 'housing', name: 'Housing / Landlord-Tenant', icon: <Home className="h-5 w-5" /> },
  { id: 'criminal', name: 'Criminal Defense / Expungement', icon: <Shield className="h-5 w-5" /> },
  { id: 'cps', name: 'CPS / Child Welfare', icon: <Baby className="h-5 w-5" /> },
  { id: 'workers-rights', name: 'Workers Rights / OSHA', icon: <Users className="h-5 w-5" /> },
  { id: 'human-rights', name: 'Human Rights / Civil Rights', icon: <HandHeart className="h-5 w-5" /> },
  { id: 'agency-complaints', name: 'Agency Complaints (Police, Doctors, etc.)', icon: <ClipboardList className="h-5 w-5" /> },
];

export const SmartTriageWizard: React.FC<SmartTriageWizardProps> = ({ onAnalysisComplete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [uploadedFilesCount, setUploadedFilesCount] = useState(0);
  
  const [triageData, setTriageData] = useState<TriageData>({
    caseTitle: '',
    caseDescription: '',
    state: '',
    county: '',
    legalArea: '',
    urgency: 'normal',
    hasEvidence: false,
  });

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const updateTriageData = (field: keyof TriageData, value: string | boolean) => {
    setTriageData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return triageData.legalArea !== '';
      case 2:
        return triageData.caseTitle !== '' && triageData.caseDescription !== '' && triageData.state !== '';
      case 3:
        return true; // Evidence is optional
      case 4:
        return true;
      default:
        return false;
    }
  };

  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const progressSteps = [
      { progress: 15, message: 'Reading what you told us...' },
      { progress: 30, message: 'Identifying the general area of law...' },
      { progress: 50, message: 'Gathering general information for your state...' },
      { progress: 70, message: 'Finding official resources...' },
      { progress: 85, message: 'Preparing your summary...' },
      { progress: 100, message: 'Preparing your summary...' },
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress(step.progress);
    }

    try {
      // Get uploaded files for this user
      const { data: files } = await supabase
        .from('case_files')
        .select('*')
        .eq('user_id', user?.id);

      const { data, error } = await supabase.functions.invoke('analyze-case-merit', {
        body: {
          caseData: {
            userId: user?.id,
            title: triageData.caseTitle,
            description: triageData.caseDescription,
            state: triageData.state,
            county: triageData.county,
            legalArea: triageData.legalArea
          },
          uploadedFiles: files
        }
      });

      if (error) throw error;

      toast.success('Your summary is ready');
      
      // Redirect to the guided case journey - single path, no confusion
      if (data.caseId) {
        onAnalysisComplete(data.caseId);
        navigate(`/case-journey?caseId=${data.caseId}`);
      }
      
    } catch (error) {
      console.error('Error summarizing case:', error);
      toast.error('We could not prepare your summary. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">What type of legal issue do you have?</h3>
              <p className="text-muted-foreground">Select the category that best describes your situation</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {legalAreaOptions.map((option) => (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all hover:border-primary/50 ${
                    triageData.legalArea === option.id 
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                      : ''
                  }`}
                  onClick={() => updateTriageData('legalArea', option.id)}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      triageData.legalArea === option.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      {option.icon}
                    </div>
                    <span className="font-medium">{option.name}</span>
                    {triageData.legalArea === option.id && (
                      <CheckCircle2 className="h-5 w-5 text-primary ml-auto" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Tell us about your case</h3>
              <p className="text-muted-foreground">The more detail you give, the more accurate your summary will be</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Case Title *</label>
                <Input
                  placeholder="e.g., Wrongful Termination Claim"
                  value={triageData.caseTitle}
                  onChange={(e) => updateTriageData('caseTitle', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">State *</label>
                <Select 
                  value={triageData.state} 
                  onValueChange={(value) => updateTriageData('state', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {states.map((state) => (
                      <SelectItem key={state} value={stateAbbreviations[state] || state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">County (Optional)</label>
                <Input
                  placeholder="e.g., Los Angeles County"
                  value={triageData.county}
                  onChange={(e) => updateTriageData('county', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Urgency Level</label>
                <Select 
                  value={triageData.urgency} 
                  onValueChange={(value) => updateTriageData('urgency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Urgent (deadline approaching)
                      </div>
                    </SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="flexible">Flexible timeline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Describe Your Legal Issue *</label>
              <Textarea
                placeholder="Tell us your version of events in detail. Include:&#10;• What happened and when&#10;• Who was involved (don't use real names)&#10;• What evidence you have&#10;• What outcome you're seeking&#10;• Any deadlines or time constraints"
                value={triageData.caseDescription}
                onChange={(e) => updateTriageData('caseDescription', e.target.value)}
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                We will restate what you tell us in plain language and point you to official resources for your state
              </p>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Upload Your Evidence</h3>
              <p className="text-muted-foreground">Your documents help us summarize your situation accurately</p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">📁 What to Upload</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Contracts, agreements, or written communications</li>
                <li>• Photos or screenshots of relevant evidence</li>
                <li>• Receipts, invoices, or financial documents</li>
                <li>• Police reports, medical records, or official documents</li>
                <li>• Witness statements or declarations</li>
              </ul>
            </div>

            <EvidenceUploader 
              onFilesUploaded={(files) => {
                setUploadedFilesCount(files.length);
                updateTriageData('hasEvidence', files.length > 0);
              }}
            />

            {uploadedFilesCount > 0 && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                <span>{uploadedFilesCount} file(s) uploaded successfully</span>
              </div>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Review & Summarize</h3>
              <p className="text-muted-foreground">We will summarize your situation in plain language and point you to official resources for your state</p>
            </div>

            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {legalAreaOptions.find(l => l.id === triageData.legalArea)?.icon}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Legal Area</p>
                      <p className="font-medium">{legalAreaOptions.find(l => l.id === triageData.legalArea)?.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium">{triageData.county ? `${triageData.county}, ` : ''}{triageData.state}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Case Title</p>
                      <p className="font-medium">{triageData.caseTitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Evidence</p>
                      <p className="font-medium">{uploadedFilesCount} file(s) uploaded</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-primary/20 pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Case Description</p>
                  <p className="text-sm line-clamp-3">{triageData.caseDescription}</p>
                </div>
              </CardContent>
            </Card>

            {isAnalyzing ? (
              <Card className="border-2 border-primary/30">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                  <div>
                    <p className="font-medium mb-2">Preparing your summary...</p>
                    <Progress value={analysisProgress} className="h-2 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {analysisProgress < 30 && 'Reading what you told us...'}
                      {analysisProgress >= 30 && analysisProgress < 50 && 'Identifying the general area of law...'}
                      {analysisProgress >= 50 && analysisProgress < 70 && 'Gathering general information for your state...'}
                      {analysisProgress >= 70 && analysisProgress < 85 && 'Finding official resources...'}
                      {analysisProgress >= 85 && 'Preparing your summary...'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button 
                onClick={simulateAnalysis} 
                className="w-full" 
                size="lg"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Summarize my situation
              </Button>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <SignInPrompt message="Sign in to use the Smart Legal Triage. It takes a few short questions." />
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle>Smart Legal Triage</CardTitle>
            <CardDescription>
              A plain-language summary of your situation, with links to official resources in your state
            </CardDescription>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Step {currentStep} of {totalSteps}</span>
            <span className="font-medium">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        {/* Step Indicators */}
        <div className="flex justify-between mt-4">
          {[
            { num: 1, label: 'Legal Area' },
            { num: 2, label: 'Case Details' },
            { num: 3, label: 'Evidence' },
            { num: 4, label: 'Summary' },
          ].map((step) => (
            <div 
              key={step.num}
              className={`flex items-center gap-2 ${
                currentStep === step.num ? 'text-primary' : 
                currentStep > step.num ? 'text-green-600' : 'text-muted-foreground'
              }`}
            >
              {currentStep > step.num ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center text-xs ${
                  currentStep === step.num ? 'border-primary' : 'border-muted-foreground'
                }`}>
                  {step.num}
                </div>
              )}
              <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </CardContent>

      {/* Navigation */}
      <div className="px-6 pb-6 flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => prev - 1)}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        {currentStep < 4 && (
          <Button
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={!canProceed()}
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </Card>
  );
};
