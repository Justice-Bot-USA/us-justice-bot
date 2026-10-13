import { useId, useRef, useState, type ChangeEvent } from "react";
import { CheckCircle2, Loader2, Upload, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BINDER_FILE_ACCEPT, BINDER_FILE_RULES } from "@/lib/binder/prepareFiles";
import { BinderUploadError, UPLOAD_PROBLEM_MESSAGES, uploadBinderFile } from "@/lib/binder/storage";
import { cn } from "@/lib/utils";
import ConfidentialNotice from "./ConfidentialNotice";

interface Outcome {
  key: string;
  name: string;
  ok: boolean;
  message?: string;
}

export interface BinderUploaderProps {
  userId: string;
  /** Where new files go: a case id, or null for "not linked to a case". */
  caseId: string | null;
  /** Shown as "Files you upload go to: …". */
  destinationLabel: string;
  /** Called after the last file of a batch, if at least one was saved. */
  onUploaded: () => void;
}

/** Upload PDF, JPG and PNG files into the binder. Free for everyone. */
export default function BinderUploader({ userId, caseId, destinationLabel, onUploaded }: BinderUploaderProps) {
  const inputId = useId();
  const hintId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);

  async function handleFiles(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length === 0) return;
    setBusy(true);
    setOutcomes([]);
    const results: Outcome[] = [];
    let saved = 0;
    for (let i = 0; i < picked.length; i++) {
      const file = picked[i];
      setStatus(picked.length === 1 ? "Uploading…" : `Uploading ${i + 1} of ${picked.length}…`);
      try {
        await uploadBinderFile({ userId, file, caseId });
        saved += 1;
        results.push({ key: `${i}`, name: file.name, ok: true });
      } catch (err) {
        const message = err instanceof BinderUploadError ? err.message : UPLOAD_PROBLEM_MESSAGES.upload_failed;
        results.push({ key: `${i}`, name: file.name, ok: false, message });
      }
      setOutcomes([...results]);
    }
    const failed = results.length - saved;
    setStatus(
      failed === 0
        ? saved === 1
          ? "1 file uploaded."
          : `${saved} files uploaded.`
        : saved === 0
          ? "Nothing was uploaded. See below."
          : `${saved} uploaded, ${failed} not uploaded. See below.`,
    );
    setBusy(false);
    // Let the same file be picked again after a failure.
    if (inputRef.current) inputRef.current.value = "";
    if (saved > 0) onUploaded();
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <h2 className="text-xl font-semibold">Upload files</h2>
      </CardHeader>
      <CardContent className="space-y-4 text-base">
        <ConfidentialNotice place="upload" />
        <p>
          Files you upload go to: <strong className="break-words">{destinationLabel}</strong>
        </p>
        <div>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            multiple
            accept={BINDER_FILE_ACCEPT}
            onChange={(e) => void handleFiles(e)}
            disabled={busy}
            aria-describedby={hintId}
            className="peer sr-only"
          />
          <label
            htmlFor={inputId}
            className={cn(
              "inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 sm:w-auto",
              "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
              busy && "pointer-events-none opacity-60",
            )}
          >
            {busy ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Upload className="h-5 w-5" aria-hidden="true" />}
            {busy ? "Uploading…" : "Choose files to upload"}
          </label>
          <p id={hintId} className="mt-2 text-sm text-muted-foreground">
            {BINDER_FILE_RULES}. Photo won't upload? Your phone may have saved it as HEIC. Share it as a JPG, or take a
            screenshot of it, and upload that.
          </p>
        </div>

        <p role="status" aria-live="polite" className={cn("font-medium", !status && "sr-only")}>
          {status}
        </p>
        {outcomes.length > 0 && (
          <ul className="space-y-2">
            {outcomes.map((o) => (
              <li key={o.key} className="flex gap-2">
                {o.ok ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" aria-hidden="true" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
                )}
                <span className="min-w-0 break-words">
                  <span className="font-medium">{o.name}</span>
                  {o.ok ? <span className="sr-only">: uploaded</span> : <span>: {o.message}</span>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
