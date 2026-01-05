import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle2, ChevronDown, Scale } from 'lucide-react';
import { FunnelConfig, FunnelState, US_STATE_NAMES, LEGAL_AREA_NAMES, RelatedCaseData, LegalCategory } from '@/lib/funnels';
import { RelatedCasesPrompt, RelatedCase } from '../RelatedCasesPrompt';
import { ConsistencyCheckPrompts, ConsistencyCheckAnswer } from '../ConsistencyCheckPrompts';
import { getApplicableConsistencyChecks, ConsistencyCheck } from '@/lib/relatedCaseSuggestions';

interface FunnelTriageStepProps {
  config: FunnelConfig;
  state: FunnelState;
  updateData: (updates: Partial<FunnelState['data']>) => void;
  onNext: () => void;
  onSkip: () => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

const URGENCY_OPTIONS = [
  { value: 'urgent', label: 'Urgent - Deadline approaching', color: 'text-red-500' },
  { value: 'normal', label: 'Normal - No immediate deadline', color: 'text-yellow-500' },
  { value: 'flexible', label: 'Flexible - Planning ahead', color: 'text-green-500' },
];

export const FunnelTriageStep: React.FC<FunnelTriageStepProps> = ({
  config,
  state,
  updateData,
}) => {
  const stateName = US_STATE_NAMES[config.jurisdiction];
  const legalAreaName = LEGAL_AREA_NAMES[config.legalArea];
  
  // Related cases state
  const [hasExistingCase, setHasExistingCase] = useState<string | undefined>(
    state.data.hasExistingCase
  );
  const [relatedCasesOpen, setRelatedCasesOpen] = useState(false);
  const relatedCases: RelatedCase[] = state.data.relatedCases || [];
  
  // Consistency checks state
  const [consistencyChecks, setConsistencyChecks] = useState<ConsistencyCheck[]>([]);
  const [consistencyAnswers, setConsistencyAnswers] = useState<ConsistencyCheckAnswer[]>(
    (state.data as any).consistencyAnswers || []
  );

  // Update consistency checks when description changes
  useEffect(() => {
    if (state.data.caseDescription && config.legalArea) {
      const checks = getApplicableConsistencyChecks(
        config.legalArea as LegalCategory,
        state.data.caseDescription
      );
      setConsistencyChecks(checks);
    } else {
      setConsistencyChecks([]);
    }
  }, [state.data.caseDescription, config.legalArea]);

  const handleHasExistingCaseChange = (value: string) => {
    setHasExistingCase(value);
    updateData({ hasExistingCase: value });
    
    // Auto-open the related cases section if user says yes
    if (value === 'yes') {
      setRelatedCasesOpen(true);
    }
  };

  const handleRelatedCasesChange = (cases: RelatedCase[]) => {
    updateData({ relatedCases: cases });
  };

  const handleConsistencyAnswerChange = (checkId: string, answer: 'yes' | 'no' | 'unsure') => {
    const newAnswers = consistencyAnswers.filter(a => a.checkId !== checkId);
    newAnswers.push({ checkId, answer });
    setConsistencyAnswers(newAnswers);
    updateData({ consistencyAnswers: newAnswers } as any);
    
    // If user answers yes to a consistency check, suggest opening related cases
    if (answer === 'yes' && !hasExistingCase) {
      setHasExistingCase('yes');
      updateData({ hasExistingCase: 'yes' });
      setRelatedCasesOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Tell Us About Your {legalAreaName} Case</h3>
        <p className="text-muted-foreground">
          We'll analyze your situation under {stateName} law and recommend the best path forward
        </p>
      </div>

      {/* Pre-filled context */}
      <div className="flex gap-2 justify-center mb-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{stateName}</span>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{legalAreaName}</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Case Title *</label>
          <Input
            placeholder={`e.g., ${legalAreaName} Matter`}
            value={state.data.caseTitle || ''}
            onChange={(e) => updateData({ caseTitle: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">County (Optional)</label>
          <Input
            placeholder={`e.g., ${stateName === 'California' ? 'Los Angeles' : stateName === 'Texas' ? 'Harris' : stateName === 'New York' ? 'Kings' : 'Miami-Dade'} County`}
            value={state.data.county || ''}
            onChange={(e) => updateData({ county: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Urgency Level</label>
        <Select 
          value={state.data.urgency || 'normal'} 
          onValueChange={(value) => updateData({ urgency: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {URGENCY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <span className={option.color}>{option.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Describe Your Legal Situation *</label>
        <Textarea
          placeholder={`Tell us about your ${legalAreaName.toLowerCase()} situation in detail. Include:
• What happened and when
• Who is involved
• What evidence you have
• What outcome you're seeking
• Any deadlines or court dates

The more detail you provide, the better our AI can analyze your case.`}
          value={state.data.caseDescription || ''}
          onChange={(e) => updateData({ caseDescription: e.target.value })}
          rows={8}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Your information is confidential and protected by our privacy policy
        </p>
      </div>

      {/* Consistency Checks - Show after description is entered */}
      {consistencyChecks.length > 0 && (
        <ConsistencyCheckPrompts
          checks={consistencyChecks}
          answers={consistencyAnswers}
          onAnswerChange={handleConsistencyAnswerChange}
        />
      )}

      {/* Related Court Cases Section */}
      <Card className="border-2">
        <CardContent className="p-4 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              <Label className="text-base font-medium">Related Court Cases</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Do you have any existing court cases related to this matter? This includes prior, 
              current, or pending cases involving the same parties or similar issues.
            </p>
            
            <RadioGroup
              value={hasExistingCase}
              onValueChange={handleHasExistingCaseChange}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="existing-yes" />
                <Label htmlFor="existing-yes" className="cursor-pointer">
                  Yes, I have related case(s)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="existing-no" />
                <Label htmlFor="existing-no" className="cursor-pointer">
                  No related cases
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unsure" id="existing-unsure" />
                <Label htmlFor="existing-unsure" className="cursor-pointer">
                  I'm not sure
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Collapsible Related Cases Form */}
          {(hasExistingCase === 'yes' || relatedCases.length > 0) && (
            <Collapsible open={relatedCasesOpen} onOpenChange={setRelatedCasesOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors">
                <span>
                  {relatedCases.length > 0 
                    ? `${relatedCases.length} related case${relatedCases.length !== 1 ? 's' : ''} added`
                    : 'Add related case details'
                  }
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${relatedCasesOpen ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <RelatedCasesPrompt
                  relatedCases={relatedCases}
                  onChange={handleRelatedCasesChange}
                  currentState={config.jurisdiction}
                  legalArea={config.legalArea as LegalCategory}
                  caseDescription={state.data.caseDescription}
                />
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FunnelTriageStep;
