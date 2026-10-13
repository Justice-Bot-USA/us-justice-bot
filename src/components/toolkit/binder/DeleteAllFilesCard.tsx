import { useId, useState, type FormEvent } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteAllBinderFiles } from "@/lib/binder/storage";
import type { CaseFileRow } from "@/lib/toolkit/types";

const CONFIRM_WORD = "DELETE";

export interface DeleteAllFilesCardProps {
  userId: string;
  /** Every file the person has, in every case. */
  files: CaseFileRow[];
  /** Re-read the list afterwards. */
  onDone: () => Promise<void> | void;
}

/** "Delete all my files" with a typed confirmation. Free for everyone, plan or not. */
export default function DeleteAllFilesCard({ userId, files, onDone }: DeleteAllFilesCardProps) {
  const inputId = useId();
  const hintId = useId();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [result, setResult] = useState("");
  const total = files.length;
  const matches = typed.trim().toUpperCase() === CONFIRM_WORD;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!matches || busy) return;
    setBusy(true);
    setResult("");
    try {
      const { deleted, remaining } = await deleteAllBinderFiles(userId, files, (done, all) =>
        setProgress(`Deleting… ${done} of ${all}`),
      );
      setResult(
        remaining === 0
          ? "All your binder files are deleted."
          : `${deleted === 1 ? "1 file was" : `${deleted} files were`} deleted. ${remaining === 1 ? "1 file" : `${remaining} files`} couldn't be deleted. Please try again.`,
      );
    } catch {
      setResult("Something went wrong while deleting. Some files may still be here. Please try again.");
    } finally {
      setBusy(false);
      setProgress("");
      setOpen(false);
      setTyped("");
      await onDone();
    }
  }

  return (
    <section aria-labelledby="delete-all-heading" className="space-y-3 rounded-lg border border-destructive/40 p-4 text-base">
      <h2 id="delete-all-heading" className="text-lg font-semibold">
        Delete all my files
      </h2>
      <p>
        This deletes every file in your binder, for all your cases, for good. Your calendar dates and class records stay. A
        class record that used one of these files as proof will no longer be linked to it.
      </p>
      {result && (
        <p role="status" className="font-medium">
          {result}
        </p>
      )}
      <Button type="button" variant="destructive" className="min-h-11" disabled={total === 0} onClick={() => setOpen(true)}>
        <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
        Delete all my files
      </Button>
      {total === 0 && <p className="text-sm text-muted-foreground">You have no files to delete.</p>}

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (busy) return;
          setOpen(next);
          if (!next) setTyped("");
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{total === 1 ? "Delete your 1 file?" : `Delete all ${total} files?`}</DialogTitle>
            <DialogDescription className="text-base">
              Every file in your binder, in every case, will be deleted for good. This can't be undone. Download anything you
              want to keep first.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => void submit(e)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={inputId} className="text-base">
                Type {CONFIRM_WORD} to confirm
              </Label>
              <Input
                id={inputId}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                aria-describedby={hintId}
                className="min-h-11 text-base"
                disabled={busy}
              />
              <p id={hintId} className="text-sm text-muted-foreground" aria-live="polite">
                {busy ? progress || "Deleting…" : `This deletes ${total === 1 ? "1 file" : `${total} files`}.`}
              </p>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" className="min-h-11" disabled={busy} onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" className="min-h-11" disabled={!matches || busy}>
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                Delete all files
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
