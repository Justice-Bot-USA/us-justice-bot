import React, { useState } from 'react';
import { signInPath } from '@/lib/signIn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Unlock, 
  CheckCircle2, 
  FileText, 
  Download, 
  Sparkles,
  Shield,
  Clock,
  ArrowRight,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { FunnelConfig, FunnelState, US_STATE_NAMES, LEGAL_AREA_NAMES, isStateEnabled } from '@/lib/funnels';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { trackAddToCart, getDetectedCountry } from '@/hooks/useAnalytics';
import { toast } from 'sonner';
import { usePaywallAccess } from '@/hooks/usePaywallAccess';
import { PLAN, THIRD_PARTY_FEES_NOTE, startSubscriptionCheckout } from '@/lib/pricing';
import { stateRouteFor } from '@/lib/stateRouting';
import { getFormsForCase } from '@/hooks/useFormsPdfGenerator';

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
  { icon: FileText, label: 'How the process generally works', description: 'General information with links to official sources' },
  { icon: Download, label: 'Guides to forms commonly used in this area', description: 'What each form is for, court fees where we know them, and the official form link' },
  { icon: Sparkles, label: 'Form filling where we support it', description: 'For the California and New York court forms we support, you enter your own answers and get the official form back to review, sign and file yourself' },
  { icon: Shield, label: 'General filing checklists', description: 'How filing generally works, and where to get help' },
  { icon: Clock, label: 'One monthly plan', description: 'All forms and filling instructions we offer for California and New York are included' },
];

// Official court self-help sites for the launch states.
const COURT_SELF_HELP: Record<string, { label: string; url: string }> = {
  CA: { label: 'California Courts Self-Help Guide', url: 'https://selfhelp.courts.ca.gov' },
  NY: { label: 'New York CourtHelp', url: 'https://www.nycourts.gov/courthelp/' },
};

export const FunnelPaywallStep: React.FC<FunnelPaywallStepProps> = ({
  config,
  state,
  onNext,
  setIsProcessing,
}) => {
  const { user } = useAuth();
  const { hasAccess, loading: accessLoading } = usePaywallAccess();
  const navigate = useNavigate();
  const [isUnlocking, setIsUnlocking] = useState(false);

  const stateName = US_STATE_NAMES[config.jurisdiction];
  const legalAreaName = LEGAL_AREA_NAMES[config.legalArea];
  // Only sell the plan in a funnel that has form guides to deliver on the next step.
  const hasFormGuides =
    config.forms.length > 0 && getFormsForCase(config.jurisdiction, config.legalArea).length > 0;
  // The plan is only sold in California and New York. Other states are coming soon.
  const launched = isStateEnabled(config.jurisdiction);

  const handleUnlock = async () => {
    // Wait for the access check so a current subscriber is never sent to checkout.
    if (!launched || !hasFormGuides || accessLoading) return;

    if (!user) {
      toast.error('Please sign in to continue');
      navigate(signInPath());
      return;
    }

    // Subscribers (and admins) already have access: no second charge.
    if (hasAccess) {
      onNext();
      return;
    }

    setIsUnlocking(true);
    setIsProcessing(true);
    trackAddToCart(PLAN.name, config.jurisdiction, getDetectedCountry(), PLAN.price);

    try {
      // Store context for the post-payment page
      sessionStorage.setItem('pending_case_id', state.data.caseId || '');
      sessionStorage.setItem('pending_funnel_config', JSON.stringify(config));
      await startSubscriptionCheckout();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setIsUnlocking(false);
      setIsProcessing(false);
    }
  };

  if (!launched) {
    return (
      <div className="text-center space-y-4 py-6">
        <h3 className="text-2xl font-bold">{stateName || 'This state'} is coming soon</h3>
        <p className="text-muted-foreground">
          Justice Bot USA is live in California and New York. There is no plan to buy for {stateName || 'this state'} yet.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild>
            <Link to="/ca/legal-center">California legal center</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/ny/legal-center">New York legal center</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!hasFormGuides) {
    const route = stateRouteFor(config.jurisdiction, config.legalArea);
    const selfHelp = COURT_SELF_HELP[route?.state ?? ''];
    return (
      <Card>
        <CardContent className="p-6 text-center space-y-4">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="text-xl font-semibold">
            No form guides for {legalAreaName.toLowerCase()} in {stateName} yet
          </h3>
          <p className="text-muted-foreground">
            We don't have form guides for this area yet, so there is nothing to buy here. Our {stateName} legal
            center has plain-language information with links to official sources, and the court's self-help site
            has the official forms and instructions.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {route && (
              <Button asChild>
                <Link to={route.centerPath}>{stateName} legal center</Link>
              </Button>
            )}
            {selfHelp && (
              <Button asChild variant="outline">
                <a href={selfHelp.url} target="_blank" rel="noopener noreferrer">
                  {selfHelp.label}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Legal information, not legal advice.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Unlock className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Unlock Forms and Guides</h3>
        <p className="text-muted-foreground">
          Form guides and filling instructions for {legalAreaName.toLowerCase()} matters in {stateName}, all included in the monthly plan
        </p>
      </div>

      {/* Case Summary */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{state.data.caseTitle || `${legalAreaName} Case`}</p>
              <p className="text-sm text-muted-foreground">{stateName} • {legalAreaName}</p>
            </div>
            <Badge variant="secondary">
              Common official forms
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
            Common {stateName} forms for {legalAreaName.toLowerCase()} matters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            Which forms apply depends on your situation. Confirm with the court self-help center.
          </p>
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
              Other common forms in this area are included too.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card className="border-primary bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <span className="text-4xl font-bold">${PLAN.price}</span>
            <span className="text-muted-foreground ml-2">/month, unlimited</span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Plain-language information about common official forms and how filing generally works. Where we support a form,
            you fill it in with your own answers, then check, sign and file it yourself. Legal information, not legal advice.
            Our content has not yet been reviewed by a licensed attorney.
          </p>
          
          <Button 
            size="lg" 
            className="w-full"
            onClick={handleUnlock}
            disabled={isUnlocking || accessLoading}
          >
            {isUnlocking || accessLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {accessLoading ? 'Checking your plan...' : 'Processing...'}
              </>
            ) : (
              <>
                <Unlock className="mr-2 h-4 w-4" />
                {hasAccess ? 'Continue — included in your plan' : PLAN.cta}
              </>
            )}
          </Button>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Payment handled by Stripe
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground space-y-2">
        <p>Cancel anytime.</p>
        <p>{THIRD_PARTY_FEES_NOTE}</p>
      </div>
    </div>
  );
};

export default FunnelPaywallStep;
