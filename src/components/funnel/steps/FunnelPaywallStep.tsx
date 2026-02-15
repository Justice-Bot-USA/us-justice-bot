import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lock, 
  Unlock, 
  CheckCircle2, 
  FileText, 
  Download, 
  Sparkles,
  Shield,
  Clock,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { FunnelConfig, FunnelState, US_STATE_NAMES, LEGAL_AREA_NAMES } from '@/lib/funnels';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { trackAddToCart, trackBeginCheckout, getDetectedCountry } from '@/hooks/useAnalytics';
import { toast } from 'sonner';
import { invokeAuthed } from '@/lib/supabaseInvoke';

interface FunnelPaywallStepProps {
  config: FunnelConfig;
  state: FunnelState;
  updateData: (updates: Partial<FunnelState['data']>) => void;
  onNext: () => void;
  onSkip: () => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

const WHAT_YOU_GET = [
  { icon: FileText, label: 'Complete legal pathway breakdown', description: 'Every step from filing to resolution' },
  { icon: Download, label: 'Downloadable court forms', description: 'Pre-filled with your case details' },
  { icon: Sparkles, label: 'AI-powered form autofill', description: 'Save hours of paperwork' },
  { icon: Shield, label: 'Step-by-step filing instructions', description: 'Courthouse-specific guidance' },
  { icon: Clock, label: 'Deadline tracking', description: 'Never miss a filing date' },
];

export const FunnelPaywallStep: React.FC<FunnelPaywallStepProps> = ({
  config,
  state,
  onNext,
  setIsProcessing,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isUnlocking, setIsUnlocking] = useState(false);

  const stateName = US_STATE_NAMES[config.jurisdiction];
  const legalAreaName = LEGAL_AREA_NAMES[config.legalArea];
  const formCount = state.data.requiredForms?.length || config.forms.length;

  const handleUnlock = async () => {
    if (!user) {
      toast.error('Please sign in to continue');
      navigate('/auth');
      return;
    }

    setIsUnlocking(true);
    setIsProcessing(true);

    const country = getDetectedCountry();
    
    // Track GA4 events
    trackAddToCart('Case Assessment', config.jurisdiction, country, 9.99);
    trackBeginCheckout(4.99, country);

    try {
      const { data, error } = await invokeAuthed('stripe-checkout', {
        body: {
          action: 'create_one_time_payment',
          formType: 'case_assessment',
          caseId: state.data.caseId,
        },
      });

      if (error) throw error;

      if (data.url) {
        // Store context for redirect
        sessionStorage.setItem('pending_case_id', state.data.caseId || '');
        sessionStorage.setItem('pending_funnel_config', JSON.stringify(config));
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setIsUnlocking(false);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Unlock className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Unlock Your Full Case Package</h3>
        <p className="text-muted-foreground">
          Get everything you need to file your {legalAreaName.toLowerCase()} case in {stateName}
        </p>
      </div>

      {/* Case Summary */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{state.data.caseTitle || `${legalAreaName} Case`}</p>
              <p className="text-sm text-muted-foreground">{stateName} • Merit Score: {state.data.meritScore}</p>
            </div>
            <Badge variant="secondary">
              {formCount} Forms Ready
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* What You Get */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            What's Included
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {WHAT_YOU_GET.map((item, idx) => {
              const Icon = item.icon;
              return (
                <li key={idx} className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Icon className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      {/* Forms Preview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Your {formCount} Forms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {config.forms.slice(0, 6).map((form, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm">
                <FileText className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{form}</span>
              </div>
            ))}
          </div>
          {config.forms.length > 6 && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              + {config.forms.length - 6} more forms included
            </p>
          )}
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card className="border-primary bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <span className="text-4xl font-bold">$9.99</span>
            <span className="text-muted-foreground ml-2">one-time</span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            We'll help you prepare the correct official form and show you exactly how to file it.
            No legal advice. No lawyer fees.
          </p>
          
          <Button 
            size="lg" 
            className="w-full"
            onClick={handleUnlock}
            disabled={isUnlocking}
          >
            {isUnlocking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Unlock className="mr-2 h-4 w-4" />
                Prepare My Forms — $9.99
              </>
            )}
          </Button>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Secure Payment
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Instant Access
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Money Back Guarantee */}
      <div className="text-center text-sm text-muted-foreground">
        <Shield className="h-4 w-4 inline mr-1" />
        30-day money-back guarantee if you're not satisfied
      </div>
    </div>
  );
};

export default FunnelPaywallStep;
