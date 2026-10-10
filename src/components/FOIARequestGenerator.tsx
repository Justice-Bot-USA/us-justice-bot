import React, { useState } from 'react';
import { signInPath } from '@/lib/signIn';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Loader2,
  Shield,
  Download,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Info,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { US_STATES } from '@/lib/states';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { invokeAuthed } from '@/lib/supabaseInvoke';
import { usePaywallAccess } from '@/hooks/usePaywallAccess';
import { PLAN, THIRD_PARTY_FEES_NOTE, startSubscriptionCheckout } from '@/lib/pricing';
import { generateFoiaLetterPdf } from '@/lib/foiaPdf';
import { launchStateOf } from '@/lib/stateRouting';

const RECORD_TYPES = [
  { value: 'arrest_report', label: 'Arrest Report' },
  { value: 'warrant_return', label: 'Warrant Return' },
  { value: 'probable_cause_affidavit', label: 'Probable Cause Affidavit' },
  { value: 'incident_report', label: 'Incident Report' },
  { value: 'booking_record', label: 'Booking / Jail Intake Record' },
  { value: 'court_admin_record', label: 'Court Administrative Record' },
];

interface AgencyDetail {
  title: string;
  address: string;
  email: string;
  phone: string;
}

interface FOIARequestGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultState?: string;
  defaultName?: string;
}

const FOIARequestGenerator: React.FC<FOIARequestGeneratorProps> = ({
  open,
  onOpenChange,
  defaultState = '',
  defaultName = '',
}) => {
  const { user } = useAuth();
  const { hasAccess } = usePaywallAccess();
  const navigate = useNavigate();

  const [selectedState, setSelectedState] = useState(defaultState);
  // The monthly plan is only sold in California and New York.
  const planOffered = !!launchStateOf(selectedState);
  const [recordType, setRecordType] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [subjectName, setSubjectName] = useState(defaultName);
  const [caseNumber, setCaseNumber] = useState('');
  const [approxDate, setApproxDate] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [agencySuggestions, setAgencySuggestions] = useState<string[]>([]);
  const [agencyDetails, setAgencyDetails] = useState<AgencyDetail[]>([]);
  const [isLoadingAgencies, setIsLoadingAgencies] = useState(false);
  const [apiSource, setApiSource] = useState('');

  // Step: 'form' | 'preview'
  const [step, setStep] = useState<'form' | 'preview'>('form');

  // Selected agency detail for display
  const selectedAgencyDetail = agencyDetails.find((a) => a.title === agencyName);

  // Fetch agency suggestions when state changes
  const handleStateChange = async (stateValue: string) => {
    setSelectedState(stateValue);
    setAgencyName('');
    if (!stateValue) return;

    setIsLoadingAgencies(true);
    try {
      const stateName =
        US_STATES.find((s) => s.value === stateValue)?.label || stateValue;
      const { data, error } = await supabase.functions.invoke(
        'foia-request-generator',
        {
          body: {
            action: 'suggest_agencies',
            state: stateName,
          },
        }
      );
      if (!error && data?.agencies) {
        setAgencySuggestions(data.agencies);
        setAgencyDetails(data.agencyDetails || []);
        setApiSource(data.source || 'fallback');
      }
    } catch {
      // Non-critical, continue without suggestions
    } finally {
      setIsLoadingAgencies(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedState || !recordType) {
      toast.error('Please select a state and record type.');
      return;
    }

    if (!user) {
      toast.error('Please sign in to generate a request.');
      navigate(signInPath());
      return;
    }

    setIsGenerating(true);
    try {
      const stateName =
        US_STATES.find((s) => s.value === selectedState)?.label ||
        selectedState;
      const recordLabel =
        RECORD_TYPES.find((r) => r.value === recordType)?.label || recordType;

      const { data, error } = await invokeAuthed('foia-request-generator', {
        body: {
          action: 'generate_letter',
          state: stateName,
          recordType: recordLabel,
          agencyName: agencyName.trim(),
          subjectName: subjectName.trim(),
          caseNumber: caseNumber.trim(),
          approxDate: approxDate.trim(),
          additionalDetails: additionalDetails.trim(),
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Generation failed');

      setGeneratedLetter(data.letter);
      setStep('preview');
      toast.success('Request letter generated!');
    } catch (err) {
      console.error('FOIA generation error:', err);
      toast.error('Failed to generate request. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast.success('Copied to clipboard!');
  };

  const handleExportPDF = async () => {
    if (!user) {
      toast.error('Please sign in to export.');
      navigate(signInPath());
      return;
    }

    // Subscribers get the full set (request + follow-up + appeal) directly.
    if (hasAccess) {
      const url = URL.createObjectURL(generateFoiaLetterPdf(generatedLetter, true));
      const a = document.createElement('a');
      a.href = url;
      a.download = `Public-Records-Request-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('PDF downloaded.');
      return;
    }

    if (!planOffered) return;

    try {
      sessionStorage.setItem('pending_foia_letter', generatedLetter);
      sessionStorage.setItem('pending_foia_state', selectedState);
      await startSubscriptionCheckout();
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Failed to start checkout.');
    }
  };

  const handleBack = () => {
    setStep('form');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Public Records Request Generator
          </DialogTitle>
          <DialogDescription>
            Write a state public records request letter that cites your state's public
            records law. Add your details and the agency's address before you send it.
          </DialogDescription>
        </DialogHeader>

        {step === 'form' ? (
          <div className="space-y-4 py-2">
            {/* State */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                State *
              </label>
              <Select value={selectedState} onValueChange={handleStateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
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

            {/* Agency (populated via FOIA USA API) */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Agency {apiSource === 'foia.gov' && (
                  <Badge variant="outline" className="text-[9px] ml-1 align-middle">
                    via FOIA.gov
                  </Badge>
                )}
              </label>
              {isLoadingAgencies ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading agencies from FOIA.gov...
                </div>
              ) : agencySuggestions.length > 0 ? (
                <Select value={agencyName} onValueChange={setAgencyName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an agency" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {agencySuggestions.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                    <SelectItem value="__custom">
                      Other (type below)
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  placeholder="e.g. Franklin County Sheriff"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                />
              )}
              {agencyName === '__custom' && (
                <Input
                  className="mt-2"
                  placeholder="Enter agency name"
                  onChange={(e) => setAgencyName(e.target.value)}
                />
              )}

              {/* Show agency contact details when selected */}
              {selectedAgencyDetail && (
                <div className="mt-2 p-3 rounded-md bg-muted/50 border text-xs space-y-1">
                  <p className="font-medium text-sm">{selectedAgencyDetail.title}</p>
                  {selectedAgencyDetail.address && (
                    <p className="flex items-start gap-1.5 text-muted-foreground">
                      <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                      {selectedAgencyDetail.address}
                    </p>
                  )}
                  {selectedAgencyDetail.email && (
                    <p className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="h-3 w-3 shrink-0" />
                      {selectedAgencyDetail.email}
                    </p>
                  )}
                  {selectedAgencyDetail.phone && (
                    <p className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="h-3 w-3 shrink-0" />
                      {selectedAgencyDetail.phone}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Record type (dropdown) */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Record Type *
              </label>
              <Select value={recordType} onValueChange={setRecordType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  {RECORD_TYPES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subject name */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Subject Name (optional)
              </label>
              <Input
                placeholder="Name on the record"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
            </div>

            {/* Approximate date and/or case number (optional) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Case # (optional)
                </label>
                <Input
                  placeholder="e.g. 2024-CR-1234"
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Approx. Date (optional)
                </label>
                <Input
                  placeholder="e.g. March 2024"
                  value={approxDate}
                  onChange={(e) => setApproxDate(e.target.value)}
                />
              </div>
            </div>

            {/* Additional details */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Additional Details (optional)
              </label>
              <Textarea
                placeholder="Any other context to help identify the records"
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                rows={2}
              />
            </div>

            {/* Generate CTA */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Request Letter...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Request Letter
                </>
              )}
            </Button>

            {/* Required Disclaimers — must be visible */}
            <div className="space-y-1 pt-2 border-t">
              <p className="text-[11px] text-muted-foreground flex items-start gap-1 font-medium">
                <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0 text-destructive" />
                This does not check for active warrants. It helps you request
                public records.
              </p>
              <p className="text-[11px] text-muted-foreground">
                • This tool does not provide legal advice.
              </p>
              <p className="text-[11px] text-muted-foreground">
                • We do not access law enforcement databases.
              </p>
              <p className="text-[11px] text-muted-foreground">
                • We do not determine whether an active warrant exists.
              </p>
              <p className="text-[11px] text-muted-foreground">
                • Users submit requests themselves.
              </p>
            </div>
          </div>
        ) : (
          /* Preview step — outputs: letter, citations, instructions, paid PDF */
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary/30">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Generated
              </Badge>
              <span className="text-sm text-muted-foreground">
                Your public records request letter is ready.
              </span>
            </div>

            {/* Agency submission instructions */}
            {selectedAgencyDetail && (
              <div className="p-3 rounded-md bg-primary/5 border border-primary/20 text-xs space-y-1">
                <p className="font-medium text-sm flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-primary" />
                  Agency Submission Instructions
                </p>
                <p className="text-muted-foreground">
                  Send your request to <strong>{selectedAgencyDetail.title}</strong>:
                </p>
                {selectedAgencyDetail.address && (
                  <p className="flex items-start gap-1.5 text-muted-foreground">
                    <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                    Mail: {selectedAgencyDetail.address}
                  </p>
                )}
                {selectedAgencyDetail.email && (
                  <p className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="h-3 w-3 shrink-0" />
                    Email: {selectedAgencyDetail.email}
                  </p>
                )}
                {selectedAgencyDetail.phone && (
                  <p className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="h-3 w-3 shrink-0" />
                    Phone: {selectedAgencyDetail.phone}
                  </p>
                )}
              </div>
            )}

            {/* Letter preview */}
            <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap max-h-[40vh] overflow-y-auto font-mono leading-relaxed border">
              {generatedLetter}
            </div>

            {/* Actions: Copy (free) + PDF export (paid) */}
            <div className="flex flex-col gap-3">
              <Button variant="outline" onClick={handleCopy} className="gap-2 w-full">
                <Copy className="h-4 w-4" />
                Copy to Clipboard (Free)
              </Button>
              {hasAccess || planOffered ? (
                <>
                  <Button onClick={handleExportPDF} className="gap-2 w-full" size="lg">
                    <Download className="h-4 w-4" />
                    {hasAccess ? 'Download PDF (request + follow-up + appeal)' : `Export as PDF — ${PLAN.priceLabel}, unlimited`}
                  </Button>
                  {/* Agencies may charge their own copy or search fees, separate from our plan. */}
                  <p className="text-xs text-muted-foreground text-center">{THIRD_PARTY_FEES_NOTE}</p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground text-center">
                  Our monthly plan is only offered in California and New York, so there is nothing to buy for this state.
                  Copy the letter for free and send it to the agency yourself.
                </p>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="text-muted-foreground"
            >
              ← Edit request details
            </Button>

            {!hasAccess && planOffered && (
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Payment handled by Stripe
                </span>
              </div>
            )}

            {/* Required disclaimers */}
            <div className="border-t pt-2 space-y-1">
              <p className="text-[11px] text-muted-foreground text-center font-medium">
                This is legal information, not legal advice. You submit the
                request yourself.
              </p>
              <p className="text-[11px] text-muted-foreground text-center">
                We do not access law enforcement databases.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FOIARequestGenerator;
