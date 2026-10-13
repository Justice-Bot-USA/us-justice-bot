import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONFIDENTIAL_RECORDS_NOTICE } from "@/lib/binder/prepareFiles";
import { cn } from "@/lib/utils";

/** Where each place remembers that the notice was dismissed (this browser only). */
export type ConfidentialNoticePlace = "upload" | "binder";

const storageKey = (place: ConfidentialNoticePlace) => `jbusa.toolkit.binder.confidentialNotice.${place}.v1`;

function wasDismissed(place: ConfidentialNoticePlace): boolean {
  try {
    return window.localStorage.getItem(storageKey(place)) === "dismissed";
  } catch {
    return false;
  }
}

function rememberDismissed(place: ConfidentialNoticePlace) {
  try {
    window.localStorage.setItem(storageKey(place), "dismissed");
  } catch {
    // Private browsing or storage turned off: the notice just shows again next time.
  }
}

/**
 * Counsel's confidential-records notice, shown at first upload and before making a binder. It can
 * be dismissed, and that is remembered in this browser.
 */
export default function ConfidentialNotice({ place, className }: { place: ConfidentialNoticePlace; className?: string }) {
  const [hidden, setHidden] = useState(() => wasDismissed(place));
  if (hidden) return null;
  return (
    <section
      aria-label="Confidential court papers"
      className={cn("rounded-lg border border-amber-300 bg-amber-50 p-4 text-base text-amber-950 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-50", className)}
    >
      <p className="flex gap-2">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <span>{CONFIDENTIAL_RECORDS_NOTICE}</span>
      </p>
      <Button
        type="button"
        variant="outline"
        className="mt-3 min-h-11 bg-background"
        onClick={() => {
          rememberDismissed(place);
          setHidden(true);
        }}
      >
        Got it
      </Button>
    </section>
  );
}
