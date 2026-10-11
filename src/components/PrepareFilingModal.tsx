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
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { THIRD_PARTY_FEES_NOTE } from '@/lib/pricing';
import { fillableForState } from '@/lib/formfill';
import { Link, useNavigate } from 'react-router-dom';
import { launchStateOf, stateRouteFor } from '@/lib/stateRouting';
import { toast } from 'sonner';
import { trackUSPrepareClicked } from '@/hooks/useAnalytics';
import { US_STATES } from '@/lib/states';
import type { LegalCategory } from '@/lib/funnels/types';

// `value` is the menu option; `legalArea` is the funnel key (LegalCategory), used to open the state's
// legal center on the matching tab. 'Other' has no forms, so it goes to the state's legal center.
const ISSUE_CATEGORIES: { value: string; label: string; legalArea: LegalCategory | null }[] = [
  { value: 'small-claims', label: 'Small Claims', legalArea: 'small-claims' },
  { value: 'family', label: 'Family Law', legalArea: 'family' },
  { value: 'housing', label: 'Housing / Landlord-Tenant', legalArea: 'housing' },
  { value: 'records', label: 'Records / Expungement', legalArea: 'criminal' },
  { value: 'employment', label: 'Employment / Workers Rights', legalArea: 'employment' },
  { value: 'personal-injury', label: 'Personal Injury', legalArea: 'personal-injury' },
  { value: 'criminal-defense', label: 'Criminal Defense', legalArea: 'criminal' },
  { value: 'immigration', label: 'Immigration', legalArea: 'immigration' },
  { value: 'other', label: 'Other', legalArea: null },
];

// California and New York only; the other states are coming soon. All of it is free.
const WHAT_YOU_GET = [
  { icon: FileText, text: 'Fill in the official California and New York court forms we support with your own answers' },
  { icon: Sparkles, text: 'Plain-language filling instructions (legal information, not legal advice)' },
  { icon: CheckCircle2, text: 'General information on where and how forms are filed' },
  { icon: Download, text: 'PDFs you review, sign and file yourself' },
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
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState(defaultState);
  const [selectedIssue, setSelectedIssue] = useState('');

  // Only California and New York are live. Any other state has no forms yet.
  const launchState = launchStateOf(selectedState);
  const selectedStateName = US_STATES.find((s) => s.value === selectedState.toUpperCase())?.label || selectedState;
  // 'any' or 'federal' (from the court records page) is not a state choice; only a real non-CA/NY state is coming soon.
  const isRealState = US_STATES.some((s) => s.value === selectedState.toUpperCase() || s.label.toLowerCase() === selectedState.toLowerCase());
  const comingSoon = isRealState && !launchState;
  const isOtherIssue = !!selectedIssue && !ISSUE_CATEGORIES.find((c) => c.value === selectedIssue)?.legalArea;

  const handleContinue = () => {
    if (!selectedState) {
      toast.error('Please select a state');
      return;
    }
    if (!launchState) {
      toast.error(`${selectedStateName} is coming soon. Justice Bot USA is live in California and New York.`);
      return;
    }
    if (!selectedIssue) {
      toast.error('Please select an issue category');
      return;
    }

    // 'Other' has no form guides: send the user to the state's legal center.
    const legalArea = ISSUE_CATEGORIES.find((c) => c.value === selectedIssue)?.legalArea ?? null;
    if (!legalArea) {
      onOpenChange(false);
      navigate(stateRouteFor(launchState)?.centerPath ?? '/');
      return;
    }

    // Forms are free to fill and download, with no account needed: go straight to them.
    trackUSPrepareClicked(source, launchState, selectedIssue);
    onOpenChange(false);
    navigate(
      fillableForState(launchState).length
        ? `/fill/${launchState.toLowerCase()}`
        : stateRouteFor(launchState, legalArea)?.centerPath ?? '/',
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Fill In Official Court Forms
          </DialogTitle>
          <DialogDescription>
            California and New York only. Free to fill and download. Not legal advice. You check, sign and file the forms yourself.
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

          {comingSoon ? (
            /* Other states: coming soon */
            <div className="rounded-lg border p-4 space-y-3 text-sm">
              <p className="font-medium">{selectedStateName} is coming soon.</p>
              <p className="text-muted-foreground">
                Justice Bot USA is live in California and New York. We don't have forms for {selectedStateName} yet.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link to="/ca/legal-center" onClick={() => onOpenChange(false)}>California legal center</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/ny/legal-center" onClick={() => onOpenChange(false)}>New York legal center</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
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
              >
                {isOtherIssue && launchState
                  ? `Open the ${stateRouteFor(launchState)?.stateName ?? ''} legal center`
                  : 'Continue to the forms'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Not legal advice. Our content has not yet been reviewed by a licensed attorney. You file it yourself. {THIRD_PARTY_FEES_NOTE}
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrepareFilingModal;
