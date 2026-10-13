import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, FileText, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fileLabel, isLinkRow, isStoredFile, signedViewUrl } from "@/lib/binder/storage";
import { toToolkitError, updateClassTracker } from "@/lib/toolkit/api";
import { LIMITS, type CaseFileRow, type ClassTrackerRow } from "@/lib/toolkit/types";
import {
  longDate,
  proofFormFromRow,
  proofPatch,
  safeProviderUrl,
  validateProofForm,
  type ProofFormErrors,
  type ProofFormField,
  type ProofFormValues,
} from "./classModel";
import FormField from "./FormField";
import { describedBy, focusField, inputClass } from "./formHelpers";

const NO_FILE = "none";

export interface ProofSectionProps {
  tracker: ClassTrackerRow;
  /** The person's binder files (every case). */
  files: CaseFileRow[];
  filesLoading: boolean;
  onSaved: (row: ClassTrackerRow) => void;
}

/** Same case first, then the rest, each in binder order. */
function orderForPicker(files: CaseFileRow[], caseId: string | null): CaseFileRow[] {
  const same = files.filter((f) => (f.case_id ?? null) === (caseId ?? null));
  const other = files.filter((f) => (f.case_id ?? null) !== (caseId ?? null));
  return [...same, ...other];
}

/**
 * Proof for one class: a file the person picked from their own case binder, and when and how
 * they sent proof. Recording or changing this is always free. Nothing here says the proof is
 * enough or was accepted.
 */
export default function ProofSection({ tracker, files, filesLoading, onSaved }: ProofSectionProps) {
  const headingId = useId();
  const p = useId();
  const id = (field: ProofFormField) => `${p}-${field}`;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formHeadingRef = useRef<HTMLHeadingElement>(null);
  const [values, setValues] = useState<ProofFormValues | null>(null);
  const [errors, setErrors] = useState<ProofFormErrors>({});
  const [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [viewError, setViewError] = useState<string | null>(null);

  const proofFile = tracker.proof_file_id ? (files.find((f) => f.id === tracker.proof_file_id) ?? null) : null;
  const pickerFiles = useMemo(() => orderForPicker(files, tracker.case_id ?? null), [files, tracker.case_id]);
  const hasAnything = Boolean(tracker.proof_file_id || tracker.proof_sent_on || tracker.proof_sent_how);
  const editing = values !== null;

  useEffect(() => {
    if (editing) formHeadingRef.current?.focus();
  }, [editing]);

  const close = () => {
    setValues(null);
    setErrors({});
    setSaveError(null);
    setTimeout(() => headingRef.current?.focus(), 0);
  };

  const view = async (file: CaseFileRow) => {
    setViewError(null);
    if (isLinkRow(file)) {
      const url = safeProviderUrl(file.file_path);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    // Open the tab during the tap so phones don't block it, then point it at the signed link.
    const win = window.open("", "_blank");
    try {
      const url = await signedViewUrl(file);
      if (win) {
        win.opener = null;
        win.location.href = url;
      } else {
        window.location.assign(url);
      }
    } catch (err) {
      win?.close();
      setViewError(`We couldn't open this file. ${toToolkitError(err).message}`);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!values) return;
    const found = validateProofForm(values);
    setErrors(found);
    const first = (["fileId", "sentOn", "sentHow"] as ProofFormField[]).find((f) => found[f]);
    if (first) {
      focusField(id(first));
      return;
    }
    const patch = proofPatch(tracker, values);
    if (Object.keys(patch).length === 0) {
      close();
      return;
    }
    setBusy(true);
    setSaveError(null);
    try {
      onSaved(await updateClassTracker(tracker.id, patch));
      close();
    } catch (err) {
      setSaveError(toToolkitError(err).message);
    } finally {
      setBusy(false);
    }
  };

  const canView = proofFile && (isStoredFile(proofFile) || (isLinkRow(proofFile) && safeProviderUrl(proofFile.file_path)));

  return (
    <section aria-labelledby={headingId} className="space-y-3">
      <h4 id={headingId} ref={headingRef} tabIndex={-1} className="text-base font-semibold focus:outline-none">
        Proof
      </h4>

      {!editing && (
        <>
          {hasAnything ? (
            <dl className="space-y-2 text-base">
              <div>
                <dt className="text-sm text-muted-foreground">Proof file</dt>
                <dd className="break-words">
                  {tracker.proof_file_id
                    ? proofFile
                      ? fileLabel(proofFile)
                      : filesLoading
                        ? "Loading…"
                        : "A file in your case binder"
                    : "None chosen"}
                </dd>
                {canView && proofFile && (
                  <Button type="button" variant="outline" className="mt-2 min-h-11" onClick={() => void view(proofFile)}>
                    {isLinkRow(proofFile) ? (
                      <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                    ) : (
                      <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                    )}
                    {isLinkRow(proofFile) ? "Open link" : "View file"}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </Button>
                )}
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">When you sent proof</dt>
                <dd>{tracker.proof_sent_on ? longDate(tracker.proof_sent_on) : "Not recorded"}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">How you sent it</dt>
                <dd className="break-words">{tracker.proof_sent_how?.trim() || "Not recorded"}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-base text-muted-foreground">No proof recorded yet.</p>
          )}
          {viewError && (
            <p role="alert" className="text-base font-medium text-destructive">
              {viewError}
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full sm:w-auto"
            onClick={() => {
              setViewError(null);
              setValues(proofFormFromRow(tracker));
            }}
          >
            <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
            {hasAnything ? "Change proof details" : "Record proof"}
          </Button>
        </>
      )}

      {values && (
        <form noValidate onSubmit={(e) => void submit(e)} className="space-y-4 rounded-lg border p-4" aria-labelledby={`${p}-heading`}>
          <h5 id={`${p}-heading`} ref={formHeadingRef} tabIndex={-1} className="text-base font-semibold focus:outline-none">
            Proof details
          </h5>

          <FormField
            id={id("fileId")}
            label="Proof file from your case binder"
            optional
            hint={
              <p>
                Upload your certificate or other proof to your case binder first, then pick it here.{" "}
                <Link to="/toolkit/binder" className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4">
                  Open case binder
                </Link>
              </p>
            }
            error={errors.fileId}
          >
            <Select
              value={values.fileId ?? NO_FILE}
              onValueChange={(v) => setValues({ ...values, fileId: v === NO_FILE ? null : v })}
              disabled={busy || filesLoading}
            >
              <SelectTrigger id={id("fileId")} className={inputClass} aria-describedby={describedBy(id("fileId"), true, errors.fileId)}>
                <SelectValue placeholder={filesLoading ? "Loading your files…" : "No file"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_FILE} className="min-h-11 text-base">
                  No file
                </SelectItem>
                {/* Keep the saved file choosable even if the list hasn't loaded it. */}
                {values.fileId && !pickerFiles.some((f) => f.id === values.fileId) && (
                  <SelectItem value={values.fileId} className="min-h-11 text-base">
                    A file in your case binder
                  </SelectItem>
                )}
                {pickerFiles.map((f) => (
                  <SelectItem key={f.id} value={f.id} className="min-h-11 text-base">
                    {fileLabel(f)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField id={id("sentOn")} label="When did you send proof?" optional error={errors.sentOn}>
            <Input
              id={id("sentOn")}
              type="date"
              value={values.sentOn}
              onChange={(e) => setValues({ ...values, sentOn: e.target.value })}
              min={LIMITS.minDate}
              max={LIMITS.maxDate}
              aria-invalid={Boolean(errors.sentOn)}
              aria-describedby={describedBy(id("sentOn"), false, errors.sentOn)}
              className={`${inputClass} max-w-xs`}
              disabled={busy}
            />
          </FormField>

          <FormField
            id={id("sentHow")}
            label="How did you send it?"
            optional
            hint={<p>For example: filed it with the clerk, or emailed it to my probation officer.</p>}
            error={errors.sentHow}
          >
            <Input
              id={id("sentHow")}
              value={values.sentHow}
              onChange={(e) => setValues({ ...values, sentHow: e.target.value })}
              maxLength={LIMITS.proofSentHow}
              autoComplete="off"
              aria-invalid={Boolean(errors.sentHow)}
              aria-describedby={describedBy(id("sentHow"), true, errors.sentHow)}
              className={inputClass}
              disabled={busy}
            />
          </FormField>

          <p className="text-sm text-muted-foreground">
            This only records what you did. To change where you are with this class, use "Where you are with this class" above.
          </p>

          {saveError && (
            <p role="alert" className="text-base font-medium text-destructive">
              {saveError}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" className="min-h-11" disabled={busy}>
              {busy ? "Saving…" : "Save proof details"}
            </Button>
            <Button type="button" variant="outline" className="min-h-11" onClick={close} disabled={busy}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
