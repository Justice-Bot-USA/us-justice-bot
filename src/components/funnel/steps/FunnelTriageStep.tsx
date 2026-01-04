import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { FunnelConfig, FunnelState, US_STATE_NAMES, LEGAL_AREA_NAMES } from '@/lib/funnels';

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
          rows={10}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Your information is confidential and protected by our privacy policy
        </p>
      </div>
    </div>
  );
};

export default FunnelTriageStep;
