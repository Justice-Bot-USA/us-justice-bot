import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { FunnelConfig, FunnelState } from '@/lib/funnels';
import { EvidenceUploader } from '@/components/EvidenceUploader';
import * as analytics from '@/hooks/useAnalytics';

interface FunnelEvidenceStepProps {
  config: FunnelConfig;
  state: FunnelState;
  updateData: (updates: Partial<FunnelState['data']>) => void;
  onNext: () => void;
  onSkip: () => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

const EVIDENCE_SUGGESTIONS: Record<string, string[]> = {
  'family': [
    'Marriage certificate',
    'Financial statements',
    'Property records',
    'Custody agreements',
    'Communication records',
  ],
  'small-claims': [
    'Contracts or agreements',
    'Receipts and invoices',
    'Photos of damage',
    'Communication records',
    'Witness statements',
  ],
  'employment': [
    'Employment contract',
    'Pay stubs',
    'Performance reviews',
    'Written warnings',
    'Email communications',
  ],
  'housing': [
    'Lease agreement',
    'Rent payment records',
    'Photos of property issues',
    'Communication with landlord',
    'Move-in/move-out inspection',
  ],
  'criminal': [
    'Police report',
    'Arrest records',
    'Witness contact info',
    'Alibi documentation',
    'Character references',
  ],
  'cps': [
    'Medical records',
    'School records',
    'Character references',
    'Housing documentation',
    'Employment verification',
  ],
  'workers-rights': [
    'Injury reports',
    'Medical records',
    'Workplace photos',
    'Safety complaints',
    'Witness statements',
  ],
  'human-rights': [
    'Incident documentation',
    'Witness statements',
    'Communication records',
    'Photos/videos',
    'Official complaints filed',
  ],
  'agency-complaints': [
    'License/permit records',
    'Complaint history',
    'Communication records',
    'Contracts or agreements',
    'Photos or evidence',
  ],
};

export const FunnelEvidenceStep: React.FC<FunnelEvidenceStepProps> = ({
  config,
  state,
  updateData,
  onNext,
  onSkip,
}) => {
  const [uploadedCount, setUploadedCount] = useState(0);
  const [hasUploaded, setHasUploaded] = useState(false);
  const suggestions = EVIDENCE_SUGGESTIONS[config.legalArea] || EVIDENCE_SUGGESTIONS['small-claims'];

  const handleFilesUploaded = (files: any[]) => {
    const newCount = files.length;
    setUploadedCount(prev => prev + newCount);
    setHasUploaded(true);
    
    // Track evidence upload
    analytics.trackEvidenceUploaded(files[0]?.file_type || 'document', newCount);
    
    // Store evidence IDs
    const currentEvidence = state.data.evidence || [];
    updateData({ 
      evidence: [...currentEvidence, ...files.map(f => f.id)] 
    });
  };

  const handleContinue = () => {
    // Proceed to the summary step
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Upload Your Evidence</h3>
        <p className="text-muted-foreground">
          Optional: add documents so your summary reflects them
        </p>
      </div>

      {/* Why Evidence Matters - Engagement Hook */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Why Upload Documents
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Your documents help us summarize your situation accurately, and keeping them in one place makes them
            easier to share with a lawyer, legal aid or the court.
          </p>
        </CardContent>
      </Card>

      {/* Suggestions Card */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents people often keep for this kind of matter
          </h4>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Badge key={index} variant="secondary">
                {suggestion}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Evidence Uploader */}
      <EvidenceUploader onFilesUploaded={handleFilesUploaded} />

      {/* Upload Status */}
      {uploadedCount > 0 && (
        <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <span className="text-green-800 dark:text-green-200 font-medium">
                {uploadedCount} file{uploadedCount !== 1 ? 's' : ''} uploaded successfully
              </span>
              <p className="text-xs text-green-700 dark:text-green-300">
                Your documents will be included in your summary
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-green-600" />
          </CardContent>
        </Card>
      )}

      {/* Primary CTA - proceed to the summary */}
      {hasUploaded ? (
        <Button 
          size="lg" 
          className="w-full" 
          onClick={handleContinue}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Summarize My Situation
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <div className="space-y-3">
          <Button 
            size="lg" 
            variant="outline"
            className="w-full" 
            onClick={onSkip}
          >
            Continue Without Evidence
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            You can add documents later
          </p>
        </div>
      )}
    </div>
  );
};

export default FunnelEvidenceStep;
