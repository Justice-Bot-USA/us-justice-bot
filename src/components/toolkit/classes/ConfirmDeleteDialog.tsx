import type { ReactNode } from "react";
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

export interface ConfirmDeleteDialogProps {
  open: boolean;
  title: string;
  /** What will be deleted, and what will not. */
  children: ReactNode;
  busy?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  /** Radix's close auto-focus; call preventDefault() to move focus yourself (for example after a delete). */
  onCloseAutoFocus?: (event: Event) => void;
}

/** Asks before deleting. Deleting your own records is always allowed, with or without a plan. */
export default function ConfirmDeleteDialog({
  open,
  title,
  children,
  busy = false,
  error,
  onConfirm,
  onCancel,
  onCloseAutoFocus,
}: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => !next && !busy && onCancel()}>
      <AlertDialogContent
        className="max-h-[90vh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg sm:w-full"
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle className="text-xl">{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-base text-foreground">{children}</div>
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
