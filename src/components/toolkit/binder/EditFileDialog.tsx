import { useEffect, useId, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import CasePicker from "@/components/toolkit/CasePicker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { isValidDateString } from "@/lib/calendar/dates";
import { toToolkitError } from "@/lib/toolkit/api";
import { LIMITS, SECTIONS, isSection, type CaseFilePatch, type CaseFileRow } from "@/lib/toolkit/types";

const NO_SECTION = "none";

export interface EditFileDialogProps {
  file: CaseFileRow | null;
  onClose: () => void;
  /** Saves the changes (throws ToolkitApiError). */
  onSave: (id: string, patch: CaseFilePatch) => Promise<unknown>;
}

/** Rename, date, section, notes and case for one file. Free for everyone. */
export default function EditFileDialog({ file, onClose, onSave }: EditFileDialogProps) {
  const ids = {
    name: useId(),
    nameHint: useId(),
    date: useId(),
    dateHint: useId(),
    section: useId(),
    notes: useId(),
    notesHint: useId(),
    error: useId(),
  };
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [section, setSection] = useState<string>(NO_SECTION);
  const [notes, setNotes] = useState("");
  const [caseId, setCaseId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!file) return;
    setName(file.display_name ?? "");
    setDate(file.document_date ?? "");
    setSection(file.section ?? NO_SECTION);
    setNotes(file.notes ?? "");
    setCaseId(file.case_id ?? null);
    setError("");
    setBusy(false);
  }, [file]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    const trimmedName = name.trim();
    if (trimmedName.length > LIMITS.displayName) {
      setError(`The name can be up to ${LIMITS.displayName} characters.`);
      return;
    }
    if (date && (!isValidDateString(date) || date < LIMITS.minDate || date > LIMITS.maxDate)) {
      setError("That date doesn't look right. Pick it again, or leave it empty.");
      return;
    }
    if (notes.length > LIMITS.fileNotes) {
      setError(`Notes can be up to ${LIMITS.fileNotes} characters.`);
      return;
    }
    const patch: CaseFilePatch = {
      display_name: trimmedName || null,
      document_date: date || null,
      section: isSection(section) ? section : null,
      notes: notes.trim() ? notes : null,
    };
    if ((file.case_id ?? null) !== caseId) {
      patch.case_id = caseId;
      // A moved file goes to the end of the other case's list.
      patch.sort_order = null;
    }
    setBusy(true);
    setError("");
    try {
      await onSave(file.id, patch);
      onClose();
    } catch (err) {
      setError(toToolkitError(err).message);
      setBusy(false);
    }
  }

  return (
    <Dialog open={Boolean(file)} onOpenChange={(open) => !open && !busy && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit file details</DialogTitle>
          <DialogDescription className="break-words">{file ? `File: ${file.file_name}` : ""}</DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void submit(e)} className="space-y-5 text-base" noValidate>
          <div className="space-y-2">
            <Label htmlFor={ids.name} className="text-base">
              Name
            </Label>
            <Input
              id={ids.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={LIMITS.displayName}
              placeholder={file?.file_name ?? ""}
              aria-describedby={ids.nameHint}
              className="min-h-11 text-base"
              autoComplete="off"
            />
            <p id={ids.nameHint} className="text-sm text-muted-foreground">
              The name shown in your list and in the binder's contents. Leave it empty to use the file name.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor={ids.date} className="text-base">
              Date on the document (optional)
            </Label>
            <Input
              id={ids.date}
              type="date"
              value={date}
              min={LIMITS.minDate}
              max={LIMITS.maxDate}
              onChange={(e) => setDate(e.target.value)}
              aria-describedby={ids.dateHint}
              className="min-h-11 text-base"
            />
            <p id={ids.dateHint} className="text-sm text-muted-foreground">
              Type the date printed on the document, if it has one. It is shown exactly as you type it.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor={ids.section} className="text-base">
              Section
            </Label>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger id={ids.section} className="min-h-11 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_SECTION} className="min-h-11 text-base">
                  No section
                </SelectItem>
                {SECTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value} className="min-h-11 text-base">
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <CasePicker value={caseId} onChange={(id) => setCaseId(id)} label="Case" />

          <div className="space-y-2">
            <Label htmlFor={ids.notes} className="text-base">
              Notes (optional)
            </Label>
            <Textarea
              id={ids.notes}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={LIMITS.fileNotes}
              rows={4}
              aria-describedby={ids.notesHint}
              className="text-base"
            />
            <p id={ids.notesHint} className="text-sm text-muted-foreground">
              Notes stay in your account. They are not printed in the binder PDF.
            </p>
          </div>

          {error && (
            <p id={ids.error} role="alert" className="font-medium text-destructive">
              {error}
            </p>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" className="min-h-11" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" className="min-h-11" disabled={busy}>
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
