import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Download,
  Sparkles,
  Shield,
  Clock,
  CheckCircle2,
  Loader2,
  Unlock,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePaywallAccess } from '@/hooks/usePaywallAccess';
import { PLAN, startSubscriptionCheckout } from '@/lib/pricing';
import { fillableForState } from '@/lib/formfill';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  trackUSPrepareClicked,
  trackUSCheckoutStarted,
} from '@/hooks/useAnalytics';
import { US_STATES } from '@/lib/states';

const ISSUE_CATEGORIES = [
  { value: 'small_claims', label: 'Small Claims' },
  { value: 'family', label: 'Family Law' },
  { value: 'housing', label: 'Housing / Landlord-Tenant' },
  { value: 'records', label: 'Records / Expungement' },
  { value: 'employment', label: 'Employment / Workers Rights' },
  { value: 'personal_injury', label: 'Personal Injury' },
  { value: 'criminal_defense', label: 'Criminal Defense' },
  { value: 'immigration', label: 'Immigration' },
  { value: 'other', label: 'Other' },
];

const WHAT_YOU_GET = [
  { icon: FileText, text: 'Correct official form(s) for your state' },
  { icon: Sparkles, text: 'Plain-language guidance' },
  { icon: CheckCircle2, text: 'Filing checklist + where/how to file' },
  { icon: Download, text: 'Export as PDF' },
];

interface PrepareFilingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-fill the state from the lookup page */
  defaultState?: string;
  /** Source page for analytics */
  source?: string;
}

const PrepareFilingModal: React.FC<PrepareFilingModalProps> = ({
  open,
  onOpenChange,
  defaultState = '',
  source = 'lookup_results',
}) => {
  const { user } = useAuth();
  const { hasAccess } = usePaywallAccess();
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState(defaultState);
  const [selectedIssue, setSelectedIssue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleContinue = async () => {
    if (!selectedState) {
      toast.error('Please select a state');
      return;
    }
    if (!selectedIssue) {
      toast.error('Please select an issue category');
      return;
    }

    if (!user) {
      toast.error('Please sign in to continue');
      sessionStorage.setItem('post_auth_redirect', '/pricing');
      navigate('/auth');
      return;
    }

    // Subscribers already have access: take them to the forms instead of charging again.
    if (hasAccess) {
      onOpenChange(false);
      navigate(fillableForState(selectedState).length ? `/fill/${selectedState.toLowerCase()}` : `/states/${selectedState}`);
      return;
    }

    setIsProcessing(true);
    trackUSPrepareClicked(source, selectedState, selectedIssue);
    trackUSCheckoutStarted('subscription', PLAN.price);

    try {
      // Store context for post-payment redirect
      const funnelConfig = {
        jurisdiction: selectedState,
        legalArea: selectedIssue,
        forms: [],
      };
      sessionStorage.setItem('pending_funnel_config', JSON.stringify(funnelConfig));

      await startSubscriptionCheckout();
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Failed to start checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Unlock className="h-5 w-5 text-primary" />
            Prepare Your Official Filing Packet
          </DialogTitle>
          <DialogDescription>
            Not legal advice. You file it yourself.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* State selector */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">State</label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent className="max-h-[260px]">
                {US_STATES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Issue category */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Issue Category</label>
            <Select value={selectedIssue} onValueChange={setSelectedIssue}>
              <SelectTrigger>
                <SelectValue placeholder="What's your case about?" />
              </SelectTrigger>
              <SelectContent>
                {ISSUE_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* What you get */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            {WHAT_YOU_GET.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Icon className="h-4 w-4 text-green-600 shrink-0" />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <Button
            className="w-full"
            size="lg"
            onClick={handleContinue}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Unlock className="mr-2 h-4 w-4" />
                {hasAccess ? 'Continue — included in your plan' : PLAN.cta}
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Not legal advice. You file it yourself.
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Secure Payment
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Instant Access
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrepareFilingModal;
