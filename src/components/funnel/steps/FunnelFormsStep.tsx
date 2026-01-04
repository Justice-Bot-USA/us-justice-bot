import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Download, CheckCircle2 } from 'lucide-react';
import { FunnelConfig, FunnelState, US_STATE_NAMES, LEGAL_AREA_NAMES } from '@/lib/funnels';

interface FunnelFormsStepProps {
  config: FunnelConfig;
  state: FunnelState;
  updateData: (updates: Partial<FunnelState['data']>) => void;
  onNext: () => void;
  onSkip: () => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

// Extended form info with more details
const FORM_DETAILS: Record<string, { name: string; description: string; fee: string; url?: string }> = {
  // California Forms
  'FL-100': { name: 'Petition - Marriage/Domestic Partnership', description: 'Initiates divorce proceedings', fee: '$435-$450', url: 'https://www.courts.ca.gov/documents/fl100.pdf' },
  'FL-110': { name: 'Summons (Family Law)', description: 'Official notice to spouse', fee: 'Included', url: 'https://www.courts.ca.gov/documents/fl110.pdf' },
  'SC-100': { name: 'Plaintiff\'s Claim', description: 'Start small claims case', fee: '$30-$75', url: 'https://www.courts.ca.gov/documents/sc100.pdf' },
  'UD-100': { name: 'Complaint - Unlawful Detainer', description: 'Eviction complaint form', fee: '$240-$450', url: 'https://www.courts.ca.gov/documents/ud100.pdf' },
  'CR-180': { name: 'Petition for Dismissal', description: 'Expungement request', fee: '$120-$150', url: 'https://www.courts.ca.gov/documents/cr180.pdf' },
  // Texas Forms
  'Original Petition for Divorce': { name: 'Original Petition for Divorce', description: 'Start Texas divorce', fee: '$300-$350' },
  'SAPCR Petition': { name: 'SAPCR Petition', description: 'Child custody case', fee: '$300-$350' },
  'Petition (Small Claims)': { name: 'Small Claims Petition', description: 'Texas small claims', fee: '$54-$95' },
  // New York Forms
  'UD-2': { name: 'Summons With Notice', description: 'NY divorce summons', fee: '$335', url: 'https://nycourts.gov/divorce/forms.shtml' },
  'CIV-SC-50': { name: 'Small Claims Complaint', description: 'NYC small claims', fee: '$15-$20' },
  // Florida Forms
  'Form 12.901(a)': { name: 'Petition for Dissolution', description: 'FL divorce (no children)', fee: '$409' },
  'Form 12.901(b)(1)': { name: 'Petition for Dissolution', description: 'FL divorce (with children)', fee: '$409' },
};

export const FunnelFormsStep: React.FC<FunnelFormsStepProps> = ({
  config,
  state,
  updateData,
}) => {
  const stateName = US_STATE_NAMES[config.jurisdiction];
  const legalAreaName = LEGAL_AREA_NAMES[config.legalArea];
  
  // Get recommended forms for this funnel
  const recommendedForms = config.forms.slice(0, 5); // Limit to 5 most relevant

  const handleSelectForm = (formId: string) => {
    const currentForms = state.data.recommendedForms || [];
    const isSelected = currentForms.includes(formId);
    
    updateData({
      recommendedForms: isSelected 
        ? currentForms.filter(f => f !== formId)
        : [...currentForms, formId]
    });
  };

  const selectedForms = state.data.recommendedForms || [];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Recommended Forms</h3>
        <p className="text-muted-foreground">
          Based on your {legalAreaName.toLowerCase()} case in {stateName}
        </p>
      </div>

      {/* Forms List */}
      <div className="space-y-3">
        {recommendedForms.map((formId) => {
          const formInfo = FORM_DETAILS[formId] || { 
            name: formId, 
            description: 'Official court form', 
            fee: 'Varies' 
          };
          const isSelected = selectedForms.includes(formId);

          return (
            <Card 
              key={formId}
              className={`cursor-pointer transition-all hover:border-primary/50 ${
                isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : ''
              }`}
              onClick={() => handleSelectForm(formId)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{formId}</h4>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{formInfo.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formInfo.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{formInfo.fee}</Badge>
                    {formInfo.url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(formInfo.url, '_blank');
                        }}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selection Summary */}
      {selectedForms.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Selected Forms</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedForms.length} form{selectedForms.length !== 1 ? 's' : ''} ready to generate
                </p>
              </div>
              <Badge variant="default">{selectedForms.length} selected</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Forms Link */}
      <div className="text-center pt-4 border-t">
        <p className="text-sm text-muted-foreground mb-2">
          Need different forms?
        </p>
        <Button variant="link" onClick={() => window.open('/forms-library', '_blank')}>
          Browse Full {stateName} Forms Library
          <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default FunnelFormsStep;
