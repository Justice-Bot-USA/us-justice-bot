import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Scale,
  FolderOpen,
  Search,
  ArrowRight,
  Info
} from 'lucide-react';

interface ComprehensiveCaseAnalysisProps {
  analysis: {
    legalCategory?: string;
    legalPathway?: string[];
    requiredForms?: Array<{
      formName: string;
      formNumber?: string;
      purpose: string;
      where: string;
    }>;
    evidenceToGather?: Array<{
      type: string;
      importance: string;
      howToObtain: string;
    }>;
    filingOptions?: {
      proSe: string;
      withAttorney: string;
      recommendation: string;
    };
    nextSteps?: string[];
  };
}

export const ComprehensiveCaseAnalysis: React.FC<ComprehensiveCaseAnalysisProps> = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <Tabs defaultValue="pathway" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="pathway">Legal Pathway</TabsTrigger>
        <TabsTrigger value="forms">Required Forms</TabsTrigger>
        <TabsTrigger value="evidence">Evidence</TabsTrigger>
        <TabsTrigger value="options">Filing Options</TabsTrigger>
      </TabsList>

      {/* Legal Pathway Tab */}
      <TabsContent value="pathway" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-primary" />
              Your Legal Pathway
            </CardTitle>
            {analysis.legalCategory && (
              <Badge variant="outline" className="w-fit">
                {analysis.legalCategory}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {analysis.legalPathway && analysis.legalPathway.length > 0 ? (
              <ol className="space-y-3">
                {analysis.legalPathway.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                      {idx + 1}
                    </span>
                    <p className="flex-1 pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-muted-foreground">No pathway information available yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        {analysis.nextSteps && analysis.nextSteps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Immediate Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* Required Forms Tab */}
      <TabsContent value="forms">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Required Forms & Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.requiredForms && analysis.requiredForms.length > 0 ? (
              <div className="space-y-4">
                {analysis.requiredForms.map((form, idx) => (
                  <div key={idx} className="p-4 border rounded-lg bg-card">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{form.formName}</h4>
                      {form.formNumber && (
                        <Badge variant="secondary">{form.formNumber}</Badge>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-muted-foreground text-xs">Purpose</p>
                          <p>{form.purpose}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <FolderOpen className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-muted-foreground text-xs">Where to Get It</p>
                          <p>{form.where}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No form information available yet.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Evidence Tab */}
      <TabsContent value="evidence">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Evidence to Gather
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.evidenceToGather && analysis.evidenceToGather.length > 0 ? (
              <div className="space-y-3">
                {analysis.evidenceToGather.map((evidence, idx) => (
                  <div key={idx} className="p-4 border rounded-lg bg-card">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{evidence.type}</h4>
                      <Badge 
                        variant={
                          evidence.importance === 'high' 
                            ? 'destructive' 
                            : evidence.importance === 'medium' 
                            ? 'default' 
                            : 'secondary'
                        }
                      >
                        {evidence.importance} priority
                      </Badge>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">How to Obtain</p>
                        <p>{evidence.howToObtain}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No evidence guidance available yet.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Filing Options Tab */}
      <TabsContent value="options">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Filing Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysis.filingOptions ? (
              <>
                {/* Pro Se Option */}
                <div className="p-4 border rounded-lg bg-card">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    File Pro Se (Represent Yourself)
                  </h4>
                  <p className="text-sm">{analysis.filingOptions.proSe}</p>
                </div>

                {/* With Attorney Option */}
                <div className="p-4 border rounded-lg bg-card">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Hire an Attorney
                  </h4>
                  <p className="text-sm">{analysis.filingOptions.withAttorney}</p>
                </div>

                {/* Recommendation */}
                <div className="p-4 border-2 border-primary rounded-lg bg-primary/5">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Recommendation
                  </h4>
                  <p className="text-sm">{analysis.filingOptions.recommendation}</p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">No filing options information available yet.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
