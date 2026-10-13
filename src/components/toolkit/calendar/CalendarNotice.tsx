import { forwardRef } from "react";
import { CalendarPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OLD_EVENT_LEAD, OLD_EVENT_NOTE } from "./copy";

export type CalendarNoticeKind = "saved" | "changed" | "deleted" | "no_changes";

export interface CalendarNoticeProps {
  kind: CalendarNoticeKind;
  /** Opens the calendar-file download for the saved or changed date. */
  onDownload?: () => void;
  onDismiss: () => void;
}

const HEADINGS: Record<CalendarNoticeKind, string> = {
  saved: "Date saved.",
  changed: "Changes saved.",
  deleted: "Date deleted.",
  no_changes: "Nothing was changed.",
};

/**
 * Status line shown above the lists after saving, changing or deleting a date. After a change or
 * a delete it reminds the person that their phone's calendar keeps the old event.
 */
const CalendarNotice = forwardRef<HTMLHeadingElement, CalendarNoticeProps>(function CalendarNotice(
  { kind, onDownload, onDismiss },
  headingRef,
) {
  const showOldEventNote = kind === "changed" || kind === "deleted";
  return (
    <section role="status" className="relative rounded-lg border-2 border-primary/40 bg-muted/40 p-4 pr-14 text-base">
      <h2 ref={headingRef} tabIndex={-1} className="text-lg font-semibold focus:outline-none">
        {HEADINGS[kind]}
      </h2>
      {showOldEventNote && (
        <p className="mt-2">
          <span className="font-medium">{OLD_EVENT_LEAD}:</span> {OLD_EVENT_NOTE}
        </p>
      )}
      {onDownload && (kind === "saved" || kind === "changed") && (
        <Button type="button" className="mt-3 min-h-11 w-full sm:w-auto" onClick={onDownload}>
          <CalendarPlus className="mr-2 h-4 w-4" aria-hidden="true" />
          {kind === "saved" ? "Add to my phone's calendar" : "Download the new calendar file"}
        </Button>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 h-11 w-11"
        onClick={onDismiss}
        aria-label="Close this message"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </Button>
    </section>
  );
});

export default CalendarNotice;
