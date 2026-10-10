import React, { useState } from 'react';
import { useFormsPdfGenerator } from '@/hooks/useFormsPdfGenerator';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Loader2, CheckCircle2, Printer, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FunnelConfig, FunnelState, US_STATE_NAMES, LEGAL_AREA_NAMES } from '@/lib/funnels';
import { stateRouteFor } from '@/lib/stateRouting';
import { getExpandedStateFormsData } from '@/lib/forms';
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

type GeneratedDocument = ReturnType<ReturnType<typeof useFormsPdfGenerator>['generateForms']>[number];

export const FunnelGenerateStep: React.FC<FunnelGenerateStepProps> = ({
  config,
  state,
  setIsProcessing,
}) => {
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateForms, generateFormsPackage, downloadPdf, getFormsList } = useFormsPdfGenerator();

  const context = {
    state: config.jurisdiction,
    legalArea: config.legalArea,
    county: state.data.county,
    caseTitle: state.data.caseTitle,
    caseDescription: state.data.caseDescription,
  };
  const plannedForms = getFormsList(config.jurisdiction, config.legalArea);

  const generateDocuments = () => {
    setIsGenerating(true);
    setIsProcessing(true);
    try {
      const docs = generateForms(context);
      setDocuments(docs);
      trackFormGenerated(config.id, docs.map(d => d.formNumber));
      toast.success(`Built ${docs.length} form guide${docs.length !== 1 ? 's' : ''}`);
    } catch (err) {
      console.error('Form guide generation error:', err);
      toast.error('Could not build your form guides. Please try again.');
    } finally {
      setIsGenerating(false);
      setIsProcessing(false);
    }
  };

  const fileName = (doc: GeneratedDocument) =>
    `${doc.formNumber.replace(/[^a-zA-Z0-9]/g, '-')}-guide.pdf`;

  const handleDownload = (doc: GeneratedDocument) => {
    downloadPdf(doc.blob, fileName(doc));
  };

  const handlePrint = (doc: GeneratedDocument) => {
    window.open(doc.url, '_blank', 'noopener');
  };

  const handleDownloadAll = () => {
    const { blob } = generateFormsPackage(context);
    downloadPdf(blob, `Court-Forms-Guide-${config.jurisdiction}-${config.legalArea}.pdf`);
  };

  const readyCount = documents.length;
  const stateName = US_STATE_NAMES[config.jurisdiction] || config.jurisdiction;

  // No form guides for this state and area: say so rather than showing guides from another area.
  if (plannedForms.length === 0) {
    const route = stateRouteFor(config.jurisdiction, config.legalArea);
    const selfHelpUrl = getExpandedStateFormsData(config.jurisdiction).selfHelpUrl;
    const areaName = (LEGAL_AREA_NAMES[config.legalArea] || config.legalArea).toLowerCase();
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-4">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="text-xl font-semibold">No form guides for this area yet</h3>
          <p className="text-muted-foreground">
            We don't have form guides for {areaName} matters in {stateName} yet.
            {route ? ` Our ${route.stateName} legal center has plain-language information with links to official sources.` : ''}
            {selfHelpUrl ? " The court's self-help site has the official forms and instructions." : ''}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {route && (
              <Button asChild>
                <Link to={route.centerPath}>{route.stateName} legal center</Link>
              </Button>
            )}
            {selfHelpUrl && (
              <Button asChild variant="outline">
                <a href={selfHelpUrl} target="_blank" rel="noopener noreferrer">
                  Court self-help site
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Build Your Form Guides</h3>
        <p className="text-muted-foreground">
          A filing guide for each form: what it's for, fees, and a link to the official court version
        </p>
      </div>

      {documents.length === 0 ? (
        // Pre-generation view
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-16 w-16 mx-auto text-primary/50 mb-4" />
            <h4 className="text-lg font-medium mb-2">Ready to Build</h4>
            <p className="text-muted-foreground mb-6">
              Form guides for common {stateName} court forms in this area
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {plannedForms.map(f => (
                <Badge key={`${f.formNumber}-${f.name}`} variant="secondary">{f.formNumber}</Badge>
              ))}
            </div>

            <Button size="lg" onClick={generateDocuments} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Building...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Build Form Guides
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        // Generation progress / results view
        <>
          <div className="space-y-3">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium">{doc.formNumber}</p>
                        <p className="text-sm text-muted-foreground truncate">{doc.name}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => handleDownload(doc)}>
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handlePrint(doc)}>
                        <Printer className="h-4 w-4 mr-1" />
                        Print
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {readyCount > 0 && (
            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">
                        Your form guides are ready
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {readyCount} guide{readyCount !== 1 ? 's' : ''} — download the official forms from the links inside
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
