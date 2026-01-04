import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Download, Loader2, CheckCircle2, Printer } from 'lucide-react';
import { FunnelConfig, FunnelState, US_STATE_NAMES } from '@/lib/funnels';
import { trackFormGenerated } from '@/lib/funnels/analytics';
import { toast } from 'sonner';

interface FunnelGenerateStepProps {
  config: FunnelConfig;
  state: FunnelState;
  updateData: (updates: Partial<FunnelState['data']>) => void;
  onNext: () => void;
  onSkip: () => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

interface GeneratedDocument {
  formId: string;
  name: string;
  status: 'pending' | 'generating' | 'ready' | 'error';
  downloadUrl?: string;
}

export const FunnelGenerateStep: React.FC<FunnelGenerateStepProps> = ({
  config,
  state,
  setIsProcessing,
}) => {
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const selectedForms = state.data.recommendedForms || config.forms.slice(0, 3);

  const generateDocuments = async () => {
    setIsGenerating(true);
    setIsProcessing(true);
    setProgress(0);

    // Initialize documents list
    const docs: GeneratedDocument[] = selectedForms.map(formId => ({
      formId,
      name: formId,
      status: 'pending',
    }));
    setDocuments(docs);

    // Simulate generation for each document
    for (let i = 0; i < docs.length; i++) {
      // Update current doc to generating
      setDocuments(prev => prev.map((d, idx) => 
        idx === i ? { ...d, status: 'generating' } : d
      ));
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mark as ready
      setDocuments(prev => prev.map((d, idx) => 
        idx === i ? { ...d, status: 'ready', downloadUrl: `#download-${d.formId}` } : d
      ));
      
      setProgress(Math.round(((i + 1) / docs.length) * 100));
    }

    // Track analytics
    trackFormGenerated(config.id, selectedForms);
    
    setIsGenerating(false);
    setIsProcessing(false);
    toast.success('Documents generated successfully!');
  };

  const handleDownload = (doc: GeneratedDocument) => {
    // TODO: Implement actual download
    toast.success(`Downloading ${doc.name}...`);
  };

  const handleDownloadAll = () => {
    // TODO: Implement batch download
    toast.success('Downloading all documents...');
  };

  const readyCount = documents.filter(d => d.status === 'ready').length;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Generate Your Documents</h3>
        <p className="text-muted-foreground">
          We'll pre-fill forms with your case information
        </p>
      </div>

      {documents.length === 0 ? (
        // Pre-generation view
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-16 w-16 mx-auto text-primary/50 mb-4" />
            <h4 className="text-lg font-medium mb-2">Ready to Generate</h4>
            <p className="text-muted-foreground mb-6">
              {selectedForms.length} document{selectedForms.length !== 1 ? 's' : ''} will be generated 
              for {US_STATE_NAMES[config.jurisdiction]} courts
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {selectedForms.map(formId => (
                <Badge key={formId} variant="secondary">{formId}</Badge>
              ))}
            </div>

            <Button size="lg" onClick={generateDocuments} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Documents
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        // Generation progress / results view
        <>
          {isGenerating && (
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Generating documents...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="space-y-3">
            {documents.map((doc) => (
              <Card key={doc.formId}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {doc.status === 'generating' ? (
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      ) : doc.status === 'ready' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium">{doc.formId}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.status === 'generating' ? 'Generating...' : 
                           doc.status === 'ready' ? 'Ready for download' : 
                           'Pending'}
                        </p>
                      </div>
                    </div>
                    {doc.status === 'ready' && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleDownload(doc)}>
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        <Button size="sm" variant="outline">
                          <Printer className="h-4 w-4 mr-1" />
                          Print
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {readyCount === documents.length && readyCount > 0 && (
            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">
                        All documents ready!
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {readyCount} document{readyCount !== 1 ? 's' : ''} generated successfully
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleDownloadAll}>
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default FunnelGenerateStep;
