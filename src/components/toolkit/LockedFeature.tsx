import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckoutStatus } from "@/hooks/useCheckoutStatus";
import { TOOLKIT_PRICE_LABEL } from "@/lib/billingDisclosure";
import { cn } from "@/lib/utils";

export type LockedFeatureName = "binder" | "calendar" | "classes" | "toolkit";

export interface LockedFeatureProps {
  /** Which part of the Toolkit the person tried to use. */
  feature: LockedFeatureName;
  className?: string;
}

// What needs the plan, and what stays free, for each tool. Must match the database rules: only new
// calendar dates, new class records and the binder PDF need an active plan.
const EXPLANATIONS: Record<LockedFeatureName, string> = {
  binder:
    "Making a binder PDF needs the Toolkit plan. Your files stay free: you can upload, view, rename, organize, download and delete them without a plan.",
  calendar:
    "Adding new dates needs the Toolkit plan. Without a plan you can still see, change and delete dates you already saved, and download your calendar file.",
  classes:
    "Adding new class records needs the Toolkit plan. Without a plan you can still see, change and delete class records you already saved.",
  toolkit:
    "Making a binder PDF and adding new calendar dates or class records need the Toolkit plan. Your files, and anything you already saved, stay free to open, change, download and delete.",
};

/** Shown instead of a buy link while the Toolkit can't be bought (sales are off by default). */
export const NOT_FOR_SALE_YET = "The Toolkit isn't available to buy yet.";

/**
 * A plain note that a feature needs the plan. While the Toolkit can be bought it has one link to
 * Pricing with the price; otherwise it says the plan isn't available to buy yet, with no price call
 * to action. No pop-ups, no countdowns.
 */
export default function LockedFeature({ feature, className }: LockedFeatureProps) {
  const checkout = useCheckoutStatus();
  return (
    <section aria-label="Part of the Toolkit plan" className={cn("rounded-lg border p-4 text-base sm:p-6", className)}>
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Lock className="h-5 w-5 shrink-0" aria-hidden="true" />
        Part of the Toolkit plan
      </h2>
      <p className="mt-2">{EXPLANATIONS[feature]}</p>
      {checkout.data === true ? (
        <Button asChild className="mt-4 h-auto min-h-11 w-full whitespace-normal py-2 text-center sm:w-auto">
          <Link to="/pricing">Get the Toolkit — {TOOLKIT_PRICE_LABEL} a month</Link>
        </Button>
      ) : checkout.isPending ? null : (
        <p className="mt-2">{NOT_FOR_SALE_YET}</p>
      )}
    </section>
  );
}
