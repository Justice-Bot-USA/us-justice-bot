import { useId, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { buildIcs, icsFileName } from "@/lib/calendar/ics";
import type { CalendarEventRow } from "@/lib/toolkit/types";
import { ALL_DATES_FILE_NAME, dateText, exportableEvents, timeText } from "./calendarModel";
import { ALERTS_QUALIFIER, LEAVE_DETAILS_OUT_HINT, LEAVE_DETAILS_OUT_LABEL, LOCK_SCREEN_WARNING } from "./copy";
import { downloadIcsFile } from "./downloadIcs";

export type ExportTarget = { kind: "one"; row: CalendarEventRow } | { kind: "all"; rows: CalendarEventRow[] };

export interface ExportDialogProps {
  /** What to put in the file. null closes the dialog. */
  target: ExportTarget | null;
  onClose: () => void;
}

// Per-viewer convenience only: remembers the "leave court details out" choice on this device.
const PRIVATE_KEY = "toolkit.calendar.leaveDetailsOut";

function readPrivatePreference(): boolean {
  try {
    return window.localStorage.getItem(PRIVATE_KEY) === "1";
  } catch {
    return false;
  }
}

function writePrivatePreference(on: boolean): void {
  try {
    if (on) window.localStorage.setItem(PRIVATE_KEY, "1");
    else window.localStorage.removeItem(PRIVATE_KEY);
  } catch {
    // Storage blocked (private window, cleared site data): the choice just isn't remembered.
  }
}

/**
 * Builds a .ics file from saved dates and hands it to the browser. Shows the lock-screen warning,
 * the "leave court details out" option and the alerts qualifier right next to the download button.
 */
export default function ExportDialog({ target, onClose }: ExportDialogProps) {
  const checkboxId = useId();
  const hintId = useId();
  const [leaveOut, setLeaveOut] = useState<boolean>(() => readPrivatePreference());
  const [savedAs, setSavedAs] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  // Keep showing the last target while the dialog animates closed; a new target starts fresh.
  const [last, setLast] = useState<ExportTarget | null>(target);
  if (target && target !== last) {
    setLast(target);
    setSavedAs(null);
    setFailed(false);
  }
  const view = target ?? last;

  const rows = view ? (view.kind === "one" ? [view.row] : view.rows) : [];
  const events = exportableEvents(rows);
  const single = view?.kind === "one" ? view.row : null;
  const noAlarms = single ? (single.alarms ?? []).length === 0 : false;

  const handleDownload = () => {
    if (!view || events.length === 0) return;
    try {
      const contents = buildIcs(events, new Date(), { private: leaveOut });
      const name = single ? icsFileName(single.title, single.event_date, leaveOut) : ALL_DATES_FILE_NAME;
      downloadIcsFile(contents, name);
      setSavedAs(name);
      setFailed(false);
    } catch {
      setSavedAs(null);
      setFailed(true);
    }
  };

  const count = events.length;

  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg sm:w-full [&>button:last-child]:right-2 [&>button:last-child]:top-2 [&>button:last-child]:p-3.5">
        <DialogHeader className="pr-8 text-left">
          <DialogTitle className="text-xl leading-snug">
            {single ? "Add to your phone's calendar" : "Download all upcoming dates"}
          </DialogTitle>
          <DialogDescription className="text-base text-foreground">
            {single ? (
              <>
                <span className="block font-semibold">{dateText(single)}</span>
                <span className="block">{timeText(single)}</span>
              </>
            ) : count === 1 ? (
              "1 upcoming date in one calendar file."
            ) : (
              `${count} upcoming dates in one calendar file.`
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-base">
          <p className="rounded-lg border-2 border-primary/40 bg-muted/40 p-3">{LOCK_SCREEN_WARNING}</p>

          <div>
            <div className="flex min-h-11 items-center gap-3">
              <Checkbox
                id={checkboxId}
                checked={leaveOut}
                onCheckedChange={(state) => {
                  const on = state === true;
                  setLeaveOut(on);
                  writePrivatePreference(on);
                  setSavedAs(null);
                }}
                aria-describedby={hintId}
                className="h-5 w-5"
              />
              <Label htmlFor={checkboxId} className="flex min-h-11 flex-1 cursor-pointer items-center text-base font-medium">
                {LEAVE_DETAILS_OUT_LABEL}
              </Label>
            </div>
            <p id={hintId} className="pl-8 text-sm text-muted-foreground">
              {LEAVE_DETAILS_OUT_HINT}
            </p>
          </div>

          <div className="space-y-1">
            <p>{ALERTS_QUALIFIER}</p>
            {noAlarms && <p className="text-muted-foreground">This date has no alerts. To add some, choose Change.</p>}
          </div>

          <div className="space-y-2">
            <p>This saves a calendar file (.ics) on your device. Open the file to add it to your calendar app.</p>
            <details className="text-sm">
              <summary className="flex min-h-11 cursor-pointer items-center font-medium">If the file doesn't open</summary>
              <ul className="list-disc space-y-1 pl-5">
                <li>iPhone: look in the Files app, in Downloads, and tap the file.</li>
                <li>
                  Android with Google Calendar: the Google Calendar app can't open these files. On a computer, open
                  calendar.google.com, go to Settings, then Import &amp; export.
                </li>
                <li>Computer: open the file, or use Import in your calendar app.</li>
              </ul>
            </details>
          </div>

          <div aria-live="polite" className="text-base">
            {savedAs && (
              <p className="font-medium">
                Your calendar file is ready: {savedAs}. If your browser asks, choose Download. Then open the file to add{" "}
                {single ? "this date" : "your dates"} to your calendar.
              </p>
            )}
            {failed && (
              <p className="font-medium text-destructive">We couldn't make the calendar file. Please try again.</p>
            )}
            {count === 0 && <p className="text-muted-foreground">There are no dates to put in a calendar file.</p>}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" className="min-h-11" onClick={onClose}>
            Close
          </Button>
          <Button type="button" className="min-h-11" onClick={handleDownload} disabled={count === 0}>
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            Download calendar file
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
