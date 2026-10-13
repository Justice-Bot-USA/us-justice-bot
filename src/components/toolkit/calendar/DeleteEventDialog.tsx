import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { CalendarEventRow } from "@/lib/toolkit/types";
import { dateText, timeText } from "./calendarModel";

export interface DeleteEventDialogProps {
  /** The entry to delete. null closes the dialog. */
  row: CalendarEventRow | null;
  busy?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  /** Radix's close auto-focus; call preventDefault() to move focus yourself (for example after a delete). */
  onCloseAutoFocus?: (event: Event) => void;
}

/** Asks before deleting a saved date. Deleting is always allowed, with or without a plan. */
export default function DeleteEventDialog({
  row,
  busy = false,
  error,
  onConfirm,
  onCancel,
  onCloseAutoFocus,
}: DeleteEventDialogProps) {
  // Keep showing the entry while the dialog animates closed.
  const [last, setLast] = useState<CalendarEventRow | null>(row);
  if (row && row !== last) setLast(row);
  const shown = row ?? last;

  return (
    <AlertDialog open={row !== null} onOpenChange={(open) => !open && !busy && onCancel()}>
      <AlertDialogContent
        className="max-h-[90vh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg sm:w-full"
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle className="text-xl">Delete this date?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-base text-foreground">
              {shown && (
                <p>
                  <span className="block break-words font-semibold">{shown.title}</span>
                  <span className="block">{dateText(shown)}</span>
                  <span className="block">{timeText(shown)}</span>
                </p>
              )}
              <p>
                This deletes it from Justice Bot USA. It does not delete it from your phone's calendar if you added it
                there.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <p role="alert" className="text-base font-medium text-destructive">
            {error}
          </p>
        )}
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel className="mt-0 min-h-11" disabled={busy}>
            Keep it
          </AlertDialogCancel>
          <Button type="button" variant="destructive" className="min-h-11" onClick={onConfirm} disabled={busy}>
            {busy ? "Deleting…" : "Yes, delete it"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
