import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertTriangle, FileText, Scale } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DocumentConsentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  documentType: string;
  jurisdiction: string;
}

export function DocumentConsentModal({
  open,
  onOpenChange,
  onConfirm,
  documentType,
  jurisdiction,
}: DocumentConsentModalProps) {
  const [acknowledged, setAcknowledged] = useState({
    notLegalAdvice: false,
    reviewRequired: false,
    jurisdictionSpecific: false,
  });

  const allAcknowledged = 
    acknowledged.notLegalAdvice && 
    acknowledged.reviewRequired && 
    acknowledged.jurisdictionSpecific;

  const handleConfirm = () => {
    if (allAcknowledged) {
      onConfirm();
      // Reset acknowledgments for next time
      setAcknowledged({
        notLegalAdvice: false,
        reviewRequired: false,
        jurisdictionSpecific: false,
      });
    }
  };

  const handleCancel = () => {
    setAcknowledged({
      notLegalAdvice: false,
      reviewRequired: false,
      jurisdictionSpecific: false,
    });
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Document Generation Consent
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                You are about to generate a <strong>{documentType}</strong> for{" "}
                <strong>{jurisdiction}</strong>. Please review and acknowledge the following
                before proceeding:
              </p>

              <Alert variant="destructive" className="border-destructive/50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Important Legal Notice:</strong> A.I. ANAL is NOT a law firm 
                  and does NOT provide legal advice.
                </AlertDescription>
              </Alert>

              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="notLegalAdvice"
                    checked={acknowledged.notLegalAdvice}
                    onCheckedChange={(checked) =>
                      setAcknowledged((prev) => ({
                        ...prev,
                        notLegalAdvice: checked === true,
                      }))
                    }
                  />
                  <Label
                    htmlFor="notLegalAdvice"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    I understand this document is for <strong>informational purposes only</strong> and 
                    does not constitute legal advice. No attorney-client relationship is created.
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="reviewRequired"
                    checked={acknowledged.reviewRequired}
                    onCheckedChange={(checked) =>
                      setAcknowledged((prev) => ({
                        ...prev,
                        reviewRequired: checked === true,
                      }))
                    }
                  />
                  <Label
                    htmlFor="reviewRequired"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    I understand I should <strong>review all content carefully</strong> and 
                    consult with a licensed attorney before taking legal action or filing documents.
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="jurisdictionSpecific"
                    checked={acknowledged.jurisdictionSpecific}
                    onCheckedChange={(checked) =>
                      setAcknowledged((prev) => ({
                        ...prev,
                        jurisdictionSpecific: checked === true,
                      }))
                    }
                  />
                  <Label
                    htmlFor="jurisdictionSpecific"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    I understand this document is <strong>jurisdiction-specific</strong> to{" "}
                    <strong>{jurisdiction}</strong> and may not be applicable in other states or 
                    jurisdictions.
                  </Label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                <Scale className="h-4 w-4" />
                <span>
                  For complex legal matters, we recommend consulting with a licensed attorney in your state.
                </span>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} 
            disabled={!allAcknowledged}
            className="bg-primary"
          >
            I Understand, Generate Document
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}