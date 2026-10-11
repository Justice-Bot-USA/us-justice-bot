import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFillableByFormNumber } from "@/lib/formfill";
import type { CourtForm } from "@/lib/formsLibraryData";
import { THIRD_PARTY_FEES_NOTE } from "@/lib/pricing";

/** The forms in `list` with these form numbers, in this order (first match for each). */
export const pickForms = (list: CourtForm[], formNumbers: string[]): CourtForm[] =>
  formNumbers.flatMap((n) => list.find((f) => f.formNumber === n) ?? []);

/** Official forms and agency links from the CA/NY data, with a free "Fill this form" link where
 *  our form filler has the form. The person decides which of these apply to them. */
export function OfficialFormList({ state, forms }: { state: "CA" | "NY"; forms: CourtForm[] }) {
  return (
    <div className="space-y-3">
      {forms.map((f) => {
        const fillable = getFillableByFormNumber(state, f.formNumber);
        return (
          <Card key={f.formNumber}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {f.formNumber}: {f.name}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{f.description}</p>
                {f.feeAmount && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Fee: {f.feeAmount}
                    {f.feeWaiverAvailable ? " (fee waiver available)" : ""}
                  </p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                {fillable && (
                  <Button size="sm" asChild>
                    <Link to={`/fill/${state.toLowerCase()}/${fillable.id}`}>Fill this form free</Link>
                  </Button>
                )}
                <Button size="sm" variant="outline" asChild>
                  <a href={f.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" /> Official
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

/** Fee note and disclaimer shown at the bottom of the free guide pages. */
export function GuideDisclaimer() {
  return (
    <div className="text-xs text-muted-foreground border-t pt-6 mt-10 space-y-2">
      <p>{THIRD_PARTY_FEES_NOTE}</p>
      <p>
        <strong>Legal information, not legal advice.</strong> Justice Bot USA is not a law firm, and our content has not
        yet been reviewed by a licensed attorney. You decide which forms and steps apply to you. For advice about your
        situation, talk to a licensed attorney or a free legal aid or court self-help center.
      </p>
    </div>
  );
}
