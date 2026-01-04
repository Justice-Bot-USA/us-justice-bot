import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Image, File, X, CheckCircle2 } from 'lucide-react';
import { FunnelConfig, FunnelState } from '@/lib/funnels';
import { EvidenceUploader } from '@/components/EvidenceUploader';

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
};

export const FunnelEvidenceStep: React.FC<FunnelEvidenceStepProps> = ({
  config,
  state,
  updateData,
  onSkip,
}) => {
  const [uploadedCount, setUploadedCount] = useState(0);
  const suggestions = EVIDENCE_SUGGESTIONS[config.legalArea] || EVIDENCE_SUGGESTIONS['small-claims'];

  const handleFilesUploaded = (files: any[]) => {
    setUploadedCount(files.length);
    updateData({ evidence: files.map(f => f.id) });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Upload Your Evidence</h3>
        <p className="text-muted-foreground">
          Supporting documents strengthen your case analysis (optional)
        </p>
      </div>

      {/* Suggestions Card */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Recommended Documents for Your Case
          </h4>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Badge key={index} variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
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
            <span className="text-green-800 dark:text-green-200">
              {uploadedCount} file{uploadedCount !== 1 ? 's' : ''} uploaded successfully
            </span>
          </CardContent>
        </Card>
      )}

      {/* Skip Option */}
      <div className="text-center pt-4">
        <Button variant="ghost" onClick={onSkip} className="text-muted-foreground">
          Skip for now — I'll add evidence later
        </Button>
      </div>
    </div>
  );
};

export default FunnelEvidenceStep;
